import React, {useEffect, useState} from "react";
import PropTypes from "prop-types";

import PhoneInput from 'react-phone-input-2'
import 'react-phone-input-2/lib/style.css'
import es from 'react-phone-input-2/lang/es.json'
import {AvBaseInput} from "availity-reactstrap-validation";
import messages from "./messages";
import {FormText, FormGroup} from "reactstrap";
import './style.scss';

const InputPhoneField = (props) => {

    return (
        <AvPhoneInput
            id={props.id}
            name={props.name}
            value={props.value}
            required={props.required}
            country={props.country || 'co'}
            placeholder={props.placeholder}
            onChange={(value) => props.onChange && props.onChange(value)}
            validate={
                {
                    required: {value: props.required ? true : false, errorMessage: messages.required}
                }
            }
            onValidate={props.onValidate}
        />
    )
}

InputPhoneField.propTypes = {
    name: PropTypes.string,
    placeholder: PropTypes.string,
    onChange: PropTypes.func,
    country: PropTypes.string,
    required: PropTypes.bool,
    defaultValue: PropTypes.any,
};

class AvPhoneInput extends AvBaseInput {
    render() {
        const {id, name, value, onChange, required, country, placeholder, helpMessage, onValidate} = this.props;
        const validation = this.context.FormCtrl.getInputState(this.props.name);
        const feedback = validation.errorMessage ? (<div className="invalid-feedback" style={{display: "block"}}>{validation.errorMessage}</div>) : null;
        const help = helpMessage ? (<FormText>{helpMessage}</FormText>) : null;
        const isInvalid = validation.errorMessage ? "select-is-invalid" : "";

        return (
            <FormGroup className={isInvalid}>
                <div>
                    <PhoneInput
                        id={id || name}
                        country={country}
                        onlyCountries={[country]}
                        preferredCountries={[country]}
                        value={value}
                        name={name}
                        placeholder={placeholder}
                        localization={es}
                        inputClass="form-control w-100"
                        inputProps={{
                            name: {name},
                            required: {required}
                        }}
                        onChange={(value, country, e, formattedValue) => {
                            onChange(formattedValue);
                        }}
                        isValid={onValidate}
                    />
                </div>
                {feedback}
                {help}
            </FormGroup>
        );
    }
};

export default InputPhoneField;
