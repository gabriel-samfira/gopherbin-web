import * as actionTypes from './actionTypes';
import * as urls from './urls';
import { initUserGetState } from './adminUserGet';

import axios from '../../axios';

var JSONbigString = require('json-bigint')({ storeAsString: true });


export const initUserListState = () => {
    return {
        type: actionTypes.USER_LIST_RESET
    }
}

export const userListStart = () => {
    return {
        type: actionTypes.USER_LIST_START
    }
}

export const userListSuccess = (usersData, page, maxResults) => {
    return {
        type: actionTypes.USER_LIST_SUCCESS,
        users: usersData,
        page: page,
        maxResults: maxResults
    }
}

export const userListFail = (error) => {
    return {
        type: actionTypes.USER_LIST_FAIL,
        error: error
    }
}

export const listUsers = (page, maxResults, token) => {
    return dispatch => {
        dispatch(userListStart());

        const defaultPage = 1
        const defaultMaxResults = 50

        let params = {
            page: defaultPage,
            max_results: defaultMaxResults
        }

        if (page !== null) {
            params.page = page
        }

        if (maxResults !== null) {
            params.max_results = maxResults
        }

        const config = {
            headers: { Authorization: `Bearer ${token}` },
            params: params,
            transformResponse: (data) => {
                return JSONbigString.parse(data)
            },
        };
        
        axios.get(urls.adminUsersURL, config)
            .then(response => {
                dispatch(userListSuccess(response.data, page, maxResults));
                return response;
            })
            .catch(error => {
                dispatch(userListFail(error))
            });
    }
}

export const userDeleteStart = () => {
    return {
        type: actionTypes.USER_DELETE_START
    }
}

export const userDeleteSuccess = (userID) => {
    return {
        type: actionTypes.USER_DELETE_SUCCESS,
        userID: userID
    }
}

export const userDeleteFail = (userID, error) => {
    return {
        type: actionTypes.USER_DELETE_FAIL,
        userID: userID,
        error: error
    }
}


export const deleteUser = (userID, token) => {
    return dispatch => {
        dispatch(userDeleteStart());

        const config = {
            headers: { Authorization: `Bearer ${token}` }
        };

        axios.delete(urls.adminUsersURL + "/" + userID, config)
            .then(response => {
                dispatch(userDeleteSuccess(userID));
                dispatch(initUserGetState());
                return response;
            })
            .catch(error => {
                dispatch(userDeleteFail(userID, error))
            });
    }
}