import React from "react"
import {Link} from "react-router-dom"
import {StatusField} from "../../../components/StatusField";
import {buildOptions} from "../../../common/converters";
import {ORDER_STATUS, ORDER_STATUS_LIST,} from "../../../common/constants";
import Conditionals from "../../../common/conditionals";
import {DATE_FORMAT, formatDate} from "../../../common/utils";
import {CUSTOMER} from "../../../helpers/url_helper";
import {Tooltip} from "@material-ui/core";
import HasPermissions from "../../../components/HasPermissions";
import {PERMISSIONS} from "../../../helpers/security_rol";

const statusOptions = buildOptions(ORDER_STATUS_LIST);

const municipalityColumns = (onDelete = false) => [
    {
        text: "#",
        dataField: "id",
        sort: true,
        formatter: (cellContent, item) => (
            <>
                <HasPermissions permission={PERMISSIONS.BILL_CREATE} renderNoAccess={() => item.id}>
                    <Link to={`/bill/detail/${item.id}`} className="text-body">
                        <b className="text-info">{item.id}</b>
                    </Link>
                </HasPermissions>
            </>
        ),
        filter: true,
        filterType: "text",
        filterCondition: Conditionals.OPERATORS.LIKE,
    },
    {
        text: "Fecha",
        dataField: "createdAt",
        sort: true,
        filter: true,
        filterType: "dateRange",
        formatter: (cellContent, item) => (
            <div>{formatDate(item.createdAt, DATE_FORMAT.ONLY_DATE)}</div>
        ),
    },
    {
        text: "Num. Legal",
        dataField: "legalNumber",
        sort: true,
        filter: true,
        filterType: "text"
    },
    {
        text: "Estado",
        dataField: "status",
        sort: true,
        filter: true,
        filterType: "text"
    },
    {
        text: "Impuesto",
        dataField: "tax",
        sort: true,
        filter: false,
        filterType: "number"
    },
    {
        text: "Nota de Crédito",
        dataField: "creditMemo",
        sort: true,
        filter: true,
        filterType: "select",
        filterOptions: [
            { label: "No", value: 0 },
            { label: "Si", value: 1 }
        ],
        formatter: (cellContent, item) => (
            <>
                {item?.creditNote?.id ? "Si" : "No"}
                {item?.creditNote?.id && item?.creditNote?.status != 1 ? <small>&nbsp;<span className="badge rounded-pill p-2 bg-soft-danger">Error Dian</span></small> : ""}
            </>
        ),
    },
    {
        text: "# Pedido",
        dataField: "order.id",
        sort: true,
        filter: true,
        filterType: "text",
        filterCondition: Conditionals.OPERATORS.LIKE,
    },
    {
        text: "Cliente",
        dataField: "customer",
        sort: true,
        filter: false,
        filterType: "asyncSelect",
        urlStr: CUSTOMER,
        formatter: (cellContent, item) => (
            <>
                {item.order.customer.name}
                {item.order.customer.isMayorist === true && (
                    <Tooltip placement="bottom" title="Cliente mayorista" aria-label="add">
                        <i className={"mdi mdi-crown font-size-18 mr-1 text-warning"}> </i>
                    </Tooltip>
                )}
            </>
        ),
    },
    {
        text: "Estado del pedido",
        dataField: "order.status",
        sort: true,
        filter: true,
        filterType: "select",
        filterOptions: statusOptions,
        filterDefaultOption: statusOptions[0],
        formatter: (cellContent, item) => (
            <StatusField color={ORDER_STATUS[item.order.status]?.color}>
                {ORDER_STATUS[item.order.status].name}
            </StatusField>
        ),
    },
]

export default municipalityColumns;
