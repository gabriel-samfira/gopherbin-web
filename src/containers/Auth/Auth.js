import React, { Component } from 'react';

import { cloneDeep } from 'lodash';

import { checkValidity } from '../../utils/utils';
import Input from '../../components/UI/Input/Input';
import Button from '../../components/UI/Button/Button';
import classes from './Auth.module.css';

import *  as actions from '../../store/actions/index'
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';

import Spinner from '../../components/UI/Spinner/Spinner';


class Auth extends Component {
    state = {
        controls: {
            email: false,
            password: false
        },
        loginForm: {
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
                    minLength: 6
                },
                touched: false,
                valid: false
            }
        }
    }

    componentDidMount() {
        let next = this.props.authRedirect ? this.props.authRedirect : "/";
        // if (this.props.location.search) {
        //     let searchParams = new URLSearchParams( this.props.location.search );
        //     for ( let param of searchParams.entries() ) {
        //         if (param[0] === "next") {
        //             next = param[1];
        //             break;
        //         }
        //     }
        // }
        this.props.onSetAuthRedirect(next)
    }

    inputChangedHandler = (event, id) => {
        const updatedLoginForm = cloneDeep(this.state.loginForm)
        updatedLoginForm[id].value = event.target.value
        updatedLoginForm[id].valid = checkValidity(
            updatedLoginForm[id].value, updatedLoginForm[id].validation)
        updatedLoginForm[id].touched = true

        let updatedControls = cloneDeep(this.state.controls)
        updatedControls[id] = updatedLoginForm[id].valid

        this.setState({controls: updatedControls})
        this.setState({loginForm: updatedLoginForm})
    }

    submitHandler = (event) => {
        event.preventDefault();
        this.props.onAuth(
            this.state.loginForm.email.value,
            this.state.loginForm.password.value);
    }

    render () {
        let elems = [];
        for (let elem in this.state.loginForm) {
            elems.push({
                id: elem,
                config: this.state.loginForm[elem]
            });
        }

        let canSubmit = Object.values(this.state.controls).every(val => val === true)

        let form = (
            <form onSubmit={this.submitHandler}>
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
                <Button btnType="Success" disabled={!canSubmit}>Submit</Button>
            </form>
        )

        if (this.props.loading) {
            form = <Spinner />
        }

        let errorMsg = null;

        if (this.props.error) {
            errorMsg = <p>{this.props.error.message}</p>
        }

        let title = <p>Welcome to Gopherbin</p>

        let authRedirect = null;
        if (this.props.isAuthenticated) {
            authRedirect = <Redirect to={this.props.authRedirect} />
        }
        return (
            
            <div className={classes.Auth}>
                {authRedirect}
                {title}
                {errorMsg}
                {form}
            </div>
        );
    }
}

const mapDispatchToProps = dispatch => {
    return {
        onAuth: (email, password) => dispatch(actions.auth(email, password)),
        onSetAuthRedirect: (path) => dispatch(actions.setAuthRedirectPath(path))
    }
}

const mapStateToProps = state => {
    return {
        loading: state.auth.loading,
        error: state.auth.error,
        isAuthenticated: state.auth.token !== null,
        authRedirect: state.auth.authRedirect
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Auth);