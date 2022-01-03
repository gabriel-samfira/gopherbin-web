import React, { Component } from 'react';
import { connect } from 'react-redux';
import {cloneDeep} from 'lodash';
import { Redirect } from 'react-router-dom';

import Input from '../../../../components/UI/Input/Input';
// import Button from '../../../../components/UI/Button/Button';
import Spinner from '../../../../components/UI/Spinner/Spinner';

import { checkValidity } from '../../../../utils/utils';
import *  as actions from '../../../../store/actions/index';
import classes from './User.module.css';

import { Button } from 'react-bootstrap';


class User extends Component {

    state = {
        passwordResetControls: {
            password: false,
            passwordAgain: false
        },
        updateUserControls: {
            full_name: this.props.userInfo.full_name !== "" && this.props.userInfo.full_name !== undefined,
            username: this.props.userInfo.username !== "" && this.props.userInfo.username !== undefined,
            email: this.props.userInfo.email !== "" && this.props.userInfo.email !== undefined
        },
        deleteUserForm: {
            value: "",
            valid: false,
            touched: false
        },
        updateUserInfoForm: {
            fullName: {
                elementType: 'input',
                label: "Full Name",
                elementConfig: {
                    type: "text"
                },
                value: this.props.userInfo.full_name,
                validation: {
                    required: true,
                    minLength: 3,
                    maxLength: 64
                },
                touched: false,
                valid: this.props.userInfo.full_name !== "" && this.props.userInfo.full_name !== undefined
            },
            username: {
                elementType: 'input',
                label: "Username",
                elementConfig: {
                    type: "text"
                },
                value: this.props.userInfo.username,
                validation: {
                    required: true,
                    minLength: 1,
                    maxLength: 256
                },
                touched: false,
                valid: this.props.userInfo.username !== "" && this.props.userInfo.username !== undefined
            },
            email: {
                elementType: 'input',
                label: "Email address",
                elementConfig: {
                    type: "email"
                },
                value: this.props.userInfo.email,
                validation: {
                    required: true,
                    isEmail: true
                },
                touched: false,
                valid: this.props.userInfo.email !== "" && this.props.userInfo.email !== undefined
            }
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

    userInfoInputChangedHandler = (event, id) => {
        let value = event.target.value

        const updatedUserProfileForm = cloneDeep(this.state.updateUserInfoForm)
        updatedUserProfileForm[id].value = value

        let isValid = checkValidity(
            updatedUserProfileForm[id].value, updatedUserProfileForm[id].validation)

        updatedUserProfileForm[id].valid = isValid
        updatedUserProfileForm[id].touched = true

        let updatedControls = cloneDeep(this.state.updateUserControls)
        updatedControls[id] = updatedUserProfileForm[id].valid

        this.setState({updateUserControls: updatedControls})
        this.setState({updateUserInfoForm: updatedUserProfileForm})
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

        let updatedControls = cloneDeep(this.state.passwordResetControls)
        updatedControls[id] = updatedUserProfileForm[id].valid

        this.setState({passwordResetControls: updatedControls})
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

    updateUserInfoSubmitHandler = (event) => {
        event.preventDefault()

        let userInfo = {
            full_name: this.state.updateUserInfoForm.fullName.value,
            username: this.state.updateUserInfoForm.username.value,
            email: this.state.updateUserInfoForm.email.value
        }
        this.props.onAdminUpdateUserInfo(
            this.props.userInfo.id,
            userInfo,
            this.props.token)
    }

    deleteUserSubmitHandler = (event) => {
        event.preventDefault()
        this.props.onUserDelete(this.props.userInfo.id, this.props.token)
    }

    deleteUSerInputChangedHandler = (event) => {
        let newVal = event.target.value;
        let valid = false;
        if (newVal && newVal === this.props.userInfo.email) {
            valid = true
        }
        this.setState({deleteUserForm: {valid: valid, touched: true, value: newVal}})
    }

    formatError = (error) => {
        let err = null;
        if (error) {
            let parsedMsg = JSON.parse(error.request.response)
            err = <p>Request returned an error: <span className={classes.HighlightetdID}>{parsedMsg.details}</span></p>
        }
        return err
    }
    getUserInfoUpdateError = () => {
        return this.formatError(this.props.updateUserInfoError)
    }

    getPasswordResetError = () => {
        return this.formatError(this.props.passwordUpdateError)
    }

    render() {
        if (!this.props.isAuthenticated) {
            return <Redirect to="/login" />
        }

        if (!this.props.userInfo || !this.props.userInfo.id) {
            const userURL = "/admin/users"
            return <Redirect to={userURL} />
        }

        let passwordResetElems = [];
        for (let elem in this.state.passwordResetForm) {
            passwordResetElems.push({
                id: elem,
                config: this.state.passwordResetForm[elem]
            });
        }

        let updateUserElems = [];
        for (let elem in this.state.updateUserInfoForm) {
            let inputElem = {
                id: elem,
                config: this.state.updateUserInfoForm[elem]
            }
            if (elem === "username" && this.props.usernameIsSet === true) {
                inputElem.config.elementConfig.readOnly = true
            }
            updateUserElems.push(inputElem);
        }

        let content = <Spinner/>

        if (!this.props.loading) {
            let canSubmitPasswordReset = Object.values(this.state.passwordResetControls).every(val => val === true)
            let canSubmitUpdateUserInfo = Object.values(this.state.updateUserControls).every(val => val === true)
            content = (
                <div className={classes.UserProfileContainer}>
                    <div className={classes.ProfileHeader}>
                        <span className={classes.PageTitle}>User profile for {this.props.userInfo.full_name} ({this.props.userInfo.email})</span>
                    </div>
                    <div className={classes.PasswordReset}>
                        <p>Update user info</p>
                        {this.getUserInfoUpdateError()}
                        {/* <p>Error updating user:<span className={classes.HighlightetdID}>{error}</span></p> */}
                        {
                            updateUserElems.map(
                                formElem => {
                                    return (
                                        <Input 
                                            key={formElem.id}
                                            changed={(event) => this.userInfoInputChangedHandler(event, formElem.id)}
                                            elementType={formElem.config.elementType}
                                            elementConfig={formElem.config.elementConfig}
                                            value={formElem.config.value}
                                            label={formElem.config.label}
                                            invalid={!formElem.config.valid}
                                            touched={formElem.config.touched}
                                        />
                                    )
                                }
                            )
                        }
                        <div style={{ marginTop: "10px", marginBottom: "5px"}}>
                            <Button
                                variant="primary"
                                disabled={!canSubmitUpdateUserInfo}
                                onClick={this.updateUserInfoSubmitHandler}>Update</Button>
                        </div>
                    </div>
                    <div className={classes.PasswordReset}>
                        <p>Reset password</p>
                        {this.getPasswordResetError()}
                        {
                            passwordResetElems.map(
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
                        <div style={{ marginTop: "10px", marginBottom: "5px"}}>
                            <Button
                                variant="primary"
                                disabled={!canSubmitPasswordReset}
                                onClick={this.submitHandler}>Change Password</Button>
                        </div>
                    </div>
                    <div className={classes.DangerZone}>
                        <p className={classes.DangerTitle}>Danger Zone</p>
                        <p>WARNING: This operation is permanent, and will delete the user and all pastes created by this user.</p>
                        <p>To delete this user, type in <span className={classes.HighlightetdID}>{this.props.userInfo.email}</span> in the field bellow, and click the delete button.</p>
                        <div className={classes.DeleteForm}>
                            <Input 
                                changed={(event) => this.deleteUSerInputChangedHandler(event)}
                                elementType="input"
                                value={this.state.deleteUserForm.value}
                                invalid={!this.state.deleteUserForm.valid}
                                touched={this.state.deleteUserForm.touched}
                            />
                            <div style={{ marginTop: "10px", marginBottom: "5px"}}>
                                <Button
                                    variant="danger"
                                    disabled={!this.state.deleteUserForm.valid}
                                    onClick={this.deleteUserSubmitHandler}>DELETE</Button>
                            </div>
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
        onAdminUpdatePassword: (userId, password, token) => dispatch(actions.adminUpdateUserPassword(userId, password, token)),
        onAdminUpdateUserInfo: (userId, userInfo, token) => dispatch(actions.adminUpdateUserInfo(userId, userInfo, token))
    }
}

const mapStateToProps = state => {
    return {
        loading: state.userGet.loading,
        usernameIsSet: state.userGet.hasUsername,
        error: state.userGet.error,
        updateUserInfoError: state.userGet.updateUserInfoError,
        passwordUpdateError: state.userGet.passwordUpdateError,
        userInfo: state.userGet.userInfo,
        token: state.auth.token,
        isAdmin: state.auth.isAdmin,
        isSuperUser: state.auth.isSuperUser,
        isAuthenticated: state.auth.token !== null
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(User);
