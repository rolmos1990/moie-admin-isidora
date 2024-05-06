import React from "react"
import {Link} from "react-router-dom"
import {STATUS_COLORS, StatusField} from "../../../components/StatusField";
import Conditionals from "../../../common/conditionals";
import {DATE_FORMAT, formatDate, STATUS_OPTIONS} from "../../../common/utils";
import {ConverterCustomerStatus} from "../../Customer/customer_status";
import {PERMISSIONS} from "../../../helpers/security_rol";
import HasPermissions from "../../../components/HasPermissions";


const billConfigColumns = (onDelete = false) => [
    {
        text: "#",
        dataField: "id",
        sort: true,
        formatter: (cellContent, item) => (
            <>
                <HasPermissions permission={PERMISSIONS.BILL_CREATE} renderNoAccess={() => item.id}>
                    <Link to={`/billConfig/${item.id}`} className="text-body">
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
        text: "Resolución",
        dataField: "number",
        sort: true,
        filter: true,
        filterType: "text"
    },
    {
        text: "Num. Inicial",
        dataField: "startNumber",
        sort: true,
        filter: true,
        filterType: "text"
    },
    {
        text: "Num. Final",
        dataField: "finalNumber",
        sort: true,
        filter: true,
        filterType: "text"
    },
    {
        text: "Prefijo",
        dataField: "prefix",
        sort: true,
        filter: true,
        filterType: "text"
    },
    {
        text: "Fecha de resolución",
        dataField: "resolution_date",
        sort: true,
        filter: true,
        filterType: "dateRange",
        formatter: (cellContent, item) => (
            <div>{formatDate(item.resolutionDate, DATE_FORMAT.ONLY_DATE)}</div>
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
            <StatusField color={item.status === true ? STATUS_COLORS.SUCCESS : STATUS_COLORS.DANGER}>
                {ConverterCustomerStatus(item.status)}
            </StatusField>
        ),
    },
]

export default billConfigColumns;
