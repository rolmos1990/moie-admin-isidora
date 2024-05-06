import {Mention, MentionsInput} from "react-mentions";
import {mentionStyle, mentionsInputStyle} from "./mentionStyles";
import React from "react";

const MultiMention = ({placeholder, value, data, onChange, onAdd}) => (
    <MentionsInput
        value={value}
        placeholder={placeholder}
        onChange={onChange}
        style={mentionsInputStyle}
        a11ySuggestionsListLabel={"Suggested mentions"}
    >
        <Mention
            markup="{{__display__}}"
            trigger="@"
            data={data}
            renderSuggestion={(suggestion, search, highlightedDisplay, index, focused) => {
                return (<div className={`user ${focused ? 'focused' : ''}`}>{highlightedDisplay}</div>)
            }}
            onAdd={onAdd}
            style={mentionStyle}
        />
    </MentionsInput>
)

export default MultiMention;