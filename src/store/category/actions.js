import {
    RESET_CATEGORY,
    GET_CATEGORIES,
    GET_CATEGORIES_SUCCESS,
    GET_CATEGORIES_FAILED,
    GET_CATEGORY,
    GET_CATEGORY_SUCCESS,
    GET_CATEGORY_FAILED,
    REGISTER_CATEGORY,
    REGISTER_CATEGORY_SUCCESS,
    REGISTER_CATEGORY_FAILED,
    UPDATE_CATEGORY,
    UPDATE_CATEGORY_SUCCESS,
    UPDATE_CATEGORY_FAILED,
    CATALOG_PRINT_BATCH_REQUEST,
    CATALOG_PRINT_BATCH_REQUEST_SUCCESS,
    CATALOG_PRINT_BATCH_REQUEST_FAILED,
    CATALOG_RESET_BATCH_REQUEST,
    CATALOG_DO_BATCH_REQUEST,
    REFRESH_CATEGORIES,
    GET_PIECES_UNPUBLISHED,
    GET_PIECES_UNPUBLISHED_SUCCESS,
    GET_PIECES_UNPUBLISHED_FAILED,
} from "./actionTypes";

export const resetCategory = () => ({
    type: RESET_CATEGORY,
})

export const getCategories = (conditional, limit, offset) => ({
    type: GET_CATEGORIES,
    conditional: conditional,
    limit: limit,
    offset: offset
})

export const getCategoriesSuccess = (data, meta) => ({
    type: GET_CATEGORIES_SUCCESS,
    meta: meta,
    payload: data,
})

export const getCategoriesFailed = error => ({
    type: GET_CATEGORIES_FAILED,
    payload: error,
})

export const getCategory = id => ({
    type: GET_CATEGORY,
    id
})

export const getCategorySuccess = data => ({
    type: GET_CATEGORY_SUCCESS,
    payload: data,
})

export const getCategoryFailed = error => ({
    type: GET_CATEGORY_FAILED,
    payload: error,
})

export const getPiecesUnpublished = id => ({
    type: GET_PIECES_UNPUBLISHED,
    id
})

export const getPiecesUnpublishedSuccess = data => ({
    type: GET_PIECES_UNPUBLISHED_SUCCESS,
    pieces: data,
})

export const getPiecesUnpublishedFailed = error => ({
    type: GET_PIECES_UNPUBLISHED_FAILED,
    payload: error,
})

export const registerCategory = (data, history) => {
    return {
        type: REGISTER_CATEGORY,
        payload: { data, history },
    }
}

export const registerCategorySuccess = data => {
    return {
        type: REGISTER_CATEGORY_SUCCESS,
        payload: data,
    }
}


export const registerCategoryFailed = data => {
    return {
        type: REGISTER_CATEGORY_FAILED,
        payload: data,
    }
}

export const updateCategory = (id, data, history) => {
    return {
        type: UPDATE_CATEGORY,
        payload: { id, data, history },
    }
}

export const updateCategorySuccess = data => {
    return {
        type: UPDATE_CATEGORY_SUCCESS,
        payload: data,
    }
}


export const updateCategoryFail = error => {
    return {
        type: UPDATE_CATEGORY_FAILED,
        payload: error,
    }
}
export const refreshCategory = () => {
    return {type: REFRESH_CATEGORIES}
}


//BATCH_REQUEST
export const doCatalogPrintBatchRequest = (conditionals, catalog) => ({
    type: CATALOG_DO_BATCH_REQUEST,
    conditionals: conditionals,
    batch: catalog,
})
export const resetCatalogBatchRequest = () => ({
    type: CATALOG_RESET_BATCH_REQUEST
})
export const printCatalogBatchRequest = (conditionals) => ({
    type: CATALOG_PRINT_BATCH_REQUEST,
    conditionals: conditionals
})
export const printCatalogBatchRequestSuccess = (data, meta) => ({
    type: CATALOG_PRINT_BATCH_REQUEST_SUCCESS,
    meta: meta,
    data: data,
})
export const printCatalogBatchRequestFailed = error => ({
    type: CATALOG_PRINT_BATCH_REQUEST_FAILED,
    error: error,
})
