import React, { Component } from 'react';
import {cloneDeep} from 'lodash';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';

import *  as actions from '../../../../store/actions/index'

import { checkValidity } from '../../../../utils/utils';
import classes from './AddUser.module.css'

import Input from '../../../../components/UI/Input/Input';
import Spinner from '../../../../components/UI/Spinner/Spinner';
import Button from '../../../../components/UI/Button/Button';


class NewUser extends Component {

    constructor(props) {
        super(props)

        this.state = {
            isUnauthorized: false,
            controls: {
                fullName: false,
                email: false,
                password: false,
                passwordAgain: false
            },
            newUserForm: {
                fullName: {
                    elementType: 'input',
                    elementConfig: {
                        type: "text",
                        placeholder: "Full Name"
                    },
                    value: '',
                    validation: {
                        required: true,
                        minLength: 1,
                        maxLength: 256
                    },
                    touched: false,
                    valid: false
                },
                email: {
                    elementType: 'input',
                    elementConfig: {
                        type: "email",
                        placeholder: "Email address"
                    },
                    value: '',
                    validation: {
                        required: true,
                        isEmail: true
                    },
                    touched: false,
                    valid: false
                },
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
                enabled: {
                    elementType: 'checkbox',
                    elementConfig: {
                        type: "checkbox",
                        placeholder: "Enabled"
                       
                    },
                    label: "Enabled",
                    value: false,
                    validation: {},
                    touched: false,
                    valid: false
                }
            }
        }

        if (this.props.isSuperUser) {
            this.state.newUserForm.isAdmin = {
                elementType: 'checkbox',
                elementConfig: {
                    type: "checkbox",
                    placeholder: "Admin"
                   
                },
                label: "Admin",
                value: false,
                validation: {},
                touched: false,
                valid: false
            }
        }
    }

    inputChangedHandler = (event, id) => {

        let value = event.target.value
        if (event.target.type === 'checkbox') {
            value = event.target.checked
        }

        const updatedNewUserForm = cloneDeep(this.state.newUserForm)
        updatedNewUserForm[id].value = value

        let isValid = checkValidity(
            updatedNewUserForm[id].value, updatedNewUserForm[id].validation)

        if (id === 'passwordAgain') {
            if (updatedNewUserForm[id].value !== updatedNewUserForm.password.value) {
                isValid = false
            }
        }

        updatedNewUserForm[id].valid = isValid
        updatedNewUserForm[id].touched = true

        let updatedControls = cloneDeep(this.state.controls)
        updatedControls[id] = updatedNewUserForm[id].valid

        this.setState({controls: updatedControls})
        this.setState({newUserForm: updatedNewUserForm})
    }

    submitHandler = (event) => {
        event.preventDefault();
        let userInfo = {
            fullName: this.state.newUserForm.fullName.value,
            email: this.state.newUserForm.email.value,
            password: this.state.newUserForm.password.value,
            enabled: this.state.newUserForm.enabled.value
        }

        if (this.props.isSuperUser) {
            userInfo.isAdmin = this.state.newUserForm.isAdmin.value
        }

        this.props.onCreateNewUser(userInfo, this.props.token)
    }

    componentDidMount () {
        this.props.onInitUserCreateState()
        if (!this.props.isAuthenticated) {
            this.props.onSetAuthRedirect(this.props.match.url)
            this.props.history.push('/login')
        }

        if (!this.props.isAdmin) {
            this.setState({isUnauthorized: true})
        }
    }

    render() {
        if (this.state.isUnauthorized) {
            return <h1>Unauthorized</h1>
        }

        let contents = <Spinner />

        if (this.props.userInfo && this.props.userInfo.id) {
            const userURL = "/admin/users"
            return <Redirect to={userURL} />
        }

        let elems = [];
        for (let elem in this.state.newUserForm) {
            elems.push({
                id: elem,
                config: this.state.newUserForm[elem]
            });
        }

        let canSubmit = Object.values(this.state.controls).every(val => val === true)
        let errorMsg = null;

        if (this.props.error) {
            let parsedMsg = JSON.parse(this.props.error.request.response)
            errorMsg = (
                <p>{parsedMsg.details}</p>
            )
        }
        if (!this.props.loading) {
            contents = (
                <div className={classes.NewUserContainer}>
                    <div className={classes.Title}>Create New User</div>
                    {errorMsg}
                    <div className={classes.NewUserForm}>
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
                                            label={formElem.config.label}
                                            id={formElem.id}
                                        />
                                    )
                                }
                            )
                        }
                    </div>
                    <div className={classes.CallToAction}>
                        <Button btnType="Success" disabled={!canSubmit} clicked={this.submitHandler}>Submit</Button>
                    </div>
                </div>
            );
        }

        return contents;
    }
}

const mapDispatchToProps = dispatch => {
    return {
        onInitUserCreateState: () => dispatch(actions.initUserCreateState()),
        onCreateNewUser: (userInfo, token) => dispatch(actions.createUser(userInfo, token))
    }
}

const mapStateToProps = state => {
    return {
        loading: state.userCreate.loading,
        error: state.userCreate.error,
        userInfo: state.userCreate.userInfo,
        token: state.auth.token,
        isAdmin: state.auth.isAdmin,
        isSuperUser: state.auth.isSuperUser,
        isAuthenticated: state.auth.token !== null
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(NewUser);
