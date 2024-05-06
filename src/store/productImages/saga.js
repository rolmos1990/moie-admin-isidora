import {all, call, fork, put, takeEvery} from "redux-saga/effects"

//Account Redux states
import {
    DELETE_PRODUCT_IMAGE,
    GET_PRODUCT_IMAGE,
    GET_PRODUCT_IMAGES, REFRESH_PRODUCT,
    REGISTER_PRODUCT_IMAGE,
    UPDATE_PRODUCT_IMAGE
} from "./actionTypes"

import {
    getProductImageFailed,
    getProductImagesFailed,
    getProductImagesSuccess,
    getProductImageSuccess, refreshProduct,
    registerProductImageFailed,
    registerProductImageSuccess,
    updateProductImageFail,
    updateProductImageSuccess
} from "./actions"

import {
    deleteProductImageApi,
    fetchProductImageApi,
    fetchProductImagesApi,
    registerProductImageApi,
    updateProductImageApi
} from "../../helpers/backend_helper"

import Conditionals from "../../common/conditionals";
import {showResponseMessage} from "../../helpers/service";
import {showMessage} from "../../components/MessageToast/ShowToastMessages";

/**
 * *  Configuración de CRUD Saga (Realizar configuración para cada uno de las replicas)
 */

const ACTION_NAME_LIST      =   GET_PRODUCT_IMAGES;
const ACTION_NAME_GET       =   GET_PRODUCT_IMAGE;
const ACTION_NAME_CREATE    =   REGISTER_PRODUCT_IMAGE;
const ACTION_NAME_UPDATE    =   UPDATE_PRODUCT_IMAGE;
const ACTION_IMAGE_NAME_DELETE = DELETE_PRODUCT_IMAGE;

const LIST_API_REQUEST               =   fetchProductImagesApi;
const GET_API_REQUEST                =   fetchProductImageApi;
const POST_API_REQUEST               =   registerProductImageApi;
const PUT_API_REQUEST                =   updateProductImageApi;
const DELETE_API_IMAGE_REQUEST       =   deleteProductImageApi;

//actions
const LIST_SUCCESS_ACTION   =   getProductImagesSuccess;
const LIST_FAILED_ACTION    =   getProductImagesFailed;
const GET_SUCCESS_ACTION    =   getProductImageSuccess;
const GET_FAILED_ACTION     =   getProductImageFailed;
const CREATE_SUCCESS_ACTION =   registerProductImageSuccess;
const CREATE_FAILED_ACTION  =   registerProductImageFailed;
const UPDATE_SUCCESS_ACTION =   updateProductImageSuccess;
const UPDATE_FAILED_ACTION  =   updateProductImageFail;


const LIST_URL = "/productImages";

function* deleteImage({ product,number }) {
    try {
        yield call(DELETE_API_IMAGE_REQUEST,  product, number );
        yield put(refreshProduct())
    } catch (error) {
        showMessage.error("No se pudo eliminar imagen");
        //yield put(GET_FAILED_ACTION(error))
    }
}

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
        history.push(LIST_URL)

    } catch (error) {
        yield put(CREATE_FAILED_ACTION(error))
    }
}

function* update({ payload: { id, data, history } }) {
    try {
        const response = yield call(PUT_API_REQUEST, id, data)
        showResponseMessage(response, "Images actualizadas!");
        yield put(UPDATE_SUCCESS_ACTION(response))
        history.post(LIST_URL)

    } catch (error) {
        yield put(UPDATE_FAILED_ACTION(error))
    }
}

export function* watchProductImage() {
    yield takeEvery(ACTION_IMAGE_NAME_DELETE, deleteImage);
    yield takeEvery(ACTION_NAME_CREATE, register);
    yield takeEvery(ACTION_NAME_UPDATE, update);
    yield takeEvery(ACTION_NAME_LIST, fetch);
    yield takeEvery(ACTION_NAME_GET, get)
}

function* productImageSaga() {
    yield all([fork(watchProductImage)])
}

export default productImageSaga
