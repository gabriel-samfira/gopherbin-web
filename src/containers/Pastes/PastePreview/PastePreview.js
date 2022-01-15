import React, { Component } from 'react';

import Moment from 'react-moment';
import { withRouter } from 'react-router-dom';
import AceEditor from "react-ace";
import 'ace-builds/webpack-resolver';
import copy from "copy-to-clipboard";
import FileSaver from 'file-saver';

import { Trash, Clipboard, ClipboardCheck, Share, Download } from 'react-bootstrap-icons';
import { editorTheme } from '../../../utils/utils';
import axios from '../../../axios';

import PrivacySlider from '../../../components/UI/PrivacySlider/PrivacySlider';

import { defaultEditorTheme } from '../pasteConstants';
import { resolveSyntax } from '../pasteConstants';
import { decode } from 'js-base64';

import classes from './PastePreview.module.css';


class PastePreview extends Component {

    state = {
        copied: false
    }

    onClickHandler = () => {
        this.props.history.push(this.getPasteURL())
    }

    getPasteURL = () => {
        let url = "/p/" + this.props.pasteData.paste_id
        if (this.props.pasteData.public === true) {
            url = "/public/p/" + this.props.pasteData.paste_id
        }
        return url
    }

    toggleCopiedState = () => {
        this.setState({copied: !this.state.copied})
    }

    onClipboardClickedHandler = () => {
        var base_url = window.location.origin;
        let url = this.getPasteURL();
        copy(base_url + url);
        this.toggleCopiedState();
        setTimeout(this.toggleCopiedState, 1000);
    }

    onDownloadHandler = () => {
        const config = {
            headers: { Authorization: `Bearer ${this.props.token}` },
            responseType: "blob"
        };
        let downloadURL = "/api/v1/paste/" + this.props.pasteData.paste_id + "/download"
        axios.get(downloadURL, config)
            .then(response => {
                let fileName = response.headers["x-suggested-filename"]
                FileSaver.saveAs(response.data, fileName);
            })
            .catch(error => {
                console.log(error);
            })
    }

    render() {
        let contents = decode(this.props.pasteData.preview)
        let contentsSplit = contents.split("\n")
        if (contentsSplit.length > 10) {
            contents = contentsSplit.splice(0, 10).join("\n").trimEnd("\n")
        }

        let expires = null;
        if (this.props.pasteData.expires) {
            expires = (
                <span
                    className={[classes.PasteInfo, classes.Expires].join(" ")}
                    >Expires <Moment fromNow>{this.props.pasteData.expires}</Moment> </span>);
        }

        let description = null
        if (this.props.pasteData.description) {
            description = <span className={classes.PasteDescription}>{this.props.pasteData.description}</span>
        }

        let sliderKey = "slider" + this.props.pasteData.paste_id

        let clipboardClasses = [classes.ControlIcon]
        let clipboardIcon = <Clipboard/>
        if (this.state.copied) {
            clipboardClasses.push(classes.ControlIconClicked)
            clipboardIcon = <ClipboardCheck/>
        }

        return (
            <div className={classes.PastePreview}>
                <div className={classes.PasteInfoContainer}>
                    <div className={classes.TitleContainer}>
                        <div>
                            <span className={classes.PasteTitle} onClick={this.onClickHandler}>{this.props.pasteData.name}</span>
                        </div>

                        <div>
                            <div style={{display: "inline-block"}}>
                                <PrivacySlider
                                    key={sliderKey}
                                    value={this.props.pasteData.public}
                                    changed={this.props.onUpdatePaste}/>
                            </div>
                            <div 
                                className={classes.ControlIcon}
                                onClick={this.props.onSharePaste}
                                title="Sharing">
                                <Share/>
                            </div>
                            <div 
                                className={classes.ControlIcon}
                                onClick={this.onDownloadHandler}
                                title="Download">
                                <Download/>
                            </div>
                            <div 
                                className={clipboardClasses.join(" ")}
                                onClick={this.onClipboardClickedHandler}
                                title="Copy paste URL">
                                {clipboardIcon}
                            </div>
                            <div 
                                className={[classes.ControlIcon, classes.PasteDeleteIcon].join(" ")}
                                onClick={this.props.onDelete}
                                title="Delete paste">
                                <Trash />
                            </div>
                        </div>
                    </div>
                    <span className={classes.PasteInfo}>Created <Moment fromNow>{this.props.pasteData.created_at}</Moment> </span>
                    {description}
                    {expires}
                </div>
                <div className={classes.PastePreviewSnippet}>
                    <div className={classes.PreviewCover} onClick={this.onClickHandler} />
                    <AceEditor
                        mode={resolveSyntax(this.props.pasteData.language)}
                        theme={editorTheme(defaultEditorTheme)["value"]}
                        name="paste-preview"
                        width="100%"
                        fontSize="inherit"
                        value={contents}
                        showPrintMargin={false}
                        highlightActiveLine={false}
                        wrapEnabled={true}
                        onLoad={
                            editor => {
                                editor.container.style.lineHeight = 1.4
                                editor.renderer.updateFontSize()
                            }
                        }
                        setOptions={{
                            maxLines: Infinity,
                            highlightGutterLine: false,
                            readOnly: true,
                            showLineNumbers: true,
                            tabSize: 4,
                        }}
                    />
                </div>
            </div>
        )
    }
}

export default withRouter(PastePreview);
