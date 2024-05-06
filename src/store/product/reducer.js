import {
    GET_PRODUCT,
    GET_PRODUCT_FAILED,
    GET_PRODUCT_SUCCESS,
    GET_PRODUCTS,
    GET_PRODUCTS_FAILED,
    GET_PRODUCTS_SUCCESS,
    QUERY_PRODUCTS,
    QUERY_PRODUCTS_FAILED,
    QUERY_PRODUCTS_SUCCESS,
    REGISTER_PRODUCT,
    REGISTER_PRODUCT_FAILED,
    REGISTER_PRODUCT_SUCCESS,
    RESET_PRODUCT,
    UPDATE_PRODUCT,
    UPDATE_PRODUCT_FAILED,
    UPDATE_PRODUCT_SUCCESS,
    ORDER_PRODUCT, ORDER_PRODUCT_SUCCESS, ORDER_PRODUCT_FAILED, CLEAR_PRODUCTS,
} from "./actionTypes";

const initialState = {
    error: "",
    loading: false,
    meta: {},
    products: [],
    product: {},
    custom: {
        loading: false,
        meta: {},
        data: {}
    },
    refresh: false
}

const product = (state = initialState, action) => {
    switch (action.type) {
        case RESET_PRODUCT:
            return {
                ...initialState,
                products: []
            }
        case CLEAR_PRODUCTS:
            return {
                ...state,
                products: []
            }
        case GET_PRODUCTS:
            return {
                ...state,
                loading: true,
            }
        case GET_PRODUCTS_FAILED:
            return {
                ...state,
                error: action.payload,
                loading: false,
            }
        case GET_PRODUCTS_SUCCESS:
            return {
                ...state,
                products: action.payload,
                meta: action.meta,
                loading: false,
            }
        case QUERY_PRODUCTS:
            return {
                ...state,
                custom: {
                    ...state.custom,
                    loading: true
                }
            }
        case QUERY_PRODUCTS_FAILED:
            return {
                ...state,
                custom: {
                    ...state.custom,
                    error: action.payload,
                    loading: false,
                }
            }
        case QUERY_PRODUCTS_SUCCESS:
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
        case GET_PRODUCT:
            return {
                ...state,
                refresh: false,
                loading: true,
            }
        case GET_PRODUCT_SUCCESS:
            return {
                ...state,
                product: action.payload,
                loading: false,
            }
        case GET_PRODUCT_FAILED:
            return {
                ...state,
                loading: false,
            }
        case REGISTER_PRODUCT:
            state = {
                ...state,
                loading: true,
            }
            break
        case REGISTER_PRODUCT_SUCCESS:
            state = {
                ...state,
                loading: false,
                product: action.payload
            }
            break
        case REGISTER_PRODUCT_FAILED:
            state = {
                ...state,
                loading: false,
            }
            break
        case UPDATE_PRODUCT:
            state = {
                ...state,
                loading: true,
            }
            break
        case UPDATE_PRODUCT_SUCCESS:
            state = {
                ...state,
                refresh: !state.refresh,
                loading: false,
            }
            break
        case UPDATE_PRODUCT_FAILED:
            state = {
                ...state,
                loading: false,
            }
            break
        case ORDER_PRODUCT:
            state = {
                ...state,
                loading: true,
            }
            break
        case ORDER_PRODUCT_SUCCESS:
            state = {
                ...state,
                refresh: !state.refresh,
                loading: false,
            }
            break
        case ORDER_PRODUCT_FAILED:
            state = {
                ...state,
                loading: false,
            }
            break
        default:
            state = {...state}
            break
    }
    return state
}

export default product
