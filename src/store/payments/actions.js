import {
    APPLY_PAYMENT,
    APPLY_PAYMENT_FAILED,
    APPLY_PAYMENT_SUCCESS, DELETE_PAYMENT, DELETE_PAYMENT_FAILED, DELETE_PAYMENT_SUCCESS,
    GET_PAYMENT,
    GET_PAYMENT_FAILED,
    GET_PAYMENT_SUCCESS,
    GET_PAYMENTS,
    GET_PAYMENTS_FAILED,
    GET_PAYMENTS_SUCCESS,
    REGISTER_PAYMENT,
    REGISTER_PAYMENT_FAILED,
    REGISTER_PAYMENT_SUCCESS,
    UPDATE_PAYMENT,
    UPDATE_PAYMENT_FAILED,
    UPDATE_PAYMENT_SUCCESS,
} from "./actionTypes";

export const getPayments = (conditional, limit, offset) => ({
    type: GET_PAYMENTS,
    conditional: conditional,
    limit: limit,
    offset: offset
})

export const getPaymentsSuccess = (data, meta) => ({
    type: GET_PAYMENTS_SUCCESS,
    meta: meta,
    payload: data,
})

export const getPaymentsFailed = error => ({
    type: GET_PAYMENTS_FAILED,
    payload: error,
})

export const getPayment = id => ({
    type: GET_PAYMENT,
    id
})

export const getPaymentSuccess = data => ({
    type: GET_PAYMENT_SUCCESS,
    payload: data,
})

export const getPaymentFailed = error => ({
    type: GET_PAYMENT_FAILED,
    payload: error,
})

export const deletePayment = id => ({
    type: DELETE_PAYMENT,
    id
})

export const deletePaymentSuccess = data => ({
    type: DELETE_PAYMENT_SUCCESS,
    payload: data,
})

export const deletePaymentFailed = error => ({
    type: DELETE_PAYMENT_FAILED,
    payload: error,
})

export const registerPayment = (data, history) => {
    return {
        type: REGISTER_PAYMENT,
        payload: {data, history},
    }
}

export const registerPaymentSuccess = data => {
    return {
        type: REGISTER_PAYMENT_SUCCESS,
        payload: data,
    }
}


export const registerPaymentFailed = data => {
    return {
        type: REGISTER_PAYMENT_FAILED,
        payload: data,
    }
}

export const updatePayment = (id, data, history) => {
    return {
        type: UPDATE_PAYMENT,
        payload: {id, data, history},
    }
}
export const updatePaymentSuccess = data => {
    return {
        type: UPDATE_PAYMENT_SUCCESS,
        payload: data,
    }
}
export const updatePaymentFail = error => {
    return {
        type: UPDATE_PAYMENT_FAILED,
        payload: error,
    }
}

export const applyPayment = (paymentId, data) => {
    return {
        type: APPLY_PAYMENT,
        payload: {paymentId, data},
    }
}
export const applyPaymentSuccess = data => {
    return {
        type: APPLY_PAYMENT_SUCCESS,
        payload: data,
    }
}
export const applyPaymentFail = error => {
    return {
        type: APPLY_PAYMENT_FAILED,
        payload: error,
    }
}
