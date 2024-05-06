import React from "react"
import {Link} from "react-router-dom"
import {ConverterCustomerStatus} from "../customer_status";
import {Tooltip} from "@material-ui/core";
import {STATUS_COLORS, StatusField} from "../../../components/StatusField";
import {formatDate, hiddenPhone, STATUS_OPTIONS, YES_NO_OPTIONS} from "../../../common/utils";
import {PERMISSIONS} from "../../../helpers/security_rol";
import HasPermissions from "../../../components/HasPermissions";
import HasPermissionsFunc from "../../../components/HasPermissionsFunc";
import {HiddenPhone} from "../../../components/Common/HiddenPhone";


const customerListColumns = (onDelete = false, hasPhonePermission = HasPermissionsFunc([PERMISSIONS.CUSTOMER_PHONE])) => {
    let cols = [
        {
            text: "Nombre",
            dataField: "name",
            sort: true,
            filter: true,
            filterType: "text",
            formatter: (cellContent, item) => (
                <>
                    {!item.img ? (
                        <div className="avatar-xs d-inline-block me-2">
                            <div className="avatar-title bg-soft-primary rounded-circle text-primary">
                                <i className="mdi mdi-account-circle m-0"></i>
                            </div>
                        </div>
                    ) : (
                        <img
                            className="avatar-xs rounded-circle me-2"
                            src={item.img}
                            alt={item.name}
                        />
                    )}
                    <HasPermissions permission={PERMISSIONS.CUSTOMER_SHOW}>
                        <Link to={`/customer/detail/${item.id}`} className="text-body">
                            {item.name}
                            {item.isMayorist === true && (
                                <Tooltip placement="bottom" title="Cliente mayorista" aria-label="add">
                                    <i className={"mdi mdi-crown font-size-18 mr-1 text-warning"}> </i>
                                </Tooltip>
                            )}
                        </Link>
                    </HasPermissions>
                </>
            ),
        },
        {
            text: "Email",
            dataField: "email",
            sort: true,
            filter: true,
            filterType: "text",
        },
        {
            text: "Télefonos",
            dataField: "phone",
            sort: false,
            filter: true,
            formatter: (cellContent, item) => (
                <>
                    <div>Cel.: {item.cellphone && item.cellphone.length > 3 ? hasPhonePermission ? item.cellphone : hiddenPhone(item.cellphone) : ''}</div>
                    <div>Res.: {item.phone && item.phone.length > 3 ? hasPhonePermission ? item.phone : hiddenPhone(item.phone) : ''}</div>
                </>
            ),
        },
        {
            text: "Télefono Celular",
            dataField: "cellphone",
            filterType: "text",
            sort: false,
            filter: true,
            hidden: true,
        },
        {
            text: "Télefono Residencial",
            dataField: "phone",
            filterType: "text",
            sort: false,
            filter: true,
            hidden: true,
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
            text: "¿Es Mayorista?",
            dataField: "isMayorist",
            sort: true,
            hidden: true,
            filter: true,
            filterType: "select",
            filterOptions: YES_NO_OPTIONS,
            filterDefaultOption: STATUS_OPTIONS[0],
        },
        {
            text: "ContraPago",
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
        }
    ];
    if (HasPermissionsFunc([PERMISSIONS.CUSTOMER_EDIT])) {
        cols.push({
            dataField: "menu",
            isDummyField: true,
            text: "Acción",
            formatter: (cellContent, item) => (
                <ul className="list-inline font-size-20 contact-links mb-0">
                    <li className="list-inline-item">
                        <HasPermissions permission={PERMISSIONS.CUSTOMER_EDIT}>
                            <Link to={`/customer/${item.id}`} className="px-2 text-primary"><i className="uil uil-pen font-size-18"></i></Link>
                        </HasPermissions>
                    </li>
                    <HasPermissions permission={PERMISSIONS.CUSTOMER_DELETE}>
                        {onDelete && (
                            <li className="list-inline-item">
                                <button size="small" className="btn btn-sm text-danger" onClick={() => onDelete(item.id)}>
                                    <i className="uil uil-trash-alt font-size-18"> </i>
                                </button>
                            </li>
                        )}
                    </HasPermissions>
                </ul>
            ),
        });
    }
    return cols;
}

export default customerListColumns
