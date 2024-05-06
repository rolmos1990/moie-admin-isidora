import {
    GET_PRODUCT_IMAGE,
    GET_PRODUCT_IMAGE_FAILED,
    GET_PRODUCT_IMAGE_SUCCESS,
    GET_PRODUCT_IMAGES,
    GET_PRODUCT_IMAGES_FAILED,
    GET_PRODUCT_IMAGES_SUCCESS,
    REGISTER_PRODUCT_IMAGE,
    REGISTER_PRODUCT_IMAGE_FAILED,
    REGISTER_PRODUCT_IMAGE_SUCCESS,
    RESET_PRODUCT_IMAGES,
    UPDATE_PRODUCT_IMAGE,
    UPDATE_PRODUCT_IMAGE_FAILED,
    UPDATE_PRODUCT_IMAGE_SUCCESS,
    REFRESH_PRODUCT
} from "./actionTypes";

const initialState = {
    error: "",
    loading: false,
    meta: {},
    productImages: [],
    productImage: {},
    refresh: false
}

const productImages = (state = initialState, action) => {
    switch (action.type) {
        case RESET_PRODUCT_IMAGES:
            state = {
                ...state,
                loading: false,
                refresh: false
            }
            break
        case GET_PRODUCT_IMAGES:
            return {
                ...state,
                loading: true,
            }
        case GET_PRODUCT_IMAGES_FAILED:
            return {
                ...state,
                error: action.payload,
                loading: true,
            }

        case GET_PRODUCT_IMAGES_SUCCESS:
            return {
                ...state,
                productImages: action.payload,
                meta: action.meta,
                loading: false,
            }
        case GET_PRODUCT_IMAGE:
            return {
                ...state,
                loading: true,
            }
        case GET_PRODUCT_IMAGE_SUCCESS:
            return {
                ...state,
                productImage: action.payload,
                loading: false,
            }
        case GET_PRODUCT_IMAGE_FAILED:
            return {
                ...state,
                loading: false,
            }
        case REGISTER_PRODUCT_IMAGE:
            state = {
                ...state,
                loading: true,
            }
            break
        case REGISTER_PRODUCT_IMAGE_SUCCESS:
            state = {
                ...state,
                loading: false,
            }
            break
        case REGISTER_PRODUCT_IMAGE_FAILED:
            state = {
                ...state,
                loading: false,
            }
            break
        case UPDATE_PRODUCT_IMAGE:
            state = {
                ...state,
                loading: true,
            }
            break
        case UPDATE_PRODUCT_IMAGE_SUCCESS:
            state = {
                ...state,
                loading: false,
                refresh: true
            }
            break
        case UPDATE_PRODUCT_IMAGE_FAILED:
            state = {
                ...state,
                loading: false,
            }
            break
        case REFRESH_PRODUCT:
            state = {
                ...state,
                refresh: !state.refresh
            }
        default:
            state = { ...state }
            break
    }
    return state
}

export default productImages
