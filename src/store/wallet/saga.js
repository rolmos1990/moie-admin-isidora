import {all, call, fork, put, takeEvery} from "redux-saga/effects"

//Account Redux states
import {GET_WALLETS, GET_WALLET, REGISTER_WALLET, UPDATE_WALLET, ADD_ATTACHMENT_WALLET} from "./actionTypes"

import {
    getWalletsSuccess,
    getWalletsFailed,
    registerWalletSuccess,
    getWalletSuccess,
    getWalletFailed,
    registerWalletFailed,
    updateWalletSuccess,
    updateWalletFail, addAttachmentWalletFailed, addAttachmentWalletSuccess
} from "./actions"

import {
    registerWalletApi,
    updateWalletApi,
    fetchWalletApi,
    fetchWalletsApi,
    addAttachmentWalletApi
} from "../../helpers/backend_helper"

import Conditionals from "../../common/conditionals";
import {showResponseMessage} from "../../helpers/service";

/**
 * *  Configuración de CRUD Saga (Realizar configuración para cada uno de las replicas)
 */

const ACTION_NAME_LIST      =   GET_WALLETS;
const ACTION_NAME_GET       =   GET_WALLET;
const ACTION_NAME_CREATE    =   REGISTER_WALLET;
const ACTION_NAME_UPDATE    =   UPDATE_WALLET;
const ACTION_CREATE_ATTACHMENT    =   ADD_ATTACHMENT_WALLET;

const LIST_API_REQUEST      =   fetchWalletsApi;
const GET_API_REQUEST       =   fetchWalletApi;
const POST_API_REQUEST      =   registerWalletApi;
const PUT_API_REQUEST       =   updateWalletApi;
const ADD_ATTACHMENT_API_REQUEST = addAttachmentWalletApi;

//actions
const LIST_SUCCESS_ACTION   =   getWalletsSuccess;
const LIST_FAILED_ACTION    =   getWalletsFailed;
const GET_SUCCESS_ACTION    =   getWalletSuccess;
const GET_FAILED_ACTION     =   getWalletFailed;
const CREATE_SUCCESS_ACTION =   registerWalletSuccess;
const CREATE_FAILED_ACTION  =   registerWalletFailed;
const UPDATE_SUCCESS_ACTION =   updateWalletSuccess;
const UPDATE_FAILED_ACTION  =   updateWalletFail;
const ADD_ATTACHMENT_FAILED_ACTION  =   addAttachmentWalletFailed;
const ADD_ATTACHMENT_SUCCESS_ACTION  =   addAttachmentWalletSuccess;


const LIST_URL = "/wallets";

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

function* createAttachment({ payload: { id, data } }) {
    try {
        const response = yield call(ADD_ATTACHMENT_API_REQUEST, id, data)
        showResponseMessage({status: 200}, "Billetera actualizada!");
        yield put(ADD_ATTACHMENT_SUCCESS_ACTION(response))

    } catch (error) {
        showResponseMessage({status: 400}, "Billetera no pudo ser actualizada!");
        yield put(ADD_ATTACHMENT_FAILED_ACTION(error))
    }
}

export function* watchWallet() {
    yield takeEvery(ACTION_NAME_CREATE, register);
    yield takeEvery(ACTION_NAME_UPDATE, update);
    yield takeEvery(ACTION_NAME_LIST, fetch);
    yield takeEvery(ACTION_NAME_GET, get)
    yield takeEvery(ACTION_CREATE_ATTACHMENT, createAttachment)
}

function* walletSaga() {
    yield all([fork(watchWallet)])
}

export default walletSaga
