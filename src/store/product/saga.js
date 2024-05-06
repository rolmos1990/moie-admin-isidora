import {all, call, fork, put, takeEvery} from "redux-saga/effects"

//Account Redux states
import {
    GET_PRODUCT,
    GET_PRODUCTS,
    ORDER_PRODUCT,
    QUERY_PENDING_PRODUCTS,
    QUERY_PRODUCTS,
    REGISTER_PRODUCT,
    UPDATE_PRODUCT
} from "./actionTypes"

import {
    getProductFailed,
    getProductsFailed,
    getProductsSuccess,
    getProductSuccess,
    queryProductsFailed,
    queryProductsSuccess,
    registerProductFailed,
    registerProductSuccess, reorderProductFail, reorderProductSuccess,
    updateProductFail,
    updateProductSuccess
} from "./actions"

import {
    fetchProductApi,
    fetchProductsApi,
    getProductsPendingApi,
    registerProductApi,
    reorderProductApi,
    updateProductApi
} from "../../helpers/backend_helper"

import Conditionals from "../../common/conditionals";
import {showResponseMessage} from "../../helpers/service";

/**
 * *  Configuración de CRUD Saga (Realizar configuración para cada uno de las replicas)
*/

const ACTION_NAME_QUERY_PENDING_PRODUCTS =   QUERY_PENDING_PRODUCTS;
const ACTION_NAME_QUERY      =   QUERY_PRODUCTS;
const ACTION_NAME_LIST      =   GET_PRODUCTS;
const ACTION_NAME_GET       =   GET_PRODUCT;
const ACTION_NAME_CREATE    =   REGISTER_PRODUCT;
const ACTION_NAME_UPDATE    =   UPDATE_PRODUCT;
const ACTION_NAME_REORDER    =  ORDER_PRODUCT;

const PENDING_PRODUCTS_API_REQUEST   =   getProductsPendingApi;
const LIST_API_REQUEST      =   fetchProductsApi;
const GET_API_REQUEST       =   fetchProductApi;
const POST_API_REQUEST      =   registerProductApi;
const PUT_API_REQUEST       =   updateProductApi;
const REORDER_API_REQUEST       =   reorderProductApi;

//actions
const QUERY_SUCCESS_ACTION  =   queryProductsSuccess;
const QUERY_FAILED_ACTION   =   queryProductsFailed;
const LIST_SUCCESS_ACTION   =   getProductsSuccess;
const LIST_FAILED_ACTION    =   getProductsFailed;
const GET_SUCCESS_ACTION    =   getProductSuccess;
const GET_FAILED_ACTION     =   getProductFailed;
const CREATE_SUCCESS_ACTION =   registerProductSuccess;
const CREATE_FAILED_ACTION  =   registerProductFailed;
const UPDATE_SUCCESS_ACTION =   updateProductSuccess;
const UPDATE_FAILED_ACTION  =   updateProductFail;
const REORDER_SUCCESS_ACTION =   reorderProductSuccess;
const REORDER_FAILED_ACTION  =   reorderProductFail;


function* get({ id }) {
    try {
        const response = yield call(GET_API_REQUEST, { id });
        yield put(GET_SUCCESS_ACTION(response))
    } catch (error) {
        yield put(GET_FAILED_ACTION(error))
    }
}


function* fetch({conditional, limit, offset, order = false}) {
    try {
        const cond = Conditionals.getConditionalFormat(conditional);
        const query = Conditionals.buildHttpGetQuery(cond, limit, offset, order);
        const response = yield call(LIST_API_REQUEST, query)
        yield put(LIST_SUCCESS_ACTION(response.data, response.meta));
    } catch (error) {
        yield put(LIST_FAILED_ACTION(error))
    }
}
function* queryData({params ={}, node='products'}) {
    try {
        const response = yield call(LIST_API_REQUEST, params)
        yield put(QUERY_SUCCESS_ACTION(response.data, response.meta, node));
    } catch (error) {
        yield put(QUERY_FAILED_ACTION(error))
    }
}
function* getPendingProducts({id}) {
    try {
        const response = yield call(PENDING_PRODUCTS_API_REQUEST, id)
        yield put(QUERY_SUCCESS_ACTION(response.products, response.meta, 'pendingProducts'));
    } catch (error) {
        yield put(QUERY_FAILED_ACTION(error))
    }
}

function* register({ payload: { data, history } }) {
    try {
        const response = yield call(POST_API_REQUEST, data)
        showResponseMessage(response, "Producto creado!");
        yield put(CREATE_SUCCESS_ACTION(response))
        if (response && response.product && response.product.id) {
            history.push("/product/" + response.product.id)
        }
    } catch (error) {
        yield put(CREATE_FAILED_ACTION(error))
    }
}

function* update({ payload: { id, data, history } }) {
    try {
        const response = yield call(PUT_API_REQUEST, id, data)
        showResponseMessage(response, "Producto actualizado!")
        yield put(UPDATE_SUCCESS_ACTION(response))
        //history.push(LIST_URL)
    } catch (error) {
        yield put(UPDATE_FAILED_ACTION(error))
    }
}

function* reorder({ payload: { id, data, history } }) {
    try {
        const response = yield call(REORDER_API_REQUEST, id, data)
        showResponseMessage(response, "Productos actualizados!")
        yield put(REORDER_SUCCESS_ACTION(response))
    } catch (error) {
        yield put(REORDER_FAILED_ACTION(error))
    }
}

export function* watchProduct() {
    yield takeEvery(ACTION_NAME_CREATE, register);
    yield takeEvery(ACTION_NAME_UPDATE, update);
    yield takeEvery(ACTION_NAME_LIST, fetch);
    yield takeEvery(ACTION_NAME_GET, get)
    yield takeEvery(ACTION_NAME_QUERY, queryData)
    yield takeEvery(ACTION_NAME_QUERY_PENDING_PRODUCTS, getPendingProducts)
    yield takeEvery(ACTION_NAME_REORDER, reorder)
}

function* productSaga() {
    yield all([fork(watchProduct)])
}

export default productSaga
