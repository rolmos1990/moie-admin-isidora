import {
    BILL_CONFIG_LIST_REFRESH,
    DELETE_BILL_CONFIG,
    DELETE_BILL_CONFIG_FAILED,
    DELETE_BILL_CONFIG_SUCCESS,
    GET_BILL_CONFIG,
    GET_BILL_CONFIG_FAILED,
    GET_BILL_CONFIG_SUCCESS,
    GET_BILL_CONFIGS,
    GET_BILL_CONFIGS_FAILED,
    GET_BILL_CONFIGS_SUCCESS,
    QUERY_BILL_CONFIGS,
    QUERY_BILL_CONFIGS_FAILED,
    QUERY_BILL_CONFIGS_SUCCESS,
    REGISTER_BILL_CONFIG,
    REGISTER_BILL_CONFIG_FAILED,
    REGISTER_BILL_CONFIG_SUCCESS,
    RESET_BILL_CONFIG,
    UPDATE_BILL_CONFIG,
    UPDATE_BILL_CONFIG_FAILED,
    UPDATE_BILL_CONFIG_SUCCESS
} from "./actionTypes";

const initialState = {
    error: "",
    loading: false,
    meta: {},
    billConfigs: [],
    billConfig: {},
    custom: {
        loading: false,
        meta: {},
        data: {}
    },
    refresh: false
}

const billConfig = (state = initialState, action) => {
    switch (action.type) {
        case RESET_BILL_CONFIG:
            return {
                ...initialState
            }
        case GET_BILL_CONFIGS:
            return {
                ...state,
                loading: true,
            }
        case GET_BILL_CONFIGS_FAILED:
            return {
                ...state,
                error: action.payload,
                loading: false,
            }
        case GET_BILL_CONFIGS_SUCCESS:
            return {
                ...state,
                billConfigs: action.payload,
                meta: action.meta,
                loading: false,
            }
        case QUERY_BILL_CONFIGS:
            return {
                ...state,
                custom: {
                    ...state.custom,
                    loading: true
                }
            }
        case QUERY_BILL_CONFIGS_FAILED:
            return {
                ...state,
                custom: {
                    ...state.custom,
                    error: action.payload,
                    loading: false,
                }
            }
        case QUERY_BILL_CONFIGS_SUCCESS:
            const data = {...state.custom.data};
            data[action.node] = action.payload;

            return {
                ...state,
                custom: {
                    ...state.custom,
                    data: data,
                    meta: action.meta,
                    loading: false
                }
            }
        case GET_BILL_CONFIG:
            return {
                ...state,
                refresh: false,
                loading: true,
            }
        case GET_BILL_CONFIG_SUCCESS:
            return {
                ...state,
                billConfig: action.payload,
                loading: false,
            }
        case GET_BILL_CONFIG_FAILED:
            return {
                ...state,
                loading: false,
            }
        case REGISTER_BILL_CONFIG:
            state = {
                ...state,
                loading: true,
            }
            break
        case REGISTER_BILL_CONFIG_SUCCESS:
            state = {
                ...state,
                loading: false,
                billConfig: action.payload
            }
            break
        case REGISTER_BILL_CONFIG_FAILED:
            state = {
                ...state,
                loading: false,
            }
            break
        case UPDATE_BILL_CONFIG:
            state = {
                ...state,
                loading: true,
            }
            break
        case UPDATE_BILL_CONFIG_SUCCESS:
            state = {
                ...state,
                refresh: !state.refresh,
                loading: false,
            }
            break
        case UPDATE_BILL_CONFIG_FAILED:
            state = {
                ...state,
                loading: false,
            }
            break
        case DELETE_BILL_CONFIG:
            state = {
                ...state,
                loading: true,
            }
            break
        case DELETE_BILL_CONFIG_SUCCESS:
            state = {
                ...state,
                loading: false,
                refresh: !state.refresh
            }
            break
        case DELETE_BILL_CONFIG_FAILED:
            state = {
                ...state,
                loading: false,
            }
            break
        case BILL_CONFIG_LIST_REFRESH:
            state = {
                ...state,
                refresh: !state.refresh,
            }
            break
        default:
            state = {...state}
            break
    }
    return state
}

export default billConfig
