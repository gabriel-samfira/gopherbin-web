import * as actionTypes from '../actions/actionTypes';
import { cloneDeep } from 'lodash';

let initialState = {
    loading: false,
    userInfo: {},
    error: null
};

const userCreateStart = (state, action) => {
    state.loading = true
    state.error = null
    return state
}

const userCreateSuccess = (state, action) => {
    state.loading = false
    state.userInfo = action.userInfo
    state.error = null
    return state
}

const userCreateFail = (state, action) => {
    state.loading = false
    state.error = action.error
    state.userInfo = {}
    return state
}

const userCreateReset = (state, action) => {
    state.userInfo = {};
    state.loading = false;
    state.error = null;
    return state
}

const reducer = (state = initialState, action) => {
    let newState = cloneDeep(state);
    switch (action.type) {
        case actionTypes.USER_CREATE_RESET:
            return userCreateReset(newState, action);
        case actionTypes.USER_CREATE_START:
            return userCreateStart(newState, action);
        case actionTypes.USER_CREATE_SUCCESS:
            return userCreateSuccess(newState, action);
        case actionTypes.USER_CREATE_FAIL:
            return userCreateFail(newState, action);
        default:
            return state;
    }
}

export default reducer;