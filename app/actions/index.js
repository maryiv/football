import Parse from 'parse/react-native';
import * as types from '../constants/ActionTypes';

const Match = Parse.Object.extend('Match');

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
                    matches: response
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

export function showMatchActions(match_index: string) {
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