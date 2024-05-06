import {
    BILL_LIST_REFRESH,
    CONFIRM_BILL,
    CONFIRM_BILL_FAILED,
    CONFIRM_BILL_SUCCESS,
    DELETE_BILL,
    DELETE_BILL_FAILED,
    DELETE_BILL_SUCCESS,
    GENERATE_CREDIT_NOTE,
    GENERATE_CREDIT_NOTE_FAILED,
    GENERATE_CREDIT_NOTE_SUCCESS,
    GENERATE_REPORT_FAILED,
    GENERATE_REPORT_REQUEST,
    GENERATE_REPORT_RESTART,
    GENERATE_REPORT_SUCCESS,
    GET_BILL,
    GET_BILL_FAILED,
    GET_BILL_SUCCESS,
    GET_BILLS,
    GET_BILLS_FAILED,
    GET_BILLS_SUCCESS,
    QUERY_BILLS,
    QUERY_BILLS_FAILED,
    QUERY_BILLS_SUCCESS,
    REGISTER_BILL,
    REGISTER_BILL_FAILED,
    REGISTER_BILL_SUCCESS,
    RESET_BILL,
    UPDATE_BILL,
    UPDATE_BILL_FAILED,
    UPDATE_BILL_SUCCESS
} from "./actionTypes";

const initialState = {
    error: "",
    loading: false,
    meta: {},
    bills: [],
    bill: {},
    custom: {
        loading: false,
        meta: {},
        data: {}
    },
    creditNote: {
        loading: false,
        data: {}
    },
    report: {
        loading: false,
        error: null,
        success: false,
    },
    refresh: false
}

const bill = (state = initialState, action) => {
    switch (action.type) {
        case RESET_BILL:
            return {
                ...initialState
            }
        case GET_BILLS:
            return {
                ...state,
                loading: true,
            }
        case GET_BILLS_FAILED:
            return {
                ...state,
                error: action.payload,
                loading: false,
            }
        case GET_BILLS_SUCCESS:
            return {
                ...state,
                bills: action.payload,
                meta: action.meta,
                loading: false,
            }
        case QUERY_BILLS:
            return {
                ...state,
                custom: {
                    ...state.custom,
                    loading: true
                }
            }
        case QUERY_BILLS_FAILED:
            return {
                ...state,
                custom: {
                    ...state.custom,
                    error: action.payload,
                    loading: false,
                }
            }
        case QUERY_BILLS_SUCCESS:
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
        case GET_BILL:
            return {
                ...state,
                refresh: false,
                loading: true,
            }
        case GET_BILL_SUCCESS:
            return {
                ...state,
                bill: action.payload,
                loading: false,
            }
        case GET_BILL_FAILED:
            return {
                ...state,
                loading: false,
            }
        case REGISTER_BILL:
            state = {
                ...state,
                loading: true,
            }
            break
        case REGISTER_BILL_SUCCESS:
            state = {
                ...state,
                loading: false,
                bill: action.payload
            }
            break
        case REGISTER_BILL_FAILED:
            state = {
                ...state,
                loading: false,
            }
            break
        case UPDATE_BILL:
            state = {
                ...state,
                loading: true,
            }
            break
        case UPDATE_BILL_SUCCESS:
            state = {
                ...state,
                refresh: !state.refresh,
                loading: false,
            }
            break
        case UPDATE_BILL_FAILED:
            state = {
                ...state,
                loading: false,
            }
            break
        case DELETE_BILL:
            state = {
                ...state,
                loading: true,
            }
            break
        case DELETE_BILL_SUCCESS:
            state = {
                ...state,
                loading: false,
                refresh: !state.refresh
            }
            break
        case DELETE_BILL_FAILED:
            state = {
                ...state,
                loading: false,
            }
            break
        case CONFIRM_BILL:
            state = {
                ...state,
                loading: true,
            }
            break
        case CONFIRM_BILL_SUCCESS:
            state = {
                ...state,
                loading: false,
                refresh: !state.refresh
            }
            break
        case CONFIRM_BILL_FAILED:
            state = {
                ...state,
                loading: false,
            }
            break
        case GENERATE_CREDIT_NOTE:
            state = {
                ...state,
                creditNote: {
                    ...state.creditNote,
                    loading: true,
                },
            }
            break
        case GENERATE_CREDIT_NOTE_SUCCESS:
            state = {
                ...state,
                refresh: !state.refresh,
                creditNote: {
                    ...state.creditNote,
                    loading: false,
                },
            }
            break
        case GENERATE_CREDIT_NOTE_FAILED:
            state = {
                ...state,
                creditNote: {
                    ...state.creditNote,
                    loading: false,
                },
            }
            break
        case BILL_LIST_REFRESH:
            state = {
                ...state,
                refresh: !state.refresh,
            }
            break
        case GENERATE_REPORT_RESTART:
            state = {
                ...state,
                report: {
                    ...state.report,
                    loading: false,
                    error: null,
                    success: false,
                },
            }
            break
        case GENERATE_REPORT_REQUEST:
            state = {
                ...state,
                report: {
                    ...state.report,
                    loading: true,
                    error: null,
                    success: false,
                },
            }
            break
        case GENERATE_REPORT_SUCCESS:
            state = {
                ...state,
                report: {
                    ...state.report,
                    loading: false,
                    error: null,
                    success: true,
                },
            }
            break
        case GENERATE_REPORT_FAILED:
            state = {
                ...state,
                report: {
                    ...state.report,
                    loading: false,
                    error: action.error,
                    success: false,
                },
            }
            break
        default:
            state = {...state}
            break
    }
    return state
}

export default bill
