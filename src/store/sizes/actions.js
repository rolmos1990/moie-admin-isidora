import {
    GET_SIZES,
    GET_SIZES_SUCCESS,
    GET_SIZES_FAILED,
    GET_SIZE,
    GET_SIZE_SUCCESS,
    GET_SIZE_FAILED,
    REGISTER_SIZE,
    REGISTER_SIZE_SUCCESS,
    REGISTER_SIZE_FAILED,
    UPDATE_SIZE,
    UPDATE_SIZE_SUCCESS,
    UPDATE_SIZE_FAILED,
} from "./actionTypes";

export const getSizes = (conditional, limit, offset) => ({
    type: GET_SIZES,
    conditional: conditional,
    limit: limit,
    offset: offset
})

export const getSizesSuccess = (data, meta) => ({
    type: GET_SIZES_SUCCESS,
    meta: meta,
    payload: data,
})

export const getSizesFailed = error => ({
    type: GET_SIZES_FAILED,
    payload: error,
})

export const getSize = id => ({
    type: GET_SIZE,
    id
})

export const getSizeSuccess = data => ({
    type: GET_SIZE_SUCCESS,
    payload: data,
})

export const getSizeFailed = error => ({
    type: GET_SIZE_FAILED,
    payload: error,
})

export const registerSize = (data, history) => {
    return {
        type: REGISTER_SIZE,
        payload: { data, history },
    }
}

export const registerSizeSuccess = data => {
    return {
        type: REGISTER_SIZE_SUCCESS,
        payload: data,
    }
}


export const registerSizeFailed = data => {
    return {
        type: REGISTER_SIZE_FAILED,
        payload: data,
    }
}

export const updateSize = (id, data, history) => {
    return {
        type: UPDATE_SIZE,
        payload: { id, data, history },
    }
}

export const updateSizeSuccess = data => {
    return {
        type: UPDATE_SIZE_SUCCESS,
        payload: data,
    }
}


export const updateSizeFail = error => {
    return {
        type: UPDATE_SIZE_FAILED,
        payload: error,
    }
}
