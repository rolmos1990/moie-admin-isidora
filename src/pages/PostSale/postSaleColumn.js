import React from "react"
import {Link} from "react-router-dom"
import {StatusField} from "../../components/StatusField";
import {buildOptions} from "../../common/converters";
import {
    DELIVERY_METHODS_LIST,
    ORDER_STATUS,
    ORDER_STATUS_LIST,
    ORDER_STATUS_LIST_POST_SALE
} from "../../common/constants";
import Conditionals from "../../common/conditionals";
import {DATE_FORMAT, formatDate} from "../../common/utils";
import {Tooltip} from "@material-ui/core";
import {CUSTOMER} from "../../helpers/url_helper";

const postSaleColumns = () => {
    const statusOptions = buildOptions(ORDER_STATUS_LIST_POST_SALE);
    const deliveryMethodsOptions = buildOptions(DELIVERY_METHODS_LIST);

    return [
        {
            text: "Pedido #",
            dataField: "id",
            sort: true,
            formatter: (cellContent, item) => {
                return (
                    <Link to={`/postSales/detail/${item.id}`} className="text-body">
                        <b className="text-info">{item.id}</b>
                    </Link>
                );
            },
            filter: true,
            filterType: "text",
            filterCondition: Conditionals.OPERATORS.EQUAL,
        },
        {
            text: "Fecha de importación / (Sync)",
            dataField: "postSaleDate",
            sort: true,
            filter: false,
            filterType: "dateRange",
            formatter: (cellContent, item) => (
                <div>{formatDate(item.postSaleDate, DATE_FORMAT.ONLY_DATE)} / {item.orderDelivery.syncDate ? formatDate(item.orderDelivery.syncDate) : ''}</div>
            ),
        },
        {
            text: "Fecha de importación",
            dataField: "postSaleDate",
            sort: true,
            filter: true,
            filterType: "dateRange",
            hidden: true,
        },
        {
            text: "Estado del Pedido",
            dataField: "status",
            sort: true,
            filter: true,
            filterType: "select",
            filterOptions: statusOptions,
            filterDefaultOption: statusOptions[0],
            formatter: (cellContent, item) => (
                <StatusField color={ORDER_STATUS[item.status]?.color}>
                    {ORDER_STATUS[item.status]?.name}
                </StatusField>
            ),
        },
        {
            text: "Cliente",
            dataField: "customer__name",
            sort: false,
            filter: true,
            filterType: "text",
            filterCondition: Conditionals.OPERATORS.LIKE,
            formatter: (cellContent, item) => (
                <Link to={`/customer/detail/${item.customer.id}`} className="text-body">
                    {item.customer.name}
                    {item.customer.isMayorist === true && (
                        <Tooltip placement="bottom" title="Cliente mayorista" aria-label="add">
                            <i className={"mdi mdi-crown font-size-18 mr-1 text-warning"}> </i>
                        </Tooltip>
                    )}
                </Link>
            ),
        },
        {
            text: "Metodo de envío",
            dataField: "deliveryMethod",
            sort: true,
            filter: true,
            filterType: "select",
            filterOptions: deliveryMethodsOptions,
            filterDefaultOption: deliveryMethodsOptions[0],
            formatter: (cellContent, item) => (
                <>
                    <div>{item.deliveryMethod.name}</div>
                    <small>{item.tracking}</small>
                </>
            ),
        },
        {
            text: "Guía",
            dataField: "orderDelivery.tracking",
            sort: true,
            filter: true,
            filterType: "text",
            formatter: (cellContent, item) => (
                <div className="badge p-2 bg-soft-info">{item.orderDelivery.tracking}</div>
            ),
        },
        {
            text: "Estado del envío",
            dataField: "orderDelivery.deliveryStatus",
            sort: true,
            filter: true,
            filterType: "text",
            formatter: (cellContent, item) => {
                if (item.orderDelivery.deliveryStatus) {
                    return <small className="text-muted">{item.orderDelivery.deliveryStatus} &nbsp;{item.manualReceived && <Tooltip placement="bottom" title="Marcado como recibido" aria-label="add"><span className={"mb-0 badge bg-soft-success p-1"}><i className="mdi mdi-check"></i></span></Tooltip>}</small>;
                }
                return '';
            },
        }
    ];
}

export default postSaleColumns;
