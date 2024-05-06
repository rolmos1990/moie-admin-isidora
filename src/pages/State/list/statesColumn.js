import React from "react"
import {Link} from "react-router-dom"
import {STATUS_COLORS, StatusField} from "../../../components/StatusField";
import {ConverterStatus} from "../../../common/converters";
import {STATUS} from "../../../common/constants";
import Conditionals from "../../../common/conditionals";
import {STATUS_OPTIONS} from "../../../common/utils";
import HasPermissionsFunc from "../../../components/HasPermissionsFunc";
import {PERMISSIONS} from "../../../helpers/security_rol";

const statesColumns = (onDelete = false) => {
    let cols = [
        {
            text: "Nombre",
            dataField: "name",
            sort: true,
            formatter: (cellContent, item) => (
                <>
                    <Link to="#" className="text-body">
                        {item.name}
                    </Link>
                </>
            ),
            filter: true,
            filterType: "text",
            filterCondition: Conditionals.OPERATORS.LIKE,
        },
        {
            text: "Código DIAN",
            dataField: "dianCode",
            sort: true,
            filter: true,
            filterType: "text",
        },
        {
            text: "Código ISO",
            dataField: "isoCode",
            sort: true,
            filter: true,
            filterType: "text",
        },
        {
            text: "Estado",
            dataField: "status",
            sort: true,
            filter: true,
            filterType: "select",
            filterOptions: STATUS_OPTIONS,
            filterDefaultOption: STATUS_OPTIONS[0],
            formatter: (cellContent, item) => (
                <StatusField color={item.status === STATUS.ACTIVE ? STATUS_COLORS.SUCCESS : STATUS_COLORS.DANGER}>
                    {ConverterStatus(item.status)}
                </StatusField>
            ),
        }
    ]

    if (HasPermissionsFunc([PERMISSIONS.LOCALITY_EDIT])) {
        cols.push({
            dataField: "menu",
            isDummyField: true,
            text: "Acción",
            formatter: (cellContent, item) => (
                <ul className="list-inline font-size-20 contact-links mb-0">
                    <li className="list-inline-item">
                        <Link to={`/state/${item.id}`} className="px-2 text-primary">
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

export default statesColumns;
