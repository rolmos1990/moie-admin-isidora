import {
    DELETE_COMMENT,
    DELETE_COMMENT_FAILED,
    DELETE_COMMENT_SUCCESS,
    GET_COMMENT,
    GET_COMMENT_FAILED,
    GET_COMMENT_SUCCESS,
    GET_COMMENTS,
    GET_COMMENTS_FAILED,
    GET_COMMENTS_SUCCESS,
    REGISTER_COMMENT,
    REGISTER_COMMENT_FAILED,
    REGISTER_COMMENT_SUCCESS,
    UPDATE_COMMENT,
    UPDATE_COMMENT_FAILED,
    UPDATE_COMMENT_SUCCESS,
} from "./actionTypes";
import Conditionals from "../../common/conditionals";

export const getCommentsByEntity = (entity, idRelated) => {
    const conditions = new Conditionals.Condition;
    conditions.add('entity', entity, Conditionals.OPERATORS.EQUAL);
    conditions.add('idRelated', idRelated, Conditionals.OPERATORS.EQUAL);
    return getComments(conditions.all(), 100, 0);
}

export const getComments = (conditional, limit, offset) => ({
    type: GET_COMMENTS,
    conditional: conditional,
    limit: limit,
    offset: offset
})
export const getCommentsSuccess = (data, meta, entity) => ({
    type: GET_COMMENTS_SUCCESS,
    meta: meta,
    payload: data,
    entity: entity
})
export const getCommentsFailed = error => ({
    type: GET_COMMENTS_FAILED,
    payload: error,
})
export const getComment = id => ({
    type: GET_COMMENT,
    id
})
export const getCommentSuccess = data => ({
    type: GET_COMMENT_SUCCESS,
    payload: data,
})
export const getCommentFailed = error => ({
    type: GET_COMMENT_FAILED,
    payload: error,
})
export const registerComment = (idRelated, data) => {
    return {
        type: REGISTER_COMMENT,
        payload: {idRelated, data},
    }
}
export const registerCommentSuccess = data => {
    return {
        type: REGISTER_COMMENT_SUCCESS,
        payload: data.comment,
    }
}
export const registerCommentFailed = data => {
    return {
        type: REGISTER_COMMENT_FAILED,
        payload: data,
    }
}
export const updateComment = (id, data, history) => {
    return {
        type: UPDATE_COMMENT,
        payload: { id, data, history },
    }
}
export const updateCommentSuccess = data => {
    return {
        type: UPDATE_COMMENT_SUCCESS,
        payload: data,
    }
}
export const updateCommentFail = error => {
    return {
        type: UPDATE_COMMENT_FAILED,
        payload: error,
    }
}
export const deleteComment = (comment) => {
    return {
        type: DELETE_COMMENT,
        payload: { comment },
    }
}
export const deleteCommentSuccess = id => {
    return {
        type: DELETE_COMMENT_SUCCESS,
        payload: id,
    }
}
export const deleteCommentFail = error => {
    return {
        type: DELETE_COMMENT_FAILED,
        payload: error,
    }
}
