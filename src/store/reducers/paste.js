import * as actionTypes from '../actions/actionTypes';
import { cloneDeep } from 'lodash';

let initialState = {
    pasteID: null,
    error: null,
    loading: false
};

const pasteAddStart = (state, action) => {
    state.loading = true
    state.error = null
    return state
}

const pasteAddSuccess = (state, action) => {
    state.loading = false
    state.pasteID = action.pasteID
    state.error = null
    return state
}

const pasteAddFail = (state, action) => {
    state.loading = false
    state.error = action.error
    return state
}

const pasteAddReset = (state, action) => {
    state.pasteID = null;
    state.loading = false;
    state.error = null;
    return state
}

const reducer = (state = initialState, action) => {
    let newState = cloneDeep(state);
    switch (action.type) {
        case actionTypes.PASTE_ADD_RESET:
            return pasteAddReset(newState, action);
        case actionTypes.PASTE_ADD_START:
            return pasteAddStart(newState, action);
        case actionTypes.PASTE_ADD_SUCCESS:
            return pasteAddSuccess(newState, action);
        case actionTypes.PASTE_ADD_FAIL:
            return pasteAddFail(newState, action);
        default:
            return state;
    }
}

export default reducer;