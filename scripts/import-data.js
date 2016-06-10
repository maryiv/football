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

async function importActions(matchID) {
    const response = await fetch(`${api_uri}match/actions/${config.import_key}/${matchID}/json`, {
        method: 'get',
        headers: {'Content-Type': 'application/json'}
    });
    const { matchActions } = await response.json();
    return matchActions.actions.action;
}

async function importMatches(date) {
    const response = await fetch(`${api_uri}competitions/matchDay/${config.import_key}/${date}/json`, {
        method: 'get',
        headers: {'Content-Type': 'application/json'}
    });
    const { matches } = await response.json();
    if (matches.errors) {
        for (let key in matches.errors) {
            console.error(matches.errors[key]);
        }
        return [];
    } else {
        const ClassType = Parse.Object.extend('Match');
        await new Parse.Query('MatchAction').each(record => record.destroy());
        await new Parse.Query('Team').each(record => record.destroy());
        await new Parse.Query(ClassType).each(record => record.destroy());
        return Promise.all(matches.match.map(attrs => importMatch(ClassType, attrs)));
    }
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
                team.set("key", value['@teamID']);
                team.set("name", value['teamName']);
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
                default:
                    match.set(key, value);
            }
        }
    }

    //Associate the actions with the match
    const MatchAction = Parse.Object.extend('MatchAction');
    let matchActions = await importActions(attributes['@matchID']);
    let relation = match.relation("actions");
    matchActions.forEach(function (action, index, actions) {
        let matchAction = new MatchAction();
        matchAction.save({
            "teamID": action['@teamID'],
            "eventID": action['@eventID'],
            "eventType": action['eventType'],
            "matchTime": action['matchTime'],
            "eventTime": action['matchTime'],
            "normalTime": action['matchTime'],
            "addedTime": action['matchTime']
        }, {
            success: function (matchAction) {
                relation.add(matchAction);
            }
        });
    });

    match = await match.save();
    ID_MAP.set(attributes.objectId, match.id);
    return match;
}

async function importAction(ClassType, attributes) {
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

    /**
     * Comment out, to get the real current date
     */
    today = '20160603';

    console.log('Import data from today');
    let matches = await importMatches(today);
    let count = matches.length;
    if (count == 0) {
        return 'Data were not imported.';
    }
    return 'Imported '+count+' matches.';
}

main().then(console.dir, console.error);
