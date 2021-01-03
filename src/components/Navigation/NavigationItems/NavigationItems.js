import React from 'react';

import NavigationItem from './NavigationItem/NavigationItem';

import classes from './NavigationItems.module.css';

const navigationItems = (props) => {
    let guardedLinks = null;
    let adminLinks = null;
    let authLink = null;

    if (props.isAuthenticated) {
        authLink = <NavigationItem link="/logout" exact>Logout</NavigationItem>
        guardedLinks = (
            <React.Fragment>
                <NavigationItem link="/" exact>Home</NavigationItem>
                <NavigationItem link="/p" exact>All pastes</NavigationItem>
            </React.Fragment>
        );
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