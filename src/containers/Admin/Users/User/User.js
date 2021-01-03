import React, { Component } from 'react';
import { connect } from 'react-redux';
import {cloneDeep} from 'lodash';
import { Redirect } from 'react-router-dom';

import Input from '../../../../components/UI/Input/Input';
import Button from '../../../../components/UI/Button/Button';
import Spinner from '../../../../components/UI/Spinner/Spinner';

import { checkValidity } from '../../../../utils/utils';
import *  as actions from '../../../../store/actions/index';
import classes from './User.module.css';

class User extends Component {

    state = {
        controls: {
            password: false,
            passwordAgain: false
        },
        deleteUserForm: {
            value: "",
            valid: false,
            touched: false
        },
        passwordResetForm: {
            password: {
                elementType: 'input',
                elementConfig: {
                    type: "password",
                    placeholder: "Password"
                },
                value: '',
                validation: {
                    required: true,
                    minLength: 8
                },
                touched: false,
                valid: false
            },
            passwordAgain: {
                elementType: 'input',
                elementConfig: {
                    type: "password",
                    placeholder: "Password again"
                },
                value: '',
                validation: {
                    required: true,
                    minLength: 8
                },
                touched: false,
                valid: false
            }
        }
    }

    componentDidMount () {
        if (!this.props.isAuthenticated) {
            this.props.onSetAuthRedirect(this.props.match.url)
            this.props.history.push('/login')
        }
    }

    inputChangedHandler = (event, id) => {
        let value = event.target.value

        const updatedUserProfileForm = cloneDeep(this.state.passwordResetForm)
        updatedUserProfileForm[id].value = value

        let isValid = checkValidity(
            updatedUserProfileForm[id].value, updatedUserProfileForm[id].validation)

        if (id === 'passwordAgain') {
            if (updatedUserProfileForm[id].value !== updatedUserProfileForm.password.value) {
                isValid = false
            }
        }

        updatedUserProfileForm[id].valid = isValid
        updatedUserProfileForm[id].touched = true

        let updatedControls = cloneDeep(this.state.controls)
        updatedControls[id] = updatedUserProfileForm[id].valid

        this.setState({controls: updatedControls})
        this.setState({passwordResetForm: updatedUserProfileForm})
    }

    submitHandler = (event) => {
        event.preventDefault()
        this.props.onAdminUpdatePassword(
            this.props.userInfo.id,
            this.state.passwordResetForm.password.value,
            this.props.token)
        
        let newState = cloneDeep(this.state)
        newState.passwordResetForm.password.value = ""
        newState.passwordResetForm.passwordAgain.value = ""
        this.setState(newState)
    }

    deleteUserSubmitHandler = (event) => {
        event.preventDefault()
        this.props.onUserDelete(this.props.userInfo.id, this.props.token)
    }

    deleteUSerInputChangedHandler = (event) => {
        let newVal = event.target.value;
        let valid = false;
        if (newVal && newVal === this.props.userInfo.id) {
            valid = true
        }
        this.setState({deleteUserForm: {valid: valid, touched: true, value: newVal}})
    }

    render() {
        if (!this.props.userInfo || !this.props.userInfo.id) {
            const userURL = "/admin/users"
            return <Redirect to={userURL} />
        }

        let elems = [];
        for (let elem in this.state.passwordResetForm) {
            elems.push({
                id: elem,
                config: this.state.passwordResetForm[elem]
            });
        }

        let content = <Spinner/>

        if (!this.props.loading) {
            let canSubmit = Object.values(this.state.controls).every(val => val === true)
            let error = null;
            if (this.props.error) {
                let parsedMsg = JSON.parse(this.props.error.request.response)
                error = <p>{parsedMsg.details}</p>
            }
            content = (
                <div className={classes.UserProfileContainer}>
                    <div className={classes.ProfileHeader}>
                        <h3>User profile for {this.props.userInfo.full_name} ({this.props.userInfo.email})</h3>
                    </div>
                    <div className={classes.PasswordReset}>
                        <p>Reset password</p>
                        {error}
                        {
                            elems.map(
                                formElem => {
                                    return (
                                        <Input 
                                            key={formElem.id}
                                            changed={(event) => this.inputChangedHandler(event, formElem.id)}
                                            elementType={formElem.config.elementType}
                                            elementConfig={formElem.config.elementConfig}
                                            value={formElem.config.value}
                                            invalid={!formElem.config.valid}
                                            touched={formElem.config.touched}
                                        />
                                    )
                                }
                            )
                        }
                        <Button btnType="Success" clicked={this.submitHandler} disabled={!canSubmit}>Change Password</Button>
                    </div>
                    <div className={classes.DangerZone}>
                        <p className={classes.DangerTitle}>Danger Zone</p>
                        <p>WARNING: This operation is permanent, and will delete the user and all pastes created by this user.</p>
                        <p>To delete this user, type in <span className={classes.HighlightetdID}>{this.props.userInfo.id}</span> in the field bellow, and click the delete button.</p>
                        <div className={classes.DeleteForm}>
                            <Input 
                                changed={(event) => this.deleteUSerInputChangedHandler(event)}
                                elementType="input"
                                value={this.state.deleteUserForm.value}
                                invalid={!this.state.deleteUserForm.valid}
                                touched={this.state.deleteUserForm.touched}
                            />
                            <Button btnType="Danger" clicked={this.deleteUserSubmitHandler} disabled={!this.state.deleteUserForm.valid}>DELETE</Button>
                        </div>
                    </div>
                </div>
            )
        }

        return content;
    }
}

const mapDispatchToProps = dispatch => {
    return {
        onInitUserGetState: () => dispatch(actions.initUserGetState()),
        onUserGet: (userId, token) => dispatch(actions.getUser(userId, token)),
        onUserDelete: (userId, token) => dispatch(actions.deleteUser(userId, token)),
        onSetAuthRedirect: (path) => dispatch(actions.setAuthRedirectPath(path)),
        onAdminUpdatePassword: (userId, password, token) => dispatch(actions.adminUpdateUserPassword(userId, password, token))
    }
}

const mapStateToProps = state => {
    return {
        loading: state.userGet.loading,
        error: state.userGet.error,
        userInfo: state.userGet.userInfo,
        token: state.auth.token,
        isAdmin: state.auth.isAdmin,
        isSuperUser: state.auth.isSuperUser,
        isAuthenticated: state.auth.token !== null
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(User);
