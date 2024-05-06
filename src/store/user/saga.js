import {all, call, fork, put, takeEvery} from "redux-saga/effects"

//Account Redux states
import {
    GET_USERS,
    GET_USER,
    REGISTER_USER,
    UPDATE_USER,
    CHANGE_PASSWORD,
    COUNT_USERS_SUCCESS,
    COUNT_USERS_FAILED, COUNT_USERS
} from "./actionTypes"

import {
    getUsersSuccess,
    getUsersFailed,
    registerUserSuccess,
    getUserSuccess,
    getUserFailed,
    registerUserFailed,
    updateUserSuccess,
    updateUserFail, changePasswordSuccess, changePasswordFailed, countUsersSuccess, countUsersFailed
} from "./actions"

import {
    registerUserApi,
    updateUserApi,
    fetchUserApi,
    fetchUsersApi, changePasswordApi, fetchOrdersApi
} from "../../helpers/backend_helper"

import Conditionals from "../../common/conditionals";
import {showResponseMessage} from "../../helpers/service";
import {formatDateToServer, getMoment} from "../../common/utils";

/**
 * *  Configuración de CRUD Saga (Realizar configuración para cada uno de las replicas)
 */

const ACTION_NAME_LIST      =   GET_USERS;
const ACTION_NAME_GET       =   GET_USER;
const ACTION_NAME_CREATE    =   REGISTER_USER;
const ACTION_NAME_UPDATE    =   UPDATE_USER;
const ACTION_NAME_CHANGE_PASSWORD    =   CHANGE_PASSWORD;

const LIST_API_REQUEST      =   fetchUsersApi;
const GET_API_REQUEST       =   fetchUserApi;
const POST_API_REQUEST      =   registerUserApi;
const PUT_API_REQUEST       =   updateUserApi;
const CHANGE_PASSWORD_API_REQUEST  =   changePasswordApi;

//actions
const LIST_SUCCESS_ACTION   =   getUsersSuccess;
const LIST_FAILED_ACTION    =   getUsersFailed;
const GET_SUCCESS_ACTION    =   getUserSuccess;
const GET_FAILED_ACTION     =   getUserFailed;
const CREATE_SUCCESS_ACTION =   registerUserSuccess;
const CREATE_FAILED_ACTION  =   registerUserFailed;
const UPDATE_SUCCESS_ACTION =   updateUserSuccess;
const UPDATE_FAILED_ACTION  =   updateUserFail;
const CHANGE_PASSWORD_SUCCESS_ACTION =   changePasswordSuccess;
const CHANGE_PASSWORD_FAILED_ACTION  =   changePasswordFailed;


const LIST_URL = "/users";

function* get({ id }) {
    try {
        const response = yield call(GET_API_REQUEST,  id );
        yield put(GET_SUCCESS_ACTION(response))
    } catch (error) {
        yield put(GET_FAILED_ACTION(error))
    }
}


function* fetch({conditional, limit = 50, offset}) {
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
        showResponseMessage(response, "Usuario creado!");
        yield put(CREATE_SUCCESS_ACTION(response))
        history.push(LIST_URL)

    } catch (error) {
        yield put(CREATE_FAILED_ACTION(error))
    }
}

function* update({ payload: { id, data, history } }) {
    try {
        const response = yield call(PUT_API_REQUEST, id, data)
        showResponseMessage(response, "Usuario actualizado!");
        yield put(UPDATE_SUCCESS_ACTION(response))
        history.push(LIST_URL)

    } catch (error) {
        yield put(UPDATE_FAILED_ACTION(error))
    }
}

function* changePassword({ payload }) {
    try {
        const response = yield call(CHANGE_PASSWORD_API_REQUEST, payload)
        showResponseMessage(response, (response.code === 200 ? "Contraseña actualizada!": response.error));
        yield put(CHANGE_PASSWORD_SUCCESS_ACTION(response))
    } catch (error) {
        yield put(CHANGE_PASSWORD_FAILED_ACTION(error))
    }
}

function* getCountUsers() {
    try {
        const conditions = new Conditionals.Condition;
        conditions.add('status', [1,2,3,4,5,7].join("::"), Conditionals.OPERATORS.IN);
        conditions.add('createdAt', formatDateToServer(getMoment().startOf('day')), Conditionals.OPERATORS.GREATER_THAN_OR_EQUAL)

        const query = {};
        query.conditional = Conditionals.getConditionalFormat(conditions.all());
        query.operation = 'origen::count,totalAmount::sum';
        query.group = 'user_id';

        const payload = Conditionals.urlSearchParams(query);

        const response = yield call(fetchOrdersApi, payload)
        yield put(countUsersSuccess(response))
    } catch (error) {
        yield put(countUsersFailed(error))
    }
}

export function* watchUser() {
    yield takeEvery(ACTION_NAME_CREATE, register);
    yield takeEvery(ACTION_NAME_UPDATE, update);
    yield takeEvery(ACTION_NAME_LIST, fetch);
    yield takeEvery(ACTION_NAME_GET, get)
    yield takeEvery(ACTION_NAME_CHANGE_PASSWORD, changePassword)
    yield takeEvery(COUNT_USERS, getCountUsers)
}

function* userSaga() {
    yield all([fork(watchUser)])
}

export default userSaga
