import React from 'react';

import classes from './PrivacySlider.module.css';

const slider = (props) => {
    return (
        <div className={classes.switch}>
            <input
                type="checkbox"
                checked={props.value}
                onChange={props.changed}
            />
            <div
                className={[classes.slider, classes.round].join(" ")}
                onClick={props.changed}></div>
        </div>
    );
};

export default slider;