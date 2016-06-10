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
            let matches = action.matches.map(match => parseMatch(match));
            return Object.assign({}, state, {
                isFetching: false,
                matches: matches
            });
        default:
            return state;
    }
}

function parseMatch(match) {
    return {
        date: match.get('date'),
        time: match.get('time'),
        competition: match.get('competition'),
        liveMatch: match.get('liveMatch'),
        result: match.get('result'),
        previewAvailable: match.get('previewAvailable'),
        reportAvailable: match.get('reportAvailable'),
        lineupsAvailable: match.get('lineupsAvailable'),
        matchStatus: match.get('matchStatus')
    }
}

const rootReducer = combineReducers({
    schedule
});

export default rootReducer