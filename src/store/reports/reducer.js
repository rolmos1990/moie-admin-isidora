import {
    GENERATE_REPORT,
    GENERATE_REPORT_FAILED,
    GENERATE_REPORT_RESTART,
    GENERATE_REPORT_SUCCESS,
    GET_REPORT_DASHBOARD,
    GET_REPORT_DASHBOARD_FAILED,
    GET_REPORT_DASHBOARD_SUCCESS
} from "./actionTypes";

const initialState = {
    error: "",
    loading: false,
    dashboard: {}
}

const report = (state = initialState, action) => {
    switch (action.type) {
        case GET_REPORT_DASHBOARD:
            return {
                ...state,
                loading: true,
            }
        case GET_REPORT_DASHBOARD_SUCCESS:
            return {
                ...state,
                error: null,
                loading: false,
                dashboard: action.payload
            }
        case GET_REPORT_DASHBOARD_FAILED:
            return {
                ...state,
                error: action.payload,
                loading: false,
            }
        case GENERATE_REPORT:
            return {
                ...state,
                loading: true,
            }
        case GENERATE_REPORT_SUCCESS:
            return {
                ...state,
                error: null,
                loading: false,
            }
        case GENERATE_REPORT_FAILED:
            return {
                ...state,
                error: action.payload,
                loading: false,
            }
        case GENERATE_REPORT_RESTART:
            return {
                ...state,
                error: null,
                loading: false,
            }
        default:
            state = {...state}
            break
    }
    return state
}

export default report
