import {all, call, fork, put, takeEvery} from "redux-saga/effects"

//Account Redux states
import {
    GET_CUSTOMERS,
    GET_CUSTOMER,
    REGISTER_CUSTOMER,
    UPDATE_CUSTOMER,
    DELETE_CUSTOMER,
    QUERY_CUSTOMERS,
    GET_CUSTOMER_REGISTEREDS,
    REGISTER_VCARD
} from "./actionTypes"
import {
    getCustomersSuccess,
    registerCustomerSuccess,
    getCustomersFail,
    getCustomerSuccess,
    getCustomerFail,
    registerCustomerFail,
    updateCustomerSuccess,
    updateCustomerFail,
    deleteCustomerSuccess,
    deleteCustomerFailed,
    queryCustomersFailed,
    queryCustomersSuccess,
    getCustomerRegisteredsSuccess, getCustomerRegisteredsFailed, registerVCardSuccess, registerVCardFail
} from "./actions"

//Include Both Helper File with needed methods
import {
    registerCustomer,
    updateCustomer,
    fetchCustomer,
    fetchCustomersApi,
    deleteCustomerApi, fetchCustomerRegisteredsApi, registerVCardApi
} from "../../helpers/backend_helper"
import Conditionals from "../../common/conditionals";
import {showResponseMessage} from "../../helpers/service";

function* fetchCustomerById({ id }) {
    try {
        const response = yield call(fetchCustomer, { id });
        yield put(getCustomerSuccess(response))
    } catch (error) {
        yield put(getCustomerFail(error))
    }
}


function* fetchCustomers({conditional, limit, offset}) {
    try {

        const cond = Conditionals.getConditionalFormat(conditional);
        const query = Conditionals.buildHttpGetQuery(cond, limit, offset);

        const response = yield call(fetchCustomersApi, query)
        yield put(getCustomersSuccess(response.data, response.meta));
    } catch (error) {
        yield put(getCustomersFail(error))
    }
}
function* queryData({params ={}, node='customers'}) {
    try {
        const response = yield call(fetchCustomersApi, params)
        yield put(queryCustomersSuccess(response.data, response.meta, node));
    } catch (error) {
        yield put(queryCustomersFailed(error))
    }
}

function* fetchCustomerRegistereds() {
    try {
        const response = yield call(fetchCustomerRegisteredsApi)
        yield put(getCustomerRegisteredsSuccess(response));
    } catch (error) {
        yield put(getCustomerRegisteredsFailed(error))
    }
}

// Is customer register successfull then direct plot user in redux.
function* customerRegister({ payload: { customer, history } }) {
    try {
        const response = yield call(registerCustomer, customer)
        showResponseMessage(response, "Cliente creado!");
        yield put(registerCustomerSuccess(response))
        //history.push("/customers")
    } catch (error) {
        if(error && error.response && error.response.data && error.response.data.error == 'doc_exists'){
            showResponseMessage({status: 400}, "Documento ya se encuentra registrado!");
        }
        yield put(registerCustomerFail(error))
    }
}

// Is customer register successfull then direct plot user in redux.
function* customerUpdate({ payload: { id, customer, history } }) {
    try {
        const response = yield call(updateCustomer, id, customer)
        showResponseMessage(response, "Cliente actualizado!");
        yield put(updateCustomerSuccess(response))
        //history.push("/customers")
    } catch (error) {
        yield put(updateCustomerFail(error))
    }
}

function* customerDelete({ payload: { id, history } }) {
    try {
        yield call(deleteCustomerApi, id)
        yield put(deleteCustomerSuccess(id))
        showResponseMessage({status:200}, "Cliente borrado!");
        history.push("/customers")

    } catch (error) {
        yield put(deleteCustomerFailed(error))
    }
}

// Is customer register successfull then direct plot user in redux.
function* vcardRegister({ payload: { vcard, history } }) {
    try {
        const response = yield call(registerVCardApi, vcard)
        showResponseMessage(response, "VCard creado!");
        yield put(registerVCardSuccess(response))
        //history.push("/customers")
    } catch (error) {
        if(error && error.response && error.response.data && error.response.data.error == 'doc_exists'){
            showResponseMessage({status: 400}, "Documento ya se encuentra registrado!");
        }
        yield put(registerVCardFail(error))
    }
}

export function* watchCustomer() {
    yield takeEvery(REGISTER_CUSTOMER, customerRegister);
    yield takeEvery(UPDATE_CUSTOMER, customerUpdate);
    yield takeEvery(GET_CUSTOMERS, fetchCustomers);
    yield takeEvery(GET_CUSTOMER, fetchCustomerById);
    yield takeEvery(DELETE_CUSTOMER, customerDelete);
    yield takeEvery(QUERY_CUSTOMERS, queryData);
    yield takeEvery(GET_CUSTOMER_REGISTEREDS, fetchCustomerRegistereds);
    yield takeEvery(REGISTER_VCARD, vcardRegister);
}

function* customerSaga() {
    yield all([fork(watchCustomer)])
}

export default customerSaga
