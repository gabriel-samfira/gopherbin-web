import * as actionTypes from '../actions/actionTypes';
import { cloneDeep } from 'lodash';

const initialState = {
    loading: false,
    shares: [],
    pasteID: null,
    pasteName: null,
    error: null
}

const pasteShareListStart = (state, action) => {
    state.loading = true
    state.error = null
    state.pasteID = null
    state.pasteName = null
    return state
}

const pasteShareListSuccess = (state, action) => {
    state.loading = false
    state.shares = action.pasteShareData
    state.pasteID = action.pasteID
    state.pasteName = action.pasteName
    state.error = null
    return state
}

const pasteShareListFail = (state, action) => {
    state.loading = false
    state.error = action.error
    return state
}

const pasteShareListReset = (state, action) => {
    state.shares = {};
    state.loading = false
    state.error = null
    state.pasteID = null
    state.pasteName = null
    return state
}

const pasteShareDeleteStart = (state, action) => {
    state.loading = true
    return state
}

const pasteShareDeleteSuccess = (state, action) => {
    state.loading = false
    if (state.shares !== null && state.shares !== undefined){
        let newShares = []
        for (let share in state.shares) {
            if (state.shares[share].username !== action.userID && state.shares[share].email !== action.userID) {
                newShares.push(state.shares[share])
            }
        }
        state.shares = newShares
    }
    state.error = null
    return state
}

const pasteShareDeleteFail = (state, action) => {
    state.loading = false
    state.error = action.error
    return state
}

// Add paste share

const pasteShareAddStart = (state, action) => {
    state.loading = true
    return state
}

const pasteShareAddSuccess = (state, action) => {
    state.loading = false
    let found = false
    for (let share in state.shares) {
        if (state.shares[share].username === action.shareData.username) {
            found = true
            break
        } 
    }
    if (!found) {
        state.shares.push(action.shareData)
    }
    state.error = null
    return state
}

const pasteShareAddFail = (state, action) => {
    state.loading = false
    state.error = action.error
    return state
}



const reducer = (state = initialState, action) => {
    let newState = cloneDeep(state);
    switch (action.type) {
        case actionTypes.PASTE_SHARE_LIST_RESET:
            return pasteShareListReset(newState, action);
        case actionTypes.PASTE_SHARE_LIST_START:
            return pasteShareListStart(newState, action);
        case actionTypes.PASTE_SHARE_LIST_SUCCESS:
            return pasteShareListSuccess(newState, action);
        case actionTypes.PASTE_SHARE_LIST_FAIL:
            return pasteShareListFail(newState, action);
        case actionTypes.PASTE_SHARE_REMOVE_START:
            return pasteShareDeleteStart(newState, action)
        case actionTypes.PASTE_SHARE_REMOVE_SUCCESS:
            return pasteShareDeleteSuccess(newState, action)
        case actionTypes.PASTE_SHARE_REMOVE_FAIL:
            return pasteShareDeleteFail(newState, action)
        case actionTypes.PASTE_SHARE_ADD_START:
            return pasteShareAddStart(newState, action)
        case actionTypes.PASTE_SHARE_ADD_SUCCESS:
            return pasteShareAddSuccess(newState, action)
        case actionTypes.PASTE_SHARE_ADD_FAIL:
            return pasteShareAddFail(newState, action)
        default:
            return state;
    }
}

export default reducer;