import {all, call, fork, put, takeEvery} from "redux-saga/effects"

//Account Redux states
import {GET_FIELD_OPTIONS, GET_FIELD_OPTION, REGISTER_FIELD_OPTION, UPDATE_FIELD_OPTION, DELETE_FIELD_OPTION} from "./actionTypes"

import {
    getFieldOptionsSuccess,
    getFieldOptionsFailed,
    registerFieldOptionSuccess,
    getFieldOptionSuccess,
    getFieldOptionFailed,
    registerFieldOptionFailed,
    updateFieldOptionSuccess,
    updateFieldOptionFail, deleteFieldOptionFail, deleteFieldOptionSuccess
} from "./actions"

import {
    registerFieldOptionApi,
    updateFieldOptionApi,
    fetchFieldOptionApi,
    fetchFieldOptionsApi, deleteFieldOptionApi
} from "../../helpers/backend_helper"

import Conditionals from "../../common/conditionals";

/**
 * *  Configuración de CRUD Saga (Realizar configuración para cada uno de las replicas)
 */

const ACTION_NAME_LIST      =   GET_FIELD_OPTIONS;
const ACTION_NAME_GET       =   GET_FIELD_OPTION;
const ACTION_NAME_CREATE    =   REGISTER_FIELD_OPTION;
const ACTION_NAME_UPDATE    =   UPDATE_FIELD_OPTION;
const ACTION_NAME_DELETE    =   DELETE_FIELD_OPTION;

const LIST_API_REQUEST      =   fetchFieldOptionsApi;
const GET_API_REQUEST       =   fetchFieldOptionApi;
const POST_API_REQUEST      =   registerFieldOptionApi;
const PUT_API_REQUEST       =   updateFieldOptionApi;
const DELETE_API_REQUEST    =   deleteFieldOptionApi;

//actions
const LIST_SUCCESS_ACTION   =   getFieldOptionsSuccess;
const LIST_FAILED_ACTION    =   getFieldOptionsFailed;
const GET_SUCCESS_ACTION    =   getFieldOptionSuccess;
const GET_FAILED_ACTION     =   getFieldOptionFailed;
const CREATE_SUCCESS_ACTION =   registerFieldOptionSuccess;
const CREATE_FAILED_ACTION  =   registerFieldOptionFailed;
const UPDATE_SUCCESS_ACTION =   updateFieldOptionSuccess;
const UPDATE_FAILED_ACTION  =   updateFieldOptionFail;
const DELETE_SUCCESS_ACTION =   deleteFieldOptionSuccess;
const DELETE_FAILED_ACTION  =   deleteFieldOptionFail;

// const LIST_URL = "/fieldOptions";

function* get({ id }) {
    try {
        const response = yield call(GET_API_REQUEST,  id );
        yield put(GET_SUCCESS_ACTION(response))
    } catch (error) {
        yield put(GET_FAILED_ACTION(error))
    }
}

function* fetch({conditional, limit, offset}) {
    try {
        const cond = Conditionals.getConditionalFormat(conditional);
        const query = Conditionals.buildHttpGetQuery(cond, limit, offset);
        const response = yield call(LIST_API_REQUEST, query)
        yield put(LIST_SUCCESS_ACTION(response.data, response.meta));
    } catch (error) {
        yield put(LIST_FAILED_ACTION(error))
    }
}

function* register({ payload: { data, history } }) {
    try {
        const response = yield call(POST_API_REQUEST, data)
        yield put(CREATE_SUCCESS_ACTION(response))
        //history.push(LIST_URL)
    } catch (error) {
        yield put(CREATE_FAILED_ACTION(error))
    }
}

function* update({ payload: { id, data, history } }) {
    try {
        const response = yield call(PUT_API_REQUEST, id, data)
        yield put(UPDATE_SUCCESS_ACTION(response))
        //history.push(LIST_URL)

    } catch (error) {
        yield put(UPDATE_FAILED_ACTION(error))
    }
}

function* remove({ payload: { id,  history } }) {
    try {
        const response = yield call(DELETE_API_REQUEST, id)
        yield put(DELETE_SUCCESS_ACTION(response))
    } catch (error) {
        yield put(DELETE_FAILED_ACTION(error))
    }
}

export function* watchFieldOption() {
    yield takeEvery(ACTION_NAME_CREATE, register);
    yield takeEvery(ACTION_NAME_UPDATE, update);
    yield takeEvery(ACTION_NAME_DELETE, remove);
    yield takeEvery(ACTION_NAME_LIST, fetch);
    yield takeEvery(ACTION_NAME_GET, get)
}

function* fieldOptionSaga() {
    yield all([fork(watchFieldOption)])
}

export default fieldOptionSaga
