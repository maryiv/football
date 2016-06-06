/**
 * @flow
 */
'use strict';

const Parse = require('parse/react-native');
const Match = Parse.Object.extend('Match');

import * as types from '../constants/ActionTypes';

function showMatchActions(match_index: string) {
    return (dispatch) => {
        let query = new Parse.Query(Match);
        query.get(match_index, {
            success: function(match) {
                let relation = match.relation("actions");
                query = relation.query();
                query.find({
                    success: function(actions) {
                        return {
                            type: types.SHOW_ACTIONS,
                            actions
                        };
                    }
                });
            }
        });
        dispatch({
            type: types.SHOW_ACTIONS,
            match_index
        });
    };
}

async function loadSchedule() {
    var matches = [];
    new Parse.Query(Match).find({
        success: function (results) {
            matches = results;
            console.log(matches);
        },
        error: function (error) {
            console.error(error);
        }
    });

    return {
        type: types.SHOW_MATCHES,
        matches
    };
}
module.exports = {
    loadSchedule,
    showMatchActions
};