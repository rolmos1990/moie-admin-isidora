import {all, call, fork, put, takeEvery} from "redux-saga/effects"

//Account Redux states
import {DELETE_BILL_CONFIG, GET_BILL_CONFIG, GET_BILL_CONFIGS, QUERY_BILL_CONFIGS, REGISTER_BILL_CONFIG, UPDATE_BILL_CONFIG} from "./actionTypes"

import {
    deleteBillConfigFailed,
    deleteBillConfigSuccess,
    getBillConfigFailed,
    getBillConfigsFailed,
    getBillConfigsSuccess,
    getBillConfigSuccess,
    queryBillConfigsFailed,
    queryBillConfigsSuccess,
    registerBillConfigFailed,
    updateBillConfigFail,
    updateBillConfigSuccess
} from "./actions"

import {deleteBillConfigApi, fetchBillConfigApi, fetchBillConfigsApi, registerBillConfigApi, updateBillConfigApi} from "../../helpers/backend_helper"

import Conditionals from "../../common/conditionals";
import {showResponseMessage} from "../../helpers/service";

/**
 * *  Configuración de CRUD Saga (Realizar configuración para cada uno de las replicas)
*/

const ACTION_NAME_QUERY      =   QUERY_BILL_CONFIGS;
const ACTION_NAME_LIST      =    GET_BILL_CONFIGS;
const ACTION_NAME_GET       =    GET_BILL_CONFIG;
const ACTION_NAME_CREATE    =    REGISTER_BILL_CONFIG;
const ACTION_NAME_UPDATE    =    UPDATE_BILL_CONFIG;
const ACTION_NAME_DELETE    =    DELETE_BILL_CONFIG;

const LIST_API_REQUEST      =   fetchBillConfigsApi;
const GET_API_REQUEST       =   fetchBillConfigApi;
const POST_API_REQUEST      =   registerBillConfigApi;
const PUT_API_REQUEST = updateBillConfigApi;

//actions
const QUERY_SUCCESS_ACTION = queryBillConfigsSuccess;
const QUERY_FAILED_ACTION = queryBillConfigsFailed;
const LIST_SUCCESS_ACTION = getBillConfigsSuccess;
const LIST_FAILED_ACTION = getBillConfigsFailed;
const GET_SUCCESS_ACTION = getBillConfigSuccess;
const GET_FAILED_ACTION = getBillConfigFailed;
const CREATE_FAILED_ACTION = registerBillConfigFailed;
const UPDATE_SUCCESS_ACTION = updateBillConfigSuccess;
const UPDATE_FAILED_ACTION = updateBillConfigFail;


const LIST_URL = "/billConfigs";

function* get({id}) {
    try {
        const response = yield call(GET_API_REQUEST, {id});
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
function* queryData({params ={}, node='bills'}) {
    try {
        const response = yield call(LIST_API_REQUEST, params)
        yield put(QUERY_SUCCESS_ACTION(response.data, response.meta, node));
    } catch (error) {
        yield put(QUERY_FAILED_ACTION(error))
    }
}

function* register({payload: {data, history}}) {
    try {
        const response = yield call(POST_API_REQUEST, data);
        showResponseMessage(response, "Resolución creada!", response.error);
        //yield put(CREATE_SUCCESS_ACTION(response));
        //yield put(refreshList());
        history.push(LIST_URL);
    } catch (error) {
        yield put(CREATE_FAILED_ACTION(error))
        showResponseMessage({status: error.response.data.code}, "", error.response.data.error);
    }
}

function* update({ payload: { id, data, history } }) {
    try {
        const response = yield call(PUT_API_REQUEST, id, data)
        showResponseMessage(response, "Conf. de Resolución han sido actualizada!")
        yield put(UPDATE_SUCCESS_ACTION(response))
        //history.push(LIST_URL)
    } catch (error) {
        yield put(UPDATE_FAILED_ACTION(error))
    }
}

function* billDelete({ payload: { id, history } }) {
    try {
        yield call(deleteBillConfigApi, id)
        yield put(deleteBillConfigSuccess(id))
        showResponseMessage({status:200}, "Resolución borrada!");
        history.push("/bills")

    } catch (error) {
        yield put(deleteBillConfigFailed(error))
    }
}

export function* watchBillConfig() {
    yield takeEvery(ACTION_NAME_CREATE, register);
    yield takeEvery(ACTION_NAME_UPDATE, update);
    yield takeEvery(ACTION_NAME_LIST, fetch);
    yield takeEvery(ACTION_NAME_GET, get);
    yield takeEvery(ACTION_NAME_DELETE, billDelete);
    yield takeEvery(ACTION_NAME_QUERY, queryData);
}

function* billSaga() {
    yield all([fork(watchBillConfig)])
}

export default billSaga
