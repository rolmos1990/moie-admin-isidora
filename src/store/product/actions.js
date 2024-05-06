import {
    CLEAR_PRODUCTS,
    GET_PRODUCT,
    GET_PRODUCT_FAILED,
    GET_PRODUCT_SUCCESS,
    GET_PRODUCTS,
    GET_PRODUCTS_FAILED,
    GET_PRODUCTS_SUCCESS, ORDER_PRODUCT, ORDER_PRODUCT_FAILED, ORDER_PRODUCT_SUCCESS,
    QUERY_PENDING_PRODUCTS,
    QUERY_PRODUCTS,
    QUERY_PRODUCTS_FAILED,
    QUERY_PRODUCTS_SUCCESS,
    REGISTER_PRODUCT,
    REGISTER_PRODUCT_FAILED,
    REGISTER_PRODUCT_SUCCESS,
    RESET_PRODUCT,
    UPDATE_PRODUCT,
    UPDATE_PRODUCT_FAILED,
    UPDATE_PRODUCT_SUCCESS
} from "./actionTypes";
import Conditionals from "../../common/conditionals";

export const resetProduct = () => ({
    type: RESET_PRODUCT,
})

export const clearProducts = () => ({
    type: CLEAR_PRODUCTS,
})

export const getProducts = (conditional, limit, offset, order) => ({
    type: GET_PRODUCTS,
    conditional: conditional,
    limit: limit,
    offset: offset,
    order: order
})


export const getProductsByRefs = (refs, offset) => {
    const conditions = new Conditionals.Condition;
    if (refs.length > 0) conditions.add("reference", refs.join("::"), Conditionals.OPERATORS.IN);
    return getProducts(conditions.all(), refs.length, offset);
}
export const getProductsByIds = (ids, offset) => {
    const conditions = new Conditionals.Condition;
    if (ids.length > 0) conditions.add("id", ids.join("::"), Conditionals.OPERATORS.IN);
    return getProducts(conditions.all(), ids.length, offset);
}

export const getProductsSuccess = (data, meta) => ({
    type: GET_PRODUCTS_SUCCESS,
    meta: meta,
    payload: data,
})

export const getProductsFailed = error => ({
    type: GET_PRODUCTS_FAILED,
    payload: error,
})

export const getProduct = id => ({
    type: GET_PRODUCT,
    id
})

export const getProductSuccess = data => ({
    type: GET_PRODUCT_SUCCESS,
    payload: data,
})

export const getProductFailed = error => ({
    type: GET_PRODUCT_FAILED,
    payload: error,
})

export const registerProduct = (data, history) => {
    return {
        type: REGISTER_PRODUCT,
        payload: { data, history },
    }
}

export const registerProductSuccess = data => {
    return {
        type: REGISTER_PRODUCT_SUCCESS,
        payload: data.product,
    }
}


export const registerProductFailed = data => {
    return {
        type: REGISTER_PRODUCT_FAILED,
        payload: data,
    }
}

export const updateProduct = (id, data, history) => {
    return {
        type: UPDATE_PRODUCT,
        payload: { id, data, history },
    }
}

export const updateProductSuccess = data => {
    return {
        type: UPDATE_PRODUCT_SUCCESS,
        payload: data,
    }
}


export const updateProductFail = error => {
    return {
        type: UPDATE_PRODUCT_FAILED,
        payload: error,
    }
}



export const countProductByStatus = () => {
    const params = {operation:'id::count', group:"status"};
    return queryProducts(params, 'statusGroup');
}

export const pendingProducts = (id) => ({
    type: QUERY_PENDING_PRODUCTS,
    id:id
})
export const queryProducts = (params, node) => ({
    type: QUERY_PRODUCTS,
    params: params,
    node: node,
})
export const queryProductsFailed = error => ({
    type: QUERY_PRODUCTS_FAILED,
    payload: error,
})
export const queryProductsSuccess = (data, meta, node) => ({
    type: QUERY_PRODUCTS_SUCCESS,
    meta: meta,
    payload: data,
    node: node,
})

export const reorderProduct = (id, data, history) => {
    return {
        type: ORDER_PRODUCT,
        payload: { id, data, history },
    }
}

export const reorderProductSuccess = data => {
    return {
        type: ORDER_PRODUCT_SUCCESS,
        payload: data,
    }
}


export const reorderProductFail = error => {
    return {
        type: ORDER_PRODUCT_FAILED,
        payload: error,
    }
}
