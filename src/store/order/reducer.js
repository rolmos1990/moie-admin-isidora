import {
    CONCILIATION_FAILED,
    CONCILIATION_REQUEST,
    CONCILIATION_SUCCESS,
    CONFIRM_CONCILIATION_FAILED,
    CONFIRM_CONCILIATION_REQUEST,
    CONFIRM_CONCILIATION_RESTART,
    CONFIRM_CONCILIATION_SUCCESS,
    CUSTOM_ORDER_FAILED,
    CUSTOM_ORDER_SUCCESS,
    DO_BATCH_REQUEST,
    GET_DELIVERY_METHODS,
    GET_DELIVERY_METHODS_FAILED,
    GET_DELIVERY_METHODS_SUCCESS,
    GET_DELIVERY_QUOTE,
    GET_DELIVERY_QUOTE_FAILED,
    GET_DELIVERY_QUOTE_SUCCESS,
    GET_HISTORIC_ORDER,
    GET_HISTORIC_ORDER_FAILED,
    GET_HISTORIC_ORDER_SUCCESS, GET_LINK_PAYMENT, GET_LINK_PAYMENT_FAILED, GET_LINK_PAYMENT_SUCCESS,
    GET_ORDER,
    GET_ORDER_FAILED,
    GET_ORDER_RESTART,
    GET_ORDER_SUCCESS,
    GET_ORDERS,
    GET_ORDERS_FAILED,
    GET_ORDERS_OFFICE,
    GET_ORDERS_OFFICE_FAILED,
    GET_ORDERS_OFFICE_SUCCESS,
    GET_ORDERS_SUCCESS, NEXT_STATUS_ORDER,
    PRINT_BATCH_REQUEST,
    PRINT_BATCH_REQUEST_FAILED,
    PRINT_BATCH_REQUEST_SUCCESS,
    PRINT_ORDER,
    REFRESH_DELIVERY_ORDER,
    REFRESH_DELIVERY_ORDER_FAILED,
    REFRESH_DELIVERY_ORDER_SUCCESS,
    REFRESH_ORDER,
    REGISTER_ORDER,
    REGISTER_ORDER_FAILED,
    REGISTER_ORDER_SUCCESS,
    RESET_BATCH_REQUEST,
    RESET_CAR,
    RESET_ORDER,
    RESUME_ORDER,
    SYNC_DELIVERY_ORDER,
    SYNC_DELIVERY_ORDER_FAILED,
    SYNC_DELIVERY_ORDER_SUCCESS,
    UPDATE_CAR,
    UPDATE_ORDER,
    UPDATE_ORDER_FAILED, UPDATE_ORDER_PRODUCTS,
    UPDATE_ORDER_SUCCESS
} from "./actionTypes";

const initialState = {
    error: "",
    loading: false,
    meta: {},
    orders: [],
    ordersByOffice: [],
    linkPayment: false,
    order: {},
    historic: [],
    refresh: null,
    deliveryMethods: {
        data: [],
        loading: false,
        error: "",
    },
    deliveryQuote: {
        data: {},
        loading: false,
        error: "",
    },
    car: {
        customer: {},
        products: [],
        deliveryOptions: {},
        summary: {},
        reset: true,
        isEdit: false,
        orderId: null,
    },
    custom:{
        data: {},
        meta: {},
        loading: false
    },
    batchRequest: {
        batch: null,
        error: null,
        meta: {},
        conditionals: null,
        loading: false,
        doRequest: false
    },
    conciliation: {
        error: null,
        loading: false,
        success: false
    },
    reset: false
}

const order = (state = initialState, action) => {
    switch (action.type) {
        case RESET_ORDER:
            return {
                ...initialState,
                reset: !state.reset
            }
        case RESET_CAR:
            return {
                ...state,
                car: {
                    customer: {},
                    products: [],
                    deliveryOptions: {},
                    summary: {},
                    reset: true
                },
            }
        case UPDATE_CAR:
            return {
                ...state,
                car: {
                    ...state.car,
                    ...action.payload,
                    reset: false
                }
            }
        case GET_ORDERS:
            return {
                ...state,
                loading: true
            }
        case GET_ORDERS_FAILED:
            return {
                ...state,
                error: action.payload,
                loading: true,
            }
        case GET_ORDERS_SUCCESS:
            return {
                ...state,
                orders: action.payload,
                meta: action.meta,
                loading: false,
            }
        case GET_ORDERS_OFFICE:
            return {
                ...state,
                ordersByOffice: [],
                loading: true,
            }
        case GET_ORDERS_OFFICE_FAILED:
            return {
                ...state,
                error: action.payload,
                loading: true,
            }
        case GET_ORDERS_OFFICE_SUCCESS:
            return {
                ...state,
                ordersByOffice: action.payload,
                meta: action.meta,
                loading: false,
            }
        case GET_ORDER_RESTART:
            return {
                ...state,
                order: null,
                loading: false,
            }
        case GET_ORDER:
            return {
                ...state,
                loading: true,
            }
        case GET_ORDER_SUCCESS:
            return {
                ...state,
                order: action.payload,
                loading: false,
            }
        case GET_ORDER_FAILED:
            return {
                ...state,
                loading: false,
            }
        case REGISTER_ORDER:
            state = {
                ...state,
                loading: true,
            }
            break
        case REGISTER_ORDER_SUCCESS:
            state = {
                ...state,
                loading: false,
                order: action.payload
            }
            break
        case REGISTER_ORDER_FAILED:
            state = {
                ...state,
                loading: false,
                error: action.payload
            }
            break
        case NEXT_STATUS_ORDER:
            state = {
                ...state,
                loading: true
            }
            break;
        case UPDATE_ORDER:
            state = {
                ...state,
                loading: true,
            }
            break
        case UPDATE_ORDER_SUCCESS:
            state = {
                ...state,
                loading: false,
                refresh: !state.refresh
            }
            break
        case UPDATE_ORDER_FAILED:
            state = {
                ...state,
                loading: false,
                error: action.payload
            }
            break
        case GET_DELIVERY_METHODS:
            return {
                ...state,
                deliveryMethods: {
                    ...state.deliveryMethods,
                    loading: true,
                }
            }
        case GET_DELIVERY_METHODS_SUCCESS:
            return {
                ...state,
                deliveryMethods: {
                    ...state.deliveryMethods,
                    data: action.payload,
                    loading: false,
                }
            }
        case GET_DELIVERY_METHODS_FAILED:
            return {
                ...state,
                deliveryMethods: {
                    ...state.deliveryMethods,
                    error: action.payload,
                    loading: false,
                }
            }
        case GET_DELIVERY_QUOTE:
            return {
                ...state,
                deliveryQuote: {
                    ...state.deliveryQuote,
                    loading: true,
                }
            }
        case GET_DELIVERY_QUOTE_SUCCESS:
            return {
                ...state,
                deliveryQuote: {
                    ...state.deliveryQuote,
                    data: action.payload,
                    loading: false,
                }
            }
        case GET_DELIVERY_QUOTE_FAILED:
            return {
                ...state,
                deliveryQuote: {
                    ...state.deliveryQuote,
                    error: action.payload,
                    loading: false,
                }
            }
        case RESUME_ORDER:
            return {
                ...state,
                custom:{
                    ...state.custom,
                    loading:true
                }
            }
        case PRINT_ORDER:
            return {
                ...state,
                custom:{
                    ...state.custom,
                    loading:true
                }
            }
        case CUSTOM_ORDER_FAILED:
            return {
                ...state,
                custom: {
                    ...state.custom,
                    error: action.payload,
                    loading: false,
                }
            }
        case CUSTOM_ORDER_SUCCESS:
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
        case DO_BATCH_REQUEST:
            return {
                ...state,
                batchRequest: {
                    ...state.batchRequest,
                    conditionals: action.conditionals,
                    doRequest: true
                }
            }
        case PRINT_BATCH_REQUEST:
            return {
                ...state,
                batchRequest: {
                    ...state.batchRequest,
                    conditionals: action.conditionals,
                    doRequest: false,
                    loading: true
                },
                error: null
            }
        case PRINT_BATCH_REQUEST_SUCCESS:
            return {
                ...state,
                batchRequest: {
                    ...state.batchRequest,
                    meta: action.meta,
                    batch: action.data,
                    loading: false
                }
            }
        case PRINT_BATCH_REQUEST_FAILED:
            return {
                ...state,
                batchRequest: {
                    ...state.batchRequest,
                    error: action.error +" - "+ Date.now(),
                    loading: false
                },
                error: action.error
            }
        case RESET_BATCH_REQUEST:
            return {
                ...state,
                batchRequest: {
                    ...state.batchRequest,
                    batch: null,
                    meta: {},
                    error: null,
                    conditionals: null,
                    doRequest: false,
                    loading: false
                }
            }
        case REFRESH_ORDER:
            return {
                ...state,
                refresh: !state.refresh,
            }
        case CONCILIATION_REQUEST:
            return {
                ...state,
                conciliation: {
                    ...state.conciliation,
                    error: null,
                    loading: true,
                    success: false
                }
            }
        case CONCILIATION_SUCCESS:
            return {
                ...state,
                conciliation: {
                    ...state.conciliation,
                    error: null,
                    loading: false,
                    success: true
                }
            }
        case CONCILIATION_FAILED:
            return {
                ...state,
                conciliation: {
                    ...state.conciliation,
                    error: action.error,
                    loading: false,
                    success: false
                }
            }
        case CONFIRM_CONCILIATION_REQUEST:
            return {
                ...state,
                conciliation: {
                    ...state.conciliation,
                    error: null,
                    loading: true,
                    success: false
                }
            }
        case CONFIRM_CONCILIATION_SUCCESS:
            return {
                ...state,
                conciliation: {
                    ...state.conciliation,
                    error: null,
                    loading: false,
                    success: true
                }
            }
        case CONFIRM_CONCILIATION_FAILED:
            return {
                ...state,
                conciliation: {
                    ...state.conciliation,
                    error: action.error,
                    loading: false,
                    success: false
                }
            }
        case CONFIRM_CONCILIATION_RESTART:
            return {
                ...state,
                conciliation: {
                    ...state.conciliation,
                    error: null,
                    loading: false,
                    success: false
                }
            }
        case GET_HISTORIC_ORDER:
            return {
                ...state,
                historic: []
            }
        case GET_HISTORIC_ORDER_SUCCESS:
            return {
                ...state,
                historic: action.payload
            }
        case GET_HISTORIC_ORDER_FAILED:
            return {
                ...state,
                historic: []
            }
        case SYNC_DELIVERY_ORDER:
            return {
                ...state,
                loading: true
            }
        case SYNC_DELIVERY_ORDER_SUCCESS:
            return {
                ...state,
                loading: false,
                refresh: !state.refresh
            }
        case SYNC_DELIVERY_ORDER_FAILED:
            return {
                ...state,
                loading: false,
            }
        case REFRESH_DELIVERY_ORDER:
            return {
                ...state,
                loading: true
            }
        case REFRESH_DELIVERY_ORDER_SUCCESS:
            return {
                ...state,
                loading: false,
                refresh: !state.refresh
            }
        case REFRESH_DELIVERY_ORDER_FAILED:
            return {
                ...state,
                loading: false,
            }
        case UPDATE_ORDER_PRODUCTS:
            return {
                ...state,
                error: null
            }
        case GET_LINK_PAYMENT:
            return {
                ...state,
                linkPayment: false
            }
        case GET_LINK_PAYMENT_SUCCESS:
            return {
                ...state,
                linkPayment: action.data
            }
        case GET_LINK_PAYMENT_FAILED:
            return {
                ...state,
                linkPayment: false
            }
        default:
            state = {...state, error: null}
            break
    }
    return state
}

export default order
