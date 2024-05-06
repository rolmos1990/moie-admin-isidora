import {all, call, fork, put, takeEvery} from "redux-saga/effects"

//Account Redux states
import {GET_ITEMS, GET_ITEM, REGISTER_ITEM, UPDATE_ITEM, GET_EVENTS} from "./actionTypes"

import {
    getItemsSuccess,
    getItemsFailed,
    registerItemSuccess,
    getItemSuccess,
    getItemFailed,
    registerItemFailed,
    updateItemSuccess,
    updateItemFail, getEventsSuccess, getEventsFailed
} from "./actions"

import {
    registerItemApi,
    updateItemApi,
    fetchItemApi,
    fetchItemsApi, fetchEventsApi
} from "../../helpers/backend_helper"

import Conditionals from "../../common/conditionals";
import {showResponseMessage} from "../../helpers/service";

/**
 * *  Configuración de CRUD Saga (Realizar configuración para cada uno de las replicas)
 */

const ACTION_NAME_LIST      =   GET_ITEMS;
const ACTION_NAME_GET       =   GET_ITEM;
const ACTION_NAME_CREATE    =   REGISTER_ITEM;
const ACTION_NAME_UPDATE    =   UPDATE_ITEM;

const ACTION_NAME_EVENT    =   GET_EVENTS;

const LIST_API_REQUEST      =   fetchItemsApi;
const GET_API_REQUEST       =   fetchItemApi;
const POST_API_REQUEST      =   registerItemApi;
const PUT_API_REQUEST       =   updateItemApi;

const GET_EVENTS_API_REQUEST =  fetchEventsApi;

//actions
const LIST_SUCCESS_ACTION   =   getItemsSuccess;
const LIST_FAILED_ACTION    =   getItemsFailed;
const GET_SUCCESS_ACTION    =   getItemSuccess;
const GET_FAILED_ACTION     =   getItemFailed;
const CREATE_SUCCESS_ACTION =   registerItemSuccess;
const CREATE_FAILED_ACTION  =   registerItemFailed;
const UPDATE_SUCCESS_ACTION =   updateItemSuccess;
const UPDATE_FAILED_ACTION  =   updateItemFail;

const EVENT_SUCCESS_ACTION   =   getEventsSuccess;
const EVENT_FAILED_ACTION    =   getEventsFailed;

const LIST_URL = "/items";

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
        showResponseMessage(response, "Billetera creada!");
        yield put(CREATE_SUCCESS_ACTION(response))
        history.push(LIST_URL)

    } catch (error) {
        yield put(CREATE_FAILED_ACTION(error))
    }
}

function* update({ payload: { id, data, history } }) {
    try {
        const response = yield call(PUT_API_REQUEST, id, data)
        showResponseMessage(response, "Billetera actualizada!");
        yield put(UPDATE_SUCCESS_ACTION(response))
        history.push(LIST_URL)

    } catch (error) {
        yield put(UPDATE_FAILED_ACTION(error))
    }
}

function* getEvents() {
    try {
        const response = yield call(GET_EVENTS_API_REQUEST, {})
        yield put(EVENT_SUCCESS_ACTION(response.data, response.meta));
    } catch (error) {
        yield put(EVENT_FAILED_ACTION(error))
    }
}

export function* watchItem() {
    yield takeEvery(ACTION_NAME_CREATE, register);
    yield takeEvery(ACTION_NAME_UPDATE, update);
    yield takeEvery(ACTION_NAME_LIST, fetch);
    yield takeEvery(ACTION_NAME_GET, get);
    yield takeEvery(ACTION_NAME_EVENT, getEvents)
}

function* itemSaga() {
    yield all([fork(watchItem)])
}

export default itemSaga
