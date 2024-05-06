import React, {useEffect, useState} from "react";
import PropTypes from "prop-types";
import Select from "react-select";
import {AvBaseInput} from "availity-reactstrap-validation";
import messages from "./messages";
import {FormText, FormGroup} from "reactstrap";
import './style.scss';
import {map} from "lodash";
import InputAsyncSearchField from "./InputAsyncSearchField";
import {FieldSelectBasic} from "./index";

const InputSelectBasicField = (props) => {
    return (
        <select
            id={props.id}
            name={props.name}
            value={props.value}
            onChange={(e => props.onChange?props.onChange(e.target.value):'')}
            className={props.className || "form-control"}>
            {map(props.options, (option, k) => (<option key={k} value={option.value}>{option.label}</option>))}
        </select>
    )
}

InputSelectBasicField.propTypes = {
    name: PropTypes.string,
    placeholder: PropTypes.string,
    onChange: PropTypes.func,
    options: PropTypes.array.isRequired,
};

export default InputSelectBasicField;