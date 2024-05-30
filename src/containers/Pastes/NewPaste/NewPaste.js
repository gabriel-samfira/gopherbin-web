import React, { Component } from 'react';
import {cloneDeep} from 'lodash';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';

import *  as actions from '../../../store/actions/index'

import { editorTheme } from '../../../utils/utils';
import DatePicker from "react-datepicker";
import Select from 'react-select'
import classes from './NewPaste.module.css';
import inputClasses from '../../../components/UI/Input/Input.module.css';
import './NewPaste.css'

import { editorThemes, defaultEditorTheme, extensionToLanguage, fallbackEditorMode } from '../pasteConstants';

import Spinner from '../../../components/UI/Spinner/Spinner';
import PrivacySlider from '../../../components/UI/PrivacySlider/PrivacySlider';

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
            theme: editorTheme(defaultEditorTheme)["value"],
            contents: ""
        },
        isPublic: false,
        syntax: "text",
        name: "",
        description: "",
        expires: null,
    }

    onChangeThemeHandler = (event) => {
        let defaultTheme = JSON.stringify({
            value: defaultEditorTheme,
            label: defaultEditorTheme.replaceAll("_", " ")
        })

        let theme = defaultTheme
        try {
            theme = JSON.stringify(event)
        } catch {
            console.log("invalid theme")
        }
        localStorage.setItem('editorTheme', theme)

        let editor = cloneDeep(this.state.editor)
        editor.theme = event.value
        this.setState({editor: editor})
    }

    toggleIsPublic = (event) => {
        this.setState(
            (prevState) => {
                return {isPublic: !prevState.isPublic};
            }
        )
    }

    onTitleChanged = (event) => {
        let value = event.target.value
        let syntax = fallbackEditorMode
        if (value.length > 1 && value.includes(".")) {
            var fileExt = value.split('.').pop();
            syntax = extensionToLanguage[fileExt]
            if (syntax === undefined) {
                syntax = fallbackEditorMode
            }
        }
        this.setState({name: value, syntax: syntax})
    }

    onExpiresChangedHandler = (event) => {
        this.setState({expires: event})
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
            title: this.state.name,
            isPublic: this.state.isPublic,
            lang: this.state.syntax,
            data: this.state.editor.contents
        }

        if (this.state.expires) {
            let offset = this.state.expires.getTimezoneOffset()
            let expires = new Date(this.state.expires.getTime() + (-(offset * 60000)))
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

    canSubmit = () => {
        return this.state.name.length > 0 && this.state.editor.contents.length > 0
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

        let options = editorThemes.map(
            option => {
                return {value: option, label: option.replaceAll("_", " ")}
            }
        )

        const customStyles = {
            control: (provided, state) => ({
                ...provided,
                background: '#fff',
                borderColor: '#9e9e9e',
                minHeight: '28px',
                height: '28px',
                boxShadow: state.isFocused ? null : null,
            }),

            valueContainer: (provided, state) => ({
                ...provided,
                height: '28px',
                padding: '0 6px',
            }),

            singleValue: (provided, state) => ({
                ...provided,
                overflow: "unset",
                }),

            input: (provided, state) => ({
                ...provided,
                margin: '0px',
            }),
            indicatorSeparator: state => ({
                display: 'none',
            }),
            indicatorsContainer: (provided, state) => ({
                ...provided,
                height: '28px',
            }),
        };
        if (!this.props.loading) {
            contents = (
                <div className={classes.NewPaste}>
                    <div className={classes.EditorContainer}>
                        <div className={classes.Controls}>
                            <div className={classes.LeftContainer}>
                                <input
                                    className={[inputClasses.InputElement, classes.PasteName].join(" ")}
                                    value={this.state.name}
                                    onChange={this.onTitleChanged}
                                    placeholder="File name with extension (eg: mylog.log)"
                                />
                            </div>
                            <div className={classes.RightContainer}>
                                <div className={classes.RightContainerElement}>
                                    <PrivacySlider
                                                changed={this.toggleIsPublic}
                                                value={this.state.isPublic}/>
                                </div>
                                <div className={classes.RightContainerElement}>
                                    <Select
                                        options={options}
                                        styles={customStyles}
                                        className={classes.DropDown}
                                        placeholder="Editor Theme"
                                        value={editorTheme(defaultEditorTheme)}
                                        onChange={this.onChangeThemeHandler}
                                    />
                                </div>
                                <div className={classes.RightContainerElement}>
                                    <DatePicker
                                        placeholderText="Expires..."
                                        onChange={this.onExpiresChangedHandler}
                                        selected={this.state.expires}
                                        minDate={(new Date(new Date().setDate((new Date()).getDate() + 1)))}
                                    />
                                </div>
                            </div>
                        </div>
                        <AceEditor
                            mode={this.state.syntax}
                            theme={this.state.editor.theme}
                            onChange={this.editorDataChangedHandler}
                            name="paste-data"
                            width="inherit"
                            height="450px"
                            fontSize="100%"
                            value={this.state.editor.contents}
                            showPrintMargin={false}
                            highlightActiveLine={true}
                            setOptions={{
                                showLineNumbers: true,
                                tabSize: 4,
                            }}
                        />
                    </div>
                    <div style={{marginTop: "10px"}}>
                        <Button type="submit" variant="success" disabled={!this.canSubmit()} onClick={this.submitHandler}>Submit</Button>
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
