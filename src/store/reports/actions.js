import {
    GENERATE_REPORT,
    GENERATE_REPORT_FAILED,
    GENERATE_REPORT_RESTART,
    GENERATE_REPORT_SUCCESS,
    GET_REPORT_DASHBOARD, GET_REPORT_DASHBOARD_FAILED, GET_REPORT_DASHBOARD_SUCCESS
} from "./actionTypes";

export const generateReport = (reportType, data) => {
    return {
        type: GENERATE_REPORT,
        reportType,
        data
    }
}
export const generateReportSuccess = () => {
    return {
        type: GENERATE_REPORT_SUCCESS
    }
}
export const generateReportFailed = () => {
    return {
        type: GENERATE_REPORT_FAILED
    }
}
export const generateReportRestart = () => {
    return {
        type: GENERATE_REPORT_RESTART
    }
}

export const getReportDashbord = () => {
    return {
        type: GET_REPORT_DASHBOARD,
    }
}
export const getReportDashbordSuccess = (response) => {
    return {
        type: GET_REPORT_DASHBOARD_SUCCESS,
        payload: response,
    }
}
export const getReportDashbordFailed = () => {
    return {
        type: GET_REPORT_DASHBOARD_FAILED
    }
}
