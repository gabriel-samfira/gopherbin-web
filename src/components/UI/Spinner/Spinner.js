import React from 'react';

import classes from './Spinner.module.css';

const spinner = (props) => {
    return (
        <div className={classes.Loader}>Loading...</div>
    );
};

export default spinner;