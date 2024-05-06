import React, {useEffect, useState} from "react";
import PropTypes from "prop-types";
import {AvBaseInput} from "availity-reactstrap-validation";
import messages from "./messages";
import {FormText, FormGroup} from "reactstrap";
import './style.scss';
import "flatpickr/dist/themes/material_blue.css"
import Flatpickr from "react-flatpickr"
import "flatpickr/dist/l10n/es.js";
import "../Fields/scss/customInputDate.scss";

export const DATE_MODES = {
    SINGLE: 'single',
    MULTIPLE: 'multiple',
    RANGE: 'range',
};

const InputDateField = (props) => {
    const [ selected, setSelected ] = useState(null);
    const {defaultValue, options} = props;

    useEffect(() => {
        setSelected(defaultValue ? defaultValue: null);
    }, [options, defaultValue]);

    return (
        <AvSearchInput
            validate={
                {
                    required: { value: props.required ? true : false, errorMessage: messages.required }
                }
            }
            name={props.name}
            value={selected}
            placeholder={props.placeholder}
            onChange={(date) => {
                setSelected(date)
                if(props.onChange){
                    props.onChange(date);
                }
            }}

            minDate={props.minDate}
            maxDate={props.maxDate}
            mode={props.mode}
            classNamePrefix="select2-selection"
        />
    )}

InputDateField.propTypes = {
    name: PropTypes.string,
    placeholder: PropTypes.string,
    onChange: PropTypes.func,
    options: PropTypes.array,
    defaultValue: PropTypes.any,
    mode: PropTypes.string,
    minDate: PropTypes.object,
    maxDate: PropTypes.object
};

class AvSearchInput extends AvBaseInput {
    render() {
        const { name, value, onChange, validate, placeholder, helpMessage,mode,minDate,maxDate } = this.props;
        const validation = this.context.FormCtrl.getInputState(this.props.name);
        const feedback = validation.errorMessage ? (<div className="invalid-feedback" style={{display: "block"}}>{validation.errorMessage}</div>) : null;
        const help = helpMessage ? (<FormText>{helpMessage}</FormText>) : null;
        const isInvalid = validation.errorMessage ? "select-is-invalid" : "";

        let options = {
            mode: mode || DATE_MODES.SINGLE,
            dateFormat: "Y-m-d",
            locale: 'es'
        };

        if(minDate){
            options = {...options, minDate: minDate};
        }

        if(maxDate){
            options = {...options, maxDate: maxDate};
        }

        return (
            <FormGroup className={isInvalid}>
                <div>
                    <Flatpickr
                        id={name}
                        className="form-control d-block"
                        validate={validate}
                        value={value}
                        name={name}
                        placeholder={placeholder}
                        options={options}
                        onClose={onChange}
                    />
                </div>
                {feedback}
                {help}
            </FormGroup>
        );
    }
};

export default InputDateField;
