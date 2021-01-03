import React, { Component } from 'react';
import { Route, Switch, withRouter, Redirect } from 'react-router-dom';
import {connect} from 'react-redux'

import './App.css';
import classes from './App.module.css';
import { authStateCheck } from './store/actions';

import Layout from './hoc/Layout/Layout';
import Auth from './containers/Auth/Auth';
import Logout from './containers/Auth/Logout/Logout';
import NewPaste from './containers/Pastes/NewPaste/NewPaste';
import Paste from './containers/Pastes/Paste/Paste';
import Pastes from './containers/Pastes/Pastes';
import Users from './containers/Admin/Users/Users';
import User from './containers/Admin/Users/User/User';
import AddUser from './containers/Admin/Users/AddUser/AddUser';

class App extends Component {
    componentDidMount() {
        this.props.onTryAutoLogin()
    }

    render() {
        let routes = (
            <Switch>
                <Route path="/login" exact component={Auth}/>
                <Route path='/p/:id' exact component={Paste} />
                <Route path='/p' exact component={Pastes} />
                <Redirect to="/login" />
            </Switch>
        );

        if (this.props.isAuthenticated) {
            let adminRoutes = null;
            if (this.props.isAdmin) {
                adminRoutes = (
                    <React.Fragment>
                        <Route path='/admin/users' exact component={Users} />
                    </React.Fragment>
                );
            }
            routes =  (
                <Switch>
                    <Route path="/login" exact component={Auth}/>
                    <Route path="/logout" exact component={Logout}/>
                    <Route path='/p/:id' exact component={Paste} />
                    <Route path='/p' exact component={Pastes} />
                    <Route path="/" exact component={NewPaste} />
                    <Redirect to="/" />
                </Switch>)
            if (this.props.isAdmin) {
                routes =  (
                    <Switch>
                        <Route path="/login" exact component={Auth}/>
                        <Route path="/logout" exact component={Logout}/>
                        <Route path='/p/:id' exact component={Paste} />
                        <Route path='/p' exact component={Pastes} />
                        <Route path='/admin/users' exact component={Users} />
                        <Route path='/admin/users/:id' exact component={User} />
                        <Route path='/admin/new-user' exact component={AddUser} />
                        <Route path="/" exact component={NewPaste} />
                        <Redirect to="/" />
                    </Switch>)
            }
        }
        return (
            <div className={classes.Layout}>
                <Layout>
                    {routes}
                </Layout>
            </div>
        );
    }
}

const mapDispatchToProps = dispatch => {
    return {
        onTryAutoLogin: () => dispatch(authStateCheck())
    }
}

const mapStateToProps = state => {
    return {
        isAuthenticated: state.auth.token !== null,
        isAdmin: state.auth.isAdmin
    }
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(App));