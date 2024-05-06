import React, {useEffect, useState} from "react";
import PropTypes from "prop-types";
import Select, {components} from "react-select";
import {AvBaseInput} from "availity-reactstrap-validation";
import messages from "./messages";
import {FormText, FormGroup} from "reactstrap";
import './style.scss';

const InputSearchField = (props) => {
    const [selected, setSelected] = useState(null);
    const {defaultValue, options} = props;

    useEffect(() => {
        if (defaultValue === -1) {
            setSelected(null);

        } else if (options && options.length > 0) {
            const selected = options.filter(item => item.value === defaultValue);
            if (selected && selected.length > 0) setSelected(selected[0]);
        }
    }, [options, defaultValue]);

    return (
        <AvSearchInput
            validate={{
                required: {value: props.required ? true : false, errorMessage: messages.required}
            }}
            isSearchable={props.isSearchable}
            isLoading={props.isLoading}
            name={props.name}
            value={selected}
            placeholder={props.placeholder}
            disabled={props.disabled}
            onChange={(value) => {
                setSelected(value)
                if (props.onChange) {
                    props.onChange(value);
                }
            }}
            options={props.options || []}
            classNamePrefix="select2-selection"
        />
    )
}

InputSearchField.propTypes = {
    name: PropTypes.string,
    placeholder: PropTypes.string,
    onChange: PropTypes.func,
    options: PropTypes.array,
    defaultValue: PropTypes.any,
    isSearchable: PropTypes.bool
};

class AvSearchInput extends AvBaseInput {

    CustomOption ({ children, ...props }) {
        return (
            <components.Option {...props}>
                {children}
                {((props.data && props.data.icon && <span dangerouslySetInnerHTML={{__html: props.data.icon}} />) || '' )}
            </components.Option>
        );
    }

    render() {
        const {name, value, onChange, validate, options, placeholder, helpMessage, isSearchable, disabled, isLoading} = this.props;
        const validation = this.context.FormCtrl.getInputState(this.props.name);
        const feedback = validation.errorMessage ? (<div className="invalid-feedback" style={{display: "block"}}>{validation.errorMessage}</div>) : null;
        const help = helpMessage ? (<FormText>{helpMessage}</FormText>) : null;
        const isInvalid = validation.errorMessage ? "select-is-invalid" : "";

        return (
            <FormGroup className={isInvalid}>
                <div>
                    <Select
                        id={name}
                        name={name}
                        value={value}
                        validate={validate}
                        defaultValue={options[0]}
                        isLoading={isLoading}
                        // menuIsOpen={true}
                        placeholder={placeholder || ""}
                        onChange={onChange}
                        options={options || []}
                        classNamePrefix="select2-selection"
                        isSearchable={isSearchable || false}
                        isDisabled={disabled || false}
                        menuPortalTarget={document.body}
                        menuPosition={'fixed'}
                        styles={{ menuPortal: base => ({ ...base, zIndex: 9999 }) }}
                        components={{
                            Option: this.CustomOption.bind(this)
                        }}
                    />
                </div>
                {feedback}
                {help}
            </FormGroup>
        );
    }
};

export default InputSearchField;
