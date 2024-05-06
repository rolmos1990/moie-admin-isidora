import {all, call, fork, put, takeEvery} from "redux-saga/effects"

//Account Redux states
import {
    CANCELED_STATUS_ORDER,
    CONCILIATION_REQUEST,
    CONFIRM_CONCILIATION_REQUEST, DOWNLOAD_PHOTO,
    GET_DELIVERY_METHODS,
    GET_DELIVERY_QUOTE,
    GET_HISTORIC_ORDER, GET_LINK_PAYMENT,
    GET_ORDER,
    GET_ORDERS,
    GET_ORDERS_OFFICE,
    NEXT_STATUS_ORDER,
    PRINT_BATCH_REQUEST,
    PRINT_ORDER,
    REFRESH_DELIVERY_ORDER,
    REGISTER_ORDER,
    RESUME_ORDER,
    SYNC_DELIVERY_ORDER,
    UPDATE_ORDER, UPDATE_ORDER_PRODUCTS
} from "./actionTypes"

import {
    confirmConciliationFailed,
    confirmConciliationSuccess,
    customOrderFailed,
    customOrderSuccess,
    doConciliationFailed,
    doConciliationSuccess,
    getDeliveryMethodsFailed,
    getDeliveryMethodsSuccess,
    getDeliveryQuoteFailed,
    getDeliveryQuoteSuccess,
    getOrder,
    getOrderFailed,
    getOrdersByOfficeFailed,
    getOrdersByOfficeSuccess,
    getOrdersFailed,
    getOrdersSuccess,
    getOrderSuccess,
    historicOrderFailed,
    historicOrderSuccess,
    printBatchRequestFailed,
    printBatchRequestSuccess,
    refreshOrderDeliveryFail,
    refreshOrderDeliverySuccess,
    refreshOrders,
    registerOrderFailed,
    registerOrderSuccess,
    syncOrderFail,
    syncOrderSuccess,
    updateOrderFail,
    updateOrderSuccess,
    generateLinkPaymentSuccess
} from "./actions"

import {
    batchPrintRequestApi,
    canceledStatusOrderApi,
    conciliationRequestApi,
    confirmConciliationRequestApi, fetchCustomerOrderFinishedApi,
    fetchDeliveryMethodsApi,
    fetchDeliveryQuoteApi,
    fetchOrderApi,
    fetchOrdersApi, generateLinkPaymentApi, increasePhotoCounterApi,
    nextStatusOrderApi,
    orderHistoric,
    printOrderApi,
    refreshStatusDelivery,
    registerOrderApi,
    resumeOrderApi,
    syncOrderDelivery,
    updateOrderApi, updateOrderProductsApi
} from "../../helpers/backend_helper"

import Conditionals from "../../common/conditionals";
import {countUsersOrders, showResponseMessage} from "../../helpers/service";
import {getErrorMessage} from "../../common/utils";

/**
 * *  Configuración de CRUD Saga (Realizar configuración para cada uno de las replicas)
 */

const ACTION_NAME_LIST = GET_ORDERS;
const ACTION_NAME_LIST_OFFICE = GET_ORDERS_OFFICE;
const ACTION_NAME_GET = GET_ORDER;
const ACTION_NAME_CREATE = REGISTER_ORDER;
const ACTION_NAME_UPDATE = UPDATE_ORDER;
const ACTION_ORDER_PRODUCTS_UPDATE = UPDATE_ORDER_PRODUCTS;
const ACTION_GENERATE_LINK = GET_LINK_PAYMENT;

const PRINT_ORDER_API = printOrderApi;
const RESUME_ORDER_API = resumeOrderApi;
const LIST_API_REQUEST = fetchOrdersApi;
const NEXT_STATUS_API_REQUEST = nextStatusOrderApi;
const CANCELED_STATUS_API_REQUEST = canceledStatusOrderApi;
const GET_API_REQUEST = fetchOrderApi;
const POST_API_REQUEST = registerOrderApi;
const PUT_API_REQUEST = updateOrderApi;
const PUT_ORDER_PRODUCTS_API_REQUEST = updateOrderProductsApi;
const BATCH_REQUEST_API_REQUEST = batchPrintRequestApi;
const CONCILIATION_REQUEST_API_REQUEST = conciliationRequestApi;
const CONFIRM_CONCILIATION_REQUEST_API_REQUEST = confirmConciliationRequestApi;
const ORDER_HISTORIC_API_REQUEST = orderHistoric;
const ORDER_DELIVERY_SYNC_API_REQUEST = syncOrderDelivery;
const ORDER_DELIVERY_REFRESH_API_REQUEST = refreshStatusDelivery;
const INCREASE_PHOTO_COUNTER_API_REQUEST = increasePhotoCounterApi;
const GENERATE_LINK_PAYMENT = generateLinkPaymentApi;
const GET_ORDER_FINISHED = fetchCustomerOrderFinishedApi;

//actions
const CUSTOM_SUCCESS_ACTION = customOrderSuccess;
const CUSTOM_FAILED_ACTION = customOrderFailed;
const LIST_SUCCESS_ACTION = getOrdersSuccess;
const LIST_FAILED_ACTION = getOrdersFailed;
const GET_SUCCESS_ACTION = getOrderSuccess;
const GET_FAILED_ACTION = getOrderFailed;
const CREATE_SUCCESS_ACTION = registerOrderSuccess;
const CREATE_FAILED_ACTION = registerOrderFailed;
const UPDATE_SUCCESS_ACTION = updateOrderSuccess;
const UPDATE_FAILED_ACTION = updateOrderFail;
const SYNC_DELIVERY_SUCCESS_ACTION = syncOrderSuccess;
const SYNC_DELIVERY_FAILED_ACTION = syncOrderFail;
const REFRESH_DELIVERY_ORDER_SUCCESS_ACTION = refreshOrderDeliverySuccess;
const REFRESH_DELIVERY_ORDER_FAILED_ACTION = refreshOrderDeliveryFail;

const PRINT_BATCH_REQUEST_SUCCESS_ACTION = printBatchRequestSuccess;
const PRINT_BATCH_REQUEST_FAILED_ACTION = printBatchRequestFailed;
const LIST_OFFICE_SUCCESS_ACTION = getOrdersByOfficeSuccess;
const LIST_OFFICE_FAILED_ACTION = getOrdersByOfficeFailed;
const CONCILIATION_REQUEST_SUCCESS_ACTION = doConciliationSuccess;
const CONCILIATION_REQUEST_FAILED_ACTION = doConciliationFailed;
const CONFIRM_CONCILIATION_REQUEST_SUCCESS_ACTION = confirmConciliationSuccess;
const CONFIRM_CONCILIATION_REQUEST_FAILED_ACTION = confirmConciliationFailed;


function* get({id}) {
    try {
        const response = yield call(GET_API_REQUEST, id);
        yield put(GET_SUCCESS_ACTION(response))
    } catch (error) {
        yield put(GET_FAILED_ACTION(getErrorMessage(error)))
    }
}

function* fetch({conditional, limit, offset, order, ordersFinished = false}) {
    try {
        const cond = Conditionals.getConditionalFormat(conditional);
        const query = Conditionals.buildHttpGetQuery(cond, limit, offset,order);

        const response = yield call(LIST_API_REQUEST, query)

        if(ordersFinished) {
            const customers = response.data.map(order => order.customer && order.customer.id);

            if(customers && customers.length > 0) {
                const responseFinished = yield call(GET_ORDER_FINISHED, {customers});

                const getQtyFinished = (responseFinished, item) => {
                    try {
                        const _orderFinished = responseFinished.filter(_ordersFinished => (_ordersFinished && _ordersFinished.id) == (item.customer && item.customer.id));
                        return (_orderFinished[0] && _orderFinished[0].qty) || 0;
                    } catch (e) {
                        return 0;
                    }
                }

                if (responseFinished && responseFinished.length > 0) {
                    response.data = response.data && response.data.map(order => ({
                            ...order,
                            ordersFinished: getQtyFinished(responseFinished, order),
                        })
                    );
                }

            }
        }

        yield put(LIST_SUCCESS_ACTION(response.data, response.meta));
    } catch (error) {
        yield put(LIST_FAILED_ACTION(getErrorMessage(error)))
    }
}
function* fetchByOffice({conditional, limit, offset}) {
    try {
        const cond = Conditionals.getConditionalFormat(conditional);
        const query = Conditionals.buildHttpGetQuery(cond, limit, offset);

        const response = yield call(LIST_API_REQUEST, query)
        yield put(LIST_OFFICE_SUCCESS_ACTION(response.data, response.meta));
    } catch (error) {
        yield put(LIST_OFFICE_FAILED_ACTION(getErrorMessage(error)))
    }
}

function* register({payload: {data, history}}) {
    try {
        const response = yield call(POST_API_REQUEST, data)
        showResponseMessage(response, "Pedido creado!");
        if (response && response.order) {
            history.push("/order/" + response.order.id)
        }
        yield put(CREATE_SUCCESS_ACTION(response))
        yield put(countUsersOrders());
    } catch (error) {
        yield put(CREATE_FAILED_ACTION(getErrorMessage(error)))
    }
}

function* nextStatus({payload: {data, history}}) {
    try {
        const response = yield call(NEXT_STATUS_API_REQUEST, data)
        if(response.status === 200) yield put(refreshOrders());
        showResponseMessage(response, "Operación exitosa!");
        yield put(UPDATE_SUCCESS_ACTION(response.order))

    } catch (error) {
        yield put(UPDATE_FAILED_ACTION(getErrorMessage(error)))
    }
}

function* canceledStatus({payload: {data, history}}) {
    try {
        const response = yield call(CANCELED_STATUS_API_REQUEST, data)
        if(response.status === 200) yield put(refreshOrders());
        showResponseMessage(response, "Operación exitosa!");
        yield put(UPDATE_SUCCESS_ACTION(response.order))

    } catch (error) {
        yield put(UPDATE_FAILED_ACTION(getErrorMessage(error)))
    }
}

function* printOrder({payload: {id, history}}) {
    try {
        const response = yield call(PRINT_ORDER_API, id)
        yield put(CUSTOM_SUCCESS_ACTION(response.html, "print"))
    } catch (error) {
        yield put(CUSTOM_FAILED_ACTION(getErrorMessage(error)))
    }
}

function* resumeOrder({payload: {id, history}}) {
    try {
        const response = yield call(RESUME_ORDER_API, id)
        yield put(CUSTOM_SUCCESS_ACTION(response.text, "resume"))
    } catch (error) {
        yield put(CUSTOM_FAILED_ACTION(getErrorMessage(error)))
    }
}

function* update({payload: {id, data, history}}) {
    try {
        const response = yield call(PUT_API_REQUEST, id, data)
        showResponseMessage(response, "Operación exitosa!");
        yield put(UPDATE_SUCCESS_ACTION(response.order))
        yield put(getOrder(id))
    } catch (error) {
        yield put(UPDATE_FAILED_ACTION(getErrorMessage(error)))
    }
}

function* updateOrderProducts({payload: {id, data, history}}) {
    try {
        const response = yield call(PUT_ORDER_PRODUCTS_API_REQUEST, id, data);
        showResponseMessage(response, "Operación exitosa!");
        yield put(UPDATE_SUCCESS_ACTION(response.order));
        yield put(getOrder(id))
    } catch (error) {
        console.log('error generado..', error.message);
        yield put(CREATE_FAILED_ACTION(getErrorMessage(error)))
    }
}

function* fetchDeliveryMethods({conditional, limit, offset}) {
    try {
        const cond = Conditionals.getConditionalFormat(conditional);
        const response = yield call(fetchDeliveryMethodsApi, Conditionals.buildHttpGetQuery(cond, limit, offset))
        yield put(getDeliveryMethodsSuccess(response.data, response.meta));
    } catch (error) {
        yield put(getDeliveryMethodsFailed(getErrorMessage(error)))
    }
}

function* fetchDeliveryQuote({data}) {
    try {
        const response = yield call(fetchDeliveryQuoteApi, data)
        yield put(getDeliveryQuoteSuccess(response));
    } catch (error) {
        yield put(getDeliveryQuoteFailed(getErrorMessage(error)))
    }
}

function* batchRequest({conditionals}) {
    try {
        const cond = Conditionals.getConditionalFormat(conditionals);
        const query = Conditionals.buildHttpGetQuery(cond);
        const response = yield call(BATCH_REQUEST_API_REQUEST, query)
        yield put(PRINT_BATCH_REQUEST_SUCCESS_ACTION(response.batch, response.meta))
    } catch (error) {
        showResponseMessage(error, "Operación falida!", getErrorMessage(error));
        yield put(PRINT_BATCH_REQUEST_FAILED_ACTION(getErrorMessage(error)))
    }
}

function* conciliation({orders}) {
    try {
        const response = yield call(CONCILIATION_REQUEST_API_REQUEST, orders)
        showResponseMessage(response, "Operación exitosa!", response.error);
        yield put(CONCILIATION_REQUEST_SUCCESS_ACTION())
    } catch (error) {
        showResponseMessage({status: 500}, "Ocurrió un error!", getErrorMessage(error));
        yield put(CONCILIATION_REQUEST_FAILED_ACTION(getErrorMessage(error)))
    }
}

function* fetchHistoric({payload}) {
    try {
        const response = yield call(ORDER_HISTORIC_API_REQUEST, payload.id);
        yield put(historicOrderSuccess(response.orderHistoric));
    } catch (error) {
        yield put(historicOrderFailed(getErrorMessage(error)))
    }
}

function* confirmConciliation({orders}) {
    try {
        const response = yield call(CONFIRM_CONCILIATION_REQUEST_API_REQUEST, orders)
        showResponseMessage(response, "Operación exitosa!", response.error);
        yield put(refreshOrders());
        yield put(CONFIRM_CONCILIATION_REQUEST_SUCCESS_ACTION())
    } catch (error) {
        showResponseMessage({status: 500}, "Ocurrió un error!", getErrorMessage(error));
        yield put(CONFIRM_CONCILIATION_REQUEST_FAILED_ACTION(getErrorMessage(error)))
    }
}

function* orderDeliverySync({payload: {id, data}}) {
    try {
        const response = yield call(ORDER_DELIVERY_SYNC_API_REQUEST, id, data)
        showResponseMessage(response, "Operación exitosa!", response.error);
        yield put(SYNC_DELIVERY_SUCCESS_ACTION())
    } catch (error) {
        showResponseMessage({status: 500}, "Ocurrió un error!", getErrorMessage(error));
        yield put(SYNC_DELIVERY_FAILED_ACTION(getErrorMessage(error)))
    }
}

function* orderDeliveryRefresh({id}) {
    try {
        const response = yield call(ORDER_DELIVERY_REFRESH_API_REQUEST, id)
        showResponseMessage(response, "Operación exitosa!", response.error);
        yield put(REFRESH_DELIVERY_ORDER_SUCCESS_ACTION())
    } catch (error) {
        showResponseMessage({status: 500}, "Ocurrió un error!", getErrorMessage(error));
        yield put(REFRESH_DELIVERY_ORDER_FAILED_ACTION(getErrorMessage(error)))
    }
}

function* increasePhotoCounter({payload: {id}}) {
    try {
        const response = yield call(INCREASE_PHOTO_COUNTER_API_REQUEST, id)
        if(response.status === 200){
            yield put(refreshOrders());
            showResponseMessage(response, "Operación exitosa!", response.error);
        }
    } catch (error) {
        showResponseMessage({status: 500}, "Ocurrió un error!", getErrorMessage(error));
    }
}

function* generateLinkPayment({payload: {id}}) {
    try {
        const response = yield call(GENERATE_LINK_PAYMENT, id);
        if(response.status === 200){
            yield put(generateLinkPaymentSuccess(response.url));
            showResponseMessage(response, "Se ha generado el link de pago!");
        }
    } catch (error) {
        showResponseMessage({status: 500}, "Ocurrió un error!", getErrorMessage(error));
    }
}


export function* watchOrder() {
    yield takeEvery(ACTION_NAME_CREATE, register);
    yield takeEvery(ACTION_NAME_UPDATE, update);
    yield takeEvery(ACTION_NAME_LIST, fetch);
    yield takeEvery(ACTION_ORDER_PRODUCTS_UPDATE, updateOrderProducts);
    yield takeEvery(ACTION_NAME_LIST_OFFICE, fetchByOffice);
    yield takeEvery(ACTION_NAME_GET, get)
    yield takeEvery(GET_DELIVERY_METHODS, fetchDeliveryMethods)
    yield takeEvery(GET_DELIVERY_QUOTE, fetchDeliveryQuote)
    yield takeEvery(NEXT_STATUS_ORDER, nextStatus)
    yield takeEvery(CANCELED_STATUS_ORDER, canceledStatus)
    yield takeEvery(RESUME_ORDER, resumeOrder)
    yield takeEvery(PRINT_ORDER, printOrder)
    yield takeEvery(PRINT_BATCH_REQUEST, batchRequest)
    yield takeEvery(CONCILIATION_REQUEST, conciliation)
    yield takeEvery(CONFIRM_CONCILIATION_REQUEST, confirmConciliation)
    yield takeEvery(GET_HISTORIC_ORDER, fetchHistoric);
    yield takeEvery(SYNC_DELIVERY_ORDER, orderDeliverySync);
    yield takeEvery(REFRESH_DELIVERY_ORDER, orderDeliveryRefresh);
    yield takeEvery(DOWNLOAD_PHOTO, increasePhotoCounter);
    yield takeEvery(ACTION_GENERATE_LINK, generateLinkPayment);
}

function* orderSaga() {
    yield all([fork(watchOrder)])
}

export default orderSaga;
