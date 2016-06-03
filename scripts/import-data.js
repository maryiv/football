/**
 * Import sample data (the local server should be running)
 */

import fetch from 'isomorphic-fetch';
import Parse from 'parse/node';

const config = require('../conf/run');
const api_uri = 'http://pads6.pa-sport.com/api/football/';
const ID_MAP = new Map();

Parse.initialize(config.app_id);
Parse.serverURL = `http://localhost:${config.port}/parse`;

function convertToday(date) {
    date = (date<10) ? '0'+date : date;
    return date;
}

async function importMatches(date) {
    const response = await fetch(`${api_uri}competitions/matchDay/${config.import_key}/${date}/json`, {
        method: 'get',
        headers: {'Content-Type': 'application/json'}
    });
    const { matches } = await response.json();
    const ClassType = Parse.Object.extend('Match');
    await new Parse.Query('Team').each(record => record.destroy());
    await new Parse.Query(ClassType).each(record => record.destroy());
    return Promise.all(matches.match.map(attrs => importMatch(ClassType, attrs)));
}

async function importMatch(ClassType, attributes) {
    const TEAM_FIELDS = new Set(['homeTeam', 'awayTeam']);
    let match = new ClassType();
    for (let key in attributes) {
        let value = attributes[key];
        if (TEAM_FIELDS.has(key)) {
            const Team = Parse.Object.extend('Team');
            let query = new Parse.Query(Team);
            let team = await query.equalTo("name", value['teamName']).first();
            if (team == undefined) {
                team = new Team();
                team.set("teamName", value['teamName']);
                team.set("score", value['score']);
                team.set("htScore", value['htScore']);
                team = await team.save();
            }
            match.set(key, {
                "teamID": team.id,
                "score": value['score'],
                "htScore": value['htScore']
            });
        } else {
            switch(key) {
                case '@date':
                    match.set('date', value);
                    break;
                case '@koTime':
                    match.set('time', value);
                    break;
                case 'competition':
                    match.set("competition", {
                        "competitionID": value['@competitionID'],
                        "seasonID": value['@seasonID'],
                        "text": value['#text']
                    });
                    break;
                case 'stage':
                    match.set("stage", {
                        "number": value['@stageNumber'],
                        "type": value['@stageType']
                    });
                    break;
                case 'round':
                    match.set("round", {
                        "number": value['@roundNumber'],
                        "text": value['#text']
                    });
                    break;
                case 'venue':
                    match.set("venue", {
                        "venueID": value['@venueID'],
                        "text": value['#text']
                    });
                    break;
                case 'homeTeam':
                    break;
                case 'awayTeam':
                    break;
                default:
                    match.set(key, value);
            }
        }
    }
    match = await match.save();
    //await importActions(attributes['@matchID'], match.id);
    ID_MAP.set(attributes.objectId, match.id);
    return match;
}

async function importActions(matchID, newMatchID) {
    const response = await fetch(`${api_uri}match/actions/${config.import_key}/${matchID}/json`, {
        method: 'get',
        headers: {'Content-Type': 'application/json'}
    });
    const { matchActions } = await response.json();
    const ClassType = Parse.Object.extend('MatchAction');
    await new Parse.Query(ClassType).each(record => record.destroy());
    return Promise.all(matchActions.map(attrs => importAction(ClassType, attrs, newMatchID)));
}

async function importAction(ClassType, attributes, matchID) {
    let action = new ClassType();
    for (let key in attributes) {
        let value = attributes[key];
        action.set(key, value);
    }
    action = await action.save();
    ID_MAP.set(attributes.objectId, action.id);
    return action;
}

async function main() {
    let today = new Date();
    let dd = convertToday(today.getDate());
    let mm = convertToday(today.getMonth()+1);
    today = today.getFullYear()+mm+dd;

    console.log('Import data from today');
    let matches = await importMatches(today);
    let count = matches.length;
    return 'Imported '+count+' matches';
}

main().then(console.dir, console.error);
