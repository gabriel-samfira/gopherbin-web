import React, { Component } from 'react';

import Moment from 'react-moment';
import { withRouter } from 'react-router-dom';
import AceEditor from "react-ace";
import 'ace-builds/webpack-resolver';

import { Trash } from 'react-bootstrap-icons';

import { defaultEditorTheme } from '../pasteConstants';
import { resolveSyntax } from '../pasteConstants';

import classes from './PastePreview.module.css';


class PastePreview extends Component {

    onClickHandler = () => {
        this.props.history.push("/p/" + this.props.pasteData.paste_id)
    }

    render() {
        let contents = atob(this.props.pasteData.preview)
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

        return (
            <div className={classes.PastePreview}>
                <div className={classes.PasteInfoContainer}>
                    <div className={classes.TitleContainer}>
                        <span className={classes.PasteTitle} onClick={this.onClickHandler}>{this.props.pasteData.name}</span>
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
                        height="inherit"
                        fontSize="inherit"
                        value={contents}
                        showPrintMargin={false}
                        highlightActiveLine={false}
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