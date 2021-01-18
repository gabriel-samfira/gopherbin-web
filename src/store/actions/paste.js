import * as actionTypes from './actionTypes';
import * as urls from './urls';
import { encode } from 'js-base64';

import axios from '../../axios';


export const initPasteState = () => {
    return {
        type: actionTypes.PASTE_ADD_RESET
    }
}

export const pasteAddStart = () => {
    return {
        type: actionTypes.PASTE_ADD_START
    }
}

export const pasteAddSuccess = (pasteData) => {
    return {
        type: actionTypes.PASTE_ADD_SUCCESS,
        pasteData: pasteData
    }
}

export const pasteAddFail = (error) => {
    return {
        type: actionTypes.PASTE_ADD_FAIL,
        error: error
    }
}

export const createPaste = (pasteData, token) => {
    return dispatch => {
        dispatch(pasteAddStart());

        const config = {
            headers: { Authorization: `Bearer ${token}` }
        };
        
        let payload = {
            name: pasteData.title,
            expires: pasteData.expires,
            public: pasteData.isPublic,
            language: pasteData.lang,
            data: encode(pasteData.data)
        }

        axios.post(urls.pasteURL, payload, config)
            .then(response => {
                dispatch(pasteAddSuccess(response.data));
                return response;
            })
            .catch(error => {
                dispatch(pasteAddFail(error))
            });
    }
}
