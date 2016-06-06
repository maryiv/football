/**
 * @flow
 */

'use strict';

import * as types from '../constants/ActionTypes';

const initialState = {
  isFetching: true,
  visibilityFilter: types.VisibilityFilters.SHOW_UPCOMING,
  matches: []
};

function schedule(state = initialState, action) {
  switch (action.type) {
    case types.SET_VISIBILITY_FILTER:
      return Object.assign({}, state, {
        visibilityFilter: action.filter
      });
    case types.LOAD_MATCHES_SUCCESS:
      return Object.assign({}, state, {
        isFetching: false,
        matches: action.response
      });
    default:
      return state;
  }
}

module.exports = schedule;
