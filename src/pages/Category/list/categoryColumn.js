import React from "react"
import {Link} from "react-router-dom"
import {STATUS_COLORS, StatusField} from "../../../components/StatusField";
import {ConverterStatus} from "../../../common/converters";
import {STATUS} from "../../../common/constants";
import Conditionals from "../../../common/conditionals";
import {formatDate, STATUS_OPTIONS} from "../../../common/utils";
import {PERMISSIONS} from "../../../helpers/security_rol";
import HasPermissions from "../../../components/HasPermissions";
import HasPermissionsFunc from "../../../components/HasPermissionsFunc";

const categoryColumns = (onDelete = false) => {
    var cols = [
        {
            text: "Nombre",
            dataField: "name",
            sort: true,
            formatter: (cellContent, item) => (
                <HasPermissions permission={PERMISSIONS.CATEGORY_SHOW} renderNoAccess={() => item.name}>
                    <Link to={`/category/${item.id}`} className="text-body">
                        {item.name}
                    </Link>
                </HasPermissions>
            ),
            filter: true,
            filterType: "text",
            filterCondition: Conditionals.OPERATORS.LIKE,
        },
        {
            text: "Fecha creación",
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
    if (HasPermissionsFunc([PERMISSIONS.CATEGORY_EDIT])) {
        cols.push({
            dataField: "menu",
            isDummyField: true,
            text: "Acción",
            formatter: (cellContent, item) => (
                <ul className="list-inline font-size-20 contact-links mb-0">
                    <li className="list-inline-item">
                        <HasPermissions permission={PERMISSIONS.CATEGORY_EDIT}>
                            <Link to={`/category/${item.id}`} className="px-2 text-primary">
                                <i className="uil uil-pen font-size-18"> </i>
                            </Link>
                        </HasPermissions>
                    </li>
                    <li className="list-inline-item">
                        <HasPermissions permission={PERMISSIONS.PRODUCT_ORDER}>
                            <Link to={`/productOrderEdit/${item.id}`} className="px-2 text-primary">
                                <i className="uil uil-sort font-size-18"> </i>
                            </Link>
                        </HasPermissions>
                    </li>
                </ul>
            ),
        },);
    }
    return cols;
}

export default categoryColumns;
