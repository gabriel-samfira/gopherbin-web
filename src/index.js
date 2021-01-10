import React from 'react';
import ReactDOM from 'react-dom';

import "bootstrap/dist/css/bootstrap.min.css";
import './index.css';

import App from './App';
import reportWebVitals from './reportWebVitals';

import thunk from 'redux-thunk';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware, compose, combineReducers } from 'redux';
import authReducer from './store/reducers/auth';
import addPasteReducer from './store/reducers/paste';
import getPasteReducer from './store/reducers/pasteGet';
import listPasteReducer from './store/reducers/pasteList';
import adminUsersReducer from './store/reducers/adminUsers';
import adminUserCreateReducer from './store/reducers/adminUserCreate';
import adminUserGetReducer from './store/reducers/adminUserGet';

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const rootReducer = combineReducers({
    auth: authReducer,
    addPaste: addPasteReducer,
    getPaste: getPasteReducer,
    listPastes: listPasteReducer,
    users: adminUsersReducer,
    userCreate: adminUserCreateReducer,
    userGet: adminUserGetReducer
});

const store = createStore(
    rootReducer,
    composeEnhancers(
        applyMiddleware(thunk)
    ))

const app = (
    <Provider store={store}>
      <BrowserRouter>
          <App />
      </BrowserRouter>
    </Provider>
);

ReactDOM.render(
    app,
    document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();