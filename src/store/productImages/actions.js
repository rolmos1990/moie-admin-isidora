import {
    GET_PRODUCT_IMAGES,
    GET_PRODUCT_IMAGES_SUCCESS,
    GET_PRODUCT_IMAGES_FAILED,
    GET_PRODUCT_IMAGE,
    GET_PRODUCT_IMAGE_SUCCESS,
    GET_PRODUCT_IMAGE_FAILED,
    REGISTER_PRODUCT_IMAGE,
    REGISTER_PRODUCT_IMAGE_SUCCESS,
    REGISTER_PRODUCT_IMAGE_FAILED,
    UPDATE_PRODUCT_IMAGE,
    UPDATE_PRODUCT_IMAGE_SUCCESS,
    UPDATE_PRODUCT_IMAGE_FAILED, RESET_PRODUCT_IMAGES, DELETE_PRODUCT_IMAGE, REFRESH_PRODUCT,
} from "./actionTypes";

export const resetProductImages = () => ({
    type: RESET_PRODUCT_IMAGES,
})
export const getProductImages = (conditional, limit, offset) => ({
    type: GET_PRODUCT_IMAGES,
    conditional: conditional,
    limit: limit,
    offset: offset
})

export const refreshProduct = () => ({
    type: REFRESH_PRODUCT,
});

export const deleteProductImage = (product, number) => ({
    type: DELETE_PRODUCT_IMAGE,
    product: product,
    number: number
});

export const getProductImagesSuccess = (data, meta) => ({
    type: GET_PRODUCT_IMAGES_SUCCESS,
    meta: meta,
    payload: data,
})

export const getProductImagesFailed = error => ({
    type: GET_PRODUCT_IMAGES_FAILED,
    payload: error,
})

export const getProductImage = id => ({
    type: GET_PRODUCT_IMAGE,
    id
})

export const getProductImageSuccess = data => ({
    type: GET_PRODUCT_IMAGE_SUCCESS,
    payload: data,
})

export const getProductImageFailed = error => ({
    type: GET_PRODUCT_IMAGE_FAILED,
    payload: error,
})

export const registerProductImage = (data, history) => {
    return {
        type: REGISTER_PRODUCT_IMAGE,
        payload: { data, history },
    }
}

export const registerProductImageSuccess = data => {
    return {
        type: REGISTER_PRODUCT_IMAGE_SUCCESS,
        payload: data,
    }
}


export const registerProductImageFailed = data => {
    return {
        type: REGISTER_PRODUCT_IMAGE_FAILED,
        payload: data,
    }
}

export const updateProductImage = (id, data, history) => {
    return {
        type: UPDATE_PRODUCT_IMAGE,
        payload: { id, data, history },
    }
}

export const updateProductImageSuccess = data => {
    return {
        type: UPDATE_PRODUCT_IMAGE_SUCCESS,
        payload: data,
    }
}


export const updateProductImageFail = error => {
    return {
        type: UPDATE_PRODUCT_IMAGE_FAILED,
        payload: error,
    }
}
