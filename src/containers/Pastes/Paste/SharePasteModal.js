import React, { Component } from 'react';

import { Button, Table } from 'react-bootstrap';
import { Trash } from 'react-bootstrap-icons';


import Modal from '../../../components/UI/Modal/Modal';
import classes from './Paste.module.css';


class SharePasteModal extends Component {

    state = {
        shareContents: "",
    }

    onShareInputChanged = (event) => {
        this.setState({shareContents: event.target.value})
    }

    onShareSubmit = () => {
        this.props.onShareAdd(this.props.sharingPaste.pasteID, this.state.shareContents, this.props.token)
        this.setState({shareContents: ""})
    }

    onKeyDown = (event) => {
        if (event.key === "Enter") {
            this.onShareSubmit()
        }
    }

    render() {
        if (this.props.sharingPaste === null || this.props.sharingPaste.pasteID === null) {
            return null
        }

        let sharesTable = <p>No shares to show</p>
        if (this.props.sharingPaste.shares && this.props.sharingPaste.shares.length) {
            sharesTable = <Table>
                <thead>
                    <tr>
                        <th>Full Name</th>
                        <th>Username</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    {
                        this.props.sharingPaste.shares.map(
                            pasteShare => {
                                return <tr key={pasteShare.username}>
                                    <th>{pasteShare.full_name}</th>
                                    <th>{pasteShare.username}</th>
                                    <th>
                                        <div 
                                            className={[classes.ControlIcon, classes.PasteDeleteIcon].join(" ")}
                                            onClick={() => this.props.onDelete(this.props.sharingPaste.pasteID, pasteShare.username, this.props.token)}
                                            title="Delete share">
                                            <Trash />
                                        </div>
                                    </th>
                                </tr>
                            }
                        )
                    }
                </tbody>
            </Table>
        }

        let inputHasContents = this.state.shareContents !== ""
        return <Modal show={true} modalClosed={this.props.onShareCancel}>
            <div className={classes.ModalContainer}>
                <p>Sharing information for <span className={classes.HighlightetdID}>{this.props.sharingPaste.pasteName}</span></p>
                <div className={classes.ModalControls}>
                    <div className={classes.AddShareContainer}>
                        <input
                            className={classes.AddShareInput}
                            value={this.state.shareContents}
                            onChange={this.onShareInputChanged}
                            onKeyDown={this.onKeyDown}
                            placeholder="Username or email"/>
                    </div>
                    <div>
                        <Button
                            variant="primary"
                            type="submit"
                            onClick={this.onShareSubmit}
                            disabled={!inputHasContents}
                        >Share</Button>
                    </div>
                </div>
                <div>
                    {sharesTable}
                </div>
                <div className={classes.ModalControls}>
                    <div>
                        <Button variant="primary" onClick={this.props.onShareCancel}>Close</Button>
                    </div>
                </div>
            </div>
        </Modal>
    }

}

export default SharePasteModal;
