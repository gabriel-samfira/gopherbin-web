import React, { Component } from 'react';
import { connect } from 'react-redux';

import *  as actions from '../../../store/actions/index';
import Spinner from '../../../components/UI/Spinner/Spinner';
import Button from '../../../components/UI/Button/Button';
import UserListItem from './UserListItem/UserListItem';

import classes from './Users.module.css';


class Users extends Component {

    componentDidMount() {
        this.props.onInitUserCreateState()
        if (this.props.isAuthenticated) {
            this.props.onInitUserListState()
            this.props.onListUsers(
                this.props.page, this.props.maxResults, this.props.token)
        } else {
            this.props.onSetAuthRedirect(this.props.match.url)
            this.props.history.push('/login')
        }
    }

    handlePageClick = (data) => {
        if (data < 1 || data > this.props.totalPages) {
            return
        }

        this.props.onListUsers(
            data, this.props.maxResults, this.props.token)
    }

    onCreateUserHandler = () => {
        this.props.history.push("/admin/new-user")
    }

    render () {
        let contents = <Spinner />
        if (this.props.error) {
            contents = <p>{this.props.error.message}</p>
        } else if (this.props.nestedUsers !== null && this.props.nestedUsers !== undefined) {
            let pagination = null;
            if(this.props.totalPages > 1) {
                let newerClasses = [];
                let olderClasses = [];

                if (this.props.page === 1) {
                    newerClasses.push(classes.PaginationDisabled)
                }
                if (this.props.page === this.props.totalPages) {
                    olderClasses.push(classes.PaginationDisabled)
                }

                pagination = (
                    <div className={classes.Pagination}>
                        <span className={newerClasses.join(" ")} onClick={() => { this.handlePageClick(this.props.page - 1)}}>Newer</span>
                        <span className={olderClasses.join(" ")} onClick={() => { this.handlePageClick(this.props.page + 1)}}>Older</span>
                    </div>
                )
            }
            contents = (
                <div className={classes.AdminUserPage}>
                    <div className={classes.CreateUserButton}>
                        <Button btnType="Success" clicked={this.onCreateUserHandler}>Create user</Button>
                    </div>
                    <div className={classes.UsersContainer}>
                        {pagination}
                        {
                            this.props.nestedUsers.map(
                                user => {
                                    return <UserListItem
                                                userInfo={user}
                                                key={user.id}/>
                                }
                            )
                        }
                        {pagination}
                    </div>
                </div>
            );
        }

        return contents;
    }
}

const mapDispatchToProps = dispatch => {
    return {
        onInitUserListState: () => dispatch(actions.initUserListState()),
        onInitUserCreateState: () => dispatch(actions.initUserCreateState()),
        onListUsers: (page, maxResults, token) => dispatch(actions.listUsers(page, maxResults, token)),
        onSetAuthRedirect: (path) => dispatch(actions.setAuthRedirectPath(path)),
        onUserDelete: (userID, token) => dispatch(actions.deleteUser(userID, token))
    }
}

const mapStateToProps = state => {
    return {
        error: state.users.error,
        loading: state.users.loading,
        isAuthenticated: state.auth.token !== null,
        token: state.auth.token,
        page: state.users.page,
        maxResults: state.users.maxResults,
        totalPages: state.users.totalPages,
        users: state.users.users,
        nestedUsers: state.users.users.users
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Users);