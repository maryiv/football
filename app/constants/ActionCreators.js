/**
 * @flow
 */
'use strict';

const Parse = require('parse/react-native');
const Match = Parse.Object.extend('Match');

import * as types from '../constants/ActionTypes';

export function showActions(match_index) {
    return { type: types.SHOW_ACTIONS, match_index }
}

export function setVisibilityFilter(filter) {
    return { type: types.SET_VISIBILITY_FILTER, filter }
}

export function loadMatches() {
    return function (dispatch, getState) {
        let { matches } = getState();
        if (matches) {
            // There is cached data! Don't do anything.
            return;
        }

        dispatch({
            type: types.LOAD_MATCHES_REQUEST
        });

        new Parse.Query(Match).find({
            success: function (response) {
                dispatch({
                    type: types.LOAD_MATCHES_SUCCESS,
                    response
                });
            },
            error: function (error) {
                dispatch({
                    type: types.LOAD_MATCHES_FAILURE,
                    error
                });
            }
        });
    }
}