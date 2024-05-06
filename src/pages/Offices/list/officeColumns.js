import React from "react"
import {Link} from "react-router-dom"
import {StatusField} from "../../../components/StatusField";
import {buildOptions} from "../../../common/converters";
import {DELIVERY_METHODS_LIST, DELIVERY_TYPES, DELIVERY_TYPES_LIST, OFFICE_STATUS, OFFICE_STATUS_LIST} from "../../../common/constants";
import Conditionals from "../../../common/conditionals";
import {DATE_FORMAT, formatDate} from "../../../common/utils";
import {Tooltip} from "@material-ui/core";
import HasPermissionsFunc from "../../../components/HasPermissionsFunc";
import {PERMISSIONS} from "../../../helpers/security_rol";

const statusOptions = buildOptions(OFFICE_STATUS_LIST);
const deliveryMethodsOptions = buildOptions(DELIVERY_METHODS_LIST);
const deliveryTypeOptions = buildOptions(DELIVERY_TYPES_LIST);

const officeColumns = (onDelete = false) => {
    let cols = [
        {
            text: "#",
            dataField: "id",
            sort: true,
            formatter: (cellContent, item) => (
                <>
                    {item.id}
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
        },
        {
            text: "Fecha",
            dataField: "batchDate",
            sort: true,
            filter: true,
            filterType: "dateRange",
            formatter: (cellContent, item) => (
                <div>{formatDate(item.batchDate, DATE_FORMAT.ONLY_DATE)}</div>
            ),
        },
        {
            text: "Tipo",
            dataField: "type",
            sort: true,
            filter: true,
            filterType: "select",
            filterOptions: deliveryTypeOptions,
            filterDefaultOption: deliveryTypeOptions[0],
            formatter: (cellContent) => (
                <>
                    {/*<div>{DELIVERY_TYPES_LIST.find(d => d.value === cellContent).label }</div>*/}
                    {cellContent === 1 && (
                        <Tooltip placement="bottom" title={DELIVERY_TYPES[0].label} aria-label="add">
                            <i className={"mdi mdi-cash font-size-18 mr-1 text-info"}> </i>
                        </Tooltip>
                    )}
                    {cellContent === 2 && (
                        <Tooltip placement="bottom" title={DELIVERY_TYPES[1].label} aria-label="add">
                            <i className={"mdi mdi-cash font-size-18 mr-1 text-warning"}> </i>
                        </Tooltip>
                    )}
                    {cellContent === 3 && (
                        <Tooltip placement="bottom" title={DELIVERY_TYPES[2].label} aria-label="add">
                            <i className={"mdi mdi-handshake font-size-18 mr-1 text-info"}> </i>
                        </Tooltip>
                    )}
                </>
            ),
        },
        {
            text: "Método de Envio",
            dataField: "deliveryMethod",
            sort: true,
            filter: true,
            filterType: "select",
            filterOptions: deliveryMethodsOptions,
            filterCondition: Conditionals.OPERATORS.EQUAL,
            formatter: (cellContent, item) => (
                <>
                    <div>{item.deliveryMethod.name}</div>
                </>
            ),
        },
        {
            text: "Pedidos",
            dataField: "officeOrders",
            sort: false,
            filter: false,
            filterType: "text",
            formatter: (cellContent, item) => (
                <>
                    <div>{(item.viewOrders && item.viewOrders.quantity > 0) ? item.viewOrders.quantity : 0 }</div>
                </>
            ),
        },
        {
            text: "Estado",
            dataField: "status",
            sort: true,
            filter: true,
            filterType: "select",
            filterOptions: statusOptions,
            filterDefaultOption: statusOptions[0],
            formatter: (cellContent, item) => (
                <StatusField color={OFFICE_STATUS[item.status]?.color}>
                    {OFFICE_STATUS[item.status]?.name}
                </StatusField>
            ),
        }
    ]
    if (HasPermissionsFunc([PERMISSIONS.OFFICE_EDIT])) {
        cols.push(
            {
                dataField: "menu",
                isDummyField: true,
                text: "Acción",
                formatter: (cellContent, item) => (
                    <ul className="list-inline font-size-20 contact-links mb-0">
                        <li className="list-inline-item">
                            <Link to={`/office/${item.id}`} className="px-2 text-primary">
                                <i className="uil uil-pen font-size-18"> </i>
                            </Link>
                        </li>
                        {onDelete && (
                            <li className="list-inline-item">
                                <button size="small" className="btn btn-sm text-danger" onClick={() => onDelete(item.id)}>
                                    <i className="uil uil-trash-alt font-size-18"> </i>
                                </button>
                            </li>
                        )}
                    </ul>
                ),
            })
    }
    return cols;
}

export default officeColumns;
