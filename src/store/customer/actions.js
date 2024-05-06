import {
    GET_CUSTOMER,
    GET_CUSTOMER_SUCCESS,
    GET_CUSTOMER_FAILED,
    REGISTER_CUSTOMER,
    REGISTER_CUSTOMER_SUCCESS,
    REGISTER_CUSTOMER_FAILED,
    GET_CUSTOMERS,
    GET_CUSTOMERS_SUCCESS,
    GET_CUSTOMERS_FAILED,
    UPDATE_CUSTOMER,
    UPDATE_CUSTOMER_SUCCESS,
    UPDATE_CUSTOMER_FAILED,
    DELETE_CUSTOMER,
    DELETE_CUSTOMER_SUCCESS,
    DELETE_CUSTOMER_FAILED, RESET_CUSTOMERS, QUERY_CUSTOMERS, QUERY_CUSTOMERS_FAILED, QUERY_CUSTOMERS_SUCCESS,
    GET_CUSTOMER_REGISTEREDS,
    GET_CUSTOMER_REGISTEREDS_SUCCESS,
    GET_CUSTOMER_REGISTEREDS_FAILED, REGISTER_VCARD, REGISTER_VCARD_SUCCESS, REGISTER_VCARD_FAILED,
} from "./actionTypes"

export const resetCustomer = () => ({
    type: RESET_CUSTOMERS,
})

export const getCustomers = (conditional, limit, offset) => ({
    type: GET_CUSTOMERS,
    conditional: conditional,
    limit: limit,
    offset: offset
})

export const getCustomersSuccess = (customers, meta) => ({
    type: GET_CUSTOMERS_SUCCESS,
    meta: meta,
    payload: customers,
})

export const getCustomersFail = error => ({
    type: GET_CUSTOMERS_FAILED,
    payload: error,
})

export const getCustomer = id => ({
    type: GET_CUSTOMER,
    id
})


export const getCustomerSuccess = customer => ({
    type: GET_CUSTOMER_SUCCESS,
    payload: customer,
})

export const getCustomerFail = error => ({
    type: GET_CUSTOMER_FAILED,
    payload: error,
})

export const registerCustomer = (customer, history) => {
    return {
        type: REGISTER_CUSTOMER,
        payload: { customer, history },
    }
}

export const registerCustomerSuccess = data => {
    return {
        type: REGISTER_CUSTOMER_SUCCESS,
        payload: data.customer,
    }
}


export const registerCustomerFail = customer => {
    return {
        type: REGISTER_CUSTOMER_FAILED,
        payload: customer,
    }
}

export const updateCustomer = (id, customer, history) => {
    return {
        type: UPDATE_CUSTOMER,
        payload: { id, customer, history },
    }
}

export const updateCustomerSuccess = customer => {
    return {
        type: UPDATE_CUSTOMER_SUCCESS,
        payload: customer,
    }
}


export const updateCustomerFail = error => {
    return {
        type: UPDATE_CUSTOMER_FAILED,
        payload: error,
    }
}

export const deleteCustomer = (id, history) => ({
    type: DELETE_CUSTOMER,
    payload: { id, history}
})

export const deleteCustomerSuccess = () => ({
    type: DELETE_CUSTOMER_SUCCESS
})

export const deleteCustomerFailed = error => ({
    type: DELETE_CUSTOMER_FAILED,
    payload: error,
})



export const countCustomersByStatus = () => {
    const params = {operation:'id::count', group:"status"};
    return queryCustomers(params, 'statusGroup');
}

export const queryCustomers = (params, node) => ({
    type: QUERY_CUSTOMERS,
    params: params,
    node: node,
})
export const queryCustomersFailed = error => ({
    type: QUERY_CUSTOMERS_FAILED,
    payload: error,
})
export const queryCustomersSuccess = (data, meta, node) => ({
    type: QUERY_CUSTOMERS_SUCCESS,
    meta: meta,
    payload: data,
    node: node,
})

export const getCustomerRegistereds = () => ({
    type: GET_CUSTOMER_REGISTEREDS
})
export const getCustomerRegisteredsFailed = error => ({
    type: GET_CUSTOMER_REGISTEREDS_FAILED,
    payload: error,
})
export const getCustomerRegisteredsSuccess = (data) => ({
    type: GET_CUSTOMER_REGISTEREDS_SUCCESS,
    payload: data,
})


export const registerVCard = (vcard, history) => {
    return {
        type: REGISTER_VCARD,
        payload: { vcard, history },
    }
}

export const registerVCardSuccess = data => {
    return {
        type: REGISTER_VCARD_SUCCESS,
        payload: data.vcard,
    }
}


export const registerVCardFail = vcard => {
    return {
        type: REGISTER_VCARD_FAILED,
        payload: vcard,
    }
}

