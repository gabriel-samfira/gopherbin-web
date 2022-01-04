import * as actionTypes from '../actions/actionTypes';
import { cloneDeep } from 'lodash';

let initialState = {
    loading: false,
    hasUsername: false,
    userInfo: {},
    error: null,
    updateUserInfoError: null,
    passwordUpdateError: null,
    deleted: false
};

const userGetStart = (state, action) => {
    state.loading = true
    state.error = null
    state.deleted = false
    return state
}

const userGetSuccess = (state, action) => {
    state.loading = false
    state.userInfo = action.userInfo
    state.hasUsername = action.userInfo.username !== undefined && action.userInfo.username !== ""
    state.error = null
    state.deleted = false
    return state
}

const userGetFail = (state, action) => {
    state.loading = false
    state.error = action.error
    state.userInfo = {}
    state.deleted = false
    return state
}

const userGetReset = (state, action) => {
    state.userInfo = {};
    state.loading = false;
    state.error = null;
    state.deleted = false
    return state
}

const userUpdateStart = (state, action) => {
    state.loading = true;
    state.error = null;
    return state
}

const userUpdateSuccess = (state, action) => {
    state.loading = false
    state.error = null
    state.passwordUpdateError = null
    state.updateUserInfoError = null
    state.userInfo = action.userInfo
    state.hasUsername = action.userInfo.username !== undefined && action.userInfo.username !== ""
    return state
}

const userUpdateFail = (state, action) => {
    state.updateUserError = action.updateUserError
    state.error = action.error
    state.passwordUpdateError = action.passwordUpdateError
    state.updateUserInfoError = action.updateUserInfoError
    state.loading = false
    return state
}

const reducer = (state = initialState, action) => {
    let newState = cloneDeep(state);
    switch (action.type) {
        case actionTypes.USER_GET_RESET:
            return userGetReset(newState, action);
        case actionTypes.USER_GET_START:
            return userGetStart(newState, action);
        case actionTypes.USER_GET_SUCCESS:
            return userGetSuccess(newState, action);
        case actionTypes.USER_GET_FAIL:
            return userGetFail(newState, action);
        case actionTypes.USER_UPDATE_START:
            return userUpdateStart(newState, action);
        case actionTypes.USER_UPDATE_SUCCESS:
            return userUpdateSuccess(newState, action);
        case actionTypes.USER_UPDATE_FAIL:
            return userUpdateFail(newState, action);
        default:
            return state;
    }
}

export default reducer;