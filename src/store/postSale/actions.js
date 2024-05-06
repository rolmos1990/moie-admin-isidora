import {
    CUSTOM_POST_SALE_FAILED,
    CUSTOM_POST_SALE_SUCCESS,
    GENERATE_REPORT_FAILED,
    GENERATE_REPORT_REQUEST,
    GENERATE_REPORT_RESTART,
    GENERATE_REPORT_SUCCESS,
    GET_POST_SALE,
    GET_POST_SALE_FAILED,
    GET_POST_SALE_SUCCESS,
    GET_POST_SALES,
    GET_POST_SALES_FAILED,
    GET_POST_SALES_SUCCESS,
    NEXT_STATUS_POST_SALE,
    REFRESH_POST_SALE,
    REGISTER_POST_SALE,
    REGISTER_POST_SALE_SUCCESS,
    UPDATE_POST_SALE,
    UPDATE_POST_SALE_FAILED,
    UPDATE_POST_SALE_SUCCESS,
} from "./actionTypes";

export const getOrders = (conditional, limit, offset) => ({
    type: GET_POST_SALES,
    conditional: conditional,
    limit: limit,
    offset: offset
})

export const getOrdersSuccess = (data, meta) => ({
    type: GET_POST_SALES_SUCCESS,
    meta: meta,
    payload: data,
})

export const getOrdersFailed = error => ({
    type: GET_POST_SALES_FAILED,
    payload: error,
})

export const getOrder = id => ({
    type: GET_POST_SALE,
    id
})

export const getOrderSuccess = data => ({
    type: GET_POST_SALE_SUCCESS,
    payload: data,
})

export const getOrderFailed = error => ({
    type: GET_POST_SALE_FAILED,
    payload: error,
})

export const nextStatusOrder = (data, history) => {
    return {
        type: NEXT_STATUS_POST_SALE,
        payload: { data, history },
    }
}
export const customOrderSuccess = (data, node) => {
    return {
        type: CUSTOM_POST_SALE_SUCCESS,
        payload: data,
        node: node,
    }
}
export const customOrderFailed = data => {
    return {
        type: CUSTOM_POST_SALE_FAILED,
        payload: data,
    }
}

export const registerOrder = (data, history) => {
    return {
        type: REGISTER_POST_SALE,
        payload: { data, history },
    }
}

export const registerOrderSuccess = data => {
    return {
        type: REGISTER_POST_SALE_SUCCESS,
        payload: data.order,
    }
}


export const registerOrderFailed = data => {
    return {
        type: REGISTER_POST_SALE_SUCCESS,
        payload: data,
    }
}

export const updateOrder = (id, data, history) => {
    return {
        type: UPDATE_POST_SALE,
        payload: { id, data, history },
    }
}

export const updateOrderSuccess = data => {
    return {
        type: UPDATE_POST_SALE_SUCCESS,
        payload: data,
    }
}
export const updateOrderFail = error => {
    return {
        type: UPDATE_POST_SALE_FAILED,
        payload: error,
    }
}


export const refreshOrders = () => {
    return {
        type: REFRESH_POST_SALE
    }
}

export const generateReportRestart = () => {
    return {
        type: GENERATE_REPORT_RESTART
    }
}
export const generateReport = (data) => {
    return {
        type: GENERATE_REPORT_REQUEST,
        data
    }
}
export const generateReportSuccess = (data) => {
    return {
        type: GENERATE_REPORT_SUCCESS,
        data
    }
}
export const generateReportFailed = (error) => {
    return {
        type: GENERATE_REPORT_FAILED,
        error
    }
}