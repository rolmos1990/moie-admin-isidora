import {fetchDataApi, postApi} from "./backend_helper";
import Conditionals from "../common/conditionals";
import {showMessage} from "../components/MessageToast/ShowToastMessages";
import {DEFAULT_PAGE_LIMIT} from "../common/pagination";
import * as url from "./url_helper";
import {formatDateToServer, getMoment} from "../common/utils";

export const getData = (urlStr, name, conditionalOptions, defaultConditions, limit = DEFAULT_PAGE_LIMIT) => {
    const conditions = new Conditionals.Condition;
    if (defaultConditions) {
        defaultConditions.forEach(dc => conditions.add(dc.field, dc.value, dc.operator));
    }
    if (name) {
        if (conditionalOptions) {
            conditions.add(conditionalOptions.fieldName, name, conditionalOptions.operator);
        } else {
            conditions.add('name', name, Conditionals.OPERATORS.LIKE);
        }
    }
    
    const cond = Conditionals.getConditionalFormat(conditions.all());
    const query = Conditionals.buildHttpGetQuery(cond, limit, 0);
    return fetchDataApi(urlStr, query);
}

export const findOrders = (conditions, limit = null, offset = null) => {
    const cond = Conditionals.getConditionalFormat(conditions.all());
    const query = Conditionals.buildHttpGetQuery(cond, limit, offset);
    return fetchDataApi(url.ORDERS, query);
}

export const showResponseMessage = (response, message, errorMessage) => {
    if (response.status === 200 || response.code === 200) {
        showMessage.success(message);
    } else {
        showMessage.error(errorMessage || message);
    }
}

export const hasCustomerOpenOrders = (customerId) => {
    const conditions = new Conditionals.Condition;
    conditions.add('status', '1::4', Conditionals.OPERATORS.BETWEEN);
    conditions.add('customer', customerId, Conditionals.OPERATORS.EQUAL);
    return findOrders(conditions, 1);
}

export const countCustomersByStatus = () => {
    return countByStatus(url.CUSTOMER);
}

export const countProductsByStatus = () => {
    return countByStatus(url.PRODUCT);
}

const countByStatus = (urlString) => {
    const query = {};
    query.operation = 'id::count';
    query.group = 'status'

    return fetchDataApi(urlString, Conditionals.urlSearchParams(query)).then(resp => {
        const group = {};
        resp.data.forEach(item => group[!!item.status ? 1 : 0] = item.id);
        return group;
    });
}

export const countMayoristas = () => {
    const query = {};
    query.operation = 'id::count';
    query.group = 'isMayorist'

    return fetchDataApi(url.CUSTOMER, Conditionals.urlSearchParams(query)).then(resp => {
        const group = {};
        resp.data.forEach(item => group[item.isMayorist ? 1 : 0] = item.id);
        return group;
    });
}

export const countUsersOrders = () => {
    const conditions = new Conditionals.Condition;
    conditions.add('status', [1,2,3,4,5,7].join("::"), Conditionals.OPERATORS.IN);
    conditions.add('createdAt', formatDateToServer(getMoment().startOf('day')), Conditionals.OPERATORS.GREATER_THAN_OR_EQUAL)

    const query = {};
    query.conditional = Conditionals.getConditionalFormat(conditions.all());
    query.operation = 'origen::count,totalAmount::sum';
    query.group = 'user_id'

    return fetchDataApi(url.ORDERS, Conditionals.urlSearchParams(query));
}

export const statsCustomerRegisteredToday = () => {
    const conditions = new Conditionals.Condition;
    conditions.add('createdAt', formatDateToServer(getMoment().startOf('day')), Conditionals.OPERATORS.GREATER_THAN_OR_EQUAL)
    return statsRegistered(url.CUSTOMER, conditions);
}

export const statsCustomerRegistered = () => {
    const conditions = new Conditionals.Condition;
    conditions.add('createdAt',formatDateToServer(getMoment().isoWeekday(1)), Conditionals.OPERATORS.GREATER_THAN_OR_EQUAL)
    return statsRegistered(url.CUSTOMER, conditions);
}

export const statsRegistered = (urlString, conditions) => {
    const cond = Conditionals.getConditionalFormat(conditions.all());
    const query = {conditional: cond, operation: 'id::count'};

    return fetchDataApi(urlString, Conditionals.urlSearchParams(query)).then(resp => {
        const data = {count: 0};
        if(resp.data && resp.data.length > 0){
            data.count = resp.data[0].id;
        }
        return data;
    });
}

export const getCatalogBatchRequest = () => {
    const conditions = new Conditionals.Condition;
    conditions.add('createdAt', formatDateToServer(getMoment().startOf('day')), Conditionals.OPERATORS.GREATER_THAN_OR_EQUAL)
    conditions.add('type', [2,3].join("::"), Conditionals.OPERATORS.IN);
    conditions.add('status', 2, Conditionals.OPERATORS.EQUAL);

    const cond = Conditionals.getConditionalFormat(conditions.all());
    const query = Conditionals.buildHttpGetQuery(cond, 15);
    return fetchDataApi(url.BATCH_REQUEST, Conditionals.urlSearchParams(query));
}

export const findFieldOptionByGroup = (group, limit = null, offset = null) => {
    const conditions = new Conditionals.Condition;
    conditions.add('groups', group, Conditionals.OPERATORS.EQUAL);
    const cond = Conditionals.getConditionalFormat(conditions.all());
    const query = Conditionals.buildHttpGetQuery(cond, limit, offset);
    return fetchDataApi(url.FIELD_OPTIONS, query).then(resp => (resp.data || []));
}

export const customerOrdersStats = (customerId, date) => {
    return fetchDataApi(`${url.CUSTOMER}/${customerId}/order_stats?beforeDate=${date.format("YYYY-MM-DD")}`, {});
}
export const customerProductStats = (customerId, date) => {
    return fetchDataApi(`${url.CUSTOMER}/${customerId}/stats?beforeDate=${date.format("YYYY-MM-DD")}`, {});
}
export const customerCategoryStats = (customerId, date) => {
    return fetchDataApi(`${url.CUSTOMER}/${customerId}/stats?beforeDate=${date.format("YYYY-MM-DD")}&categoryMode=true`, {});
}

export const markOrderReceived = (orderId) => {
    return postApi(url.ORDER_CONFIRM_RECEIVED, {order: orderId});
}
