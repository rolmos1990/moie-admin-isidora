import {all, call, fork, put, takeEvery} from "redux-saga/effects"

//Account Redux states
import {UPDATE_PRODUCT_SIZE_LIST} from "./actionTypes"

import {updateProductSizeListFail, updateProductSizeListSuccess} from "./actions"

import {updateProductSizeListApi} from "../../helpers/backend_helper"

import {showResponseMessage} from "../../helpers/service";

const ACTION_NAME_UPDATE_LIST = UPDATE_PRODUCT_SIZE_LIST;

const PUT_API_REQUEST_LIST  =   updateProductSizeListApi;

//actions
const UPDATE_LIST_SUCCESS_ACTION =   updateProductSizeListSuccess;
const UPDATE_LIST_FAILED_ACTION  =   updateProductSizeListFail;

function* updateList({ payload: { id, data, history } }) {
    try {
        const response = yield call(PUT_API_REQUEST_LIST, id, data)
        showResponseMessage(response, "Tallas actualizadas!");
        yield put(UPDATE_LIST_SUCCESS_ACTION(response))
    } catch (error) {
        yield put(UPDATE_LIST_FAILED_ACTION(error))
    }
}

export function* watchProductSize() {
    yield takeEvery(ACTION_NAME_UPDATE_LIST, updateList);
}

function* productSizeSaga() {
    yield all([fork(watchProductSize)])
}

export default productSizeSaga
