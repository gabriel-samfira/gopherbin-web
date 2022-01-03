import * as actionTypes from './actionTypes';
import * as urls from './urls';

import axios from '../../axios';

var JSONbigString = require('json-bigint')({ storeAsString: true });


export const initUserCreateState = () => {
    return {
        type: actionTypes.USER_CREATE_RESET
    }
}

export const userCreateStart = () => {
    return {
        type: actionTypes.USER_CREATE_START
    }
}

export const userCreateSuccess = (userInfo) => {
    return {
        type: actionTypes.USER_CREATE_SUCCESS,
        userInfo: userInfo
    }
}

export const userCreateFail = (error) => {
    return {
        type: actionTypes.USER_CREATE_FAIL,
        error: error
    }
}

export const createUser = (userCreateInfo, token) => {
    return dispatch => {
        dispatch(userCreateStart());

        const config = {
            headers: { Authorization: `Bearer ${token}` },
            transformResponse: (data) => {
                return JSONbigString.parse(data)
            },
        };
        
        let payload = {
            full_name: userCreateInfo.fullName,
            username: userCreateInfo.username,
            email: userCreateInfo.email,
            password: userCreateInfo.password,
            enabled: userCreateInfo.enabled
        }

        if (userCreateInfo.isAdmin) {
            payload.is_admin = userCreateInfo.isAdmin
        }

        axios.post(urls.adminUsersURL, payload, config)
            .then(response => {
                dispatch(userCreateSuccess(response.data));
                return response;
            })
            .catch(error => {
                dispatch(userCreateFail(error))
            });
    }
}
