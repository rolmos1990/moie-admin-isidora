import {
    GET_WALLETS,
    GET_WALLETS_SUCCESS,
    GET_WALLETS_FAILED,
    GET_WALLET,
    GET_WALLET_SUCCESS,
    GET_WALLET_FAILED,
    REGISTER_WALLET,
    REGISTER_WALLET_SUCCESS,
    REGISTER_WALLET_FAILED,
    UPDATE_WALLET,
    UPDATE_WALLET_SUCCESS,
    UPDATE_WALLET_FAILED,
    RESET_WALLET,
    ADD_ATTACHMENT_WALLET,
    ADD_ATTACHMENT_WALLET_SUCCESS,
    ADD_ATTACHMENT_WALLET_FAILED
} from "./actionTypes";

export const resetWallet = () => ({
    type: RESET_WALLET,
})

export const getWallets = (conditional, limit, offset) => ({
    type: GET_WALLETS,
    conditional: conditional,
    limit: limit,
    offset: offset
})

export const getWalletsSuccess = (data, meta) => ({
    type: GET_WALLETS_SUCCESS,
    meta: meta,
    payload: data,
})

export const getWalletsFailed = error => ({
    type: GET_WALLETS_FAILED,
    payload: error,
})

export const getWallet = id => ({
    type: GET_WALLET,
    id
})

export const getWalletSuccess = data => ({
    type: GET_WALLET_SUCCESS,
    payload: data,
})

export const getWalletFailed = error => ({
    type: GET_WALLET_FAILED,
    payload: error,
})

export const registersWallet = (data, history) => {
    return {
        type: REGISTER_WALLET,
        payload: { data, history },
    }
}

export const registerWalletSuccess = data => {
    return {
        type: REGISTER_WALLET_SUCCESS,
        payload: data,
    }
}


export const registerWalletFailed = data => {
    return {
        type: REGISTER_WALLET_FAILED,
        payload: data,
    }
}

export const addAttachmentWallet = (id, data) => {
    return {
        type: ADD_ATTACHMENT_WALLET,
        payload: { id, data },
    }
}

export const addAttachmentWalletSuccess = data => {
    return {
        type: ADD_ATTACHMENT_WALLET_SUCCESS,
        payload: data,
    }
}


export const addAttachmentWalletFailed = data => {
    return {
        type: ADD_ATTACHMENT_WALLET_FAILED,
        payload: data,
    }
}

export const updateWallet = (id, data, history) => {
    return {
        type: UPDATE_WALLET,
        payload: { id, data, history },
    }
}
export const updateWalletSuccess = data => {
    return {
        type: UPDATE_WALLET_SUCCESS,
        payload: data,
    }
}
export const updateWalletFail = error => {
    return {
        type: UPDATE_WALLET_FAILED,
        payload: error,
    }
}
