import {
    GET_DELIVERY_LOCALITY,
    GET_DELIVERY_LOCALITY_FAILED,
    GET_DELIVERY_LOCALITY_SUCCESS,
    GET_DELIVERY_LOCALITIES,
    GET_DELIVERY_LOCALITIES_FAILED,
    GET_DELIVERY_LOCALITIES_SUCCESS,
    REGISTER_DELIVERY_LOCALITY,
    REGISTER_DELIVERY_LOCALITY_FAILED,
    REGISTER_DELIVERY_LOCALITY_SUCCESS,
    UPDATE_DELIVERY_LOCALITY,
    UPDATE_DELIVERY_LOCALITY_FAILED,
    UPDATE_DELIVERY_LOCALITY_SUCCESS
} from "./actionTypes";

const initialState = {
    error: "",
    loading: false,
    meta: {},
    deliveryLocalities: [],
    deliveryLocality: {},
    refresh: false
}

const deliveryLocalities = (state = initialState, action) => {
    switch (action.type) {
        case GET_DELIVERY_LOCALITIES:
            return {
                ...state,
                loading: true,
            }
        case GET_DELIVERY_LOCALITIES_FAILED:
            return {
                ...state,
                error: action.payload,
                loading: true,
            }

        case GET_DELIVERY_LOCALITIES_SUCCESS:
            return {
                ...state,
                deliveryLocalities: action.payload,
                meta: action.meta,
                loading: false,
            }
        case GET_DELIVERY_LOCALITY:
            return {
                ...state,
                loading: true,
            }
        case GET_DELIVERY_LOCALITY_SUCCESS:
            return {
                ...state,
                deliveryLocality: action.payload,
                loading: false,
            }
        case GET_DELIVERY_LOCALITY_FAILED:
            return {
                ...state,
                loading: false,
            }
        case REGISTER_DELIVERY_LOCALITY:
            state = {
                ...state,
                loading: true,
            }
            break
        case REGISTER_DELIVERY_LOCALITY_SUCCESS:
            state = {
                ...state,
                loading: false,
            }
            break
        case REGISTER_DELIVERY_LOCALITY_FAILED:
            state = {
                ...state,
                loading: false,
            }
            break
        case UPDATE_DELIVERY_LOCALITY:
            state = {
                ...state,
                loading: true,
            }
            break
        case UPDATE_DELIVERY_LOCALITY_SUCCESS:
            state = {
                ...state,
                loading: false,
            }
            break
        case UPDATE_DELIVERY_LOCALITY_FAILED:
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

export default deliveryLocalities
