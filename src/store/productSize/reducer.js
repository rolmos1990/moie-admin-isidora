import {RESET_PRODUCT_SIZE, UPDATE_PRODUCT_SIZE_LIST, UPDATE_PRODUCT_SIZE_LIST_FAILED, UPDATE_PRODUCT_SIZE_LIST_SUCCESS} from "./actionTypes";

const initialState = {
    error: "",
    loading: false,
    meta: {},
    productSizes: [],
    productSize: {},
    refresh: false
}

const productSizes = (state = initialState, action) => {
    switch (action.type) {
        case RESET_PRODUCT_SIZE:
            state = {
                ...state,
                loading: false,
                refresh: false
            }
            break
        case UPDATE_PRODUCT_SIZE_LIST:
            state = {
                ...state,
                loading: true,
            }
            break
        case UPDATE_PRODUCT_SIZE_LIST_SUCCESS:
            state = {
                ...state,
                loading: false,
                refresh: !state.refresh
            }
            break
        case UPDATE_PRODUCT_SIZE_LIST_FAILED:
            state = {
                ...state,
                loading: false,
            }
            break
        default:
            state = { ...state }
            break
    }
    return state
}

export default productSizes
