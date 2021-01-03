import React from 'react';

import classes from './Button.module.css';

const button = (props) => {
    let onClickHan = props.clicked;
    let btnClasses = [classes.Button];
    if (props.disabled) {
        onClickHan = null
    }

    if (props.btnType) {
        btnClasses.push(classes[props.btnType])
    }

    return (
        <button
            disabled={props.disabled}
            onClick={onClickHan}
            className={btnClasses.join(' ')}>{props.children}</button>
    );
};

export default button;