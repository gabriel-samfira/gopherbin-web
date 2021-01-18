import * as actionTypes from '../actions/actionTypes';
import { cloneDeep } from 'lodash';

const initialState = {
    loading: false,
    pasteData: null,
    pasteID: null,
    error: null
}

const publicPasteGetStart = (state, action) => {
    state.loading = true
    state.error = null
    return state
}

const publicPasteGetSuccess = (state, action) => {
    state.loading = false
    state.pasteData = action.pasteData
    state.error = null
    return state
}

const publicPasteGetFail = (state, action) => {
    state.loading = false
    state.error = action.error
    state.pasteData = null
    return state
}

const publicPasteGetReset = (state, action) => {
    state.pasteID = null;
    state.pasteData = null;
    state.loading = false;
    state.error = null;
    return state
}

const reducer = (state = initialState, action) => {
    let newState = cloneDeep(state);
    switch (action.type) {
        case actionTypes.PUB_PASTE_GET_RESET:
            return publicPasteGetReset(newState, action);
        case actionTypes.PUB_PASTE_GET_START:
            return publicPasteGetStart(newState, action);
        case actionTypes.PUB_PASTE_GET_SUCCESS:
            return publicPasteGetSuccess(newState, action);
        case actionTypes.PUB_PASTE_GET_FAIL:
            return publicPasteGetFail(newState, action);
        default:
            return state;
    }
}

export default reducer;