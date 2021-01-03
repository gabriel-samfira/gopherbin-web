import * as actionTypes from '../actions/actionTypes';
import { cloneDeep } from 'lodash';

let initialState = {
    loading: false,
    userInfo: {},
    error: null,
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
    state.userInfo = action.userInfo
    return state
}

const userUpdateFail = (state, action) => {
    state.error = action.error
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