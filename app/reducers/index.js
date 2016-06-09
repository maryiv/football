import { combineReducers } from 'redux';
import * as types from '../constants/ActionTypes';

const initialScheduleState = {
    isFetching: false,
    visibilityFilter: types.VisibilityFilters.SHOW_UPCOMING,
    matches: []
};

function schedule(state = initialScheduleState, action) {
    switch (action.type) {
        case types.SET_VISIBILITY_FILTER:
            return Object.assign({}, state, {
                visibilityFilter: action.filter
            });
        case types.LOAD_MATCHES_REQUEST:
            return Object.assign({}, state, {
                isFetching: true,
                matches: []
            });
        case types.LOAD_MATCHES_SUCCESS:
            return Object.assign({}, state, {
                isFetching: false,
                matches: action.matches
            });
        default:
            return state;
    }
}

const rootReducer = combineReducers({
    schedule
});

export default rootReducer