import {
    DELETE_MUNICIPALITY,
    DELETE_MUNICIPALITY_FAILED,
    DELETE_MUNICIPALITY_SUCCESS,
    DELETE_STATE,
    DELETE_STATE_FAILED,
    DELETE_STATE_SUCCESS,
    GET_MUNICIPALITIES,
    GET_MUNICIPALITIES_FAILED,
    GET_MUNICIPALITIES_SUCCESS,
    GET_MUNICIPALITY,
    GET_MUNICIPALITY_FAILED,
    GET_MUNICIPALITY_SUCCESS,
    GET_STATE,
    GET_STATE_FAILED,
    GET_STATE_SUCCESS,
    GET_STATES,
    GET_STATES_FAILED,
    GET_STATES_SUCCESS,
    REGISTER_MUNICIPALITY,
    REGISTER_MUNICIPALITY_FAILED,
    REGISTER_MUNICIPALITY_SUCCESS,
    REGISTER_STATE,
    REGISTER_STATE_FAILED,
    REGISTER_STATE_SUCCESS,
    RESET_LOCATION,
    UPDATE_MUNICIPALITY,
    UPDATE_MUNICIPALITY_FAILED,
    UPDATE_MUNICIPALITY_SUCCESS,
    UPDATE_STATE,
    UPDATE_STATE_FAILED,
    UPDATE_STATE_SUCCESS
} from "./actionTypes";

const initialState = {
    error: "",
    loading: false,
    municipalities: [],
    municipality: {},
    states: [],
    state: {},
    refresh: false
}

const location = (state = initialState, action) => {
    switch (action.type) {
        case RESET_LOCATION:
            return {
                ...initialState
            }
        case GET_STATES:
            return {
                ...state,
                loading: true,
            }
        case GET_STATES_FAILED:
            return {
                ...state,
                error: action.payload,
                loading: true,
            }
        case GET_STATES_SUCCESS:
            return {
                ...state,
                states: action.payload,
                meta: action.meta,
                loading: false,
            }
        case GET_STATE:
            return {
                ...state,
                loading: true,
            }
        case GET_STATE_SUCCESS:
            return {
                ...state,
                state: action.payload,
                loading: false,
            }
        case GET_STATE_FAILED:
            return {
                ...state,
                loading: false,
            }
        case REGISTER_STATE:
            state = {
                ...state,
                loading: true,
            }
            break
        case REGISTER_STATE_SUCCESS:
            state = {
                ...state,
                loading: false,
            }
            break
        case REGISTER_STATE_FAILED:
            state = {
                ...state,
                loading: false,
            }
            break
        case UPDATE_STATE:
            state = {
                ...state,
                loading: true,
            }
            break
        case UPDATE_STATE_SUCCESS:
            state = {
                ...state,
                loading: false,
            }
            break
        case UPDATE_STATE_FAILED:
            state = {
                ...state,
                loading: false,
            }
            break
        case DELETE_STATE:
            state = {
                ...state,
                loading: true,
            }
            break
        case DELETE_STATE_SUCCESS:
            state = {
                ...state,
                loading: false,
                refresh: !state.refresh
            }
            break
        case DELETE_STATE_FAILED:
            state = {
                ...state,
                loading: false,
            }
            break

        case GET_MUNICIPALITIES:
            return {
                ...state,
                loading: true,
            }
        case GET_MUNICIPALITIES_FAILED:
            return {
                ...state,
                error: action.payload,
                loading: true,
            }

        case GET_MUNICIPALITIES_SUCCESS:
            return {
                ...state,
                municipalities: action.payload,
                meta: action.meta,
                loading: false,
            }
        case GET_MUNICIPALITY:
            return {
                ...state,
                loading: true,
            }
        case GET_MUNICIPALITY_SUCCESS:
            return {
                ...state,
                municipality: action.payload,
                loading: false,
            }
        case GET_MUNICIPALITY_FAILED:
            return {
                ...state,
                loading: false,
            }
        case REGISTER_MUNICIPALITY:
            state = {
                ...state,
                loading: true,
            }
            break
        case REGISTER_MUNICIPALITY_SUCCESS:
            state = {
                ...state,
                loading: false,
            }
            break
        case REGISTER_MUNICIPALITY_FAILED:
            state = {
                ...state,
                loading: false,
            }
            break
        case UPDATE_MUNICIPALITY:
            state = {
                ...state,
                loading: true,
            }
            break
        case UPDATE_MUNICIPALITY_SUCCESS:
            state = {
                ...state,
                loading: false,
            }
            break
        case UPDATE_MUNICIPALITY_FAILED:
            state = {
                ...state,
                loading: false,
            }
            break
        case DELETE_MUNICIPALITY:
            state = {
                ...state,
                loading: true,
            }
            break
        case DELETE_MUNICIPALITY_SUCCESS:
            state = {
                ...state,
                loading: false,
                refresh: !state.refresh
            }
            break
        case DELETE_MUNICIPALITY_FAILED:
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

export default location;
