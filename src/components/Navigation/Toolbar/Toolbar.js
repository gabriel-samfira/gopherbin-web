import React from 'react';

// import Logo from '../../Logo/Logo';
import NavigationItems from '../NavigationItems/NavigationItems';
import DrawerToggle from '../SideDrawer/DrawerToggle/DrawerToggle';

import classes from './Toolbar.module.css';

const toolbar = (props) => {
    return (
        <header className={classes.Toolbar}>
            <DrawerToggle toggleDrawer={props.toggleDrawer}/>
            {/* <div className={[classes.Logo, classes.DesktopOnly].join(' ')}>
                <Logo/>
            </div> */}
            <div className={[classes.NavContainer, classes.DesktopOnly].join(" ")}>
                {/* <nav className={classes.DesktopOnly}> */}
                    <NavigationItems isAuthenticated={props.isAuthenticated} isAdmin={props.isAdmin}/>
                {/* </nav> */}
            </div>
        </header>
    );
};

export default toolbar;