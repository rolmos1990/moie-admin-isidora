import {all, call, fork, put, takeEvery} from "redux-saga/effects"

//Account Redux states
import {GET_SIZES, GET_SIZE, REGISTER_SIZE, UPDATE_SIZE} from "./actionTypes"

import {
    getSizesSuccess,
    getSizesFailed,
    registerSizeSuccess,
    getSizeSuccess,
    getSizeFailed,
    registerSizeFailed,
    updateSizeSuccess,
    updateSizeFail
} from "./actions"

import {
    registerSizeApi,
    updateSizeApi,
    fetchSizeApi,
    fetchSizesApi
} from "../../helpers/backend_helper"

import Conditionals from "../../common/conditionals";
import {showResponseMessage} from "../../helpers/service";

/**
 * *  Configuración de CRUD Saga (Realizar configuración para cada uno de las replicas)
 */

const ACTION_NAME_LIST      =   GET_SIZES;
const ACTION_NAME_GET       =   GET_SIZE;
const ACTION_NAME_CREATE    =   REGISTER_SIZE;
const ACTION_NAME_UPDATE    =   UPDATE_SIZE;

const LIST_API_REQUEST      =   fetchSizesApi;
const GET_API_REQUEST       =   fetchSizeApi;
const POST_API_REQUEST      =   registerSizeApi;
const PUT_API_REQUEST       =   updateSizeApi;

//actions
const LIST_SUCCESS_ACTION   =   getSizesSuccess;
const LIST_FAILED_ACTION    =   getSizesFailed;
const GET_SUCCESS_ACTION    =   getSizeSuccess;
const GET_FAILED_ACTION     =   getSizeFailed;
const CREATE_SUCCESS_ACTION =   registerSizeSuccess;
const CREATE_FAILED_ACTION  =   registerSizeFailed;
const UPDATE_SUCCESS_ACTION =   updateSizeSuccess;
const UPDATE_FAILED_ACTION  =   updateSizeFail;


const LIST_URL = "/sizes";

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
        showResponseMessage(response, "Talla creada!");
        yield put(CREATE_SUCCESS_ACTION(response))
        history.push(LIST_URL)

    } catch (error) {
        yield put(CREATE_FAILED_ACTION(error))
    }
}

function* update({ payload: { id, data, history } }) {
    try {
        const response = yield call(PUT_API_REQUEST, id, data)
        showResponseMessage(response, "Talla actualizada!");
        yield put(UPDATE_SUCCESS_ACTION(response))
        history.push(LIST_URL)

    } catch (error) {
        yield put(UPDATE_FAILED_ACTION(error))
    }
}

export function* watchSize() {
    yield takeEvery(ACTION_NAME_CREATE, register);
    yield takeEvery(ACTION_NAME_UPDATE, update);
    yield takeEvery(ACTION_NAME_LIST, fetch);
    yield takeEvery(ACTION_NAME_GET, get)
}

function* sizeSaga() {
    yield all([fork(watchSize)])
}

export default sizeSaga
