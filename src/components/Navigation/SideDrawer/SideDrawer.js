import React from 'react';

// import Logo from '../../Logo/Logo';
import NavigationItems from '../NavigationItems/NavigationItems';
import Backdrop from '../../UI/Backdrop/Backdrop';

import classes from './SideDrawer.module.css';

const sideDrawer = (props) => {

    var attachedClasses = [classes.SideDrawer, classes.Close]
    if (props.showSideDrawer) {
        attachedClasses = [classes.SideDrawer, classes.Open]
    }

    return (
        <React.Fragment>
            <Backdrop show={props.showSideDrawer} clicked={props.closed}/>
            <div className={attachedClasses.join(' ')}>
                {/* <div className={classes.Logo}>
                    <Logo />
                </div> */}
                <nav>
                    <NavigationItems isAuthenticated={props.isAuth} isAdmin={props.isAdmin}/>
                </nav>
            </div>
        </React.Fragment>
    );
};

export default sideDrawer;