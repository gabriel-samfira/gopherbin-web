import * as actionTypes from '../actions/actionTypes';
import { cloneDeep } from 'lodash';

let initialState = {
    token: null,
    error: null,
    loading: false,
    authRedirect: '/',
    isAdmin: false,
    isSuperUser: false,
    fullName: ""
};

const authStart = (state, action) => {
    state.loading = true
    state.error = null
    state.isAdmin = false
    state.isSuperUser = false
    state.fullName = ""
    return state
}

const authSuccess = (state, action) => {
    state.loading = false
    state.token = action.token
    state.isAdmin = action.isAdmin
    state.isSuperUser = action.isSuperUser
    state.fullName = action.fullName
    state.error = null
    return state
}

const authFail = (state, action) => {
    state.loading = false
    state.error = action.error
    state.isAdmin = false
    state.isSuperUser = false
    state.fullName = ""
    return state
}

const authLogout = (state, action) => {
    state.token = null;
    state.isAdmin = false
    state.isSuperUser = false
    state.fullName = ""
    return state
}

const setAuthRedirectPath = (state, action) => {
    state.authRedirect = action.path
    return state
}

const reducer = (state = initialState, action) => {
    let newState = cloneDeep(state);
    switch (action.type) {
        case actionTypes.AUTH_START:
            return authStart(newState, action);
        case actionTypes.AUTH_SUCCESS:
            return authSuccess(newState, action);
        case actionTypes.AUTH_FAIL:
            return authFail(newState, action);
        case actionTypes.AUTH_LOGOUT:
            return authLogout(state, action);
        case actionTypes.SET_AUTH_REDIRECT_PATH:
            return setAuthRedirectPath(state, action)
        default:
            return state;
    }
}

export default reducer;