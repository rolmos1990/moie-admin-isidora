import React from "react"
import {Link} from "react-router-dom"
import {STATUS_COLORS, StatusField} from "../../../components/StatusField";
import {ConverterStatus} from "../../../common/converters";
import {STATUS} from "../../../common/constants";
import Conditionals from "../../../common/conditionals";
import {STATUS_OPTIONS} from "../../../common/utils";
import {Tooltip} from "@material-ui/core";
import HasPermissionsFunc from "../../../components/HasPermissionsFunc";
import {PERMISSIONS} from "../../../helpers/security_rol";

const userColumns = (onSelect = false) => {
    let cols = [
        {
            text: "Nombre",
            dataField: "name",
            sort: true,
            formatter: (cellContent, item) => (
                <Link to={`/user/${item.id}`} className="text-body">
                    {item.name}
                </Link>
            ),
            filter: true,
            filterType: "text",
            filterCondition: Conditionals.OPERATORS.LIKE,
        },
        {
            text: "Apellido",
            dataField: "lastname",
            sort: true,
            filter: true,
            filterType: "text",
            filterCondition: Conditionals.OPERATORS.LIKE,
        },
        {
            text: "Correo",
            dataField: "email",
            sort: true,
            filter: true,
            filterType: "text",
            filterCondition: Conditionals.OPERATORS.LIKE,
        },
        {
            text: "Usuario",
            dataField: "username",
            sort: true,
            filter: true,
            filterType: "text",
            filterCondition: Conditionals.OPERATORS.LIKE,
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

    if (HasPermissionsFunc([PERMISSIONS.PRODUCT_EDIT])) {
        cols.push({
            dataField: "menu",
            isDummyField: true,
            text: "Acción",
            formatter: (cellContent, item) => (
                <ul className="list-inline font-size-20 contact-links mb-0">
                    <li className="list-inline-item">
                        <Tooltip placement="bottom" title="Editar usuario" aria-label="add">
                            <Link to={`/user/${item.id}`} className="px-2 text-primary">
                                <i className="uil uil-pen font-size-18"> </i>
                            </Link>
                        </Tooltip>
                    </li>
                    <li className="list-inline-item">
                        <li className="list-inline-item">
                            <Tooltip placement="bottom" title="Cambiar contraseña" aria-label="add">
                                <button size="small" className="btn btn-sm text-primary" onClick={() => onSelect(item)}>
                                    <i className="fa fa-user-lock"> </i>
                                </button>
                            </Tooltip>
                        </li>
                    </li>
                </ul>
            ),
        })
    }

    return cols;
}

export default userColumns;
