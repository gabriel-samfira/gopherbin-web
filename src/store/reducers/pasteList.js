import * as actionTypes from '../actions/actionTypes';
import { cloneDeep } from 'lodash';

const initialState = {
    loading: false,
    pastes: {},
    error: null,
    page: 1,
    maxResults: 10,
    totalPages: 1
}

const pasteListStart = (state, action) => {
    state.loading = true
    state.error = null
    return state
}

const pasteListSuccess = (state, action) => {
    state.loading = false
    state.pastes = action.pastes
    state.error = null
    state.page = action.page
    state.maxResults = action.maxResults
    state.totalPages = action.pastes.total_pages
    return state
}

const pasteListFail = (state, action) => {
    state.loading = false
    state.error = action.error
    state.pastes = {}
    state.page = 1
    state.maxResults = 50
    state.totalPages = 1
    return state
}

const pasteListReset = (state, action) => {
    state.pastes = {};
    state.loading = false;
    state.error = null;
    state.page = 1
    state.maxResults = 50
    state.totalPages = 1
    return state
}

const pasteDeleteStart = (state, action) => {
    state.loading = true
    return state
}

const pasteDeleteSuccess = (state, action) => {
    if (state.pastes.pastes !== null && state.pastes.pastes !== undefined){
        let newPastes = []
        for (let paste in state.pastes.pastes) {
            if (state.pastes.pastes[paste].paste_id !== action.pasteID) {
                newPastes.push(state.pastes.pastes[paste])
            }
        }
        state.pastes.pastes = newPastes
    }
    state.error = null
    state.loading = false
    return state
}

const pasteDeleteFail = (state, action) => {
    if (state.pastes.pastes !== null && state.pastes.pastes !== undefined){
        let newPastes = state.pastes.pastes.filter((paste) => {
            if (paste.paste_id === action.pasteID) {
                paste.error = action.error
            }
            return paste
        })
        state.pastes.pastes = newPastes
    }
    state.error = action.error
    state.loading = false
    return state
}

const pasteUpdateStart = (state, action) => {
    state.loading = true
    return state
}

const pasteUpdateSuccess = (state, action) => {
    if (state.pastes.pastes !== null && state.pastes.pastes !== undefined){
        let newPastes = state.pastes.pastes.filter((paste) => {
            if (paste.paste_id === action.pasteID) {
                paste.public = action.pasteData.public
            }
            return paste
        })
        state.pastes.pastes = newPastes
    }
    state.error = null
    state.loading = false
    return state
}

const pasteUpdateFail = (state, action) => {
    if (state.pastes.pastes !== null && state.pastes.pastes !== undefined){
        let newPastes = state.pastes.pastes.filter((paste) => {
            if (paste.paste_id === action.pasteID) {
                paste.error = action.error
            }
            return paste
        })
        state.pastes.pastes = newPastes
    }
    state.error = action.error
    state.loading = false
    return state
}


const reducer = (state = initialState, action) => {
    let newState = cloneDeep(state);
    switch (action.type) {
        case actionTypes.PASTE_LIST_RESET:
            return pasteListReset(newState, action);
        case actionTypes.PASTE_LIST_START:
            return pasteListStart(newState, action);
        case actionTypes.PASTE_LIST_SUCCESS:
            return pasteListSuccess(newState, action);
        case actionTypes.PASTE_LIST_FAIL:
            return pasteListFail(newState, action);
        case actionTypes.PASTE_DELETE_START:
            return pasteDeleteStart(newState, action)
        case actionTypes.PASTE_DELETE_SUCCESS:
            return pasteDeleteSuccess(newState, action)
        case actionTypes.PASTE_DELETE_FAIL:
            return pasteDeleteFail(newState, action)
        case actionTypes.PASTE_UPDATE_START:
            return pasteUpdateStart(newState, action)
        case actionTypes.PASTE_UPDATE_SUCCESS:
            return pasteUpdateSuccess(newState, action)
        case actionTypes.PASTE_UPDATE_FAIL:
            return pasteUpdateFail(newState, action)
        default:
            return state;
    }
}

export default reducer;