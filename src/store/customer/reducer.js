import {
    DELETE_CUSTOMER,
    DELETE_CUSTOMER_FAILED,
    DELETE_CUSTOMER_SUCCESS,
    GET_CUSTOMER_FAILED,
    GET_CUSTOMER_SUCCESS,
    REGISTER_CUSTOMER,
    REGISTER_CUSTOMER_FAILED,
    REGISTER_CUSTOMER_SUCCESS,
    UPDATE_CUSTOMER,
    UPDATE_CUSTOMER_FAILED,
    UPDATE_CUSTOMER_SUCCESS,
    GET_CUSTOMERS_FAILED,
    GET_CUSTOMERS_SUCCESS,
    RESET_CUSTOMERS,
    QUERY_CUSTOMERS,
    QUERY_CUSTOMERS_FAILED,
    QUERY_CUSTOMERS_SUCCESS, GET_CUSTOMER, GET_CUSTOMERS, GET_CUSTOMER_REGISTEREDS_SUCCESS

} from "./actionTypes"

const initialState = {
    error: "",
    loading: false,
    meta: {},
    customers: [],
    customer: {},
    refresh: false,
    registereds: {}
}

const customer = (state = initialState, action) => {
    switch (action.type) {
        case RESET_CUSTOMERS:
            return {
                ...state,
                loading: false,
                customer: {},
                meta: {},
                refresh: false
            }
        case GET_CUSTOMERS:
            return {
                ...state,
                loading: true,
            }
        case GET_CUSTOMERS_FAILED:
            return {
                ...state,
                error: action.payload,
                loading: true,
            }

        case GET_CUSTOMERS_SUCCESS:
            return {
                ...state,
                customers: action.payload,
                meta: action.meta,
                loading: false,
            }
        case QUERY_CUSTOMERS:
            return {
                ...state,
                custom: {
                    ...state.custom,
                    loading: true
                }
            }
        case QUERY_CUSTOMERS_FAILED:
            return {
                ...state,
                custom: {
                    ...state.custom,
                    error: action.payload,
                    loading: false,
                }
            }
        case QUERY_CUSTOMERS_SUCCESS:
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
        case GET_CUSTOMER:
            return {
                ...state,
                loading: true,
            }
        case GET_CUSTOMER_SUCCESS:
            return {
                ...state,
                customer: action.payload,
                loading: false,
            }
        case GET_CUSTOMER_FAILED:
            return {
                ...state,
                loading: false,
            }
        case REGISTER_CUSTOMER:
            state = {
                ...state,
                error: false,
                loading: true,
            }
            break
        case REGISTER_CUSTOMER_SUCCESS:
            state = {
                ...state,
                loading: false,
                customer: action.payload
            }
            break
        case REGISTER_CUSTOMER_FAILED:
            state = {
                ...state,
                error: true,
                loading: false,
            }
            break
        case UPDATE_CUSTOMER:
            state = {
                ...state,
                loading: true,
            }
            break
        case UPDATE_CUSTOMER_SUCCESS:
            state = {
                ...state,
                loading: false,
            }
            break
        case UPDATE_CUSTOMER_FAILED:
            state = {
                ...state,
                loading: false,
            }
            break
        case DELETE_CUSTOMER:
            state = {
                ...state,
                loading: true,
            }
            break
        case DELETE_CUSTOMER_SUCCESS:
            state = {
                ...state,
                loading: false,
                refresh: !state.refresh
            }
            break
        case DELETE_CUSTOMER_FAILED:
            state = {
                ...state,
                loading: false,
            }
            break
        case GET_CUSTOMER_REGISTEREDS_SUCCESS:
            state = {
                ...state,
                registereds: action.payload,
            }
            break
        default:
            state = { ...state }
            break
    }
    return state
}

export default customer
