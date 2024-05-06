import {
    GET_CATEGORY,
    GET_CATEGORY_FAILED,
    GET_CATEGORY_SUCCESS,
    GET_CATEGORIES,
    GET_CATEGORIES_FAILED,
    GET_CATEGORIES_SUCCESS,
    REGISTER_CATEGORY,
    REGISTER_CATEGORY_FAILED,
    REGISTER_CATEGORY_SUCCESS,
    UPDATE_CATEGORY,
    UPDATE_CATEGORY_FAILED,
    UPDATE_CATEGORY_SUCCESS,
    CATALOG_PRINT_BATCH_REQUEST,
    CATALOG_PRINT_BATCH_REQUEST_SUCCESS,
    CATALOG_PRINT_BATCH_REQUEST_FAILED,
    CATALOG_RESET_BATCH_REQUEST,
    CATALOG_DO_BATCH_REQUEST,
    REFRESH_CATEGORIES,
    RESET_CATEGORY,
    GET_PIECES_UNPUBLISHED,
    GET_PIECES_UNPUBLISHED_FAILED,
    GET_PIECES_UNPUBLISHED_SUCCESS,
} from "./actionTypes";

const initialState = {
    error: "",
    loading: false,
    meta: {},
    categories: [],
    category: {},
    refresh: false,
    pieces: [],
    batchRequest: {
        batch: null,
        error: null,
        meta: {},
        conditionals: null,
        loading: false,
        doRequest: false
    }
}

const category = (state = initialState, action) => {
    switch (action.type) {
        case RESET_CATEGORY:
            return {
                ...initialState
            }
        case GET_PIECES_UNPUBLISHED:
            return {
                ...state,
                pieces: [],
            }
        case GET_PIECES_UNPUBLISHED_FAILED:
            return {
                ...state,
                error: action.payload,
                pieces: [],
            }

        case GET_PIECES_UNPUBLISHED_SUCCESS:
            return {
                ...state,
                pieces: action.pieces
            }
        case GET_CATEGORIES:
            return {
                ...state,
                loading: true,
            }
        case GET_CATEGORIES_FAILED:
            return {
                ...state,
                error: action.payload,
                loading: true,
            }

        case GET_CATEGORIES_SUCCESS:
            return {
                ...state,
                categories: action.payload,
                meta: action.meta,
                loading: false,
            }
        case GET_CATEGORY:
            return {
                ...state,
                loading: true,
            }
        case GET_CATEGORY_SUCCESS:
            return {
                ...state,
                category: action.payload,
                loading: false,
            }
        case GET_CATEGORY_FAILED:
            return {
                ...state,
                loading: false,
            }
        case REGISTER_CATEGORY:
            state = {
                ...state,
                loading: true,
            }
            break
        case REGISTER_CATEGORY_SUCCESS:
            state = {
                ...state,
                loading: false,
            }
            break
        case REGISTER_CATEGORY_FAILED:
            state = {
                ...state,
                loading: false,
            }
            break
        case UPDATE_CATEGORY:
            state = {
                ...state,
                loading: true,
            }
            break
        case UPDATE_CATEGORY_SUCCESS:
            state = {
                ...state,
                loading: false,
            }
            break
        case UPDATE_CATEGORY_FAILED:
            state = {
                ...state,
                loading: false,
            }
            break
        case CATALOG_DO_BATCH_REQUEST:
            return {
                ...state,
                batchRequest: {
                    ...state.batchRequest,
                    conditionals: action.conditionals,
                    batch: action.batch,
                    doRequest: true
                }
            }
        case CATALOG_PRINT_BATCH_REQUEST:
            return {
                ...state,
                batchRequest: {
                    ...state.batchRequest,
                    conditionals: action.conditionals,
                    doRequest: false,
                    loading: true
                }
            }
        case CATALOG_PRINT_BATCH_REQUEST_SUCCESS:
            return {
                ...state,
                refresh: !state.refresh,
                batchRequest: {
                    ...state.batchRequest,
                    meta: action.meta,
                    batch: action.data,
                    loading: false
                }
            }
        case CATALOG_PRINT_BATCH_REQUEST_FAILED:
            return {
                ...state,
                batchRequest: {
                    ...state.batchRequest,
                    error: action.error,
                    loading: false
                }
            }
        case CATALOG_RESET_BATCH_REQUEST:
            return {
                ...state,
                batchRequest: {
                    ...state.batchRequest,
                    batch: null,
                    meta: {},
                    error: null,
                    conditionals: null,
                    doRequest: false,
                    loading: false
                }
            }
        case REFRESH_CATEGORIES:
            return {
                ...state,
                refresh: !state.refresh,
            }
        default:
            state = { ...state }
            break
    }
    return state
}

export default category
