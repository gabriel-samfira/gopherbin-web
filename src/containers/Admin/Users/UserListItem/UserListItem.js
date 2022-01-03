import React, { Component } from 'react';
import { connect } from 'react-redux';

import { withRouter } from 'react-router-dom';

import classes from './UserListItem.module.css';
import *  as actions from '../../../../store/actions/index';


class UserListItem extends Component {

    onClickHandler = () => {
        this.props.onInitUserGetState();
        this.props.onUserGet(this.props.userInfo);
        let userURL = "/admin/users/" + this.props.userInfo.id
        this.props.history.push(userURL)
    }

    render () {
        let username = <div>{this.props.userInfo.email}</div>
        if (this.props.userInfo.username) {
            username = <div>{this.props.userInfo.username} ({this.props.userInfo.email})</div>
        }
        return (
            <div className={classes.UserListItem} onClick={this.onClickHandler}>
                <div>{this.props.userInfo.full_name}</div>
                {username}
            </div>
        );
    }
}


const mapDispatchToProps = dispatch => {
    return {
        onInitUserGetState: () => dispatch(actions.initUserGetState()),
        onUserGet: (userInfo) => dispatch(actions.userGetSuccess(userInfo))
    }
}

export default withRouter(connect(null, mapDispatchToProps)(UserListItem));