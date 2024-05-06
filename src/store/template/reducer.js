import {
    GET_TEMPLATE, GET_TEMPLATE_CATALOG, GET_TEMPLATE_CATALOG_FAILED, GET_TEMPLATE_CATALOG_SUCCESS,
    GET_TEMPLATE_FAILED,
    GET_TEMPLATE_SUCCESS,
    GET_TEMPLATES,
    GET_TEMPLATES_FAILED,
    GET_TEMPLATES_SUCCESS,
    REGISTER_TEMPLATE,
    REGISTER_TEMPLATE_FAILED,
    REGISTER_TEMPLATE_SUCCESS, RESET_TEMPLATE,
    UPDATE_TEMPLATE, UPDATE_TEMPLATE_FAILED,
    UPDATE_TEMPLATE_SUCCESS
} from "./actionTypes";

const initialState = {
    error: "",
    loading: false,
    meta: {},
    templates: [],
    template: {},
    refresh: false
}

const template = (state = initialState, action) => {
    switch (action.type) {
        case RESET_TEMPLATE:
            return {
                ...initialState
            }
        case GET_TEMPLATES:
            return {
                ...state,
                loading: true,
            }
        case GET_TEMPLATES_FAILED:
            return {
                ...state,
                error: action.payload,
                loading: true,
            }

        case GET_TEMPLATES_SUCCESS:
            return {
                ...state,
                templates: action.payload,
                meta: action.meta,
                loading: false,
            }
        case GET_TEMPLATE:
            return {
                ...state,
                loading: true,
            }
        case GET_TEMPLATE_SUCCESS:
            return {
                ...state,
                template: action.payload,
                loading: false,
            }
        case GET_TEMPLATE_FAILED:
            return {
                ...state,
                loading: false,
            }
        case REGISTER_TEMPLATE:
            state = {
                ...state,
                loading: true,
            }
            break
        case REGISTER_TEMPLATE_SUCCESS:
            state = {
                ...state,
                loading: false,
            }
            break
        case REGISTER_TEMPLATE_FAILED:
            state = {
                ...state,
                loading: false,
            }
            break
        case UPDATE_TEMPLATE:
            state = {
                ...state,
                loading: true,
            }
            break
        case UPDATE_TEMPLATE_SUCCESS:
            state = {
                ...state,
                loading: false,
            }
            break
        case UPDATE_TEMPLATE_FAILED:
            state = {
                ...state,
                loading: false,
            }
            break
        case GET_TEMPLATE_CATALOG:
            return {
                ...state,
                loading: true,
            }
        case GET_TEMPLATE_CATALOG_FAILED:
            return {
                ...state,
                error: action.payload,
                loading: true,
            }

        case GET_TEMPLATE_CATALOG_SUCCESS:
            return {
                ...state,
                templatesCatalog: action.payload,
                meta: action.meta,
                loading: false,
            }
            break
        default:
            state = { ...state }
            break
    }
    return state
}

export default template
