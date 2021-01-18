import React, { Component } from 'react';
import { connect } from 'react-redux';

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



class PublicPaste extends Component {
    // Deduplicate this
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
        this.props.onInitPasteState()
        this.props.onGetPaste(pasteID)
        this.props.onSetAuthRedirect("/")
    }

    render() {
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
                        height="inherit"
                        fontSize="inherit"
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
        onInitPasteGetState: () => dispatch(actions.initPublicPasteGetState()),
        onGetPaste: (pasteID) => dispatch(actions.getPublicPaste(pasteID)),
        onInitPasteState: () => dispatch(actions.initPasteState()),
        onSetAuthRedirect: (path) => dispatch(actions.setAuthRedirectPath(path))
    }
}

const mapStateToProps = state => {
    return {
        pasteID: state.getPublicPaste.pasteID,
        pasteData: state.getPublicPaste.pasteData,
        error: state.getPublicPaste.error,
        allState: state.getPublicPaste,
        loading: state.getPublicPaste.loading
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(PublicPaste);
