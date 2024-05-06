import {
    ADD_ORDER_BILL,
    ADD_ORDER_BILL_FAILED,
    ADD_ORDER_BILL_SUCCESS,
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
    RESET_BILL, SEND_INVOICE, SEND_INVOICE_FAILED, SEND_INVOICE_SUCCESS,
    UPDATE_BILL,
    UPDATE_BILL_FAILED,
    UPDATE_BILL_SUCCESS
} from "./actionTypes";
import Conditionals from "../../common/conditionals";

export const resetBill = () => ({
    type: RESET_BILL,
})

export const getBills = (conditional, limit, offset) => ({
    type: GET_BILLS,
    conditional: conditional,
    limit: limit,
    offset: offset
})

export const getBillsByIds = (ids, offset) => {
    const conditions = new Conditionals.Condition;
    if (ids.length > 0) conditions.add("id", ids.join("::"), Conditionals.OPERATORS.IN);
    return getBills(conditions.all(), ids.length, offset);
}

export const getBillsSuccess = (data, meta) => ({
    type: GET_BILLS_SUCCESS,
    meta: meta,
    payload: data,
})

export const getBillsFailed = error => ({
    type: GET_BILLS_FAILED,
    payload: error,
})

export const getBill = id => ({
    type: GET_BILL,
    id
})

export const getBillSuccess = data => ({
    type: GET_BILL_SUCCESS,
    payload: data,
})

export const getBillFailed = error => ({
    type: GET_BILL_FAILED,
    payload: error,
})

export const registerBill = (data) => {
    return {
        type: REGISTER_BILL,
        payload: {data},
    }
}

export const registerBillSuccess = data => {
    return {
        type: REGISTER_BILL_SUCCESS,
        payload: data.bill,
    }
}


export const registerBillFailed = data => {
    return {
        type: REGISTER_BILL_FAILED,
        payload: data,
    }
}

export const updateBill = (id, data) => {
    return {
        type: UPDATE_BILL,
        payload: {id, data},
    }
}

export const updateBillSuccess = data => {
    return {
        type: UPDATE_BILL_SUCCESS,
        payload: data,
    }
}


export const updateBillFail = error => {
    return {
        type: UPDATE_BILL_FAILED,
        payload: error,
    }
}

export const deleteBill = (id, history) => ({
    type: DELETE_BILL,
    payload: {id, history}
})

export const deleteBillSuccess = () => ({
    type: DELETE_BILL_SUCCESS
})

export const deleteBillFailed = error => ({
    type: DELETE_BILL_FAILED,
    payload: error,
})

export const confirmBill = (id, history) => ({
    type: CONFIRM_BILL,
    payload: {id, history}
})

export const confirmBillSuccess = () => ({
    type: CONFIRM_BILL_SUCCESS
})

export const confirmBillFailed = error => ({
    type: CONFIRM_BILL_FAILED,
    payload: error,
})


export const countBillByStatus = () => {
    const params = {operation: 'id::count', group: "status"};
    return queryBills(params, 'statusGroup');
}

export const queryBills = (params, node) => ({
    type: QUERY_BILLS,
    params: params,
    node: node,
})
export const queryBillsFailed = error => ({
    type: QUERY_BILLS_FAILED,
    payload: error,
})
export const queryBillsSuccess = (data, meta, node) => ({
    type: QUERY_BILLS_SUCCESS,
    meta: meta,
    payload: data,
    node: node,
})

export const addOrderBill = (id, data, conditional, history) => {
    return {
        type: ADD_ORDER_BILL,
        payload: {id, data, conditional, history},
    }
}

export const addOrderBillSuccess = data => {
    return {
        type: ADD_ORDER_BILL_SUCCESS,
        payload: data.bill,
    }
}


export const addOrderBillFailed = data => {
    return {
        type: ADD_ORDER_BILL_FAILED,
        payload: data,
    }
}

export const refreshList = () => {
    return {type: BILL_LIST_REFRESH}
}

export const createCreditNote = id => ({
    type: GENERATE_CREDIT_NOTE,
    id
})
export const createCreditNoteSuccess = () => {
    return {
        type: GENERATE_CREDIT_NOTE_SUCCESS
    }
}
export const createCreditNoteFailed = () => {
    return {
        type: GENERATE_CREDIT_NOTE_FAILED
    }
}


export const sendInvoice = id => ({
    type: SEND_INVOICE,
    id
})
export const sendInvoiceSuccess = () => {
    return {
        type: SEND_INVOICE_SUCCESS
    }
}
export const sendInvoiceFailed = () => {
    return {
        type: SEND_INVOICE_FAILED
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
