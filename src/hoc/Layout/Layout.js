import React, { Component } from 'react';
import { connect } from 'react-redux';

import Toolbar from '../../components/Navigation/Toolbar/Toolbar';
import SideDrawer from '../../components/Navigation/SideDrawer/SideDrawer';

import classes from './Layout.module.css';

class Layout extends Component {

    state = {
        showSideDrawer: false
    }

    sideDrawerClosedHandler = () => {
        this.setState({showSideDrawer: false})
    }

    toggleSideDrawerHandler = () => {
            this.setState((prevState) => {
                return {showSideDrawer: !prevState.showSideDrawer};
            }
        )
    }

    render() {
        return (
            <React.Fragment>
                <Toolbar
                    isAuthenticated={this.props.isAuthenticated}
                    toggleDrawer={this.toggleSideDrawerHandler}
                    isAdmin={this.props.isAdmin} />
                <SideDrawer
                    isAuth={this.props.isAuthenticated}
                    closed={this.sideDrawerClosedHandler}
                    showSideDrawer={this.state.showSideDrawer}
                    isAdmin={this.props.isAdmin} />

                <main className={classes.Content}>
                    {this.props.children}
                </main>
            </React.Fragment>
        );
    }
}

const mapStateToProps = state => {
    return {
        isAuthenticated: state.auth.token !== null,
        isAdmin: state.auth.isAdmin,
        isSuperUser: state.auth.isSuperUser
    }
}

export default connect(mapStateToProps)(Layout);