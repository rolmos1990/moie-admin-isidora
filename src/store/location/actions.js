import {
    REGISTER_STATE,
    REGISTER_STATE_SUCCESS,
    REGISTER_STATE_FAILED,
    UPDATE_STATE_FAILED,
    UPDATE_STATE_SUCCESS,
    UPDATE_STATE,
    DELETE_STATE_FAILED,
    DELETE_STATE_SUCCESS,
    DELETE_STATE,
    GET_STATES,
    GET_STATES_SUCCESS,
    GET_STATES_FAILED,
    GET_STATE,
    GET_STATE_SUCCESS,
    GET_STATE_FAILED,

    REGISTER_MUNICIPALITY_FAILED,
    REGISTER_MUNICIPALITY_SUCCESS,
    REGISTER_MUNICIPALITY,
    UPDATE_MUNICIPALITY,
    UPDATE_MUNICIPALITY_FAILED,
    UPDATE_MUNICIPALITY_SUCCESS,
    DELETE_MUNICIPALITY,
    DELETE_MUNICIPALITY_SUCCESS,
    DELETE_MUNICIPALITY_FAILED,
    GET_MUNICIPALITIES,
    GET_MUNICIPALITIES_SUCCESS,
    GET_MUNICIPALITIES_FAILED,
    GET_MUNICIPALITY,
    GET_MUNICIPALITY_SUCCESS,
    GET_MUNICIPALITY_FAILED, RESET_LOCATION,
} from "./actionTypes";

export const resetLocation = () => ({
    type: RESET_LOCATION,
})

export const getState = id => ({
    type: GET_STATE,
    id
})

export const getStateSuccess = data => ({
    type: GET_STATE_SUCCESS,
    payload: data,
})

export const getStateFail = error => ({
    type: GET_STATE_FAILED,
    payload: error,
})

export const registerState = (data, history) => {
    return {
        type: REGISTER_STATE,
        payload: {data, history},
    }
}

export const registerStateSuccess = data => {
    return {
        type: REGISTER_STATE_SUCCESS,
        payload: data,
    }
}

export const registerStateFail = data => {
    return {
        type: REGISTER_STATE_FAILED,
        payload: data,
    }
}

export const getStates = (conditional, limit, offset) => ({
    type: GET_STATES,
    conditional,
    limit,
    offset
})

export const getStatesSuccess = data => ({
    type: GET_STATES_SUCCESS,
    payload: data,
})

export const getStatesFailed = error => ({
    type: GET_STATES_FAILED,
    payload: error,
})

export const updateState = (id, data, history) => {
    return {
        type: UPDATE_STATE,
        payload: {id, data, history},
    }
}

export const updateStateSuccess = data => {
    return {
        type: UPDATE_STATE_SUCCESS,
        payload: data,
    }
}

export const updateStateFail = error => {
    return {
        type: UPDATE_STATE_FAILED,
        payload: error,
    }
}

export const deleteState = (id, history) => ({
    type: DELETE_STATE,
    payload: {id, history}
})

export const deleteStateSuccess = () => ({
    type: DELETE_STATE_SUCCESS
})

export const deleteStateFailed = error => ({
    type: DELETE_STATE_FAILED,
    payload: error,
})


export const getMunicipality = id => ({
    type: GET_MUNICIPALITY,
    id
})


export const getMunicipalitySuccess = data => ({
    type: GET_MUNICIPALITY_SUCCESS,
    payload: data,
})

export const getMunicipalityFail = error => ({
    type: GET_MUNICIPALITY_FAILED,
    payload: error,
})

export const registerMunicipality = (data, history) => {
    return {
        type: REGISTER_MUNICIPALITY,
        payload: {data, history},
    }
}

export const registerMunicipalitySuccess = data => {
    return {
        type: REGISTER_MUNICIPALITY_SUCCESS,
        payload: data,
    }
}

export const registerMunicipalityFail = data => {
    return {
        type: REGISTER_MUNICIPALITY_FAILED,
        payload: data,
    }
}


export const getMunicipalities = (conditional, limit, offset) => ({
    type: GET_MUNICIPALITIES,
    conditional,
    limit,
    offset
})
export const getMunicipalitiesSuccess = data => ({
    type: GET_MUNICIPALITIES_SUCCESS,
    payload: data,
})

export const getMunicipalitiesFailed = error => ({
    type: GET_MUNICIPALITIES_FAILED,
    payload: error,
})

export const updateMunicipality = (id, data, history) => {
    return {
        type: UPDATE_MUNICIPALITY,
        payload: {id, data, history},
    }
}

export const updateMunicipalitySuccess = data => {
    return {
        type: UPDATE_MUNICIPALITY_SUCCESS,
        payload: data,
    }
}

export const updateMunicipalityFail = error => {
    return {
        type: UPDATE_MUNICIPALITY_FAILED,
        payload: error,
    }
}

export const deleteMunicipality = (id, history) => ({
    type: DELETE_MUNICIPALITY,
    payload: {id, history}
})

export const deleteMunicipalitySuccess = () => ({
    type: DELETE_MUNICIPALITY_SUCCESS
})

export const deleteMunicipalityFailed = error => ({
    type: DELETE_MUNICIPALITY_FAILED,
    payload: error,
})
