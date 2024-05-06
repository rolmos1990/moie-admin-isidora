import {all, call, fork, put, takeEvery} from "redux-saga/effects"

//Account Redux states
import {GET_DELIVERY_LOCALITIES, GET_DELIVERY_LOCALITY, REGISTER_DELIVERY_LOCALITY, UPDATE_DELIVERY_LOCALITY} from "./actionTypes"

import {
    getDeliveryLocalitiesSuccess,
    getDeliveryLocalitiesFailed,
    registerDeliveryLocalitySuccess,
    getDeliveryLocalitySuccess,
    getDeliveryLocalityFailed,
    registerDeliveryLocalityFailed,
    updateDeliveryLocalitySuccess,
    updateDeliveryLocalityFail
} from "./actions"

import {
    registerDeliveryLocalityApi,
    updateDeliveryLocalityApi,
    fetchDeliveryLocalityApi,
    fetchDeliveryLocalitiesApi
} from "../../helpers/backend_helper"

import Conditionals from "../../common/conditionals";

/**
 * *  Configuración de CRUD Saga (Realizar configuración para cada uno de las replicas)
 */

const ACTION_NAME_LIST      =   GET_DELIVERY_LOCALITIES;
const ACTION_NAME_GET       =   GET_DELIVERY_LOCALITY;
const ACTION_NAME_CREATE    =   REGISTER_DELIVERY_LOCALITY;
const ACTION_NAME_UPDATE    =   UPDATE_DELIVERY_LOCALITY;

const LIST_API_REQUEST      =   fetchDeliveryLocalitiesApi;
const GET_API_REQUEST       =   fetchDeliveryLocalityApi;
const POST_API_REQUEST      =   registerDeliveryLocalityApi;
const PUT_API_REQUEST       =   updateDeliveryLocalityApi;

//actions
const LIST_SUCCESS_ACTION   =   getDeliveryLocalitiesSuccess;
const LIST_FAILED_ACTION    =   getDeliveryLocalitiesFailed;
const GET_SUCCESS_ACTION    =   getDeliveryLocalitySuccess;
const GET_FAILED_ACTION     =   getDeliveryLocalityFailed;
const CREATE_SUCCESS_ACTION =   registerDeliveryLocalitySuccess;
const CREATE_FAILED_ACTION  =   registerDeliveryLocalityFailed;
const UPDATE_SUCCESS_ACTION =   updateDeliveryLocalitySuccess;
const UPDATE_FAILED_ACTION  =   updateDeliveryLocalityFail;


const LIST_URL = "/deliveryLocalities";

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
        const order = {field: "name", type: "asc"}
        const cond = Conditionals.getConditionalFormat(conditional);
        const query = Conditionals.buildHttpGetQuery(cond, limit, offset, order);
        const response = yield call(LIST_API_REQUEST, query)
        yield put(LIST_SUCCESS_ACTION(response.data, response.meta));
    } catch (error) {
        yield put(LIST_FAILED_ACTION(error))
    }
}

function* register({ payload: { data, history, customActions } }) {
    try {
        const response = yield call(POST_API_REQUEST, data)
        yield put(CREATE_SUCCESS_ACTION(response))
        if(customActions){
            customActions();
        } else {
            history.push(LIST_URL)
        }

    } catch (error) {
        yield put(CREATE_FAILED_ACTION(error))
    }
}

function* update({ payload: { id, data, history, customActions } }) {
    try {
        const response = yield call(PUT_API_REQUEST, id, data)
        yield put(UPDATE_SUCCESS_ACTION(response))
        if(customActions){
            customActions();
        } else {
            history.push(LIST_URL)
        }

    } catch (error) {
        yield put(UPDATE_FAILED_ACTION(error))
    }
}

export function* watchDeliveryLocality() {
    yield takeEvery(ACTION_NAME_CREATE, register);
    yield takeEvery(ACTION_NAME_UPDATE, update);
    yield takeEvery(ACTION_NAME_LIST, fetch);
    yield takeEvery(ACTION_NAME_GET, get)
}

function* deliveryLocalitySaga() {
    yield all([fork(watchDeliveryLocality)])
}

export default deliveryLocalitySaga
