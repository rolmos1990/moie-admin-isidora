import {all, call, fork, put, takeEvery} from "redux-saga/effects"

import {GENERATE_REPORT, GET_REPORT_DASHBOARD} from "./actionTypes"
import {b64toBlob} from "../../common/utils";
import {
    generateReportFailed,
    generateReportSuccess,
    getReportDashbordFailed,
    getReportDashbordSuccess
} from "./actions";
import {
    customerReportApi,
    billReportApi,
    conciliationReportApi,
    officeReportApi,
    postSaleReportApi,
    statsDashboardApi
} from "../../helpers/backend_helper";
import {REPORT_TYPES} from "../../common/constants";
import {showResponseMessage} from "../../helpers/service";
import Conditionals from "../../common/conditionals";

const apiMap = {}
apiMap[REPORT_TYPES.CUSTOMER] = customerReportApi;
apiMap[REPORT_TYPES.BILLS] = billReportApi;
apiMap[REPORT_TYPES.CONCILIATION] = conciliationReportApi;
apiMap[REPORT_TYPES.POST_SALE] = postSaleReportApi;
apiMap[REPORT_TYPES.OFFICE] = officeReportApi;
const STAT_DASHBOARD = statsDashboardApi;


function* generateReport({reportType, data}) {
    try {
        console.log('data: ', data);
        if (!apiMap[reportType]) {
            showResponseMessage({status: 500}, "Reporte no valido");
        }

        let blob;
        if(data.conditional) {
            const cond = Conditionals.getConditionalFormat(data.conditional);
            console.log('cond: ', cond);
            const query = Conditionals.buildHttpGetQuery(cond, data.limit, data.offset);
            console.log('query run: ', query);
            blob = yield call(apiMap[reportType], query);
        } else {
            blob = yield call(apiMap[reportType], new URLSearchParams(data));
        }


        const _url = window.URL.createObjectURL(b64toBlob(blob.data));
        const a = document.createElement('a');
        a.style.display = 'none';
        a.href = _url;
        // the filename you want

        if(!blob.name){
            showResponseMessage({status: 200}, "No se encontraron registros para este periodo");
        } else {
            a.download = blob.name;
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(_url);
            yield put(generateReportSuccess());
            showResponseMessage({status: 200}, "Reporte generado!");
        }
    } catch (e) {
        yield put(generateReportFailed(e.message))
        showResponseMessage({status: 500}, "No se logró general el reporte");
    }
}

function* getStatDashboard() {
    try {
        const response = yield call(STAT_DASHBOARD)
        yield put(getReportDashbordSuccess(response));
    } catch (error) {
        yield put(getReportDashbordFailed(error))
    }
}

export function* watchReport() {
    yield takeEvery(GENERATE_REPORT, generateReport)
    yield takeEvery(GET_REPORT_DASHBOARD, getStatDashboard)
}

function* reportSaga() {
    yield all([fork(watchReport)])
}

export default reportSaga
