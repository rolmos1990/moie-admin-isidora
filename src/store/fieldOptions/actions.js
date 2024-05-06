import {
    GET_FIELD_OPTIONS,
    GET_FIELD_OPTIONS_SUCCESS,
    GET_FIELD_OPTIONS_FAILED,
    GET_FIELD_OPTION,
    GET_FIELD_OPTION_SUCCESS,
    GET_FIELD_OPTION_FAILED,
    REGISTER_FIELD_OPTION,
    REGISTER_FIELD_OPTION_SUCCESS,
    REGISTER_FIELD_OPTION_FAILED,
    UPDATE_FIELD_OPTION,
    UPDATE_FIELD_OPTION_SUCCESS,
    UPDATE_FIELD_OPTION_FAILED, DELETE_FIELD_OPTION, DELETE_FIELD_OPTION_SUCCESS, DELETE_FIELD_OPTION_FAILED,
} from "./actionTypes";
import Conditionals from "../../common/conditionals";

export const getFieldOptions = (conditional, limit, offset) => ({
    type: GET_FIELD_OPTIONS,
    conditional: conditional,
    limit: limit,
    offset: offset
})

export const getFieldOptionByGroups = (groups, limit, offset) => {
    const conditions = new Conditionals.Condition;
    if(groups.length > 0) conditions.add("groups", groups.join("::"), Conditionals.OPERATORS.IN);
    return getFieldOptions(conditions.all(), limit, offset);
}

export const getFieldOptionByGroup = (group, limit, offset) => {
    const conditions = new Conditionals.Condition;
    conditions.add("groups", group, Conditionals.OPERATORS.EQUAL);
    return getFieldOptions(conditions.all(), limit, offset);
}

export const getProductFieldOption = (limit, offset) => {
    return getFieldOptionByName("PRODUCT", limit, offset);
}

export const getFieldOptionByName = (name, limit, offset) => {
    const conditions = new Conditionals.Condition;
    conditions.add("name", name, Conditionals.OPERATORS.EQUAL);
    return getFieldOptions(conditions.all(), limit, offset);
}

export const getFieldOptionsSuccess = (data, meta) => ({
    type: GET_FIELD_OPTIONS_SUCCESS,
    meta: meta,
    payload: data,
})

export const getFieldOptionsFailed = error => ({
    type: GET_FIELD_OPTIONS_FAILED,
    payload: error,
})

export const getFieldOption = id => ({
    type: GET_FIELD_OPTION,
    id
})

export const getFieldOptionSuccess = data => ({
    type: GET_FIELD_OPTION_SUCCESS,
    payload: data,
})

export const getFieldOptionFailed = error => ({
    type: GET_FIELD_OPTION_FAILED,
    payload: error,
})

export const registerFieldOption = (data, history) => {
    return {
        type: REGISTER_FIELD_OPTION,
        payload: { data, history },
    }
}

export const registerFieldOptionSuccess = data => {
    return {
        type: REGISTER_FIELD_OPTION_SUCCESS,
        payload: data,
    }
}


export const registerFieldOptionFailed = data => {
    return {
        type: REGISTER_FIELD_OPTION_FAILED,
        payload: data,
    }
}

export const updateFieldOption = (id, data, history) => {
    return {
        type: UPDATE_FIELD_OPTION,
        payload: { id, data, history },
    }
}
export const updateFieldOptionSuccess = data => {
    return {
        type: UPDATE_FIELD_OPTION_SUCCESS,
        payload: data,
    }
}
export const updateFieldOptionFail = error => {
    return {
        type: UPDATE_FIELD_OPTION_FAILED,
        payload: error,
    }
}

export const deleteFieldOption = (id, history) => {
    return {
        type: DELETE_FIELD_OPTION,
        payload: { id, history },
    }
}
export const deleteFieldOptionSuccess = data => {
    return {
        type: DELETE_FIELD_OPTION_SUCCESS,
        payload: data,
    }
}
export const deleteFieldOptionFail = error => {
    return {
        type: DELETE_FIELD_OPTION_FAILED,
        payload: error,
    }
}
