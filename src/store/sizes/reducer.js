import {
    GET_SIZE,
    GET_SIZE_FAILED,
    GET_SIZE_SUCCESS,
    GET_SIZES,
    GET_SIZES_FAILED,
    GET_SIZES_SUCCESS,
    REGISTER_SIZE,
    REGISTER_SIZE_FAILED,
    REGISTER_SIZE_SUCCESS,
    UPDATE_SIZE, UPDATE_SIZE_FAILED,
    UPDATE_SIZE_SUCCESS
} from "./actionTypes";

const initialState = {
    error: "",
    loading: false,
    meta: {},
    sizes: [],
    size: {},
    refresh: false
}

const sizes = (state = initialState, action) => {
    switch (action.type) {
        case GET_SIZES:
            return {
                ...state,
                loading: true,
            }
        case GET_SIZES_FAILED:
            return {
                ...state,
                error: action.payload,
                loading: true,
            }

        case GET_SIZES_SUCCESS:
            return {
                ...state,
                sizes: action.payload,
                meta: action.meta,
                loading: false,
            }
        case GET_SIZE:
            return {
                ...state,
                loading: true,
            }
        case GET_SIZE_SUCCESS:
            return {
                ...state,
                size: action.payload,
                loading: false,
            }
        case GET_SIZE_FAILED:
            return {
                ...state,
                loading: false,
            }
        case REGISTER_SIZE:
            state = {
                ...state,
                loading: true,
            }
            break
        case REGISTER_SIZE_SUCCESS:
            state = {
                ...state,
                loading: false,
            }
            break
        case REGISTER_SIZE_FAILED:
            state = {
                ...state,
                loading: false,
            }
            break
        case UPDATE_SIZE:
            state = {
                ...state,
                loading: true,
            }
            break
        case UPDATE_SIZE_SUCCESS:
            state = {
                ...state,
                loading: false,
            }
            break
        case UPDATE_SIZE_FAILED:
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

export default sizes
