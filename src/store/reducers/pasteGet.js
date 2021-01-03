import * as actionTypes from '../actions/actionTypes';
import { cloneDeep } from 'lodash';

const initialState = {
    loading: false,
    pasteData: null,
    pasteID: null,
    error: null
}

const pasteGetStart = (state, action) => {
    state.loading = true
    state.error = null
    return state
}

const pasteGetSuccess = (state, action) => {
    state.loading = false
    state.pasteData = action.pasteData
    state.error = null
    return state
}

const pasteGetFail = (state, action) => {
    state.loading = false
    state.error = action.error
    state.pasteData = null
    return state
}

const pasteGetReset = (state, action) => {
    state.pasteID = null;
    state.pasteData = null;
    state.loading = false;
    state.error = null;
    return state
}


const reducer = (state = initialState, action) => {
    let newState = cloneDeep(state);
    switch (action.type) {
        case actionTypes.PASTE_GET_RESET:
            return pasteGetReset(newState, action);
        case actionTypes.PASTE_GET_START:
            return pasteGetStart(newState, action);
        case actionTypes.PASTE_GET_SUCCESS:
            return pasteGetSuccess(newState, action);
        case actionTypes.PASTE_GET_FAIL:
            return pasteGetFail(state, action);
        default:
            return state;
    }
}

export default reducer;