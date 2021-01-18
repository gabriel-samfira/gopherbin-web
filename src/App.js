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
import PublicPaste from './containers/Pastes/Paste/PublicPaste';
import Pastes from './containers/Pastes/Pastes';
import Users from './containers/Admin/Users/Users';
import User from './containers/Admin/Users/User/User';
import AddUser from './containers/Admin/Users/AddUser/AddUser';

class App extends Component {
    componentDidMount() {
        this.props.onTryAutoLogin()
    }

    render() {
        let allRoutes = [
            <Route key="login" path="/login" exact component={Auth}/>,
            <Route key="logout" path="/logout" exact component={Logout}/>,
            <Route key="privPaste" path='/p/:id' exact component={Paste} />,
            <Route key="allPastes" path='/p' exact component={Pastes} />,
            <Route key="publicPaste" path='/public/p/:id' exact component={PublicPaste} />
        ]

        let routes = (
            <Switch>
                {allRoutes.map(rt => rt)}
                <Redirect to="/login" />
            </Switch>
        );

        if (this.props.isAuthenticated) {
            allRoutes.push(<Route key="createPaste" path="/" exact component={NewPaste} />)

            if (this.props.isAdmin) {
                let adminRoutes = [
                    <Route key="adminUsers" path='/admin/users' exact component={Users} />,
                    <Route key="adminUser" path='/admin/users/:id' exact component={User} />,
                    <Route key="newUser" path='/admin/new-user' exact component={AddUser} />
                ]
                adminRoutes.map(rt => allRoutes.push(rt))
            }

            routes =  (
                <Switch>
                    {allRoutes.map(rt => rt)}
                    <Redirect to="/" />
                </Switch>
            )
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