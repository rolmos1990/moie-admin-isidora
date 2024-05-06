import React from "react"
import Conditionals from "../../../common/conditionals";
import {Link} from "react-router-dom";
import HasPermissionsFunc from "../../../components/HasPermissionsFunc";
import {PERMISSIONS} from "../../../helpers/security_rol";
import {DELIVERY_METHODS_LIST, DELIVERY_TYPES} from "../../../common/constants";
import {buildOptions} from "../../../common/converters";
import {STATUS_OPTIONS} from "../../../common/utils";
import {STATUS_COLORS, StatusField} from "../../../components/StatusField";
import {ConverterCustomerStatus} from "../../Customer/customer_status";

const getDeliveryType = (_type = "") => {
    if(_type == 1){
        return "Contado";
    } else if(_type == 2){
        return "Contado - AlCobro";
    } else if(_type == 3){
        return "AlCobro";
    }

    return _type;
}

const metodos = {
    "1": 'Interrapidisimo',
    "4": 'ServiEntrega'
};

const colors = {
  "1": 'badge-success bg-warning',
  "4": 'badge-success bg-success'
};

const deliveryTimeCalc = (item) => {
    if (item.deliveryType == 1) {
        //sucursal
        item.icon = "&nbsp;&nbsp;&nbsp;&nbsp;"+ item.timeInDays +"&nbsp;&nbsp;<i class='fa fa-building' ></i>";
    }
    if (item.deliveryType == 2) {
        //delivery
        item.icon = "&nbsp;&nbsp;&nbsp;&nbsp;"+ item.timeInDays +"&nbsp;&nbsp;<i class='fa fa-motorcycle' ></i>";
    }
    if (item.deliveryType == 3) {
        //sucursal y delivery
        item.icon = "&nbsp;&nbsp;&nbsp;&nbsp;"+ item.timeInDays +"&nbsp;&nbsp;<span><i class='fa fa-building' ></i>&nbsp;<i class='fa fa-motorcycle' ></i></span>";
    }

    return item.icon;
}

const deliveryMethodsOptions = buildOptions(DELIVERY_METHODS_LIST);

const localityColumns = (onDelete = false) => {
    const cols = [
        {
            text: "Nombre",
            dataField: "name",
            sort: true,
            formatter: (cellContent, item) => (
                <>
                    <Link to="#" className="text-body">
                        {item.name}
                        <div>
                        <span className={`badge ${colors[item.deliveryMethodId]}`}>{ metodos[item.deliveryMethodId] }</span>
                        </div>
                    </Link>
                </>
            ),
            filter: true,
            filterType: "text",
            filterCondition: Conditionals.OPERATORS.LIKE,
        },
        {
            text: "Forma de Pago",
            dataField: "deliveryType",
            sort: true,
            filter: true,
            filterType: "text",
            formatter: (cellContent, item) => (
                <div>
                    {getDeliveryType(item.deliveryType)}
                </div>
            ),
        },
        {
            text: "Tiempo de Entrega",
            dataField: "timeInDays",
            sort: true,
            filter: true,
            filterType: "text",
            formatter: (cellContent, item) => (
                <div dangerouslySetInnerHTML={{__html: deliveryTimeCalc(item)}}/>
            ),
},
    {
        text: "Flete",
            dataField: "priceFirstKilo",
            sort: true,
            filter: true,
            filterType: "text"
    },
    {
        text: "Método de Envio",
        dataField: "deliveryMethodId",
        hidden: true,
        sort: true,
        filter: true,
        filterType: "select",
        filterOptions: deliveryMethodsOptions,
        filterCondition: Conditionals.OPERATORS.EQUAL,
        formatter: (cellContent, item) => (
            <>
                <div>{item.deliveryMethodId}</div>
            </>
        ),
    },
    {
        text: "Activo",
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
    ];

    if (HasPermissionsFunc([PERMISSIONS.DELIVERY_LOCALITY_EDIT])) {
        cols.push({
            dataField: "menu",
            isDummyField: true,
            text: "Acción",
            formatter: (cellContent, item) => (
                <ul className="list-inline font-size-20 contact-links mb-0">
                    <li className="list-inline-item">
                        <Link to={`/deliveryLocality/${item.id}`} className="px-2 text-primary">
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

export default localityColumns;
