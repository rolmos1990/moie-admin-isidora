import {
    CANCELED_STATUS_ORDER, CLEAN_ERROR_MESSAGE,
    CONCILIATION_FAILED,
    CONCILIATION_REQUEST,
    CONCILIATION_SUCCESS,
    CONFIRM_CONCILIATION_FAILED,
    CONFIRM_CONCILIATION_REQUEST,
    CONFIRM_CONCILIATION_RESTART,
    CONFIRM_CONCILIATION_SUCCESS,
    CUSTOM_ORDER_FAILED,
    CUSTOM_ORDER_SUCCESS,
    DO_BATCH_REQUEST, DOWNLOAD_PHOTO,
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
    GET_ORDERS_SUCCESS, MARK_RECEIVED, MARK_RECEIVED_FAILED, MARK_RECEIVED_SUCCESS,
    NEXT_STATUS_ORDER,
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
    UPDATE_ORDER_SUCCESS,
} from "./actionTypes";

export const resetOrder = () => ({
    type: RESET_ORDER,
})

export const getOrders = (conditional, limit, offset, order, ordersFinished = false) => ({
    type: GET_ORDERS,
    conditional: conditional,
    limit: limit,
    offset: offset,
    order: order,
    ordersFinished: ordersFinished
})

export const getOrdersSuccess = (data, meta) => ({
    type: GET_ORDERS_SUCCESS,
    meta: meta,
    payload: data,
})

export const getOrdersFailed = error => ({
    type: GET_ORDERS_FAILED,
    payload: error,
})

export const getOrdersByOffice = (conditional, limit, offset) => ({
    type: GET_ORDERS_OFFICE,
    conditional: conditional,
    limit: limit,
    offset: offset
})

export const getOrdersByOfficeSuccess = (data, meta) => ({
    type: GET_ORDERS_OFFICE_SUCCESS,
    meta: meta,
    payload: data,
})
export const getOrdersByOfficeFailed = error => ({
    type: GET_ORDERS_OFFICE_FAILED,
    payload: error,
})

export const getOrder = id => ({
    type: GET_ORDER,
    id
})
export const restartOrder = () => ({
    type: GET_ORDER_RESTART
})

export const getOrderSuccess = data => ({
    type: GET_ORDER_SUCCESS,
    payload: data,
})

export const getOrderFailed = error => ({
    type: GET_ORDER_FAILED,
    payload: error,
})

export const nextStatusOrder = (data, history) => {
    return {
        type: NEXT_STATUS_ORDER,
        payload: { data, history },
    }
}
export const canceledStatusOrder = (data, history) => {
    return {
        type: CANCELED_STATUS_ORDER,
        payload: { data, history },
    }
}
export const resumeOrder = (id, history) => {
    return {
        type: RESUME_ORDER,
        payload: { id, history },
    }
}
export const historicOrder = (id) => {
    return {
        type: GET_HISTORIC_ORDER,
        payload: { id },
    }
}
export const historicOrderFailed = () => {
    return {
        type: GET_HISTORIC_ORDER_FAILED
    }
}
export const historicOrderSuccess = (data) => {
    return {
        type: GET_HISTORIC_ORDER_SUCCESS,
        payload: data ,
    }
}
export const printOrder = (id, history) => {
    return {
        type: PRINT_ORDER,
        payload: { id, history },
    }
}
export const customOrderSuccess = (data, node) => {
    return {
        type: CUSTOM_ORDER_SUCCESS,
        payload: data,
        node: node,
    }
}
export const customOrderFailed = data => {
    return {
        type: CUSTOM_ORDER_FAILED,
        payload: data,
    }
}

export const registerOrder = (data, history) => {
    return {
        type: REGISTER_ORDER,
        payload: { data, history },
    }
}

export const registerOrderSuccess = data => {
    return {
        type: REGISTER_ORDER_SUCCESS,
        payload: data.order,
    }
}


export const registerOrderFailed = data => {
    return {
        type: REGISTER_ORDER_FAILED,
        payload: data,
    }
}

export const updateOrder = (id, data, history) => {
    return {
        type: UPDATE_ORDER,
        payload: { id, data, history },
    }
}

export const updateOrderProducts = (id, data, history) => {
    return {
        type: UPDATE_ORDER_PRODUCTS,
        payload: { id, data, history },
    }
}

export const increasePhotoCounter = (id) => {
    return {
        type: DOWNLOAD_PHOTO,
        payload: { id },
    }
}

export const updateOrderSuccess = () => {
    return {
        type: UPDATE_ORDER_SUCCESS,
    }
}
export const updateOrderFail = error => {
    return {
        type: UPDATE_ORDER_FAILED,
        payload: error,
    }
}

export const syncOrder = (id, data) => {
    return {
        type: SYNC_DELIVERY_ORDER,
        payload: { id, data },
    }
}

export const syncOrderSuccess = () => {
    return {
        type: SYNC_DELIVERY_ORDER_SUCCESS,
    }
}
export const syncOrderFail = error => {
    return {
        type: SYNC_DELIVERY_ORDER_FAILED,
        payload: error,
    }
}

export const refreshOrderDelivery = (id) => {
    return {
        type: REFRESH_DELIVERY_ORDER,
        id: id
    }
}

export const refreshOrderDeliverySuccess = () => {
    return {
        type: REFRESH_DELIVERY_ORDER_SUCCESS,
        payload: true
    }
}
export const refreshOrderDeliveryFail = error => {
    return {
        type: REFRESH_DELIVERY_ORDER_FAILED,
        payload: error,
    }
}

export const getDeliveryMethods = (conditional, limit, offset) => ({
    type: GET_DELIVERY_METHODS,
    conditional: conditional,
    limit: limit,
    offset: offset
})
export const getDeliveryMethodsSuccess = (data, meta) => ({
    type: GET_DELIVERY_METHODS_SUCCESS,
    meta: meta,
    payload: data,
})
export const getDeliveryMethodsFailed = error => ({
    type: GET_DELIVERY_METHODS_FAILED,
    payload: error,
})

export const getDeliveryQuote = (request) => ({
    type: GET_DELIVERY_QUOTE,
    data: request
})

export const getDeliveryQuoteSuccess = (data, meta) => ({
    type: GET_DELIVERY_QUOTE_SUCCESS,
    meta: meta,
    payload: data,
})

export const getDeliveryQuoteFailed = error => ({
    type: GET_DELIVERY_QUOTE_FAILED,
    payload: error,
})


export const resetCar = () => ({type: RESET_CAR});

export const updateCard = (payload) => ({
    type: UPDATE_CAR,
    payload
})


//BATCH_REQUEST
export const doPrintBatchRequest = (conditionals) => ({
    type: DO_BATCH_REQUEST,
    conditionals: conditionals
})
export const resetBatchRequest = () => ({
    type: RESET_BATCH_REQUEST
})
export const printBatchRequest = (conditionals) => ({
    type: PRINT_BATCH_REQUEST,
    conditionals: conditionals
})
export const printBatchRequestSuccess = (data, meta) => ({
    type: PRINT_BATCH_REQUEST_SUCCESS,
    meta: meta,
    data: data,
})
export const printBatchRequestFailed = error => ({
    type: PRINT_BATCH_REQUEST_FAILED,
    error: error,
})

export const refreshOrders = () => {
    return {
        type: REFRESH_ORDER
    }
}

//CONCILIATION
export const doConciliation = (orders) => ({
    type: CONCILIATION_REQUEST,
    orders
})
export const doConciliationSuccess = () => ({
    type: CONCILIATION_SUCCESS
})
export const doConciliationFailed = (error) => ({
    type: CONCILIATION_FAILED,
    error
})
//CONFIRM CONCILIATION
export const confirmConciliation = (orders) => ({
    type: CONFIRM_CONCILIATION_REQUEST,
    orders
})
export const confirmConciliationSuccess = () => ({
    type: CONFIRM_CONCILIATION_SUCCESS
})
export const confirmConciliationFailed = (error) => ({
    type: CONFIRM_CONCILIATION_FAILED,
    error
})
export const confirmConciliationRestart = () => ({
    type: CONFIRM_CONCILIATION_RESTART
})
export const cleanErrorMessage = () => ({
    type: CLEAN_ERROR_MESSAGE
})

export const generateLinkPayment = (id) => {
    return {
        type: GET_LINK_PAYMENT,
        payload: { id },
    }
}
export const generateLinkPaymentSuccess = (url) => {
    return {
        type: GET_LINK_PAYMENT_SUCCESS,
        data: url,
    }
}
export const generateLinkPaymentFailed = (id) => {
    return {
        type: GET_LINK_PAYMENT_FAILED,
        payload: { id },
    }
}
