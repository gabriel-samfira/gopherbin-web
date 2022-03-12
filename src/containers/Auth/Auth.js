import React, { Component } from 'react';

import { cloneDeep } from 'lodash';

import { checkValidity } from '../../utils/utils';
import Input from '../../components/UI/Input/Input';
import Spinner from '../../components/UI/Spinner/Spinner';
import classes from './Auth.module.css';

import *  as actions from '../../store/actions/index'
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';
import { Button } from 'react-bootstrap';


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
                    type: "text",
                    placeholder: "Email or username"
                },
                value: '',
                validation: {
                    required: true
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
                <Button
                    type="submit"
                    variant="primary"
                    disabled={!canSubmit}
                    onClick={this.submitHandler}>Submit</Button>
            </form>
        )

        if (this.props.loading) {
            form = <Spinner />
        }

        let errorMsg = null;

        if (this.props.error) {
            errorMsg = <p class={classes.HighlightedMessage}>{this.props.error.message}</p>
            if (this.props.error.response && this.props.error.response.data.error === "init_required") {
                errorMsg = <p class={classes.HighlightedMessage}>{this.props.error.response.data.details}</p>
            }
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
