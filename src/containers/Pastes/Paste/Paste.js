import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';

import copy from "copy-to-clipboard";

import AceEditor from "react-ace";
import 'ace-builds/webpack-resolver';

import { resolveSyntax } from '../pasteConstants';
import *  as actions from '../../../store/actions/index';
import classes from './Paste.module.css';

import Spinner from '../../../components/UI/Spinner/Spinner';
import { defaultEditorTheme } from '../pasteConstants';
import Moment from 'react-moment';
import { Button, Tooltip, Overlay } from 'react-bootstrap';
import { decode } from 'js-base64';


class Paste extends Component {

    constructor(props) {
        super(props);

        this.target = React.createRef();
        this.state = {
            showTooltip: false
        }
    }

    toggleTooltip = () => {
        this.setState({showTooltip: !this.state.showTooltip})
    }

    componentDidMount() {
        this.props.onInitPasteGetState()
        let pasteID = this.props.match.params.id
        if (!this.props.isAuthenticated) {
            this.props.onSetAuthRedirect(this.props.match.url)
            this.props.history.push('/login')
        } else {
            this.props.onInitPasteState()
            this.props.onGetPaste(pasteID, this.props.token)
            this.props.onSetAuthRedirect("/")
        }
    }

    render() {
        if (!this.props.isAuthenticated) {
            return <Redirect to="/login" />
        }

        let contents = <Spinner />
        if (this.props.allState.error) {
            contents = <p>{this.props.allState.error.response.data.details}</p>
        } else if (this.props.pasteData !== null) {
            const pasteContents = decode(this.props.pasteData.data)
            const syntax = this.props.pasteData.language
            contents = (
                <div className={classes.Paste}>
                    <div className={classes.PasteInfo}>
                        <h2>{this.props.pasteData.name}</h2>
                        <p>Created <Moment fromNow>{this.props.pasteData.created_at}</Moment> </p>
                        <Button variant="secondary" ref={this.target} onClick={
                            () => {
                                copy(pasteContents)
                                this.toggleTooltip()
                                setTimeout(this.toggleTooltip, 1000)
                            }
                        }>
                            Copy
                        </Button>
                        <Overlay target={this.target.current} show={this.state.showTooltip} placement="top">
                            {(props) => (
                                <Tooltip id="overlay-example" {...props}>
                                    Copied!
                                </Tooltip>
                            )}
                        </Overlay>
                    </div>
                    <AceEditor
                        mode={resolveSyntax(syntax)}
                        theme={defaultEditorTheme}
                        name="paste-data"
                        width="100%"
                        fontSize="inherit"
                        wrapEnabled={true}
                        value={pasteContents}
                        showPrintMargin={false}
                        highlightActiveLine={false}
                        setOptions={{
                            maxLines: Infinity,
                            highlightGutterLine: false,
                            readOnly: true,
                            showLineNumbers: true,
                            tabSize: 4,
                        }}
                    />
                </div>
            )
        }

        return contents;
    }
}

const mapDispatchToProps = dispatch => {
    return {
        onInitPasteGetState: () => dispatch(actions.initPasteGetState()),
        onGetPaste: (pasteID, token) => dispatch(actions.getPaste(pasteID, token)),
        onSetAuthRedirect: (path) => dispatch(actions.setAuthRedirectPath(path)),
        onInitPasteState: () => dispatch(actions.initPasteState())
    }
}

const mapStateToProps = state => {
    return {
        pasteID: state.getPaste.pasteID,
        pasteData: state.getPaste.pasteData,
        error: state.getPaste.error,
        allState: state.getPaste,
        loading: state.getPaste.loading,
        isAuthenticated: state.auth.token !== null,
        token: state.auth.token
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Paste);
