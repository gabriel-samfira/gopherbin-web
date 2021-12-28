import * as actionTypes from './actionTypes';
import * as urls from './urls';

import axios from '../../axios';


export const initPasteGetState = () => {
    return {
        type: actionTypes.PASTE_GET_RESET
    }
}

export const pasteGetStart = () => {
    return {
        type: actionTypes.PASTE_GET_START
    }
}

export const pasteGetSuccess = (pasteData) => {
    return {
        type: actionTypes.PASTE_GET_SUCCESS,
        pasteData: pasteData
    }
}

export const pasteGetFail = (error) => {
    return {
        type: actionTypes.PASTE_GET_FAIL,
        error: error
    }
}


export const initPasteListState = () => {
    return {
        type: actionTypes.PASTE_LIST_RESET
    }
}

export const pasteListStart = () => {
    return {
        type: actionTypes.PASTE_LIST_START
    }
}

export const pasteListSuccess = (pastesData, page, maxResults) => {
    return {
        type: actionTypes.PASTE_LIST_SUCCESS,
        pastes: pastesData,
        page: page,
        maxResults: maxResults
    }
}

export const pasteListFail = (error) => {
    return {
        type: actionTypes.PASTE_LIST_FAIL,
        error: error
    }
}

export const getPaste = (pasteID, token) => {
    return dispatch => {
        dispatch(pasteGetStart());

        const config = {
            headers: { Authorization: `Bearer ${token}` }
        };
        
        axios.get(urls.pasteURL + "/" + pasteID, config)
            .then(response => {
                dispatch(pasteGetSuccess(response.data));
                return response;
            })
            .catch(error => {
                dispatch(pasteGetFail(error))
            });
    }
}

export const initPublicPasteGetState = () => {
    return {
        type: actionTypes.PUB_PASTE_GET_RESET
    }
}

export const publicPasteGetStart = () => {
    return {
        type: actionTypes.PUB_PASTE_GET_START
    }
}

export const publicPasteGetSuccess = (pasteData) => {
    return {
        type: actionTypes.PUB_PASTE_GET_SUCCESS,
        pasteData: pasteData
    }
}

export const publicPasteGetFail = (error) => {
    return {
        type: actionTypes.PUB_PASTE_GET_FAIL,
        error: error
    }
}

export const getPublicPaste = (pasteID) => {
    return dispatch => {
        dispatch(publicPasteGetStart());
        
        axios.get(urls.publicPasteURL + "/" + pasteID)
            .then(response => {
                dispatch(publicPasteGetSuccess(response.data));
                return response;
            })
            .catch(error => {
                dispatch(publicPasteGetFail(error))
            });
    }
}


export const listPastes = (page, maxResults, token) => {
    return dispatch => {
        dispatch(pasteListStart());

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
            params: params
        };
        
        axios.get(urls.pasteURL, config)
            .then(response => {
                dispatch(pasteListSuccess(response.data, page, maxResults));
                return response;
            })
            .catch(error => {
                dispatch(pasteGetFail(error))
            });
    }
}

export const pasteDeleteStart = () => {
    return {
        type: actionTypes.PASTE_DELETE_START
    }
}

export const pasteDeleteSuccess = (pasteID) => {
    return {
        type: actionTypes.PASTE_DELETE_SUCCESS,
        pasteID: pasteID
    }
}

export const pasteDeleteFail = (pasteID, error) => {
    return {
        type: actionTypes.PASTE_DELETE_FAIL,
        pasteID: pasteID,
        error: error
    }
}


export const pasteUpdateStart = () => {
    return {
        type: actionTypes.PASTE_UPDATE_START
    }
}

export const pasteUpdateSuccess = (pasteID, pasteData) => {
    return {
        type: actionTypes.PASTE_UPDATE_SUCCESS,
        pasteID: pasteID,
        pasteData: pasteData
    }
}

export const pasteUpdateFail = (pasteID, error) => {
    return {
        type: actionTypes.PASTE_UPDATE_FAIL,
        pasteID: pasteID,
        error: error
    }
}

export const deletePaste = (pasteID, token) => {
    return dispatch => {
        dispatch(pasteDeleteStart());

        const config = {
            headers: { Authorization: `Bearer ${token}` }
        };

        axios.delete(urls.pasteURL + "/" + pasteID, config)
            .then(response => {
                dispatch(pasteDeleteSuccess(pasteID));
                return response;
            })
            .catch(error => {
                dispatch(pasteDeleteFail(pasteID, error))
            });
    }
}

export const updatePaste = (pasteID, pasteData, token) => {
    return dispatch => {
        dispatch(pasteUpdateStart());

        const config = {
            headers: { Authorization: `Bearer ${token}` }
        };

        let payload = {
            public: pasteData.public
        }
        axios.put(urls.pasteURL + "/" + pasteID, payload, config)
            .then(response => {
                dispatch(pasteUpdateSuccess(pasteID, response.data));
                return response;
            })
            .catch(error => {
                dispatch(pasteUpdateFail(pasteID, error))
            });
    }
}