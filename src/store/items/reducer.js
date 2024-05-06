import {
    GET_ITEM,
    GET_ITEM_FAILED,
    GET_ITEM_SUCCESS,
    GET_ITEMS,
    GET_ITEMS_FAILED,
    GET_ITEMS_SUCCESS,
    REGISTER_ITEM,
    REGISTER_ITEM_FAILED,
    REGISTER_ITEM_SUCCESS, RESET_ITEM,
    UPDATE_ITEM, UPDATE_ITEM_FAILED,
    UPDATE_ITEM_SUCCESS
} from "./actionTypes";

const initialState = {
    error: "",
    loading: false,
    meta: {},
    items: [],
    item: {},
    refresh: false
}

const item = (state = initialState, action) => {
    switch (action.type) {
        case RESET_ITEM:
            return {
                ...initialState
            }
        case GET_ITEMS:
            return {
                ...state,
                loading: true,
            }
        case GET_ITEMS_FAILED:
            return {
                ...state,
                error: action.payload,
                loading: true,
            }

        case GET_ITEMS_SUCCESS:
            return {
                ...state,
                items: action.payload,
                meta: action.meta,
                loading: false,
            }
        case GET_ITEM:
            return {
                ...state,
                loading: true,
            }
        case GET_ITEM_SUCCESS:
            return {
                ...state,
                item: action.payload,
                loading: false,
            }
        case GET_ITEM_FAILED:
            return {
                ...state,
                loading: false,
            }
        case REGISTER_ITEM:
            state = {
                ...state,
                loading: true,
            }
            break
        case REGISTER_ITEM_SUCCESS:
            state = {
                ...state,
                loading: false,
            }
            break
        case REGISTER_ITEM_FAILED:
            state = {
                ...state,
                loading: false,
            }
            break
        case UPDATE_ITEM:
            state = {
                ...state,
                loading: true,
            }
            break
        case UPDATE_ITEM_SUCCESS:
            state = {
                ...state,
                loading: false
            }
            break
        case UPDATE_ITEM_FAILED:
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

export default item
