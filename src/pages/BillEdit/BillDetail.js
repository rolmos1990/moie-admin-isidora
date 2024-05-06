import React, {useEffect, useState} from "react"
import {Col, Container, Row} from "reactstrap"
import {Card, Tooltip} from "@material-ui/core";
import {withRouter} from "react-router-dom"
import {connect} from "react-redux";
import PropTypes from "prop-types";
import Breadcrumb from "../../components/Common/Breadcrumb";
import {formatDate} from "../../common/utils";
import NoDataIndication from "../../components/Common/NoDataIndication";
import {createCreditNote, getBill, sendInvoice, updateBill} from "../../store/bill/actions";
import {ConfirmationModalAction} from "../../components/Modal/ConfirmationModal";
import {BILL_STATUS, CHARGE_ON_DELIVERY, DELIVERY_METHODS_IDS, ORDERS_ENUM} from "../../common/constants";
import {PERMISSIONS} from "../../helpers/security_rol";
import NoAccess from "../../components/Common/NoAccess";
import HasPermissions from "../../components/HasPermissions";
import Conditionals from "../../common/conditionals";
import OrderList from "../Orders/orderList";
import CustomModal from "../../components/Modal/CommosModal";
import HasPermissionsFunc from "../../components/HasPermissionsFunc";
import moment from "moment";

const BillDetail = (props) => {

    const {onGetBill, refresh, bill} = props;

    const [activeTab, setActiveTab] = useState(1);

    const [openOrdersModal, setOpenOrdersModal] = useState(false);
    const [orderListConditions, setOrderListConditions] = useState([]);
    const hasAssociateOrderPermission = HasPermissionsFunc([PERMISSIONS.BILL_CHANGE_ORDER]);


    useEffect(() => {
        if (props.match.params.id) {
            onGetBill(props.match.params.id);
        }
    }, [onGetBill, refresh]);

    const createCreditNote = () => {
        ConfirmationModalAction({
            title: `¿Está seguro de generar una nota de crédito para la factura # ${bill.id}?`,
            description: 'Esta acción no puede revertirse.',
            id: '_creditNoteModal',
            onConfirm: () => props.onCreateCreditNote(bill.id)
        });
    }

    const createInvoice = () => {
        ConfirmationModalAction({
            title: `¿Está seguro de reenviar esta factura # ${bill.id}?`,
            description: 'Esta acción no puede revertirse.',
            id: '_creditInvoiceModal',
            onConfirm: () => props.onCreateInvoice(bill.id)
        });
    }

    const addOrdersManager = (billId, type) => {
        if(!type){
            addOrders(billId);
        }
        if(type === 'SERVIENTREGA'){
            addOrdersServiEntrega(billId);
        }
        if(type === 'PAYU'){
            addOrdersPayu(billId);
        }
    }

    const addOrders = (billId) => {
        const conditions = new Conditionals.Condition;
        conditions.add('bill.id', '', Conditionals.OPERATORS.NULL);
        conditions.add('office', '', Conditionals.OPERATORS.NOT_NULL);
        conditions.add('createdAt', '2022-01-01T00:00:00.000Z', Conditionals.OPERATORS.GREATER_THAN_OR_EQUAL);
        conditions.add('deliveryMethod', DELIVERY_METHODS_IDS.INTERRAPIDISIMO, Conditionals.OPERATORS.EQUAL);
        conditions.add('orderDelivery.deliveryType', CHARGE_ON_DELIVERY, Conditionals.OPERATORS.EQUAL);
        conditions.add('status', [ORDERS_ENUM.SENT, ORDERS_ENUM.FINISHED].join("::"), Conditionals.OPERATORS.IN);

        setOrderListConditions(conditions.condition);
        setOpenOrdersModal(true);
    };

    const addOrdersPayu = (billId) => {
        const conditions = new Conditionals.Condition;
        conditions.add('bill.id', '', Conditionals.OPERATORS.NULL);
        conditions.add('office', '', Conditionals.OPERATORS.NOT_NULL);
        conditions.add('createdAt', '2022-01-01T00:00:00.000Z', Conditionals.OPERATORS.GREATER_THAN_OR_EQUAL);
        conditions.add('deliveryMethod', DELIVERY_METHODS_IDS.PAYU, Conditionals.OPERATORS.EQUAL);
        conditions.add('status', [ORDERS_ENUM.SENT, ORDERS_ENUM.FINISHED].join("::"), Conditionals.OPERATORS.IN);

        setOrderListConditions(conditions.condition);
        setOpenOrdersModal(true);
    };

    const addOrdersServiEntrega = (billId) => {
        const conditions = new Conditionals.Condition;
        conditions.add('bill.id', '', Conditionals.OPERATORS.NULL);
        conditions.add('office', '', Conditionals.OPERATORS.NOT_NULL);
        conditions.add('createdAt', '2023-05-20T00:00:00.000Z', Conditionals.OPERATORS.GREATER_THAN_OR_EQUAL);
        conditions.add('deliveryMethod', DELIVERY_METHODS_IDS.SERVIENTREGA, Conditionals.OPERATORS.EQUAL);
        conditions.add('orderDelivery.deliveryType', CHARGE_ON_DELIVERY, Conditionals.OPERATORS.EQUAL);
        conditions.add('status', [ORDERS_ENUM.SENT, ORDERS_ENUM.FINISHED].join("::"), Conditionals.OPERATORS.IN);

        setOrderListConditions(conditions.condition);
        setOpenOrdersModal(true);
    };

    const associateNewOrder = (type) => {
        ConfirmationModalAction({
            title: `¿Está seguro de modificar y asociar un nuevo pedido a esta factura # ${bill.id}?`,
            description: 'Esta acción no puede revertirse.',
            id: '_associateNewOrder',
            onConfirm: () => addOrdersManager(bill.id, type)
        });
    }

    const formatLog = (_log) => {
        if (_log) {
            const replaceRegex = /Paso+/g;
            _log = _log.replace(replaceRegex, "<br /><br />Paso");
            return _log;
        } else {
            return "No hay registros al momento";

        }
    }

    const canCancel = () => {
        const isSent = (bill.status == BILL_STATUS.SENT && bill.creditNote == null);
        const isFailedCreditNote = (bill?.creditNote != null && bill?.creditNote?.status != 1);
        return isSent || isFailedCreditNote;
    }

    const canRetry = () => {
        const isNotSent = bill.status !== BILL_STATUS.SENT;
        return isNotSent;
    }

    const canAssociateOrder = () => {
        const canAssociate = hasAssociateOrderPermission && (bill.status === BILL_STATUS.ERROR);
        return canAssociate;
    }

    const onCloseModal = () => {
        setOpenOrdersModal(false);
    };
    const onAcceptModal = (conditionals) => {
        if (conditionals && conditionals.length > 0) {
            if (conditionals && conditionals.length > 1) {
                return;
            }
        }

        const value = conditionals[0].value;
        const ids = value.split ? value.split('::') : [value];
        const orderId = ids[0];

        props.onUpdateBill(bill.id, {order: {id: orderId}, createdAt: moment().format('YYYY-MM-DD HH:mm:ss')});
        setOpenOrdersModal(false);
    };

    return (bill && bill.id) ? (
        <React.Fragment>
            <CustomModal title={"Agregar pedidos"} size="lg" showFooter={false} isOpen={openOrdersModal} onClose={onCloseModal}>
                <OrderList customActions={onAcceptModal} showAsModal={true} conditionals={orderListConditions} externalView orderLimit={1}/>
            </CustomModal>
            <div className="page-content">
                <Container fluid className="pb-3">
                    <Breadcrumb hasBack path="/bills" title={`Factura #${bill.id}`} item={`Factura #${bill.id}`}/>

                    <HasPermissions permissions={[PERMISSIONS.BILL_LIST]} renderNoAccess={() => <NoAccess/>}>
                        <Row className="mb-2">
                            <Col md={12}>
                                <div className={"mb-3 float-md-start"}>

                                </div>
                                <div className={"mb-3 float-md-end"}>
                                    <div className="button-items">
                                        {canAssociateOrder() && (
                                            <>
                                                <Tooltip placement="bottom" title="Asociar un nuevo Pedido (INTERRAPIDISIMO)" aria-label="add">
                                                    <button type="button" color="primary" className="btn-sm btn btn-outline-info waves-effect waves-light" onClick={() => associateNewOrder()}>
                                                        <i className={`uil-shopping-cart-alt me-2`}> </i>
                                                    </button>
                                                </Tooltip>
                                                <Tooltip placement="bottom" title="Asociar un nuevo Pedido (SERVIENTREGA)" aria-label="add">
                                                <button type="button" color="primary" className="btn-sm btn btn-outline-info waves-effect waves-light" onClick={() => associateNewOrder('SERVIENTREGA')}>
                                                <i className={`uil-shopping-cart-alt me-2`}> </i>
                                                </button>
                                                </Tooltip>
                                                <Tooltip placement="bottom" title="Asociar un nuevo Pedido (PAYU)" aria-label="add">
                                                <button type="button" color="primary" className="btn-sm btn btn-outline-info waves-effect waves-light" onClick={() => associateNewOrder('PAYU')}>
                                                <i className={`uil-shopping-cart-alt me-2`}> </i>
                                                </button>
                                                </Tooltip>
                                            </>
                                        )}

                                        {canRetry() && (
                                            <Tooltip placement="bottom" title="Reenviar Factura" aria-label="add">
                                                <button type="button" color="primary" className="btn-sm btn btn-outline-info waves-effect waves-light" onClick={() => createInvoice()}>
                                                    <i className={`uil-repeat text-primary`}> </i>
                                                </button>
                                            </Tooltip>
                                        )}
                                        {canCancel() && (
                                            <Tooltip placement="bottom" title="Generar nota de crédito" aria-label="add">
                                                <button type="button" color="primary" className="btn-sm btn btn-outline-info waves-effect waves-light" onClick={() => createCreditNote()}>
                                                    <i className={`uil-bill text-danger`}> </i>
                                                </button>
                                            </Tooltip>
                                        )}
                                    </div>
                                </div>
                            </Col>
                        </Row>
                        <Card id={'details'} className="mb-3 p-3">
                            <Row>
                                <Col md={12}>
                                    <h4 className="card-title text-info">Información básica</h4>
                                    <hr/>
                                </Col>
                                <Col md={12}>
                                    <Row>
                                        <Col md={6}>
                                            <label>ID: </label>
                                            <span className="p-1">{bill.id}</span>
                                        </Col>
                                    </Row>
                                    <Row>
                                        <Col md={6}>
                                            <label>Número legal: </label>
                                            <span className="p-1">{bill.legalNumber}</span>
                                        </Col>
                                        <Col md={6}>
                                            <label>Pedido: </label>
                                            <span className="p-1">{bill.order.id}</span>
                                        </Col>
                                    </Row>
                                    <Row>
                                        <Col md={6}>
                                            <label>Estatus:</label>
                                            <span className="p-1">{bill.status}</span>
                                        </Col>
                                        <Col md={6}>
                                            <label>Fecha: </label>
                                            <span className="p-1">{formatDate(bill.createdAt)}</span>
                                        </Col>
                                    </Row>
                                    <Row>
                                        <Col md={6}>
                                            <label>Cliente:</label>
                                            <span className="p-1">{bill.order.customer.name}</span>
                                        </Col>
                                        <Col md={6}>
                                            <label>Correo: </label>
                                            <span className="p-1">{bill.order.customer.email}</span>
                                        </Col>
                                    </Row>
                                    <Row>
                                        <Col md={6}>
                                            {bill?.creditNote?.id && bill?.creditNote?.status != 1 ? <div><label>Nota de Credito: </label>&nbsp;<span className="badge rounded-pill p-2 bg-soft-danger">Error Dian</span></div> : ""}
                                        </Col>
                                    </Row>
                                </Col>
                            </Row>
                        </Card>
                        <Card id={'log'} className="mb-3 p-3">
                            <Row>
                                <Col md={12}>

                                    <ul className="nav nav-tabs nav-tabs-custom nav-justified" role="tablist">
                                        <li className="nav-item">
                                            <a className={`nav-link ${activeTab === 1 ? 'active' : ''}`} data-bs-toggle="tab" href="#tab1" role="tab" aria-selected="false" onClick={() => setActiveTab(1)}>
                                                <span className="d-block d-sm-none"><i className="fas fa-home"> </i></span>
                                                <span className="d-none d-sm-block">Bicacora Factura Dian</span>
                                            </a>
                                        </li>
                                        <li className="nav-item">
                                            <a className={`nav-link ${activeTab === 2 ? 'active' : ''}`} data-bs-toggle="tab" href="#tab2" role="tab" aria-selected="false" onClick={() => setActiveTab(2)}>
                                                <span className="d-block d-sm-none"><i className="far fa-user"> </i></span>
                                                <span className="d-none d-sm-block">Bitacora Nota de Credito</span>
                                            </a>
                                        </li>
                                    </ul>
                                    <div className="tab-content p-3 text-muted">
                                        <div className={`tab-pane ${activeTab === 1 ? 'active' : ''}`} id="tab2" role="tabpanel">
                                            <h4 className="card-title text-info">Bitacora Dian</h4>
                                            <hr/>
                                            <div dangerouslySetInnerHTML={{__html: formatLog(bill.dianLog)}}/>
                                        </div>
                                        <div className={`tab-pane ${activeTab === 2 ? 'active' : ''}`} id="tab2" role="tabpanel">
                                            <h4 className="card-title text-info">Bitacora Nota de Credito</h4>
                                            <hr/>
                                            <div dangerouslySetInnerHTML={{__html: formatLog(bill.dianCreditMemoLog)}}/>
                                        </div>
                                    </div>
                                </Col>
                            </Row>
                        </Card>
                    </HasPermissions>
                </Container>
            </div>
        </React.Fragment>
    ) : <NoDataIndication/>;
}

const mapStateToProps = state => {
    const {bill, loading, refresh, creditNote} = state.Bill
    return {bill, refresh, loading, loadingCreditNote: creditNote.loading}
}

const mapDispatchToProps = dispatch => ({
    onGetBill: (id) => dispatch(getBill(id)),
    onCreateCreditNote: (id) => dispatch(createCreditNote(id)),
    onCreateInvoice: (id) => dispatch(sendInvoice(id)),
    onUpdateBill: (id, data) => dispatch(updateBill(id, data))
})

export default withRouter(
    connect(mapStateToProps, mapDispatchToProps)(BillDetail)
)

BillDetail.propTypes = {
    error: PropTypes.any,
    history: PropTypes.object
}
