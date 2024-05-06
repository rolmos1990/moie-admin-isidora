import React from "react"
import {Link} from "react-router-dom"
import Conditionals from "../../../common/conditionals";
import HasPermissionsFunc from "../../../components/HasPermissionsFunc";
import {PERMISSIONS} from "../../../helpers/security_rol";
import {DATE_FORMAT, formatDate, priceFormat} from "../../../common/utils";

const itemsColumns = (onDelete = false) => {
    let cols = [
        {
            text: "#",
            dataField: "id",
            sort: true,
            filter: false,
            filterType: "text",
            filterCondition: Conditionals.OPERATORS.EQUAL,
        },
        {
            text: "Fecha",
            dataField: "createdAt",
            sort: true,
            formatter: (cellContent, item) => (
                <>
                    <Link to={`/item/${item.id}`} className="text-body">
                        {formatDate(item.createdAt, DATE_FORMAT.ONLY_DATE)}
                    </Link>
                </>
            ),
            filter: false,
            filterType: "dateRange",
        },
        {
            text: "Monto",
            dataField: "amount",
            sort: false,
            filter: false,
            filterType: "text",
            formatter: (cellContent, item) => (
                <p className={ cellContent > 0 ? "text-success" : "text-danger" } >
                    {item.type == 1 ? priceFormat(cellContent) : cellContent}
                </p>
            ),
        },
        {
            text: "Tipo",
            dataField: "type",
            sort: true,
            filter: true,
            filterType: "text",
            formatter: (cellContent, item) => (
                <p className={ cellContent > 0 ? "text-success" : "text-danger" } >
                    {item.type == 1 ? 'INTERRAPIDISIMO' : 'BOLSAS'}
                </p>
            ),
        },
    ]

    if (HasPermissionsFunc([PERMISSIONS.ITEMS_EDIT])) {
        cols.push({
            dataField: "menu",
            isDummyField: true,
            text: "Acción",
            formatter: (cellContent, item) => (
                <ul className="list-inline font-size-20 contact-links mb-0">
                    <li className="list-inline-item">
                        <Link to={`/items/${item.id}`} className="px-2 text-primary">
                            <i className="uil uil-pen font-size-18"> </i>
                        </Link>
                    </li>
                </ul>
            ),
        })
    }
    return cols;
}

export default itemsColumns;
