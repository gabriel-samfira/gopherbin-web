import * as actionTypes from '../actions/actionTypes';
import { cloneDeep } from 'lodash';

let initialState = {
    loading: false,
    users: {},
    error: null,
    page: 1,
    maxResults: 10,
    totalPages: 1
};

const userListStart = (state, action) => {
    state.loading = true
    state.error = null
    return state
}

const userListSuccess = (state, action) => {
    state.loading = false
    state.users = action.users
    state.error = null
    state.page = action.page
    state.maxResults = action.maxResults
    state.totalPages = action.users.total_pages
    return state
}

const userListFail = (state, action) => {
    state.loading = false
    state.error = action.error
    state.users = {}
    state.page = 1
    state.maxResults = 10
    state.totalPages = 1
    return state
}

const userListReset = (state, action) => {
    state.users = {};
    state.loading = false;
    state.error = null;
    state.page = 1
    state.maxResults = 10
    state.totalPages = 1
    return state
}

const userDeleteStart = (state, action) => {
    state.loading = true
    return state
}

const userDeleteSuccess = (state, action) => {
    if (state.users.users !== null && state.users.users !== undefined){
        let newUsers = []
        for (let user in state.users.users) {
            if (state.users.users[user].id !== action.userID) {
                newUsers.push(state.users.users[user])
            }
        }
        state.users.users = newUsers
    }
    state.error = null
    state.loading = false
    return state
}

const userDeleteFail = (state, action) => {
    if (state.users.users !== null && state.users.users !== undefined){
        let newUsers = state.users.users.filter((user) => {
            if (user.id === action.userID) {
                user.error = action.error
            }
            return user
        })
        state.users.users = newUsers
    }
    state.error = action.error
    state.loading = false
    return state
}

const reducer = (state = initialState, action) => {
    let newState = cloneDeep(state);
    switch (action.type) {
        case actionTypes.USER_LIST_RESET:
            return userListReset(newState, action);
        case actionTypes.USER_LIST_START:
            return userListStart(newState, action);
        case actionTypes.USER_LIST_SUCCESS:
            return userListSuccess(newState, action);
        case actionTypes.USER_LIST_FAIL:
            return userListFail(newState, action);
        case actionTypes.USER_DELETE_START:
            return userDeleteStart(newState, action)
        case actionTypes.USER_DELETE_SUCCESS:
            return userDeleteSuccess(newState, action)
        case actionTypes.USER_DELETE_FAIL:
            return userDeleteFail(newState, action)
        default:
            return state;
    }
}

export default reducer;