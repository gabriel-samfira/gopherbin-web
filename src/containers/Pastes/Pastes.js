import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';

import { Button } from 'react-bootstrap';

import *  as actions from '../../store/actions/index';
import Spinner from '../../components/UI/Spinner/Spinner';
import PastePreview from './PastePreview/PastePreview';

import classes from './Pastes.module.css';
import './Pastes.css';


class Pastes extends Component {

    componentDidMount() {
        if (this.props.isAuthenticated) {
            this.props.onInitPasteGetState()
            this.props.onInitPublicPasteGetState()
            this.props.onListPastes(
                this.props.page, this.props.maxResults, this.props.token)
        } else {
            this.props.onSetAuthRedirect(this.props.match.url)
            this.props.history.push('/login')
        }
    }

    handlePageClick = (data) => {
        if (data < 1 || data > this.props.totalPages) {
            return
        }

        this.props.onListPastes(
            data, this.props.maxResults, this.props.token)
    }

    handleOnPasteDelete = (pasteID) => {
        this.props.onPasteDelete(pasteID, this.props.token)
    }

    render () {
        if (!this.props.isAuthenticated) {
            return <Redirect to="/login" />
        }

        let contents = <Spinner />
        if (this.props.error) {
            contents = <p>{this.props.error.message}</p>
        } else if (this.props.nestedPastes !== null && this.props.nestedPastes !== undefined) {
            let pagination = null;
            if(this.props.totalPages > 1) {
                let newerClasses = [];
                let olderClasses = [];

                if (this.props.page === 1) {
                    newerClasses.push(classes.PaginationDisabled)
                }
                if (this.props.page === this.props.totalPages) {
                    olderClasses.push(classes.PaginationDisabled)
                }

                pagination = (
                    <div className={classes.Pagination}>
                        <span className={newerClasses.join(" ")} onClick={() => { this.handlePageClick(this.props.page - 1)}}>Newer</span>
                        <span className={olderClasses.join(" ")} onClick={() => { this.handlePageClick(this.props.page + 1)}}>Older</span>
                    </div>
                )
            }
            if (this.props.nestedPastes.length) {
                contents = (
                    <div className={classes.PastesContainer}>
                        {pagination}
                        {
                            this.props.nestedPastes.map(
                                paste => {
                                    return <PastePreview
                                                pasteData={paste}
                                                key={paste.paste_id}
                                                onDelete={() => this.handleOnPasteDelete(paste.paste_id)}/>
                                }
                            )
                        }
                        {pagination}
                    </div>
                );
            } else {
                contents = (
                    <div className={classes.NoPastes}>
                        <Button variant="primary" size="lg" onClick={() => this.props.history.push("/")}>Create new paste</Button>
                    </div>
                );
            }
        }

        return contents;
    }
}

const mapDispatchToProps = dispatch => {
    return {
        onInitPasteGetState: () => dispatch(actions.initPasteGetState()),
        onInitPublicPasteGetState: () => dispatch(actions.initPublicPasteGetState()),
        onListPastes: (page, maxResults, token) => dispatch(actions.listPastes(page, maxResults, token)),
        onSetAuthRedirect: (path) => dispatch(actions.setAuthRedirectPath(path)),
        onPasteDelete: (pasteID, token) => dispatch(actions.deletePaste(pasteID, token))
    }
}

const mapStateToProps = state => {
    return {
        error: state.listPastes.error,
        loading: state.listPastes.loading,
        isAuthenticated: state.auth.token !== null,
        token: state.auth.token,
        page: state.listPastes.page,
        maxResults: state.listPastes.maxResults,
        totalPages: state.listPastes.totalPages,
        pastes: state.listPastes.pastes,
        nestedPastes: state.listPastes.pastes.pastes
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Pastes);