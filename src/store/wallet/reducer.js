import {
    ADD_ATTACHMENT_WALLET,
    ADD_ATTACHMENT_WALLET_FAILED,
    ADD_ATTACHMENT_WALLET_SUCCESS,
    GET_WALLET,
    GET_WALLET_FAILED,
    GET_WALLET_SUCCESS,
    GET_WALLETS,
    GET_WALLETS_FAILED,
    GET_WALLETS_SUCCESS,
    REGISTER_WALLET,
    REGISTER_WALLET_FAILED,
    REGISTER_WALLET_SUCCESS, RESET_WALLET,
    UPDATE_WALLET, UPDATE_WALLET_FAILED,
    UPDATE_WALLET_SUCCESS
} from "./actionTypes";

const initialState = {
    error: "",
    loading: false,
    meta: {},
    wallets: [],
    wallet: {},
    refresh: false
}

const wallet = (state = initialState, action) => {
    switch (action.type) {
        case RESET_WALLET:
            return {
                ...initialState
            }
        case GET_WALLETS:
            return {
                ...state,
                loading: true,
            }
        case GET_WALLETS_FAILED:
            return {
                ...state,
                error: action.payload,
                loading: true,
            }

        case GET_WALLETS_SUCCESS:
            return {
                ...state,
                wallets: action.payload,
                meta: action.meta,
                loading: false,
            }
        case GET_WALLET:
            return {
                ...state,
                loading: true,
            }
        case GET_WALLET_SUCCESS:
            return {
                ...state,
                wallet: action.payload,
                loading: false,
            }
        case GET_WALLET_FAILED:
            return {
                ...state,
                loading: false,
            }
        case REGISTER_WALLET:
            state = {
                ...state,
                loading: true,
            }
            break
        case REGISTER_WALLET_SUCCESS:
            state = {
                ...state,
                loading: false,
            }
            break
        case REGISTER_WALLET_FAILED:
            state = {
                ...state,
                loading: false,
            }
            break
        case UPDATE_WALLET:
            state = {
                ...state,
                loading: true,
            }
            break
        case UPDATE_WALLET_SUCCESS:
            state = {
                ...state,
                loading: false
            }
            break
        case UPDATE_WALLET_FAILED:
            state = {
                ...state,
                loading: false,
            }
            break
        case ADD_ATTACHMENT_WALLET:
            state = {
                ...state,
                loading: true,
            }
            break
        case ADD_ATTACHMENT_WALLET_FAILED:
            state = {
                ...state,
                loading: false,
            }
            break
        case ADD_ATTACHMENT_WALLET_SUCCESS:
            state = {
                ...state,
                loading: false,
                refresh: !state.refresh
            }
            break
        default:
            state = { ...state }
            break
    }
    return state
}

export default wallet
