import React, { Component } from 'react';

import Moment from 'react-moment';
import { withRouter } from 'react-router-dom';
import AceEditor from "react-ace";
import 'ace-builds/webpack-resolver';

import { Trash } from 'react-bootstrap-icons';

import { defaultEditorTheme } from '../pasteConstants';
import { resolveSyntax } from '../pasteConstants';
import { decode } from 'js-base64';

import classes from './PastePreview.module.css';


class PastePreview extends Component {

    onClickHandler = () => {
        let url = "/p/" + this.props.pasteData.paste_id
        if (this.props.pasteData.public === true) {
            url = "/public/p/" + this.props.pasteData.paste_id
        }
        this.props.history.push(url)
    }

    render() {
        let contents = decode(this.props.pasteData.preview)
        let contentsSplit = contents.split("\n")
        if (contentsSplit.length > 10) {
            contents = contentsSplit.splice(0, 10).join("\n").trimRight("\n")
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

        let pasteLabel = <span className={[classes.PasteLabel, classes.PasteLabelSecret].join(" ")}>secret</span>
        if (this.props.pasteData.public === true) {
            pasteLabel = <span className={[classes.PasteLabel, classes.PasteLabelPublic].join(" ")}>public</span>
        }

        return (
            <div className={classes.PastePreview}>
                <div className={classes.PasteInfoContainer}>
                    <div className={classes.TitleContainer}>
                        <div>
                            <span className={classes.PasteTitle} onClick={this.onClickHandler}>{this.props.pasteData.name}</span>
                            {pasteLabel}
                        </div>
                        <div className={classes.PasteDeleteIcon} onClick={this.props.onDelete}>
                            <Trash />
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
                        theme={defaultEditorTheme}
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
