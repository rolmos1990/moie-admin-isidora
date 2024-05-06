import React from "react"
import Conditionals from "../../../common/conditionals";
import {formatDate, PAYMENT_OPTIONS, priceFormat, STATUS_OPTIONS} from "../../../common/utils";
import {StatusField} from "../../../components/StatusField";
import {ORDER_STATUS, PAYMENT_STATUS} from "../../../common/constants";

const paymentsColumns = (onSelected) => [
    {
        text: "ID",
        dataField: "id",
        sort: true,
        formatter: (cellContent, item) => (
            <>
                <button className="btn btn-outline-default" onClick={() => onSelected(item)}>
                    <b className="text-info">{item.id}</b>
                </button>
            </>
        ),
        filter: true,
        filterType: "text",
        filterCondition: Conditionals.OPERATORS.LIKE,
    },
    {
        text: "Nombre",
        dataField: "name",
        sort: true,
        filter: true,
        filterType: "text",
        filterCondition: Conditionals.OPERATORS.LIKE,
        formatter: (cellContent, item) => (
            <>
                {cellContent} &nbsp; {item.status > 0 && <span><i className={"mdi mdi-check font-size-18 mr-1 text-success"}> </i></span>}
            </>
        ),
    },
    {
        text: "Fecha",
        dataField: "createdAt",
        sort: true,
        filter: true,
        filterType: "dateRange",
        formatter: (cellContent, item) => (
            <div>
                {formatDate(item.createdAt)}
            </div>
        ),
    },
    {
        text: "Forma de pago",
        dataField: "type",
        sort: true,
        filter: true,
        filterType: "text",
    },
    {
        text: "Origen",
        dataField: "originBank",
        sort: true,
        filter: true,
        filterType: "text",
    },
    {
        text: "Destino",
        dataField: "targetBank",
        sort: true,
        filter: true,
        filterType: "text",
    },
    {
        text: "Monto",
        dataField: "consignmentAmount",
        sort: true,
        filter: true,
        filterType: "text",
        formatter: (cellContent, item) => (
            <div className="text-right">
                {priceFormat(item.consignmentAmount, "", true)}
            </div>
        ),
    },
    {
        text: "Estado",
        dataField: "status",
        sort: true,
        filter: true,
        filterType: "select",
        filterOptions: PAYMENT_OPTIONS,
        filterDefaultOption: PAYMENT_OPTIONS[0],
        formatter: (cellContent, item) => (
            <StatusField color={PAYMENT_STATUS[item.status]?.color}>
                {PAYMENT_STATUS[item.status]?.name}
            </StatusField>
        ),
    },
]

export default paymentsColumns;
