import {
    BILL_CONFIG_LIST_REFRESH,
    DELETE_BILL_CONFIG,
    DELETE_BILL_CONFIG_FAILED,
    DELETE_BILL_CONFIG_SUCCESS,
    GET_BILL_CONFIG,
    GET_BILL_CONFIG_FAILED,
    GET_BILL_CONFIG_SUCCESS,
    GET_BILL_CONFIGS,
    GET_BILL_CONFIGS_FAILED,
    GET_BILL_CONFIGS_SUCCESS,
    QUERY_BILL_CONFIGS,
    QUERY_BILL_CONFIGS_FAILED,
    QUERY_BILL_CONFIGS_SUCCESS,
    REGISTER_BILL_CONFIG,
    REGISTER_BILL_CONFIG_FAILED,
    REGISTER_BILL_CONFIG_SUCCESS,
    RESET_BILL_CONFIG,
    UPDATE_BILL_CONFIG,
    UPDATE_BILL_CONFIG_FAILED,
    UPDATE_BILL_CONFIG_SUCCESS
} from "./actionTypes";
import Conditionals from "../../common/conditionals";

export const resetBillConfig = () => ({
    type: RESET_BILL_CONFIG,
})

export const getBillConfigs = (conditional, limit, offset) => ({
    type: GET_BILL_CONFIGS,
    conditional: conditional,
    limit: limit,
    offset: offset
})

export const getBillConfigsByIds = (ids, offset) => {
    const conditions = new Conditionals.Condition;
    if (ids.length > 0) conditions.add("id", ids.join("::"), Conditionals.OPERATORS.IN);
    return getBillConfigs(conditions.all(), ids.length, offset);
}

export const getBillConfigsSuccess = (data, meta) => ({
    type: GET_BILL_CONFIGS_SUCCESS,
    meta: meta,
    payload: data,
})

export const getBillConfigsFailed = error => ({
    type: GET_BILL_CONFIGS_FAILED,
    payload: error,
})

export const getBillConfig = id => ({
    type: GET_BILL_CONFIG,
    id
})

export const getBillConfigSuccess = data => ({
    type: GET_BILL_CONFIG_SUCCESS,
    payload: data,
})

export const getBillConfigFailed = error => ({
    type: GET_BILL_CONFIG_FAILED,
    payload: error,
})

export const registerBillConfig = (data, history) => {
    return {
        type: REGISTER_BILL_CONFIG,
        payload: {data, history},
    }
}

export const registerBillConfigSuccess = data => {
    return {
        type: REGISTER_BILL_CONFIG_SUCCESS,
        payload: data.bill,
    }
}


export const registerBillConfigFailed = data => {
    return {
        type: REGISTER_BILL_CONFIG_FAILED,
        payload: data,
    }
}

export const updateBillConfig = (id, data, history) => {
    return {
        type: UPDATE_BILL_CONFIG,
        payload: {id, data, history},
    }
}

export const updateBillConfigSuccess = data => {
    return {
        type: UPDATE_BILL_CONFIG_SUCCESS,
        payload: data,
    }
}


export const updateBillConfigFail = error => {
    return {
        type: UPDATE_BILL_CONFIG_FAILED,
        payload: error,
    }
}

export const deleteBillConfig = (id, history) => ({
    type: DELETE_BILL_CONFIG,
    payload: {id, history}
})

export const deleteBillConfigSuccess = () => ({
    type: DELETE_BILL_CONFIG_SUCCESS
})

export const deleteBillConfigFailed = error => ({
    type: DELETE_BILL_CONFIG_FAILED,
    payload: error,
})

export const countBillConfigByStatus = () => {
    const params = {operation: 'id::count', group: "status"};
    return queryBillConfigs(params, 'statusGroup');
}

export const queryBillConfigs = (params, node) => ({
    type: QUERY_BILL_CONFIGS,
    params: params,
    node: node,
})
export const queryBillConfigsFailed = error => ({
    type: QUERY_BILL_CONFIGS_FAILED,
    payload: error,
})
export const queryBillConfigsSuccess = (data, meta, node) => ({
    type: QUERY_BILL_CONFIGS_SUCCESS,
    meta: meta,
    payload: data,
    node: node,
})

export const refreshList = () => {
    return {type: BILL_CONFIG_LIST_REFRESH}
}
