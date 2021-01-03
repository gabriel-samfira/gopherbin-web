import React from 'react';
import { NavLink } from 'react-router-dom';

import classes from './NavigationItem.module.css';

const navigationItem = (props) => {
    let linkClasses = [classes.NavigationItem]
    if (props.className) {
        linkClasses.push(props.className)
    }

    return (
        <li className={linkClasses.join(" ")}>
            <NavLink
                exact={props.exact}
                activeClassName={classes.active}
                to={props.link}>{props.children}</NavLink>
        </li>
    )
};

export default navigationItem;
