import React from 'react';

import NavigationItem from './NavigationItem/NavigationItem';

import classes from './NavigationItems.module.css';

const navigationItems = (props) => {
    let guardedLinks = null;
    let adminLinks = null;
    let authLink = null;

    // let publicLinks = (<NavigationItem link="/" exact>Home</NavigationItem>)

    if (props.isAuthenticated) {
        authLink = <NavigationItem link="/logout" exact>Logout</NavigationItem>
        guardedLinks = (
            <React.Fragment>
                <NavigationItem link="/" exact>Home</NavigationItem>
                <NavigationItem link="/p" exact>All pastes</NavigationItem>
            </React.Fragment>
        );
    } else {
        authLink = <NavigationItem link="/login" exact>Login</NavigationItem>
    }

    if (props.isAdmin) {
        adminLinks = (
            <React.Fragment>
                <NavigationItem link="/admin/users" className={classes.AdminLink}>Admin</NavigationItem>
            </React.Fragment>
        );
    }

    return (
        <React.Fragment>
            <ul className={[classes.NavigationItems, classes.MarginRightAuto].join(" ")}>
                {/* {publicLinks} */}
                {guardedLinks}
            </ul>
            <ul className={[classes.NavigationItems, classes.MarginLeftAuto].join(" ")}>
                {adminLinks}
                {authLink}
            </ul>
        </React.Fragment>
    );
};

export default navigationItems;