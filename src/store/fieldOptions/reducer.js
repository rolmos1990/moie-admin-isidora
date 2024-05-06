import {
    DELETE_FIELD_OPTION, DELETE_FIELD_OPTION_FAILED, DELETE_FIELD_OPTION_SUCCESS,
    GET_FIELD_OPTION,
    GET_FIELD_OPTION_FAILED,
    GET_FIELD_OPTION_SUCCESS,
    GET_FIELD_OPTIONS,
    GET_FIELD_OPTIONS_FAILED,
    GET_FIELD_OPTIONS_SUCCESS,
    REGISTER_FIELD_OPTION,
    REGISTER_FIELD_OPTION_FAILED,
    REGISTER_FIELD_OPTION_SUCCESS,
    UPDATE_FIELD_OPTION, UPDATE_FIELD_OPTION_FAILED,
    UPDATE_FIELD_OPTION_SUCCESS
} from "./actionTypes";

const initialState = {
    error: "",
    loading: false,
    meta: {},
    fieldOptions: [],
    fieldOption: {},
    refresh: false
}

const fieldOptions = (state = initialState, action) => {
    switch (action.type) {
        case GET_FIELD_OPTIONS:
            return {
                ...state,
                loading: true,
                refresh: false
            }
        case GET_FIELD_OPTIONS_FAILED:
            return {
                ...state,
                error: action.payload,
                loading: true,
            }

        case GET_FIELD_OPTIONS_SUCCESS:
            return {
                ...state,
                fieldOptions: action.payload,
                meta: action.meta,
                loading: false,
            }
        case GET_FIELD_OPTION:
            return {
                ...state,
                loading: true,
            }
        case GET_FIELD_OPTION_SUCCESS:
            return {
                ...state,
                fieldOption: action.payload,
                loading: false,
            }
        case GET_FIELD_OPTION_FAILED:
            return {
                ...state,
                loading: false,
            }
        case REGISTER_FIELD_OPTION:
            state = {
                ...state,
                loading: true,
            }
            break
        case REGISTER_FIELD_OPTION_SUCCESS:
            state = {
                ...state,
                loading: false,
                refresh: true
            }
            break
        case REGISTER_FIELD_OPTION_FAILED:
            state = {
                ...state,
                loading: false,
            }
            break
        case UPDATE_FIELD_OPTION:
            state = {
                ...state,
                loading: true,
            }
            break
        case UPDATE_FIELD_OPTION_SUCCESS:
            state = {
                ...state,
                loading: false,
                refresh: true
            }
            break
        case UPDATE_FIELD_OPTION_FAILED:
            state = {
                ...state,
                loading: false,
            }
            break
        case DELETE_FIELD_OPTION:
            state = {
                ...state,
                loading: true,
            }
            break
        case DELETE_FIELD_OPTION_SUCCESS:
            state = {
                ...state,
                loading: false,
                refresh: true
            }
            break
        case DELETE_FIELD_OPTION_FAILED:
            state = {
                ...state,
                loading: false,
            }
            break
        default:
            state = { ...state }
            break
    }
    return state
}

export default fieldOptions
