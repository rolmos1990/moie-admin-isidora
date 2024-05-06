import {
    ADD_ORDER_OFFICE,
    ADD_ORDER_OFFICE_FAILED,
    ADD_ORDER_OFFICE_SUCCESS,
    CONFIRM_OFFICE,
    CONFIRM_OFFICE_FAILED,
    CONFIRM_OFFICE_SUCCESS,
    DELETE_OFFICE,
    DELETE_OFFICE_FAILED,
    DELETE_OFFICE_SUCCESS,
    GET_OFFICE,
    GET_OFFICE_FAILED,
    GET_OFFICE_SUCCESS,
    GET_OFFICES,
    GET_OFFICES_FAILED,
    GET_OFFICES_SUCCESS,
    IMPORT_FILE,
    IMPORT_FILE_FAILED,
    IMPORT_FILE_RESET,
    IMPORT_FILE_SUCCESS,
    PRINT_OFFICE_REPORT,
    PRINT_OFFICE_REPORT_FAILED,
    PRINT_OFFICE_REPORT_RESET,
    PRINT_OFFICE_REPORT_SUCCESS,
    QUERY_OFFICES,
    QUERY_OFFICES_FAILED,
    QUERY_OFFICES_SUCCESS,
    REGISTER_OFFICE,
    REGISTER_OFFICE_FAILED,
    REGISTER_OFFICE_SUCCESS,
    RESET_OFFICE,
    UPDATE_OFFICE,
    UPDATE_OFFICE_FAILED,
    UPDATE_OFFICE_SUCCESS
} from "./actionTypes";

const initialState = {
    error: "",
    loading: false,
    meta: {},
    offices: [],
    office: {},
    custom: {
        loading: false,
        meta: {},
        data: {}
    },
    importFile:{
        loading: false,
        refresh: false,
        success: false,
        error: ""
    },
    printReport:{
        loading: false,
        refresh: false,
        success: false,
        data: null,
        error: ""
    },
    refresh: false
}

const office = (state = initialState, action) => {
    switch (action.type) {
        case ADD_ORDER_OFFICE:
            return {
                ...state,
                refresh: state.refresh,
                loading: true,
            }
        case ADD_ORDER_OFFICE_SUCCESS:
            return {
                ...state,
                refresh: !state.refresh,
                loading: false,
            }
        case ADD_ORDER_OFFICE_FAILED:
            return {
                ...state,
                refresh: state.refresh,
                loading: false,
            }
        case RESET_OFFICE:
            return {
                ...initialState
            }
        case GET_OFFICES:
            return {
                ...state,
                loading: true,
            }
        case GET_OFFICES_FAILED:
            return {
                ...state,
                error: action.payload,
                loading: false,
            }
        case GET_OFFICES_SUCCESS:
            return {
                ...state,
                offices: action.payload,
                meta: action.meta,
                loading: false,
            }
        case QUERY_OFFICES:
            return {
                ...state,
                custom: {
                    ...state.custom,
                    loading: true
                }
            }
        case QUERY_OFFICES_FAILED:
            return {
                ...state,
                custom: {
                    ...state.custom,
                    error: action.payload,
                    loading: false,
                }
            }
        case QUERY_OFFICES_SUCCESS:
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
        case GET_OFFICE:
            return {
                ...state,
                refresh: false,
                loading: true,
            }
        case GET_OFFICE_SUCCESS:
            return {
                ...state,
                office: action.payload,
                loading: false,
            }
        case GET_OFFICE_FAILED:
            return {
                ...state,
                loading: false,
            }
        case REGISTER_OFFICE:
            state = {
                ...state,
                loading: true,
            }
            break
        case REGISTER_OFFICE_SUCCESS:
            state = {
                ...state,
                loading: false,
                office: action.payload
            }
            break
        case REGISTER_OFFICE_FAILED:
            state = {
                ...state,
                loading: false,
            }
            break
        case UPDATE_OFFICE:
            state = {
                ...state,
                loading: true,
            }
            break
        case UPDATE_OFFICE_SUCCESS:
            state = {
                ...state,
                refresh: true,
                loading: false,
            }
            break
        case UPDATE_OFFICE_FAILED:
            state = {
                ...state,
                loading: false,
            }
            break
        case DELETE_OFFICE:
            state = {
                ...state,
                loading: true,
            }
            break
        case DELETE_OFFICE_SUCCESS:
            state = {
                ...state,
                loading: false,
                refresh: !state.refresh
            }
            break
        case DELETE_OFFICE_FAILED:
            state = {
                ...state,
                loading: false,
            }
            break
        case CONFIRM_OFFICE:
            state = {
                ...state,
                loading: true,
            }
            break
        case CONFIRM_OFFICE_SUCCESS:
            state = {
                ...state,
                loading: false,
                refresh: !state.refresh
            }
            break
        case CONFIRM_OFFICE_FAILED:
            state = {
                ...state,
                loading: false,
            }
            break
        case IMPORT_FILE_RESET:
            state = {
                ...state,
                importFile: {
                    loading: false,
                    refresh: false,
                    success: false,
                    error: ""
                }
            }
            break
        case IMPORT_FILE:
            state = {
                ...state,
                importFile: {
                    ...state.importFile,
                    loading: true,
                    success: false,
                    error: null
                }
            }
            break
        case IMPORT_FILE_SUCCESS:
            state = {
                ...state,
                importFile: {
                    ...state.importFile,
                    loading: false,
                    success: true,
                    refresh: !state.refresh,
                    error: null
                }
            }
            break
        case IMPORT_FILE_FAILED:
            state = {
                ...state,
                importFile: {
                    ...state.importFile,
                    loading: false,
                    success: false,
                    error: action.payload
                }
            }
            break
        case PRINT_OFFICE_REPORT:
            state = {
                ...state,
                printReport: {
                    ...state.printReport,
                    loading: true,
                    success: false,
                    error: null
                }
            }
            break
        case PRINT_OFFICE_REPORT_SUCCESS:
            state = {
                ...state,
                printReport: {
                    ...state.printReport,
                    loading: false,
                    success: true,
                    data: action.payload,
                    refresh: !state.refresh,
                    error: null
                }
            }
            break
        case PRINT_OFFICE_REPORT_FAILED:
            state = {
                ...state,
                printReport: {
                    ...state.printReport,
                    loading: false,
                    success: false,
                    error: action.payload
                }
            }
            break
        case PRINT_OFFICE_REPORT_RESET:
            state = {
                ...state,
                printReport: {
                    ...state.printReport,
                    loading: false,
                    success: false,
                    data: null
                }
            }
            break
        default:
            state = {...state}
            break
    }
    return state
}

export default office
