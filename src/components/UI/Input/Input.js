import React from 'react';
import SelectSearch from 'react-select-search';
import AceEditor from "react-ace";

import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

import 'react-select-search/style.css';
import './Input.css';
import classes from './Input.module.css';


const capitalizeFirstLetter = ([ first, ...rest ], locale = navigator.language) =>
  first.toLocaleUpperCase(locale) + rest.join('')


const input = (props) => {
    let inputEl = null;
    let inputClasses = [classes.InputElement];

    if (props.invalid && props.touched) {
        inputClasses.push(classes.Invalid)
    }

    switch (props.elementType) {
        case ('date-picker'):
            inputEl = (
                <DatePicker
                    placeholderText={props.elementConfig.placeholder}
                    selected={props.value}
                    {...props.elementConfig}
                    onChange={props.changed}
                />
            );
            break;
        case ('editor'):
            inputEl = (
                <AceEditor
                    mode={props.textMode}
                    theme={props.theme}
                    onChange={props.changed}
                    name="paste-data"
                    showGutter={true}
                    highlightActiveLine={true}
                    setOptions={{
                        enableBasicAutocompletion: false,
                        enableLiveAutocompletion: false,
                        enableSnippets: false,
                        showLineNumbers: true,
                        tabSize: 4,
                    }}
                />);
            break;
        case ('checkbox'):
            inputEl = (
                <input
                    id={props.id}
                    className={classes.Checkbox}
                    {...props.elementConfig}
                    checked={props.value}
                    onChange={props.changed}/>);
            break;
        case ('input'):
            inputEl = (
                <input
                    id={props.id}
                    className={inputClasses.join(' ')}
                    {...props.elementConfig}
                    value={props.value}
                    onChange={props.changed}/>);
            break;
        case ('textarea'):
            inputEl = (
                <textarea
                    className={inputClasses.join(' ')}
                    {...props.elementConfig}
                    value={props.value}
                    onChange={props.changed} />);
            break;
        case ('select-seachable'):
            let searchableOptions = props.elementConfig.options.map(
                opt => {
                    return {
                        value: opt.value,
                        name: capitalizeFirstLetter(opt.displayValue).replace("_", " ")
                    }
                }
            );
            inputEl = (
                <SelectSearch
                    id={props.id}
                    onChange={props.changed}
                    // className={inputClasses.join(' ')}
                    value={props.value}
                    search
                    options={searchableOptions}/>);
            break;
        case ('select'):
                let options = props.elementConfig.options.map(
                    opt => {
                        return (
                            <option
                                key={opt.value}
                                value={opt.value}>
                                    {opt.displayValue}
                            </option>
                        );
                    }
                );

                inputEl = (
                    <select
                        onChange={props.changed}
                        className={inputClasses.join(' ')}
                        value={props.value}> {options} </select>
                );
                break;
        default:
            inputEl = (
                <input
                    onChange={props.changed}
                    className={inputClasses.join(' ')}
                    {...props.elementConfig}
                    value={props.value}/>);
    }
    let label = null;
    if (props.label) {
        label = <label className={classes.Label} htmlFor={props.id}>{props.label}</label>
    }
    return (
        <div className={classes.Input}>
            {label}
            {inputEl}
        </div>
    );
};

export default input;