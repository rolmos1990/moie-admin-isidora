import {all, call, fork, put, takeEvery} from "redux-saga/effects"

//Account Redux states
import {GET_TEMPLATES, GET_TEMPLATE, REGISTER_TEMPLATE, UPDATE_TEMPLATE, GET_TEMPLATE_CATALOG} from "./actionTypes"

import {
    getTemplatesSuccess,
    getTemplatesFailed,
    registerTemplateSuccess,
    getTemplateSuccess,
    getTemplateFailed,
    registerTemplateFailed,
    updateTemplateSuccess,
    updateTemplateFail, getTemplatesCatalogSuccess, getTemplatesCatalogFailed
} from "./actions"

import {
    registerTemplateApi,
    updateTemplateApi,
    fetchTemplateApi,
    fetchTemplatesApi, fetchTemplatesCatalogsApi
} from "../../helpers/backend_helper"

import Conditionals from "../../common/conditionals";
import {showResponseMessage} from "../../helpers/service";

/**
 * *  Configuración de CRUD Saga (Realizar configuración para cada uno de las replicas)
 */

const ACTION_NAME_LIST      =   GET_TEMPLATES;
const ACTION_NAME_GET       =   GET_TEMPLATE;
const ACTION_NAME_CREATE    =   REGISTER_TEMPLATE;
const ACTION_NAME_UPDATE    =   UPDATE_TEMPLATE;
const ACTION_NAME_CATALOGS  =   GET_TEMPLATE_CATALOG;

const LIST_API_REQUEST      =   fetchTemplatesApi;
const GET_API_REQUEST       =   fetchTemplateApi;
const POST_API_REQUEST      =   registerTemplateApi;
const PUT_API_REQUEST       =   updateTemplateApi;
const LIST_API_TEMPLATE_CATALOG_REQUEST       =   fetchTemplatesCatalogsApi;

//actions
const LIST_SUCCESS_ACTION   =   getTemplatesSuccess;
const LIST_FAILED_ACTION    =   getTemplatesFailed;
const GET_SUCCESS_ACTION    =   getTemplateSuccess;
const GET_FAILED_ACTION     =   getTemplateFailed;
const CREATE_SUCCESS_ACTION =   registerTemplateSuccess;
const CREATE_FAILED_ACTION  =   registerTemplateFailed;
const UPDATE_SUCCESS_ACTION =   updateTemplateSuccess;
const UPDATE_FAILED_ACTION  =   updateTemplateFail;
const LIST_TEMPLATE_CATALOG_SUCCESS_ACTION   =   getTemplatesCatalogSuccess;
const LIST_TEMPLATE_CATALOG_FAILED_ACTION    =   getTemplatesCatalogFailed;


const LIST_URL = "/templates";

function* get({ id }) {
    try {
        const response = yield call(GET_API_REQUEST,  id );
        yield put(GET_SUCCESS_ACTION(response))
    } catch (error) {
        yield put(GET_FAILED_ACTION(error))
    }
}

function* fetchTemplateCatalogs({conditional, limit, offset}) {
    try {
        const cond = Conditionals.getConditionalFormat(conditional);
        const query = Conditionals.buildHttpGetQuery(cond, limit, offset);

        const response = yield call(LIST_API_TEMPLATE_CATALOG_REQUEST, query)
        yield put(LIST_TEMPLATE_CATALOG_SUCCESS_ACTION(response.data, response.meta));
    } catch (error) {
        yield put(LIST_TEMPLATE_CATALOG_FAILED_ACTION(error))
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
        showResponseMessage(response, "Plantilla creada!");
        yield put(CREATE_SUCCESS_ACTION(response))
        history.push(LIST_URL)

    } catch (error) {
        yield put(CREATE_FAILED_ACTION(error))
    }
}

function* update({ payload: { id, data, history } }) {
    try {
        const response = yield call(PUT_API_REQUEST, id, data)
        showResponseMessage(response, "Plantilla actualizada!");
        yield put(UPDATE_SUCCESS_ACTION(response))
        history.push(LIST_URL)

    } catch (error) {
        yield put(UPDATE_FAILED_ACTION(error))
    }
}

export function* watchTemplate() {
    yield takeEvery(ACTION_NAME_CREATE, register);
    yield takeEvery(ACTION_NAME_UPDATE, update);
    yield takeEvery(ACTION_NAME_LIST, fetch);
    yield takeEvery(ACTION_NAME_GET, get)
    yield takeEvery(ACTION_NAME_CATALOGS, fetchTemplateCatalogs)
}

function* sizeSaga() {
    yield all([fork(watchTemplate)])
}

export default sizeSaga
