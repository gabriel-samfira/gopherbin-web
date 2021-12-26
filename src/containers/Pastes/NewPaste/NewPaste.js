import React, { Component } from 'react';
import {cloneDeep} from 'lodash';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';

import *  as actions from '../../../store/actions/index'

import { checkValidity } from '../../../utils/utils';
import classes from './NewPaste.module.css'
import './NewPaste.css'

import { editorModes, defaultEditorTheme } from '../pasteConstants';

import Input from '../../../components/UI/Input/Input';
import Spinner from '../../../components/UI/Spinner/Spinner';

import AceEditor from "react-ace";
import { Button } from 'react-bootstrap';

import 'ace-builds/webpack-resolver';


class NewPaste extends Component {

    state = {
        controls: {
            title: false,
            pasteData: false
        },
        editor: {
            theme: defaultEditorTheme,
            contents: ""
        },
        pasteForm: {
            title: {
                elementType: 'input',
                elementConfig: {
                    type: "text",
                    placeholder: "Title"
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
            expires: {
                elementType: 'date-picker',
                elementConfig: {
                    placeholder: "Expires...",
                    // locale: "ro",
                    minDate: (new Date(new Date().setDate((new Date()).getDate() + 1)))
                },
                value: '',
                validation: {},
                touched: false,
                valid: true
            },
            syntax: {
                elementType: 'select-seachable',
                elementConfig: {
                    options: editorModes.map(lang => {
                        return {
                            value: lang,
                            displayValue: lang
                        }
                    })
                },
                value: 'text',
                validation: {},
                touched: false,
                valid: true
            },
            public: {
                elementType: 'checkbox',
                elementConfig: {
                    type: "checkbox",
                    placeholder: "Public"
                   
                },
                label: "Public",
                value: false,
                validation: {},
                touched: false,
                valid: false
            }
        }
    }

    inputChangedHandler = (event, id) => {
        if (event === null || event === undefined) {
            return
        }
        let target = event.target
        let value = null

        switch(target) {
            case (undefined):
            case (null):
                if (Array.isArray(event)) {
                    value = event[0]
                } else {
                    value = event
                }
                break;
            default:
                if (target.type === 'checkbox') {
                    value = target.checked
                } else {
                    value = target.value
                }
        }

        const updatedPasteForm = cloneDeep(this.state.pasteForm)
        updatedPasteForm[id].value = value
        updatedPasteForm[id].valid = checkValidity(
            updatedPasteForm[id].value, updatedPasteForm[id].validation)
        updatedPasteForm[id].touched = true

        let updatedControls = cloneDeep(this.state.controls)
        updatedControls[id] = updatedPasteForm[id].valid

        this.setState({controls: updatedControls})
        this.setState({pasteForm: updatedPasteForm})
    }

    editorDataChangedHandler = (data) => {
        let editor = cloneDeep(this.state.editor)
        let controls = cloneDeep(this.state.controls)
        editor.contents = data
        if (editor.contents.length > 0) {
            controls.pasteData = true
        }
        this.setState({editor: editor, controls: controls})
    }

    submitHandler = (event) => {
        event.preventDefault();
        let pasteData = {
            title: this.state.pasteForm.title.value,
            isPublic: this.state.pasteForm.public.value,
            lang: this.state.pasteForm.syntax.value,
            data: this.state.editor.contents
        }

        if (this.state.pasteForm.expires.value) {
            let offset = this.state.pasteForm.expires.value.getTimezoneOffset()
            let expires = new Date(this.state.pasteForm.expires.value.getTime() + (-(offset * 60000)))
            pasteData.expires = expires
        }
        this.props.onCreatePaste(pasteData, this.props.token)
    }

    componentDidMount () {
        if (this.props.isAuthenticated) {
            this.props.onInitPasteState()
        } else {
            this.props.onSetAuthRedirect(this.props.match.url)
            this.props.history.push('/login')
        }
    }

    render() {
        if (!this.props.isAuthenticated) {
            return <Redirect to="/login" />
        }

        let contents = <Spinner />
        if (this.props.pasteID !== null) {
            let pasteURL = "/p/" + this.props.pasteID;
            if (this.props.isPublic === true) {
                pasteURL = "/public/p/" + this.props.pasteID;
            }
            return <Redirect to={pasteURL} />
        }

        let elems = [];
        for (let elem in this.state.pasteForm) {
            elems.push({
                id: elem,
                config: this.state.pasteForm[elem]
            });
        }

        let canSubmit = Object.values(this.state.controls).every(val => val === true)

        if (!this.props.loading) {
            contents = (
                <div className={classes.NewPaste}>
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
                
                    <div className={classes.EditorContainer}>
                        <AceEditor
                            mode={this.state.pasteForm.syntax.value}
                            theme={this.state.editor.theme}
                            onChange={this.editorDataChangedHandler}
                            name="paste-data"
                            width="inherit"
                            height="inherit"
                            fontSize="100%"
                            value={this.state.editor.contents}
                            showPrintMargin={false}
                            // showGutter={false}
                            highlightActiveLine={true}
                            setOptions={{
                                // highlightActiveLine: false,
                                // highlightGutterLine: false,
                                // readOnly: true,
                                showLineNumbers: true,
                                tabSize: 4,
                            }}
                        />
                    </div>
                    <div style={{marginTop: "20px"}}>
                        <Button type="submit" variant="primary" disabled={!canSubmit} onClick={this.submitHandler}>Submit</Button>
                    </div>
                </div>
            );
        }

        return contents;
    }
}

const mapDispatchToProps = dispatch => {
    return {
        onInitPasteState: () => dispatch(actions.initPasteState()),
        onCreatePaste: (pasteData, token) => dispatch(actions.createPaste(pasteData, token)),
        onSetAuthRedirect: (path) => dispatch(actions.setAuthRedirectPath(path)),
    }
}

const mapStateToProps = state => {
    return {
        loading: state.addPaste.loading,
        error: state.addPaste.error,
        pasteID: state.addPaste.pasteID,
        isPublic: state.addPaste.public,
        token: state.auth.token,
        isAuthenticated: state.auth.token !== null
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(NewPaste);
