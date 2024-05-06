import React, {useEffect, useState} from "react"
import {CardBody, Col, Container, Label, Row} from "reactstrap"
import {AvForm} from "availity-reactstrap-validation"
import {Card, Tooltip} from "@material-ui/core";
import {Link, withRouter} from "react-router-dom"
import {connect} from "react-redux";
import {apiError} from "../../store/auth/login/actions";
import PropTypes from "prop-types";
import {addOrderOffice, confirmOffice, deleteOffice, deleteOrderOffice, getOffice, printOfficeReport, registerOffice, resetPrintOfficeReport, updateOffice} from "../../store/office/actions";
import {FieldDate, FieldSelect, FieldText} from "../../components/Fields";
import Breadcrumb from "../../components/Common/Breadcrumb";
import {
    DATE_FORMAT,
    formatDate,
    formatDateToServerEndOfDay,
    printPartOfPage
} from "../../common/utils";
import {DELIVERY_METHODS, DELIVERY_TYPES, GROUPS, OFFICE_STATUS, ORDERS_ENUM, STATUS} from "../../common/constants";
import ButtonSubmit from "../../components/Common/ButtonSubmit";
import {DATE_MODES} from "../../components/Fields/InputDate";
import {ConverterDeliveryType, getEmptyOptions} from "../../common/converters";
import {getDeliveryMethods, getOrdersByOffice} from "../../store/order/actions";
import {getFieldOptionByGroups} from "../../store/fieldOptions/actions";
import {StatusField} from "../../components/StatusField";
import {ConfirmationModalAction} from "../../components/Modal/ConfirmationModal";
import CustomModal from "../../components/Modal/CommosModal";
import OrderList from "../Orders/orderList";
import Conditionals from "../../common/conditionals";
import {fileOfficeTemplate, officePdfApi} from "../../helpers/backend_helper";
import {PERMISSIONS} from "../../helpers/security_rol";
import NoAccess from "../../components/Common/NoAccess";
import HasPermissions from "../../components/HasPermissions";
import {showMessage} from "../../components/MessageToast/ShowToastMessages";

const OfficeEdit = (props) => {
    const {getOffice, office, deliveryMethods, orders, printReportData, refresh, refreshOrders, deleteOrderOffice} = props;
    const [officeData, setOfficeData] = useState({_status: STATUS.ACTIVE});
    const isEdit = props.match.params.id;
    const [orderListConditions, setOrderListConditions] = useState([]);
    const [deliveryMethodList, setDeliveryMethodList] = useState([]);
    const [deliveryTypes, setDeliveryTypes] = useState(null);
    const [deliveryMethod, setDeliveryMethod] = useState(null);
    const [deliveryType, setDeliveryType] = useState(null);
    const [openOrdersModal, setOpenOrdersModal] = useState(false);
    const [ordersList, setOrdersList] = useState([]);
    const [reportBody, setReportBody] = useState(null);
    const [editable, setEditable] = useState(isEdit ? false : true);


    //carga inicial
    useEffect(() => {
        setDeliveryTypes([getEmptyOptions(), ...DELIVERY_TYPES.map(dt => ({label: dt.label, value: dt.id}))]);

        if (isEdit && getOffice) {
            getOffice(props.match.params.id);
        }

        onGetFieldOptions();
        onGetDeliveryMethods();
    }, [getOffice]);

    useEffect(() => {
        if (reportBody && reportBody.length > 0) {
            let html = null;
            reportBody.forEach((body) => {
                if (html) {
                    html += '<br/>';
                } else {
                    html = '';
                }
                html += body.html;
            })
            printPartOfPage(html);
        }
    }, [reportBody]);

    useEffect(() => {
        if (orders && isEdit) {
            setOrdersList(orders);
        }
    }, [orders]);

    useEffect(() => {
        if (!reportBody && printReportData && printReportData.data && printReportData.data.batch) {
            setReportBody(printReportData.data.batch.body);
            props.resetPrintOfficeReport();
        }
    }, [printReportData.data]);

    useEffect(() => {
        if (office.id && isEdit) {
            setOfficeData({...office, _status: office.status});
            setDeliveryType(office.type);
            setDeliveryMethod(office.deliveryMethod);
            getOrdersByConditional();
        }
    }, [office]);

    useEffect(() => {
        getOrdersByConditional();
    }, [refreshOrders, refresh])

    useEffect(() => {
        if (deliveryMethods) {

            const list = deliveryMethods || [];
            const ot = deliveryType + '';
            setDeliveryMethodList([getEmptyOptions(), ...list.filter(op => (op.settings.includes(ot))).map(op => ({label: op.name, value: op.code}))]);
        }
    }, [deliveryType, deliveryMethods]);

    const handleValidSubmit = (event, values) => {

        const selectedDelivery = deliveryMethods.filter(item => item.code === values?.deliveryMethod?.value)[0];
        if (!selectedDelivery) {
            return false;
        }

        const data = {
            ...values,
            status: values._status,
            deliveryMethod: selectedDelivery.id,
            type: values.deliveryType.value,
            batchDate: values.batchDate[0] ? formatDateToServerEndOfDay(values.batchDate[0].end) : null
        };
        if (values.batchDate && values.batchDate.length === 1) {
            data.batchDate = values.batchDate[0] ? formatDateToServerEndOfDay(values.batchDate[0]) : null
        }
        if (values.batchDate && values.batchDate.length > 1) {
            data.batchDate = values.batchDate ? formatDateToServerEndOfDay(values.batchDate) : null
        }
        delete data._status;
        delete data.deliveryType;

        if (!isEdit) {
            props.registerOffice(data, props.history)
        } else {
            props.updateOffice(props.match.params.id, data, props.history)
        }
    }

    const getOrdersByConditional = () => {
        const conditions = new Conditionals.Condition;
        conditions.add("office", props.match.params.id, Conditionals.OPERATORS.EQUAL);
        onGetOrders(conditions);
    };

    const getOrdersByConditionalAndFilter = (filter) => {
        const conditions = new Conditionals.Condition;
        conditions.add("office", props.match.params.id, Conditionals.OPERATORS.EQUAL);

        if (filter.includes("c:")) {
            filter = filter.replace("c:", "");
            conditions.add("customer.name", filter, Conditionals.OPERATORS.LIKE);
        } else if (filter.includes("cc:")) {
            filter = filter.replace("cc:", "");
            conditions.add("customer.name", filter, Conditionals.OPERATORS.EQUAL);
        } else if (filter.includes("cemail:")) {
            filter = filter.replace("cemail:", "");
            conditions.add("customer.email", filter, Conditionals.OPERATORS.EQUAL);
        } else if (filter.includes("p:")) {
            filter = filter.replace("p:", "");
            conditions.add("id", filter, Conditionals.OPERATORS.LIKE);
        } else if (filter.includes("w:")) {
            filter = filter.replace("w:", "");
            conditions.add("totalWeight", filter, Conditionals.OPERATORS.LIKE);
        } else {
            conditions.add("customer.name", filter, Conditionals.OPERATORS.LIKE);
        }
        onGetOrders(conditions);
    };

    const onDelete = (id) => {
        ConfirmationModalAction({
            title: '¿Seguro desea eliminar este Despacho?',
            description: 'Usted está eliminado este Despacho, una vez eliminado no podrá ser recuperado.',
            id: '_clienteModal',
            onConfirm: () => onConfirmDelete(id, props.history)
        });
    };

    const onConfirm = (id) => {
        ConfirmationModalAction({
            title: '¿Seguro desea confirmar el despacho?',
            description: 'Usted está confirmando este Despacho, al confirmar no podrá modificar nuevamente.',
            id: '_clienteModal',
            onConfirm: () => onConfirmOffice(id, props.history)
        });
    };
    const onCloseModal = () => {
        getOrdersByConditional();
        setOpenOrdersModal(false);
    };

    const onAcceptModal = (conditionals) => {
        getOrdersByConditional();
        props.addOrderOffice(officeData.id, {id: 123}, conditionals, props.history);
        setOpenOrdersModal(false);
    };

    const addOrders = () => {
        const conditions = new Conditionals.Condition;
        conditions.add("status", ORDERS_ENUM.PRINTED, Conditionals.OPERATORS.EQUAL);//IMPRESA
        conditions.add("deliveryMethod.id", office.deliveryMethod.id, Conditionals.OPERATORS.EQUAL);
        conditions.add("orderDelivery.deliveryType", office.type, Conditionals.OPERATORS.EQUAL);
        conditions.add('office', '', Conditionals.OPERATORS.NULL);
        setOrderListConditions(conditions.condition);
        setOpenOrdersModal(true);
    };

    const deleteOrders = (id) => {
        ConfirmationModalAction({
            title: '¿Seguro desea eliminar el pedido?',
            description: 'Usted está confirmando eliminar este pedido, al confirmar no podrá recuperarlo nuevamente.',
            id: '_clienteModal',
            onConfirm: () => deleteOrderOffice(office.id, {order: id})
        });
    }

    const onConfirmDelete = (id, history) => props.deleteOffice(id, history);
    const onConfirmOffice = (id, history) => props.confirmOffice(id, history);
    const onGetDeliveryMethods = (conditional = null, limit = 50, page) => props.getDeliveryMethods(conditional, limit, page);
    const onGetFieldOptions = (conditional = null, limit = 500, page) => props.getFieldOptionByGroups([GROUPS.ORDERS_ORIGIN], limit, page);
    const onGetOrders = (conditions) => props.getOrdersByOffice(conditions.all(), 200, 0);
    const handleDownloadTemplate = (id) => fileOfficeTemplate('test.xls', id);

    const printReport = (id) => {
        setReportBody(null);
        props.printOfficeReport(id);
    }

    /** Solicitar reporte PDF */
    const requestPdfReport = async (id) => {
        try {
            const response = await officePdfApi(id);
            if (response.status === 200) {
                printPartOfPage(response.html);
            }
        } catch (e) {
            showMessage.error("No se ha podido generar el reporte PDF");
        }
    }

    return (
        <React.Fragment>
            <CustomModal title={"Agregar pedidos"} size="lg" showFooter={false} isOpen={openOrdersModal} onClose={onCloseModal}>
                <OrderList customActions={onAcceptModal} showAsModal={true} conditionals={orderListConditions} externalView/>
            </CustomModal>
            <div className="page-content">
                <Container fluid>
                    <Breadcrumb hasBack path="/offices" title={officeData.name} item={"Despachos"}/>
                    <HasPermissions permissions={[PERMISSIONS.OFFICE_EDIT]} renderNoAccess={() => <NoAccess/>}>
                        {officeData.status && (
                            <Row className="mb-2">
                                <Col md={12}>
                                    <div className={"mb-3 float-md-start"}>
                                        <StatusField color={OFFICE_STATUS[officeData.status]?.color} className={"font-size-14 mr-5"}>
                                            {OFFICE_STATUS[officeData.status]?.name}
                                        </StatusField>
                                        <small className="badge rounded-pill bg-soft-info font-size-14 mr-5 p-2">Operador: {officeData?.user?.name}</small>
                                    </div>
                                    <div className={"mb-3 float-md-end"}>
                                        <div className="button-items">

                                            {!!([1, 2].includes(officeData?.type)) && officeData.status === 1 && (
                                                <Tooltip placement="bottom" title="Descargar PDF para Cajas" aria-label="add">
                                                    <button type="button" color="primary" className="btn-sm btn btn-outline-danger waves-effect waves-light" onClick={() => requestPdfReport(officeData.id)}>
                                                        <i className={"mdi mdi-file-pdf"}> </i> {printReportData.loading ? 'Generando...' : ''}
                                                    </button>
                                                </Tooltip>
                                            )}

                                            {/* <Tooltip placement="bottom" title="Imprimir reporte" aria-label="add">
                                            <button type="button" color="primary" className="btn-sm btn btn-outline-info waves-effect waves-light" onClick={() => printReport(officeData.id)}>
                                                <i className={"mdi mdi-printer"}> </i> {printReportData.loading ? 'Generando...' : ''}
                                            </button>
                                        </Tooltip>*/}

                                            {!!(officeData?.type === 3 && [DELIVERY_METHODS.INTERRAPIDISIMO, DELIVERY_METHODS.SERVIENTREGA, DELIVERY_METHODS.PAYU].includes(officeData?.deliveryMethod?.code)) && (
                                                <Tooltip placement="bottom" title="Descargar Plantilla Excel" aria-label="add">
                                                    <button type="button" color="primary" className="btn-sm btn btn-outline-info waves-effect waves-light" onClick={() => handleDownloadTemplate(officeData.id)}>
                                                        <i className={"mdi mdi-file-excel"}> </i>
                                                    </button>
                                                </Tooltip>
                                            )}
                                            {officeData.status === 1 && (
                                                <>
                                                    <Tooltip placement="bottom" title="Eliminar despacho" aria-label="add">
                                                        <button type="button" color="primary" className="btn-sm btn btn-outline-danger waves-effect waves-light" onClick={() => onDelete(officeData.id)}>
                                                            <i className={"mdi mdi-delete"}> </i>
                                                        </button>
                                                    </Tooltip>
                                                    <Tooltip placement="bottom" title="Agregar pedidos" aria-label="add">
                                                        <button type="button" color="primary" className="btn-sm btn btn-outline-info waves-effect waves-light" onClick={() => addOrders()}>
                                                            <i className={"mdi mdi-plus"}> </i>
                                                        </button>
                                                    </Tooltip>
                                                    <Tooltip placement="bottom" title="Finalizar" aria-label="add">
                                                        <button type="button" color="primary" className="btn-sm btn btn-outline-success waves-effect waves-light" onClick={() => onConfirm(officeData.id)}>
                                                            <i className={"mdi mdi-check"}> </i>
                                                        </button>
                                                    </Tooltip>
                                                </>
                                            )}
                                        </div>
                                    </div>
                                </Col>
                            </Row>
                        )}
                        <AvForm className="needs-validation" autoComplete="off"
                                onValidSubmit={(e, v) => {
                                    handleValidSubmit(e, v)
                                }}>
                            <Row>
                                {editable ? (
                                    <Col xl="4" className="mb-2">
                                        <Card>
                                            <CardBody>
                                                <Row>
                                                    <Col md="12">
                                                        <div className="mb-3">
                                                            <Label htmlFor="field_name">Fecha <span className="text-danger">*</span></Label>
                                                            <FieldDate
                                                                name={"batchDate"}
                                                                mode={DATE_MODES.SINGLE}
                                                                defaultValue={officeData.batchDate}
                                                            />
                                                        </div>
                                                    </Col>
                                                    <Col md="12">
                                                        <div className="mb-3">
                                                            <Label htmlFor="field_name">Nombre <span className="text-danger">*</span></Label>
                                                            <FieldText
                                                                id={"field_name"}
                                                                name={"name"}
                                                                value={officeData.name}
                                                                minLength={3}
                                                                maxLength={255}
                                                                required
                                                            />
                                                        </div>
                                                    </Col>
                                                </Row>
                                                <Row>
                                                    <Col md="12">
                                                        <div className="mb-3">
                                                            <Label htmlFor="field_name">Tipo <span className="text-danger">*</span></Label>
                                                            <FieldSelect
                                                                id={"deliveryType"}
                                                                name={"deliveryType"}
                                                                options={deliveryTypes}
                                                                defaultValue={deliveryType}
                                                                onChange={item => setDeliveryType(item.value)}
                                                                required
                                                            />
                                                        </div>
                                                    </Col>
                                                    <Col md="12">
                                                        <div className="mb-3">
                                                            <Label htmlFor="field_name">Metodo<span className="text-danger">*</span></Label>
                                                            <FieldSelect
                                                                id={"deliveryMethod"}
                                                                name={"deliveryMethod"}
                                                                options={deliveryMethodList}
                                                                defaultValue={deliveryMethod?.code}
                                                                onChange={item => setDeliveryMethod(item.value)}
                                                                required
                                                            />
                                                        </div>
                                                    </Col>
                                                </Row>
                                                <Row>
                                                    <Col md="12">
                                                        <div className="mb-3">
                                                            <Label htmlFor="field_name">Descripción</Label>
                                                            <FieldText
                                                                type={"textarea"}
                                                                id={"description"}
                                                                name={"description"}
                                                                value={officeData.description}
                                                                minLength={3}
                                                                maxLength={255}
                                                            />
                                                        </div>
                                                    </Col>
                                                </Row>

                                                <Row>
                                                    <Col md={12} className="text-right">
                                                        <button type="button" className="btn btn-light" onClick={() => setEditable(false)}> Cerrar</button>
                                                        <ButtonSubmit loading={props.loading}/>
                                                    </Col>
                                                </Row>
                                            </CardBody>
                                        </Card>
                                    </Col>) : (
                                    <Col xl="4" className="mb-2">
                                        <Card>
                                            <div className="float-end">
                                                <Tooltip placement="bottom" title="Editar despacho" aria-label="add">
                                                    <button type="button"
                                                            size="small"
                                                            className="btn btn-sm text-primary cursor-pointer"
                                                            onClick={() => {
                                                                setEditable(true);
                                                            }}>
                                                        <i className="uil uil-pen font-size-18"> </i>
                                                    </button>
                                                </Tooltip>
                                            </div>
                                            <CardBody>
                                                <Row>
                                                    <Col md={12}>
                                                        <label>Fecha: </label>
                                                        <span className="p-1">{formatDate(officeData.batchDate, DATE_FORMAT.ONLY_DATE)}</span>
                                                    </Col>
                                                    <Col md={12}>
                                                        <label>Nombre: </label>
                                                        <span className="p-1">{officeData.name}</span>
                                                    </Col>
                                                    <Col md={12}>
                                                        <label>Tipo: </label>
                                                        <span className="p-1">{ConverterDeliveryType(deliveryType)}</span>
                                                    </Col>
                                                    <Col md={12}>
                                                        <label>Metodo: </label>
                                                        <span className="p-1">{deliveryMethod?.code}</span>
                                                    </Col>
                                                    <Col md={12}>
                                                        <label>Descripción: </label>
                                                        <span className="p-1">{officeData.description}</span>
                                                    </Col>
                                                </Row>
                                            </CardBody>
                                        </Card>
                                    </Col>
                                )}

                                <Col xl="8">
                                    <Card>
                                        <CardBody>
                                            <h4 className="card-title text-info"><i
                                                className="uil-shopping-cart-alt me-2"> </i> Pedidos en despacho</h4> <br/>
                                            <Col md="8">
                                                <div className="mb-3">
                                                    <FieldText
                                                        id={"searchBar"}
                                                        name={"dianCode"}
                                                        value={""}
                                                        minLength={0}
                                                        maxLength={200}
                                                        placeholder="Buscar un pedido..."
                                                        onChange={item => item.target.value === "" ? getOrdersByConditional() : getOrdersByConditionalAndFilter(item.target.value)}
                                                    />
                                                </div>
                                            </Col>
                                            <Row>
                                                {ordersList.length === 0 && <p><i className="fa fa-box-open text-muted"></i> Este despacho se encuentra vacio</p>}
                                                {ordersList.sort((a, b) => a.id < b.id).map((order, k) => (
                                                    <Col md={4} className="">
                                                        <div key={k} className="order-box">
                                                            <div>
                                                                <Link to={`/order/${order.id}`} className="text-muted">
                                                                    <small className="font-weight-600"><span className="text-info">Pedido #: {order.id}</span></small>
                                                                </Link>
                                                                <Tooltip placement="bottom" title={"Peso"} aria-label="add">
                                                                    <small className="float-end text-muted" style={{"cursor": "default"}}>
                                                                        <i className="mdi mdi-weight-pound"></i> {order.totalWeight}
                                                                    </small>
                                                                </Tooltip>
                                                                <br/>
                                                                <small><span className="font-weight-600">Cliente: </span> <small>{order.customer.name}</small></small>
                                                                {onDelete && (
                                                                    <button size="small" className="btn btn-sm text-danger" onClick={() => deleteOrders(order.id)}>
                                                                        <i className="uil uil-trash-alt font-size-18"> </i>
                                                                    </button>
                                                                )}
                                                            </div>
                                                        </div>
                                                    </Col>
                                                ))}
                                            </Row>
                                            {!ordersList && (
                                                <div className={"m-1 pl-2"}>No hay registros asociados</div>
                                            )}
                                        </CardBody>
                                    </Card>
                                </Col>
                            </Row>
                        </AvForm>
                    </HasPermissions>
                </Container>
            </div>
        </React.Fragment>
    )
}

const mapStateToProps = state => {
    const {deliveryMethods, ordersByOffice, refresh: refreshOrders} = state.Order
    const {error, office, loading, printReport, refresh} = state.Office
    return {error, office, loading, deliveryMethods: deliveryMethods.data, orders: ordersByOffice, printReportData: printReport, refresh, refreshOrders}
}

export default withRouter(
    connect(mapStateToProps, {
        apiError, registerOffice, deleteOffice, confirmOffice, updateOffice, getOffice,
        getDeliveryMethods, getFieldOptionByGroups, addOrderOffice, deleteOrderOffice, getOrdersByOffice, printOfficeReport, resetPrintOfficeReport
    })(OfficeEdit)
)

OfficeEdit.propTypes = {
    error: PropTypes.any,
    history: PropTypes.object
}

