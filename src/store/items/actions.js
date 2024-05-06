import {
    GET_ITEMS,
    GET_ITEMS_SUCCESS,
    GET_ITEMS_FAILED,
    GET_ITEM,
    GET_ITEM_SUCCESS,
    GET_ITEM_FAILED,
    REGISTER_ITEM,
    REGISTER_ITEM_SUCCESS,
    REGISTER_ITEM_FAILED,
    UPDATE_ITEM,
    UPDATE_ITEM_SUCCESS,
    UPDATE_ITEM_FAILED,
    RESET_ITEM, GET_EVENTS_FAILED, GET_EVENTS_SUCCESS, GET_EVENTS
} from "./actionTypes";

export const resetItem = () => ({
    type: RESET_ITEM,
})

export const getItems = (conditional, limit, offset) => ({
    type: GET_ITEMS,
    conditional: conditional,
    limit: limit,
    offset: offset
})

export const getItemsSuccess = (data, meta) => ({
    type: GET_ITEMS_SUCCESS,
    meta: meta,
    payload: data,
})

export const getItemsFailed = error => ({
    type: GET_ITEMS_FAILED,
    payload: error,
})

export const getItem = id => ({
    type: GET_ITEM,
    id
})

export const getItemSuccess = data => ({
    type: GET_ITEM_SUCCESS,
    payload: data,
})

export const getItemFailed = error => ({
    type: GET_ITEM_FAILED,
    payload: error,
})

export const registersItem = (data, history) => {
    return {
        type: REGISTER_ITEM,
        payload: { data, history },
    }
}

export const registerItemSuccess = data => {
    return {
        type: REGISTER_ITEM_SUCCESS,
        payload: data,
    }
}


export const registerItemFailed = data => {
    return {
        type: REGISTER_ITEM_FAILED,
        payload: data,
    }
}

export const updateItem = (id, data, history) => {
    return {
        type: UPDATE_ITEM,
        payload: { id, data, history },
    }
}
export const updateItemSuccess = data => {
    return {
        type: UPDATE_ITEM_SUCCESS,
        payload: data,
    }
}
export const updateItemFail = error => {
    return {
        type: UPDATE_ITEM_FAILED,
        payload: error,
    }
}



export const getEvents = (data, history) => {
    return {
        type: GET_EVENTS,
        payload: { data, history },
    }
}

export const getEventsSuccess = data => {
    return {
        type: GET_EVENTS_SUCCESS,
        payload: data,
    }
}


export const getEventsFailed = data => {
    return {
        type: GET_EVENTS_FAILED,
        payload: data,
    }
}
