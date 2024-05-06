import React from "react"
import {Link} from "react-router-dom"
import {STATUS_COLORS, StatusField} from "../../components/StatusField";
import {ConverterStatus} from "../../common/converters";
import {STATUS} from "../../common/constants";
import Conditionals from "../../common/conditionals";
import {isValidOption, STATUS_OPTIONS} from "../../common/utils";
/*

const configsColumns = (onDelete = false, onSelect = false) => [
    {
        text: "Grupo",
        dataField: "group",
        sort: true,
        filter: true,
        filterType: "text",
    },
    {
        text: "Nombre",
        dataField: "name",
        sort: true,
        filter: true,
        filterType: "text",
    },
    {
        dataField: "menu",
        isDummyField: true,
        text: "Acción",
        formatter: (cellContent, item) => (
            <ul className="list-inline font-size-20 contact-links mb-0">
                {onSelect && (
                    <li className="list-inline-item">
                        <button size="small" className="btn btn-sm text-primary" onClick={() => onSelect(item)}>
                            <i className="uil uil-pen font-size-18"> </i>
                        </button>
                    </li>
                )}
                {onDelete && (
                    <li className="list-inline-item">
                        <button size="small" className="btn btn-sm text-danger" onClick={() => onDelete(item.id)}>
                            <i className="uil uil-trash-alt font-size-18"> </i>
                        </button>
                    </li>
                )}
            </ul>
        ),
    },
]

export default configsColumns;
*/
