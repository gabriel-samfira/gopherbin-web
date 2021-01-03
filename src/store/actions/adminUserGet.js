import * as actionTypes from './actionTypes';
import * as urls from './urls';

import axios from '../../axios';

var JSONbigString = require('json-bigint')({ storeAsString: true });

export const initUserGetState = () => {
    return {
        type: actionTypes.USER_GET_RESET
    }
}

export const userGetStart = () => {
    return {
        type: actionTypes.USER_GET_START
    }
}

export const userGetSuccess = (userInfo) => {
    return {
        type: actionTypes.USER_GET_SUCCESS,
        userInfo: userInfo
    }
}

export const userGetFail = (error) => {
    return {
        type: actionTypes.USER_GET_FAIL,
        error: error
    }
}

export const getUser = (userID, token) => {
    return dispatch => {
        dispatch(userGetStart());

        const config = {
            headers: { Authorization: `Bearer ${token}` },
            transformResponse: (data) => {
                return JSONbigString.parse(data)
            }
        };
        
        axios.get(urls.adminUsersURL + "/" + userID, config)
            .then(response => {
                dispatch(userGetSuccess(response.data));
                return response;
            })
            .catch(error => {
                dispatch(userGetFail(error))
            });
    }
}

const userUpdateStart = () => {
    return {
        type: actionTypes.USER_UPDATE_START
    }
}

const userUpdateSuccess = (userInfo) => {
    return {
        type: actionTypes.USER_UPDATE_SUCCESS,
        userInfo: userInfo
    }
}

const userUpdateFail = (error) => {
    return {
        type: actionTypes.USER_UPDATE_FAIL,
        error: error
    }
}

export const adminUpdateUserPassword = (userId, password, token) => {
    return dispatch => {
        dispatch(userUpdateStart());

        const config = {
            headers: { Authorization: `Bearer ${token}` },
            transformResponse: (data) => {
                return JSONbigString.parse(data)
            }
        };

        const payload = {
            password: password
        }
        
        axios.put(urls.adminUsersURL + "/" + userId, payload, config)
            .then(response => {
                dispatch(userUpdateSuccess(response.data));
                return response;
            })
            .catch(error => {
                dispatch(userUpdateFail(error))
            });
    }
}