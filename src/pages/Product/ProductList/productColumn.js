import React from "react"
import {Link} from "react-router-dom"
import {STATUS_COLORS, StatusField} from "../../../components/StatusField";
import {HtmlTooltip} from "../../../components/Common/HtmlTooltip";
import {ConverterStatus} from "../../../common/converters";
import {STATUS} from "../../../common/constants";
import Conditionals from "../../../common/conditionals";
import {getImageByQuality, priceFormat, STATUS_OPTIONS, YES_NO_OPTIONS} from "../../../common/utils";
import {CATEGORY, SIZE} from "../../../helpers/url_helper";
import {Button, Tooltip} from "@material-ui/core";
import Images from "../../../components/Common/Image";
import HasPermissions from "../../../components/HasPermissions";
import {PERMISSIONS} from "../../../helpers/security_rol";
import HasPermissionsFunc from "../../../components/HasPermissionsFunc";

const badgeStyles = {minWidth: '30px', margin: '2px'}

const productColumns = (onDelete = false, onToogleActivate = false) => {
    let columns = [
        {
            text: "Código",
            dataField: "reference",
            sort: false,
            filter: true,
            filterType: "text",
            filterCondition: Conditionals.OPERATORS.EQUAL,
            formatter: (cellContent, item) => (
                <HasPermissions permission={PERMISSIONS.PRODUCT_SHOW} renderNoAccess={() => <span className="text-info">{item.reference} </span>}>
                <HtmlTooltip
                    title={
                        <React.Fragment>
                            <Images src={`${getImageByQuality(item.productImage.length > 0 ? item.productImage[0] : {}, 'medium')}`}
                                    alt={item.reference}
                                    height={100}
                                    className="img-fluid mx-auto d-block tab-img rounded"/>
                        </React.Fragment>
                    }>
                        <Link to={`/product/detail/${item.id}`} className="text-body">
                            <span className="text-info">{item.reference} </span>
                        </Link>
                </HtmlTooltip>
                </HasPermissions>
            ),
        },
        {
            text: "Descripcion",
            dataField: "name",
            sort: true,
            formatter: (cellContent, item) => (
                <div className={`field-br ${item.status === STATUS.ACTIVE ? '' : 'opacity-25'}`} style={{width: '350px'}}>
                    <small>{item.name}</small>
                    {(item.published === false && item.status === STATUS.ACTIVE) && (
                        <Tooltip placement="bottom" title="Producto no publicado" aria-label="add">
                            <i className={"mdi mdi-alert-octagram-outline font-size-18 mr-1 text-warning"}> </i>
                        </Tooltip>
                    )}
                    {item.providerReference && (
                        <div>
                            <Tooltip placement="bottom" title="Referencia de Proveedor" aria-label="provider_add">
                                <p className="badge bg-soft-secondary p-1"><small><b><i className="mdi mdi-web-box mr-5"></i>{item.providerReference}</b></small></p>
                            </Tooltip>
                        </div>
                    )}
                </div>
            ),
            filter: true,
            filterType: "text",
            filterCondition: Conditionals.OPERATORS.LIKE,
        },
        {
            text: "Precio",
            dataField: "price",
            sort: true,
            headerStyle: (colum, colIndex) => {
                return {textAlign: 'center'};
            },
            formatter: (cellContent, item) => (
                <div className={`text-right ${item.status === STATUS.ACTIVE ? '' : 'opacity-25'}`}>
                    {priceFormat(item.price, "", true)}
                </div>
            ),
            filter: true,
            filterType: "number",
        },
        {
            text: "Costo",
            dataField: "cost",
            sort: true,
            filter: true,
            headerStyle: (colum, colIndex) => {
                return {textAlign: 'right'};
            },
            formatter: (cellContent, item) => (
                <div className={`text-right ${item.status === STATUS.ACTIVE ? '' : 'opacity-25'}`}>
                    {priceFormat(item.cost, "", true)}
                </div>
            ),
            filterType: "number",
        },
        {
            text: "Categoria",
            dataField: "category",
            sort: true,
            formatter: (cellContent, item) => (
                <div className="field-br" style={{width: '230px'}}>
                    {!item.category ? '' : (
                        <Link to={`/category/${item.category.id}`} className="text-body">
                            {item.category.name}
                        </Link>
                    )}
                </div>
            ),
            hidden: true,
            filter: true,
            filterType: "asyncSelect",
            urlStr: CATEGORY,
            conditionalOptions: {fieldName: 'name', operator: Conditionals.OPERATORS.LIKE},
        },
        {
            text: "Existencia",
            dataField: "summary",
            isDummyField: true,
            formatter: (cellContent, item) => (
                <>
                    <Tooltip placement="bottom" title="Disponible" aria-label="add">
                        <span className={`mb-0 badge bg-success p-2 ${item.status === STATUS.ACTIVE ? '' : 'opacity-25'}`} style={badgeStyles}>{item.productAvailable?.available || 0}</span>
                    </Tooltip>
                    <Tooltip placement="bottom" title="Apartado" aria-label="add">
                        <span className={`mb-0 badge bg-danger p-2 ${item.status === STATUS.ACTIVE ? '' : 'opacity-25'}`} style={badgeStyles}>{item.productAvailable?.reserved || 0}</span>
                    </Tooltip>
                    <Tooltip placement="bottom" title="Vendidos" aria-label="add">
                        <span className={`mb-0 badge bg-grey p-2 ${item.status === STATUS.ACTIVE ? '' : 'opacity-25'}`} style={badgeStyles}>{item.productAvailable?.completed || 0}</span>
                    </Tooltip>
                </>
            ),
        },
        {
            text: "Talla",
            dataField: "size",
            sort: true,
            hidden: true,
            filter: true,
            filterType: "asyncSelect",
            urlStr: SIZE,
        },
        {
            text: "Publicado",
            dataField: "published",
            sort: true,
            hidden: true,
            filter: true,
            filterType: "select",
            filterOptions: YES_NO_OPTIONS,
            filterDefaultOption: YES_NO_OPTIONS[0]
        },
        {
            text: "Estado",
            dataField: "status",
            sort: true,
            filter: true,
            hidden: true,
            filterType: "select",
            filterOptions: STATUS_OPTIONS,
            filterDefaultOption: STATUS_OPTIONS[0],
            formatter: (cellContent, item) => (
                <StatusField color={item.status === STATUS.ACTIVE ? STATUS_COLORS.SUCCESS : STATUS_COLORS.DANGER}>
                    {ConverterStatus(item.status)}
                </StatusField>
            ),
        },
        {
            text: "Referencia de Proveedor",
            dataField: "providerReference",
            sort: false,
            hidden: true,
            filter: true,
            filterType: "text"
        },

    ];

    if (HasPermissionsFunc([PERMISSIONS.PRODUCT_EDIT])) {
        columns.push({
            dataField: "menu",
            isDummyField: true,
            text: "Acción",
            formatter: (cellContent, item) => (
                <ul className="list-inline font-size-20 contact-links mb-0">
                    <li className="list-inline-item">
                        <HasPermissions permission={PERMISSIONS.PRODUCT_EDIT}>
                            <Link to={`/product/${item.id}`} className="px-2 text-primary">
                                <i className="uil uil-pen font-size-18"> </i>
                            </Link>
                        </HasPermissions>
                    </li>
                    <li className="list-inline-item">
                        <HasPermissions permission={PERMISSIONS.PRODUCT_EDIT}>
                            {item.published == 0 ? (
                                <Tooltip placement="bottom" title="Publicar" aria-label="add">
                                    <Button color="default" className="text-success" onClick={() => onToogleActivate(item.id, 1)}>
                                        <i className="uil uil-check font-size-18"> </i>
                                    </Button>
                                </Tooltip>
                            ) : (
                                <Tooltip placement="bottom" title="Despublicar" aria-label="add">
                                    <Button color="default" className="text-muted" onClick={() => onToogleActivate(item.id, 0)}>
                                        <i className="uil uil-trash font-size-18"> </i>
                                    </Button>
                                </Tooltip>
                            )}
                        </HasPermissions>
                    </li>
                    {/*<li className="list-inline-item">
                    <button size="small" className="btn btn-sm text-danger" onClick={() => onDelete(item.id)}>
                        <i className="uil uil-trash-alt font-size-18"> </i>
                    </button>
                </li>*/}
                </ul>
            ),
        })
    }

    return columns;
}

export default productColumns;
