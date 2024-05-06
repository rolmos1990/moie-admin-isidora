import React from "react"
import {Link} from "react-router-dom"
import {StatusField} from "../../components/StatusField";
import {buildOptions} from "../../common/converters";
import {DELIVERY_METHODS_LIST, DELIVERY_TYPES, DELIVERY_TYPES_LIST, ORDER_STATUS, ORDER_STATUS_LIST} from "../../common/constants";
import Conditionals from "../../common/conditionals";
import {formatDate, priceFormat} from "../../common/utils";
import {Tooltip} from "@material-ui/core";
import {CUSTOMER, USER} from "../../helpers/url_helper";
import HasPermissionsFunc from "../../components/HasPermissionsFunc";
import {PERMISSIONS} from "../../helpers/security_rol";

const statusOptions = buildOptions(ORDER_STATUS_LIST);
const deliveryMethodsOptions = buildOptions(DELIVERY_METHODS_LIST);
const deliveryTypeOptions = buildOptions(DELIVERY_TYPES_LIST);

const orderColumns = (onSelectedOrder, showAsModal, conciliationView) => {
    let columns = [
        {
            text: "Pedido #",
            dataField: "id",
            sort: true,
            formatter: (cellContent, item) => {
                if (onSelectedOrder) {
                    return (
                        <button className="btn btn-outline-default" onClick={() => onSelectedOrder(item.id)}>
                            <b className="text-info">{item.id}</b>
                        </button>
                    );
                }
                return  (
                    <Link to={`/order/${item.id}`} className="text-body">
                        <b className="text-info">{item.id}</b>
                    </Link>
                );
            },
            filter: true,
            filterType: "text",
            filterCondition: Conditionals.OPERATORS.EQUAL,
        },
        {
            text: "Cliente",
            dataField: "customer__name",
            sort: false,
            filter: true,
            filterType: "text",
            filterCondition: Conditionals.OPERATORS.LIKE,
            formatter: (cellContent, item) => (
                !showAsModal ? (
                        <Link to={`/customer/detail/${item.customer.id}`} className="text-body">
                            <div>
                            {item.customer.isMayorist === true && (
                                <Tooltip placement="bottom" title="Cliente mayorista" aria-label="add">
                                    <i className={"mdi mdi-crown font-size-18 mr-1 text-warning"}> </i>
                                </Tooltip>
                            )}

                                {item.customer.name}
                                <span>
                                    <span className="badge rounded-pill bg-secondary m-1">{ item.ordersFinished }</span>
                                </span>
                            </div>
                            <div>
                            <small className="bg-grey badge badge-soft-secondary"><i className="fa fa-user"></i> { item.user.name }</small>
                        </div>
                    </Link>)
                    : (<>
                        {item.customer.name}
                        {item.customer.isMayorist === true && (
                            <Tooltip placement="bottom" title="Cliente mayorista" aria-label="add">
                                <i className={"mdi mdi-crown font-size-18 mr-1 text-warning"}> </i>
                            </Tooltip>
                        )}
                    </>)
            ),
        },
        {
            text: "Tipo de envio",
            dataField: "orderDelivery__deliveryType",
            sort: true,
            filter: true,
            filterType: "select",
            filterOptions: deliveryTypeOptions,
            filterDefaultOption: deliveryTypeOptions[0],
            hidden: true,
        },
        {
            text: "Fecha",
            dataField: "createdAt",
            sort: true,
            filter: true,
            filterType: "dateRange",
            formatter: (cellContent, item) => (
                <div>{item.modifiedDate ? formatDate(item.modifiedDate) : formatDate(item.createdAt)}</div>
            ),
        },
        {
            text: "Envio",
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

                    {item.orderDelivery.deliveryType === 1 && (
                        <Tooltip placement="bottom" title={DELIVERY_TYPES[0].label} aria-label="add">
                            <i className={"mdi mdi-cash font-size-18 mr-1 text-info"}> </i>
                        </Tooltip>
                    )}
                    {item.orderDelivery.deliveryType === 2 && (
                        <Tooltip placement="bottom" title={DELIVERY_TYPES[1].label} aria-label="add">
                            <i className={"mdi mdi-cash font-size-18 mr-1 text-warning"}> </i>
                        </Tooltip>
                    )}
                    {item.orderDelivery.deliveryType === 3 && (
                        <Tooltip placement="bottom" title={DELIVERY_TYPES[2].label} aria-label="add">
                            <i className={"mdi mdi-handshake font-size-18 mr-1 text-info"}> </i>
                        </Tooltip>
                    )}
                    {item.prints > 0 && (
                        <Tooltip placement="bottom" title={`Pedido tiene ${item.prints} impresiones`} aria-label="add">
                            <i className={"badge rounded-pill bg-soft-danger mdi mdi-printer"}> </i>
                        </Tooltip>
                    )}
                </>
            ),
        },
        {
            text: "Prendas",
            dataField: "quantity",
            sort: false,
            filter: false,
        },
        {
            text: "Monto",
            dataField: "totalAmount",
            sort: false,
            filter: false,
            formatter: (cellContent, item) => priceFormat(cellContent),
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
                <StatusField color={ORDER_STATUS[item.status]?.color}>
                    {ORDER_STATUS[item.status]?.name}
                </StatusField>
            ),
        },
        {
            text: "Operador",
            dataField: "user",
            hidden: true,
            sort: false,
            filterType: "asyncSelect",
            filter: true,
            urlStr: USER,
            hasWild: true,
            conditionalOptions: {fieldName: 'name', operator: Conditionals.OPERATORS.LIKE},
            defaultConditions: [{field: 'status', value: '', operator: Conditionals.OPERATORS.TRUE}],
            formatter: (cellContent, item) => (
                <div>{item.user.name}</div>
            ),
        }
    ];

    if (!showAsModal && !conciliationView && HasPermissionsFunc([PERMISSIONS.ORDER_EDIT])) {
        columns.push({
            dataField: "menu",
            isDummyField: true,
            text: "Acción",
            formatter: (cellContent, item) => (
                <ul className="list-inline font-size-20 contact-links mb-0">
                    <li className="list-inline-item">
                        <Link to={`/order/${item.id}`} className="px-2 text-primary">
                            <i className="uil uil-pen font-size-18"> </i>
                        </Link>
                    </li>
                </ul>
            ),
        });
    }

    if (conciliationView) {
        columns.push({
            text: "Precio",
            dataField: "totalAmount",
            sort: true,
            headerStyle: (colum, colIndex) => {
                return {textAlign: 'center'};
            },
            formatter: (cellContent, item) => (
                <div className="text-right">
                    {priceFormat(item.totalAmount, "", true)}
                </div>
            ),
            filter: true,
            filterType: "number",
        });
    }

    return columns;
}

export default orderColumns;
