import * as actionTypes from './actionTypes';
import * as urls from './urls';

import axios from '../../axios';
import jwt_decode from "jwt-decode";


export const authStart = () => {
    return {
        type: actionTypes.AUTH_START
    }
}

export const authSuccess = (token) => {
    let tokenInfo = jwt_decode(token);
    let extraInfo = {}
    if (tokenInfo) {
        extraInfo = {
            isSuperUser: tokenInfo.is_superuser,
            isAdmin: tokenInfo.is_admin,
            fullName: tokenInfo.full_name
        }
    }
    return {
        ...extraInfo,
        type: actionTypes.AUTH_SUCCESS,
        token: token,
    }
}

export const authFail = (error) => {
    return {
        type: actionTypes.AUTH_FAIL,
        error: error
    }
}

export const logout = () => {
    localStorage.removeItem('token')
    return {
        type: actionTypes.AUTH_LOGOUT
    }
}

export const auth = (email, password) => {
    return dispatch => {
        dispatch(authStart());
        let baseURL = urls.signInURL

        let payload = {
            username: email,
            password: password
        }

        axios.post(baseURL, payload)
            .then(response => {
                localStorage.setItem('token', response.data.token)
                dispatch(authSuccess(response.data.token));
                return response;
            })
            .catch(error => {
                localStorage.removeItem('token')
                dispatch(authFail(error))
            });
    }
}

export const setAuthRedirectPath = (path) => {
    return {
        type: actionTypes.SET_AUTH_REDIRECT_PATH,
        path: path
    }
}

export const authStateCheck = () => {
    return dispatch => {
        const token = localStorage.getItem('token')

        if (!token) {
            dispatch(logout())
        } else {
            dispatch(authSuccess(token))
        }
    }
}