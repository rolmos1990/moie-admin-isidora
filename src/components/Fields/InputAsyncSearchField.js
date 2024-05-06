import React, {useEffect, useState} from "react";
import PropTypes from "prop-types";
import AsyncSelect from 'react-select/async';
import {FormGroup, FormText} from "reactstrap";
import './style.scss';
import {getData} from "../../helpers/service";
import {arrayToOptionsByFieldName, getEmptyOptions} from "../../common/converters";
import {AvBaseInput} from "availity-reactstrap-validation";
import messages from "./messages";
import Conditionals from "../../common/conditionals";
import {__trim, trim} from "../../common/utils";

const InputAsyncSearchField = (props) => {
    const {defaultValue, conditionalOptions, defaultConditions} = props;
    const [selected, setSelected] = useState(null);

    useEffect(() => {
        setSelected(defaultValue);
    }, [defaultValue]);

    return (
        <AvAsyncSearchInput
            validate={{required: {value: props.required === true, errorMessage: messages.required}}}
            name={props.name}
            hasWild={props.hasWild || false}
            value={selected}
            placeholder={props.placeholder}
            removeDots={props.removeDots}
            urlStr={props.urlStr}
            isClearable={props.isClearable}
            noSpaces={props.noSpaces}
            noDoubleSpaces={props.noDoubleSpaces}
            onKeyPress={props.onKeyPress ? props.onKeyPress : null}
            onChange={(value, meta) => {
                setSelected(value)
                if (props.onChange) {
                    props.onChange(value, meta);
                }
            }}
            conditionalOptions={conditionalOptions}
            defaultConditions={defaultConditions}
        />
    )
}

InputAsyncSearchField.propTypes = {
    urlStr: PropTypes.string.isRequired,
};


class AvAsyncSearchInput extends AvBaseInput {
    render() {
        const {name, value, onChange, validate, isClearable, hasWild, urlStr, conditionalOptions, defaultConditions, placeholder, helpMessage, onKeyPress, removeDots, noSpaces, noDoubleSpaces} = this.props;
        const validation = this.context.FormCtrl.getInputState(this.props.name);
        const feedback = validation.errorMessage ? (<div className="invalid-feedback" style={{display: "block"}}>{validation.errorMessage}</div>) : null;
        const help = helpMessage ? (<FormText>{helpMessage}</FormText>) : null;
        const isInvalid = validation.errorMessage ? "select-is-invalid" : "";

        return (
            <FormGroup className={isInvalid}>
                <div>
                    <AsyncSelect
                        cacheOptions
                        defaultOptions
                        name={name}
                        value={value}
                        onChange={onChange}
                        placeholder={placeholder}
                        removeDots={removeDots}
                        isClearable={isClearable}
                        onKeyDown={onKeyPress ? onKeyPress : null}
                        loadOptions={inputValue => {
                            const cond = {...conditionalOptions};
                            let textSearch = inputValue +'';
                            if(removeDots){
                                textSearch = textSearch.replace(/\./g, '');
                            }
                            if(noSpaces){
                                textSearch = trim(textSearch);
                            }
                            if(noDoubleSpaces){
                                textSearch = __trim(textSearch);
                            }


                            if(hasWild && inputValue.includes("*")){
                                cond.operator = Conditionals.OPERATORS.LIKE;
                                textSearch = textSearch.replace('*', '')
                            } else if(hasWild) {
                                cond.operator = Conditionals.OPERATORS.LIKE;
                            } else {
                                cond.operator = Conditionals.OPERATORS.EQUAL;
                            }

                           return getData(urlStr, textSearch, cond, defaultConditions).then(response => {
                               const fieldName = conditionalOptions && conditionalOptions.fieldName ? conditionalOptions.fieldName : 'name';
                               const options = arrayToOptionsByFieldName(response.data, fieldName);
                               //options.unshift(getEmptyOptions());
                               return options
                           })

                        }}
                    />
                </div>
                {feedback}
                {help}
            </FormGroup>
        );
    }
};


export default InputAsyncSearchField;
