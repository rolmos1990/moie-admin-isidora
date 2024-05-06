import {
    DELETE_COMMENT, DELETE_COMMENT_FAILED, DELETE_COMMENT_SUCCESS,
    GET_COMMENT,
    GET_COMMENT_FAILED,
    GET_COMMENT_SUCCESS,
    GET_COMMENTS,
    GET_COMMENTS_FAILED,
    GET_COMMENTS_SUCCESS,
    REGISTER_COMMENT,
    REGISTER_COMMENT_FAILED,
    REGISTER_COMMENT_SUCCESS,
    UPDATE_COMMENT, UPDATE_COMMENT_FAILED,
    UPDATE_COMMENT_SUCCESS
} from "./actionTypes";

const initialState = {
    error: "",
    loading: false,
    meta: {},
    comments: [],
    comment: {},
    refresh: false
}

const comments = (state = initialState, action) => {
    switch (action.type) {
        case GET_COMMENTS:
            return {
                ...state,
                loading: true,
            }
        case GET_COMMENTS_FAILED:
            return {
                ...state,
                error: action.payload,
                loading: true,
            }

        case GET_COMMENTS_SUCCESS:
            return {
                ...state,
                comments: {
                    ...state.comments,
                    [action.entity] : action.payload
                },
                meta: action.meta,
                loading: false
            }
        case GET_COMMENT:
            return {
                ...state,
                loading: true,
            }
        case GET_COMMENT_SUCCESS:
            return {
                ...state,
                comment: action.payload,
                loading: false,
            }
        case GET_COMMENT_FAILED:
            return {
                ...state,
                loading: false,
            }
        case REGISTER_COMMENT:
            state = {
                ...state,
                loading: true,
            }
            break
        case REGISTER_COMMENT_SUCCESS:
            state = {
                ...state,
                loading: false,
                // comments: [...state.comments, action.payload],
            }
            break
        case REGISTER_COMMENT_FAILED:
            state = {
                ...state,
                loading: false,
            }
            break
        case UPDATE_COMMENT:
            state = {
                ...state,
                loading: true,
            }
            break
        case UPDATE_COMMENT_SUCCESS:
            state = {
                ...state,
                loading: false,
            }
            break
        case UPDATE_COMMENT_FAILED:
            state = {
                ...state,
                loading: false,
            }
            break
        case DELETE_COMMENT:
            state = {
                ...state,
                loading: true,
            }
            break
        case DELETE_COMMENT_SUCCESS:
            const comments= [...state.comments];
            const comment = comments.find(i => i.id === action.payload);
            comments.splice(comments.indexOf(comment), 1);
            state = {
                ...state,
                loading: false,
                // comments: comments,
            }
            break
        case DELETE_COMMENT_FAILED:
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

export default comments
