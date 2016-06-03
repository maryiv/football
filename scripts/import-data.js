/**
 * Import sample data (the local server should be running)
 */

import fetch from 'isomorphic-fetch';
import Parse from 'parse/node';

const config = require('../conf/run');

Parse.initialize(config.app_id);
Parse.serverURL = `http://localhost:${config.port}/parse`;

function convertToday(date) {
    date = (date<10) ? '0'+date : date;
    return date;
}

async function importMatchs(date) {
    const response = await fetch(`http://pads6.pa-sport.com/api/football/competitions/matchDay/${config.import_key}/${date}/json`, {
        method: 'get',
        headers: {'Content-Type': 'application/json'}
    });
    const result = await response.json();
    console.log(result);
    /*const ClassType = Parse.Object.extend('Match');
    await new Parse.Query(ClassType).each(record => record.destroy());
    return Promise.all(results.map(attrs => importObject(ClassType, attrs)));*/
}

async function main() {
    let today = new Date();
    let dd = convertToday(today.getDate());
    let mm = convertToday(today.getMonth()+1);
    today = today.getFullYear()+mm+dd;
    console.log('Import data from today');
    var matchs = await importMatchs(today);

    return 'Imported';
}

main().then(console.dir, console.error);
