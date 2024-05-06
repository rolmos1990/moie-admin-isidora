import React, {useEffect, useState} from "react"
import {Col, Row} from "reactstrap"
import {Card, Tooltip} from "@material-ui/core";
import {withRouter} from "react-router-dom"
import {connect} from "react-redux";
import PropTypes from "prop-types";
import NoDataIndication from "../../components/Common/NoDataIndication";
import {getOrders} from "../../store/order/actions";
import Conditionals from "../../common/conditionals";
import {formatDate, hiddenPhone, priceFormat} from "../../common/utils";
import {ConfirmationModalAction} from "../../components/Modal/ConfirmationModal";
import {StatusField} from "../../components/StatusField";
import {ORDER_STATUS, PAYMENT_STATUS} from "../../common/constants";
import {applyPayment, deletePayment, getPayment} from "../../store/payments/actions";
import {PERMISSIONS} from "../../helpers/security_rol";
import HasPermissions from "../../components/HasPermissions";
import HasPermissionsFunc from "../../components/HasPermissionsFunc";

const PaymentOverlay = (props) => {

    const {paymentSelected, payment, onRelateOrder, onCloseOverlay, onGetOrders, orders, onGetPayment, refresh, onCancelPayment} = props;
    const [findOrderBy, setFindOrderBy] = useState(null);
    const hasPhonePermission = HasPermissionsFunc([PERMISSIONS.CUSTOMER_PHONE]);

    useEffect(() => {
        if (paymentSelected) {
            onReload();
        }
    }, [paymentSelected, refresh]);

    const onReload = () => {
        onGetPayment(paymentSelected.id);

        const conditions = new Conditionals.Condition;
        conditions.add("payment", null, Conditionals.OPERATORS.NULL);
        conditions.add("orderDelivery.deliveryType", [1,2].join("::"), Conditionals.OPERATORS.IN);
        conditions.add('status', 1);
        onGetOrders(conditions);
        setFindOrderBy("NO_PAYMENT");
    }

    const selectOrder = (order) => {
        ConfirmationModalAction({
            title: 'Confirmación',
            description: `Usted está asociando el pago# ${paymentSelected.id} con el pedido# ${order.id}, ¿Desea continuar?`,
            id: '_cancelPaymentModal',
            onConfirm: () => {
                onRelateOrder(paymentSelected.id, {orderId: order.id});
                onReload();
            }
        });
    }

    const cancelPayment = () => {
        ConfirmationModalAction({
            title: 'Confirmación',
            description: `Usted está anulando el pago# ${paymentSelected.id}, ¿Desea continuar?`,
            id: '_clienteModal',
            onConfirm: () => {
                onCancelPayment(paymentSelected.id);
                onReload();
            }
        });
    }

    return paymentSelected && payment && payment.id ? (
        <div className={'orderDetail-overlay pt-2'}>
            <Row className="mb-2">
                <Col md={12}>
                    <div className={"mb-3 float-md-start"}>
                        <Tooltip placement="bottom" title="Ocultar" aria-label="add">
                            <button className="btn btn-outline-default mr-5" onClick={() => onCloseOverlay()}>
                                <i className="uil uil-arrow-to-right font-size-16"> </i>
                            </button>
                        </Tooltip>
                        <small className="badge rounded-pill bg-info font-size-14 mr-5 p-2">Pago# {payment.id}</small>
                    </div>
                    <div className={"mb-3 float-md-end"}>
                        {payment.status === 0 && (
                            <Tooltip placement="bottom" title="Anular pago" aria-label="add">
                                <button className="btn btn-sm text-danger mr-5" onClick={() => cancelPayment()}>
                                    <i className="uil uil-trash-alt font-size-18"> </i>
                                </button>
                            </Tooltip>
                        )}
                    </div>
                </Col>
            </Row>
            <Row className="mb-3">
                <Col md={12} className="p-3">
                    <Card id={'payment-detail'} className="p-3">
                        <Row>
                            <Col xs={10}>
                                <h4 className="card-title text-info"><i className="uil uil-truck"> </i> Datos del pago</h4>
                            </Col>
                            <Col xs={2}>
                                <StatusField color={PAYMENT_STATUS[payment.status]?.color}>
                                    {PAYMENT_STATUS[payment.status]?.name}
                                </StatusField>
                            </Col>
                        </Row>
                        <Row>
                            <Col md={6}>
                                <label>Nombre: </label>
                                <span className="p-1">{payment.name}</span>
                            </Col>
                            <Col md={6}>
                                <label>Teléfono: </label>
                                <span className="p-1">{hasPhonePermission ? payment.phone : hiddenPhone(payment.phone)}</span>
                            </Col>
                            <Col md={6}>
                                <label>Correo: </label>
                                <span className="p-1">{payment.email}</span>
                            </Col>
                            <Col md={6}>
                                <label>Forma de pago: </label>
                                <span className="p-1">{payment.type}</span>
                            </Col>
                            {payment.originBank && (
                                <Col md={6}>
                                    <label>Banco origen: </label>
                                    <span className="p-1">{payment.originBank}</span>
                                </Col>
                            )}
                            <Col md={6}>
                                <label>Banco destino: </label>
                                <span className="p-1">{payment.targetBank}</span>
                            </Col>
                            <Col md={6}>
                                <label>Fecha: </label>
                                <span className="p-1">{formatDate(payment.createdAt)}</span>
                            </Col>
                            <Col md={6}>
                                <label>Número de comprobante: </label>
                                <span className="p-1">{payment.consignmentNumber}</span>
                            </Col>
                            <Col md={6}>
                                <label>Monto: </label>
                                <span className="p-1">{priceFormat(payment.consignmentAmount, "", true)}</span>
                            </Col>
                        </Row>
                    </Card>
                </Col>
                <Col md={12} className="p-3">
                    {!payment.order && payment.status == 0 && (
                        <Card id={'orders'} className="p-3">
                            <Col xs={10}>
                                <h4 className="card-title text-info"><i className="uil uil-truck"> </i> Seleccionar venta</h4>
                            </Col>
                            <Row>
                                <table className="table table-sm table-striped table-bordered table-centered table-nowrap font-size-11">
                                    <thead>
                                    <tr>
                                        <th style={{width: '10%'}}># Pedido</th>
                                        <th style={{width: '35%'}}>Cliente</th>
                                        <th style={{width: '15%'}}>Fecha</th>
                                        <th style={{width: '15%'}}>Total con descuento</th>
                                        <th style={{width: '10%'}}>Envio</th>
                                        <th style={{width: '15%'}}>Total</th>
                                        <HasPermissions permissions={[PERMISSIONS.PAYMENT_EDIT]}>
                                            <th></th>
                                        </HasPermissions>
                                    </tr>
                                    </thead>
                                    <tbody>
                                    {orders.length === 0 && (

                                        <tr>
                                            <HasPermissions permissions={[PERMISSIONS.PAYMENT_EDIT]} renderNoAccess={() => <td colSpan={5} style={{"textAlign": "center"}}>No hay registros que mostrar</td>}>
                                                <td colSpan={6} style={{"textAlign": "center"}}>No hay registros que mostrar</td>
                                            </HasPermissions>
                                        </tr>
                                    )}
                                    {orders.map((order, k) => (
                                        <tr>
                                            <td>{order.id}</td>
                                            <td>{order.customer.name}</td>
                                            <td>{formatDate(order.createdAt)}</td>
                                            <td className="text-end">{priceFormat(order.totalWithDiscount)}</td>
                                            <td className="text-end">{priceFormat(order.orderDelivery.deliveryCost)}</td>
                                            <td className="text-end">{priceFormat(order.totalAmount)}</td>
                                            <HasPermissions permissions={[PERMISSIONS.PAYMENT_EDIT]}>
                                                <td>
                                                    <Tooltip placement="bottom" title="Asociar pedido" aria-label="add">
                                                        <button size="small" className="btn btn-sm btn-primary" onClick={() => selectOrder(order)}>
                                                            <i className="uil uil-plus-circle font-size-18"> </i>
                                                        </button>
                                                    </Tooltip>
                                                </td>
                                            </HasPermissions>
                                        </tr>
                                    ))}
                                    </tbody>
                                </table>
                            </Row>
                        </Card>
                    )}
                    {payment.order && (
                        <Card id={'order-detail'} className="p-3">
                            <Col xs={10}>
                                <h4 className="card-title text-info"><i className="uil uil-truck"> </i> Pedido asociado</h4>
                            </Col>
                            <Row>
                                <Col md={6}>
                                    <label>Pedido #: </label>
                                    <span className="p-1">{payment.order.id}</span>
                                </Col>
                                <Col md={6}>
                                    <label>Estado: </label>
                                    <span className="p-1">
                                         <StatusField color={ORDER_STATUS[payment.order.status]?.color} className={"font-size-10 mr-5"}>
                                            {ORDER_STATUS[payment.order.status].name}
                                        </StatusField>
                                    </span>
                                </Col>
                                <Col md={6}>
                                    <label>Cliente: </label>
                                    <span className="p-1">{payment.order.customer.name}</span>
                                </Col>
                                <Col md={6}>
                                    <label>Correo: </label>
                                    <span className="p-1">{payment.order.customer.email}</span>
                                </Col>
                                <Col md={6}>
                                    <label>Fecha: </label>
                                    <span className="p-1">{formatDate(payment.order.createdAt)}</span>
                                </Col>
                                <Col md={6}>
                                    <label>Cantidad de prendas: </label>
                                    <span className="p-1">{payment.order.quantity}</span>
                                </Col>
                            </Row>
                            <Row>
                                <Col md={4}>
                                    <label>Monto con Descuento: </label>
                                    <span className="p-1">{priceFormat(payment.order.totalWithDiscount, "", true)}</span>
                                </Col>
                                <Col md={4}>
                                    <label>Envio: </label>
                                    <span className="p-1">{priceFormat(payment.order.orderDelivery.deliveryCost, "", true)}</span>
                                </Col>
                                <Col md={4}>
                                    <label>Total: </label>
                                    <span className="p-1">{priceFormat(payment.order.totalAmount, "", true)}</span>
                                </Col>
                            </Row>
                        </Card>
                    )}
                </Col>
            </Row>

        </div>
    ) : <NoDataIndication/>;
}

const mapStateToProps = state => {
    const {orders} = state.Order
    const {payment, refresh} = state.Payments;
    return {orders, payment, refresh}
}

const mapDispatchToProps = dispatch => ({
    onGetPayment: (id) => dispatch(getPayment(id)),
    onGetOrders: (conditions) => dispatch(getOrders(conditions.all(), 500, 0)),
    onCancelPayment: (id) => dispatch(deletePayment(id)),
    onRelateOrder: (paymentId, payload) => dispatch(applyPayment(paymentId, payload))
})

export default withRouter(
    connect(mapStateToProps, mapDispatchToProps)(PaymentOverlay)
)

PaymentOverlay.propTypes = {
    paymentSelected: PropTypes.object.isRequired,
    showOverlay: PropTypes.bool,
    onCloseOverlay: PropTypes.func,
    error: PropTypes.any,
    history: PropTypes.object
}
