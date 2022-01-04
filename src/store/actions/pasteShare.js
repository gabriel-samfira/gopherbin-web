import * as actionTypes from './actionTypes';
import * as urls from './urls';

import axios from '../../axios';

export const initPasteShareList = () => {
    return {
        type: actionTypes.PASTE_SHARE_LIST_RESET
    }
}

// List paste shares

export const pasteShareListStart = (pasteID) => {
    return {
        type: actionTypes.PASTE_SHARE_LIST_START,
        pasteID: pasteID
    }
}

export const pasteShareListSuccess = (pasteID, pasteName, pasteShareData) => {
    return {
        type: actionTypes.PASTE_SHARE_LIST_SUCCESS,
        pasteID: pasteID,
        pasteName: pasteName,
        pasteShareData: pasteShareData.users
    }

}
export const pasteShareListFail = (pasteID, error) => {
    return {
        type: actionTypes.PASTE_SHARE_LIST_FAIL,
        pasteID: pasteID,
        error: error
    }
}

export const listPasteShares = (pasteID, pasteName, token) => {
    return dispatch => {
        dispatch(pasteShareListStart());

        const config = {
            headers: { Authorization: `Bearer ${token}` }
        };
        let shareURI = urls.pasteURL + "/" + pasteID + "/sharing"
        axios.get(shareURI, config)
            .then(response => {
                dispatch(pasteShareListSuccess(pasteID, pasteName, response.data));
                return response;
            })
            .catch(error => {
                dispatch(pasteShareListFail(pasteID, error))
            });
    }
}

// Delete paste shares

export const pasteShareDeleteStart = (pasteID) => {
    return {
        type: actionTypes.PASTE_SHARE_REMOVE_START,
        pasteID: pasteID
    }
}

export const pasteShareDeleteSuccess = (pasteID, userID) => {
    return {
        type: actionTypes.PASTE_SHARE_REMOVE_SUCCESS,
        pasteID: pasteID,
        userID: userID
    }

}
export const pasteShareDeleteFail = (pasteID, userID, error) => {
    return {
        type: actionTypes.PASTE_SHARE_REMOVE_FAIL,
        pasteID: pasteID,
        userID: userID,
        error: error
    }
}

export const deletePasteShare = (pasteID, userID, token) => {
    return dispatch => {
        dispatch(pasteShareDeleteStart());

        const config = {
            headers: { Authorization: `Bearer ${token}` }
        };
        let shareURI = urls.pasteURL + "/" + pasteID + "/sharing/" + userID
        axios.delete(shareURI, config)
            .then(response => {
                dispatch(pasteShareDeleteSuccess(pasteID, userID));
                return response;
            })
            .catch(error => {
                dispatch(pasteShareDeleteFail(pasteID, userID, error))
            });
    }
}


// Add paste share
export const pasteShareAddStart = (pasteID) => {
    return {
        type: actionTypes.PASTE_SHARE_ADD_START,
        pasteID: pasteID
    }
}

export const pasteShareAddSuccess = (pasteID, userID, shareData) => {
    return {
        type: actionTypes.PASTE_SHARE_ADD_SUCCESS,
        pasteID: pasteID,
        userID: userID,
        shareData: shareData
    }

}
export const pasteShareAddFail = (pasteID, userID, error) => {
    return {
        type: actionTypes.PASTE_SHARE_ADD_FAIL,
        pasteID: pasteID,
        userID: userID,
        error: error
    }
}

export const addPasteShare = (pasteID, userID, token) => {
    return dispatch => {
        dispatch(pasteShareAddStart());

        const config = {
            headers: { Authorization: `Bearer ${token}` }
        };

        let payload = {
            userID: userID
        }
        let shareURI = urls.pasteURL + "/" + pasteID + "/sharing"
        axios.post(shareURI, payload, config)
            .then(response => {
                dispatch(pasteShareAddSuccess(pasteID, userID, response.data));
                return response;
            })
            .catch(error => {
                dispatch(pasteShareAddFail(pasteID, userID, error))
            });
    }
}

