import {AvBaseInput} from "availity-reactstrap-validation";
import React, {useEffect, useState} from "react";
import PropTypes from "prop-types";
import messages from './messages';
import {FormGroup} from "reactstrap";

const SwitchField = (props) => {

    const {name,color,required,defaultValue} = props;
    const [ checked, setChecked ] = useState(defaultValue);

    useEffect(() => {
        setChecked(defaultValue);
    },[defaultValue]);

    return (
        <AvSwitchInput
            color={color || "primary"}
            name={name}
            value={checked}
            checked={checked}
            onChange={() => {
                setChecked(!checked)
            }}
            validate={
                {
                    required: { value: required ? true : false, errorMessage: messages.required }
                }
            }
        />
    );
}

SwitchField.propTypes = {
    name: PropTypes.string,
    value: PropTypes.string,
    required: PropTypes.bool,
    color: PropTypes.string
}

class AvSwitchInput extends AvBaseInput {
    render()
    {
        const {name,value,color,onChange, validate} = this.props;
        const validation = this.context.FormCtrl.getInputState(name);
        const isInvalid = validation.errorMessage ? "has-error" : "";

        return (<FormGroup className={isInvalid}>
            <div className="square-switch">
                <input
                    type="checkbox"
                    id={name}
                    validate={validate}
                    switch={color}
                    value={value}
                    checked={value}
                    onChange={onChange}
                />
                <label
                    htmlFor={name}
                    data-on-label="Si"
                    data-off-label="No"
                ></label>
            </div>
        </FormGroup>);
    }
}

export default SwitchField;
