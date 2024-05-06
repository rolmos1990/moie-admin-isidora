import React from "react"
import {Link} from "react-router-dom"
import Conditionals from "../../../common/conditionals";
import HasPermissionsFunc from "../../../components/HasPermissionsFunc";
import {PERMISSIONS} from "../../../helpers/security_rol";
import {DATE_FORMAT, formatDate, priceFormat} from "../../../common/utils";

const walletColumns = (onDelete = false) => {
    let cols = [
        {
            text: "#",
            dataField: "id",
            sort: true,
            filter: true,
            filterType: "text",
            filterCondition: Conditionals.OPERATORS.EQUAL,
        },
        {
            text: "Fecha",
            dataField: "date",
            sort: true,
            formatter: (cellContent, item) => (
                <>
                    <Link to={`/wallet/${item.id}`} className="text-body">
                        {formatDate(item.date, DATE_FORMAT.ONLY_DATE)}
                    </Link>
                </>
            ),
            filter: true,
            filterType: "dateRange",
        },
        {
            text: "Descripción",
            dataField: "description",
            sort: true,
            filter: true,
            filterType: "text",
        },
        {
            text: "Monto",
            dataField: "amount",
            sort: true,
            filter: true,
            filterType: "text",
            formatter: (cellContent, item) => (
                <p className={ cellContent > 0 ? "text-success" : "text-danger" } >
                    {priceFormat(cellContent)}
                </p>
            ),
        }
    ]

    if (HasPermissionsFunc([PERMISSIONS.WALLET_EDIT])) {
        cols.push({
            dataField: "menu",
            isDummyField: true,
            text: "Acción",
            formatter: (cellContent, item) => (
                <ul className="list-inline font-size-20 contact-links mb-0">
                    <li className="list-inline-item">
                        <Link to={`/wallet/${item.id}`} className="px-2 text-primary">
                            <i className="uil uil-pen font-size-18"> </i>
                        </Link>
                    </li>
                </ul>
            ),
        })
    }
    return cols;
}

export default walletColumns;
