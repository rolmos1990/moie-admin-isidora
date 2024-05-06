import React, {useEffect, useState} from "react";
import PropTypes from "prop-types";
import {AvBaseInput} from "availity-reactstrap-validation";
import messages from "./messages";
import {FormGroup, FormText} from "reactstrap";
import theme from './scss/autocomplete.scss';
import Autosuggest from 'react-autosuggest';

const Autocomplete = (props) => {
    const [selected, setSelected] = useState('');
    const [suggestions, setSuggestions] = useState([]);
    const {defaultValue, options} = props;

    const getSuggestions = value => {
        const inputValue = value.trim().toLowerCase();
        if(options.length <= 0){
            return;
        }
        return inputValue.length === 0 ? [] : (options || []).filter(item => {
                return item.name.toLowerCase().includes(inputValue)
            }
        );
    };

    const getSuggestionValue = suggestion => suggestion.name;

    const renderSuggestion = suggestion => (
        <div className="font-size-12">
            {suggestion.name}
        </div>
    )
    const onSuggestionSelected = (val) => {
        setSelected(val.currentTarget.textContent)
        props.onChange && props.onChange(val.currentTarget.textContent || '')
    }

    useEffect(() => {
        setSelected(defaultValue || '');
    }, [defaultValue]);

    const onSuggestionsFetchRequested = ({value}) => {
        setSuggestions(getSuggestions(value))
    };

    // Autosuggest will call this function every time you need to clear suggestions.
    const onSuggestionsClearRequested = () => {
        setSuggestions([])
    };

    const onChange = (e) => {
        props.onChange(e.target.value || '');
        setSelected(e.target.value || '');
    }

    return (
        <AvAutoSuggestInput
            validate={{
                required: {value: props.required === true, errorMessage: messages.required}
            }}
            name={props.name}
            value={selected}
            placeholder={props.placeholder}
            disabled={props.disabled}
            onSuggestionsClearRequested={onSuggestionsClearRequested}
            onSuggestionsFetchRequested={onSuggestionsFetchRequested}
            getSuggestionValue={getSuggestionValue}
            renderSuggestion={renderSuggestion}
            onSuggestionSelected={onSuggestionSelected}
            onChange={onChange}
            suggestions={suggestions || []}
        />
    )
}

Autocomplete.propTypes = {
    name: PropTypes.string,
    placeholder: PropTypes.string,
    onChange: PropTypes.func,
    options: PropTypes.array,
    defaultValue: PropTypes.any,
};

class AvAutoSuggestInput extends AvBaseInput {
    render() {
        const {name, value, onChange, onSuggestionSelected, onSuggestionsFetchRequested, onSuggestionsClearRequested, getSuggestionValue, renderSuggestion, suggestions, placeholder, helpMessage, disabled} = this.props;
        const validation = this.context.FormCtrl.getInputState(this.props.name);
        const feedback = validation.errorMessage ? (<div className="invalid-feedback" style={{display: "block"}}>{validation.errorMessage}</div>) : null;
        const help = helpMessage ? (<FormText>{helpMessage}</FormText>) : null;
        const isInvalid = validation.errorMessage ? "select-is-invalid" : "";

        return (
            <FormGroup className={isInvalid}>
                <div>
                    <Autosuggest
                        name={name}
                        suggestions={suggestions}
                        onSuggestionsFetchRequested={onSuggestionsFetchRequested}
                        onSuggestionsClearRequested={onSuggestionsClearRequested}
                        getSuggestionValue={getSuggestionValue}
                        renderSuggestion={renderSuggestion}
                        onSuggestionSelected={onSuggestionSelected}
                        inputProps={{
                            placeholder: placeholder,
                            value,
                            onChange: onChange,
                        }}
                        theme={{
                            ...theme,
                            input: 'form-control',
                            container: 'react-autosuggest__container',
                            containerOpen: 'react-autosuggest__container--open',
                            inputOpen: 'react-autosuggest__input--open',
                            inputFocused: 'react-autosuggest__input--focused',
                            suggestionsContainer: 'react-autosuggest__suggestions-container',
                            suggestionsContainerOpen: 'react-autosuggest__suggestions-container--open',
                            suggestionsList: 'react-autosuggest__suggestions-list',
                            suggestion: 'react-autosuggest__suggestion',
                            suggestionFirst: 'react-autosuggest__suggestion--first',
                            suggestionHighlighted: 'react-autosuggest__suggestion--highlighted',
                            sectionContainer: 'react-autosuggest__section-container',
                            sectionContainerFirst: 'react-autosuggest__section-container--first',
                            sectionTitle: 'react-autosuggest__section-title'
                        }}
                    />
                </div>
                {feedback}
                {help}
            </FormGroup>
        );
    }
};

export default Autocomplete;
