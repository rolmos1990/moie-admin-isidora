import {all, call, fork, put, takeEvery} from "redux-saga/effects"

import Conditionals from "../../common/conditionals";
import {DELETE_MUNICIPALITY, DELETE_STATE, GET_MUNICIPALITIES, GET_MUNICIPALITY, GET_STATE, GET_STATES, REGISTER_MUNICIPALITY, REGISTER_STATE, UPDATE_MUNICIPALITY, UPDATE_STATE} from "./actionTypes";
import {
    deleteMunicipalityFailed,
    deleteMunicipalitySuccess,
    deleteStateFailed,
    deleteStateSuccess,
    getMunicipalitiesFailed,
    getMunicipalitiesSuccess,
    getMunicipalityFail,
    getMunicipalitySuccess,
    getStateFail,
    getStatesFailed,
    getStatesSuccess,
    getStateSuccess,
    registerMunicipalityFail,
    registerMunicipalitySuccess,
    registerStateFail,
    registerStateSuccess,
    updateMunicipalityFail,
    updateMunicipalitySuccess,
    updateStateFail,
    updateStateSuccess
} from "./actions";
import {
    deleteMunicipalityApi,
    deleteStateApi,
    fetchMunicipalitiesApi,
    fetchMunicipalityApi,
    fetchStateApi,
    fetchStatesApi,
    registerMunicipalityApi,
    registerStateApi,
    updateMunicipalityApi,
    updateStateApi
} from "../../helpers/backend_helper";
import {showResponseMessage} from "../../helpers/service";


function* fetchStateById({id}) {
    try {
        const response = yield call(fetchStateApi, id);
        yield put(getStateSuccess(response))
    } catch (error) {
        yield put(getStateFail(error))
    }
}

function* fetchStates({conditional, limit, offset}) {
    try {
        const cond = Conditionals.getConditionalFormat(conditional);
        const query = Conditionals.buildHttpGetQuery(cond, limit, offset);

        const response = yield call(fetchStatesApi, query)
        yield put(getStatesSuccess(response.data, response.meta));
    } catch (error) {
        yield put(getStatesFailed(error))
    }
}

function* stateRegister({payload: {data, history}}) {
    try {
        const response = yield call(registerStateApi, data)
        showResponseMessage(response, "Estado creado!");
        yield put(registerStateSuccess(response))
        history.push("/States")

    } catch (error) {
        yield put(registerStateFail(error))
    }
}

function* stateUpdate({payload: {id, data, history}}) {
    try {
        const response = yield call(updateStateApi, id, data)
        showResponseMessage(response, "Estado actualizado!");
        yield put(updateStateSuccess(response))
        history.push("/states")

    } catch (error) {
        yield put(updateStateFail(error))
    }
}

function* stateDelete({payload: {id, history}}) {
    try {
        yield call(deleteStateApi, id)
        showResponseMessage({status:200}, "Estado borrado!");
        yield put(deleteStateSuccess(id))
        history.push("/states")

    } catch (error) {
        yield put(deleteStateFailed(error))
    }
}


function* fetchMunicipalityById({id}) {
    try {
        const response = yield call(fetchMunicipalityApi, id);
        yield put(getMunicipalitySuccess(response))
    } catch (error) {
        yield put(getMunicipalityFail(error))
    }
}

function* fetchMunicipalities({conditional, limit, offset}) {
    try {
        const cond = Conditionals.getConditionalFormat(conditional);
        const query = Conditionals.buildHttpGetQuery(cond, limit, offset);

        const response = yield call(fetchMunicipalitiesApi, query)
        yield put(getMunicipalitiesSuccess(response.data, response.meta));
    } catch (error) {
        yield put(getMunicipalitiesFailed(error))
    }
}

function* municipalityRegister({payload: {data, history}}) {
    try {
        const response = yield call(registerMunicipalityApi, data)
        showResponseMessage(response, "Municipio creado!");
        yield put(registerMunicipalitySuccess(response))
        history.push("/municipalities")
    } catch (error) {
        yield put(registerMunicipalityFail(error))
    }
}

function* municipalityUpdate({payload: {id, data, history}}) {
    try {
        const response = yield call(updateMunicipalityApi, id, data)
        showResponseMessage(response, "Municipio actualizada!");
        yield put(updateMunicipalitySuccess(response))
        history.push("/municipalities")

    } catch (error) {
        yield put(updateMunicipalityFail(error))
    }
}

function* municipalityDelete({payload: {id, history}}) {
    try {
        yield call(deleteMunicipalityApi, id)
        showResponseMessage({status: 200}, "Municipio borrado!");
        yield put(deleteMunicipalitySuccess(id))
        history.push("/municipalities")

    } catch (error) {
        yield put(deleteMunicipalityFailed(error))
    }
}

export function* watchLocations() {
    yield takeEvery(GET_STATE, fetchStateById);
    yield takeEvery(GET_STATES, fetchStates);
    yield takeEvery(REGISTER_STATE, stateRegister);
    yield takeEvery(UPDATE_STATE, stateUpdate);
    yield takeEvery(DELETE_STATE, stateDelete);

    yield takeEvery(GET_MUNICIPALITY, fetchMunicipalityById);
    yield takeEvery(GET_MUNICIPALITIES, fetchMunicipalities);
    yield takeEvery(REGISTER_MUNICIPALITY, municipalityRegister);
    yield takeEvery(UPDATE_MUNICIPALITY, municipalityUpdate);
    yield takeEvery(DELETE_MUNICIPALITY, municipalityDelete);
}

function* locationSaga() {
    yield all([fork(watchLocations)])
}

export default locationSaga
