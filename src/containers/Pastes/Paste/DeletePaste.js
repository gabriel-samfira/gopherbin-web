import React, { Component } from 'react';

import { Button } from 'react-bootstrap';

import Modal from '../../../components/UI/Modal/Modal';
import classes from './Paste.module.css';


class DeletePasteModal extends Component {

    render() {
        let modal = null
        if (this.props.deletingPaste !== null) {
            modal = <Modal show={true} modalClosed={this.props.onDeleteCancel}>
                <div className={classes.ModalContainer}>
                    <p>Are you sure you want to delete <span className={classes.HighlightetdID}>{this.props.deletingPaste.pasteName}</span>?</p>
                    <div className={classes.ModalControls}>
                        <div>
                            <Button variant="primary" onClick={this.props.onDeleteCancel}>Cancel</Button>
                        </div>
                        <div>
                            <Button variant="danger" onClick={() => {this.props.onDeleteConfirm(this.props.deletingPaste.pasteID)}}>Delete</Button>
                        </div>
                    </div>
                </div>
            </Modal>
        }

        return modal;
    }

}

export default DeletePasteModal;
