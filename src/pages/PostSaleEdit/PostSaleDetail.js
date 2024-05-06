import React, {useEffect} from "react"
import {Col, Container, Row} from "reactstrap"
import {Button, Card, Tooltip} from "@material-ui/core";
import {withRouter} from "react-router-dom"
import {connect} from "react-redux";
import PropTypes from "prop-types";
import Breadcrumb from "../../components/Common/Breadcrumb";
import {formatDate, priceFormat} from "../../common/utils";
import NoDataIndication from "../../components/Common/NoDataIndication";
import {StatusField} from "../../components/StatusField";
import {COMMENT_ENTITIES, GROUPS, ORDER_STATUS} from "../../common/constants";
import Observations from "../../components/Common/Observations";
import {getOrder, refreshOrderDelivery, syncOrder} from "../../store/order/actions";
import {PERMISSIONS} from "../../helpers/security_rol";
import NoAccess from "../../components/Common/NoAccess";
import HasPermissions from "../../components/HasPermissions";
import {ConfirmationModalAction} from "../../components/Modal/ConfirmationModal";
import {markOrderReceived, showResponseMessage} from "../../helpers/service";

const PostSaleDetail = (props) => {

    const {onGetOrder, refresh, order} = props;

    useEffect(() => {
        if (props.match.params.id) {
            onGetOrder(props.match.params.id);
        }
    }, [onGetOrder, refresh]);

    const updateDeliveryStatus = () => {
        props.onUpdateSync(order.id, {sync: !order.orderDelivery.sync})
    }

    const refreshDeliveryStatus = () => {
        props.onRefreshOrderDelivery(order.id);
    }

    const onMarkReceived = async () => {
        ConfirmationModalAction({
            title: 'Confirmación',
            description: '¿Seguro desea marcar este pedido como recibido?',
            id: '_OrderModal',
            onConfirm: () => {
                markOrderReceived(order.id).then(resp => {
                    onGetOrder(props.match.params.id);
                    showResponseMessage({status: 200}, "PostVenta actualizado");
                });
            }
        });
    }

    return order.id ? (
        <React.Fragment>
            <div className="page-content">
                <Container fluid className="pb-3">
                    <Breadcrumb hasBack path="/postSales" title={order.name} item={`Post Venta #${order.id}`}/>
                    <HasPermissions permissions={[PERMISSIONS.POSTSALE_LIST]} renderNoAccess={() => <NoAccess/>}>
                        <Row className="mb-2">
                            <Col md={12}>
                                <div className={"mb-3 float-md-start"}>
                                    <small className="badge rounded-pill bg-soft-info font-size-14 mr-5 p-2">Operador: {order?.user?.name}</small>
                                </div>
                                <div className={"mb-3 float-md-end"}>
                                    <div className="button-items">

                                        <Tooltip placement="bottom" title={order.orderDelivery.sync ? 'Desactivar' : 'Activar'} aria-label="add">
                                            <button type="button" color="primary" className="btn-sm btn btn-outline-info waves-effect waves-light" onClick={() => updateDeliveryStatus(order)}>
                                                <i className={`mdi mdi-${order.orderDelivery.sync ? 'delete text-danger' : 'check text-success'}`}> </i>
                                            </button>
                                        </Tooltip>
                                        <Tooltip placement="bottom" title="Refrescar" aria-label="add">
                                            <button type="button" color="primary" className="btn-sm btn btn-outline-info waves-effect waves-light" onClick={() => refreshDeliveryStatus(order.id)}>
                                                <i className={"mdi mdi-refresh"}> </i>
                                            </button>
                                        </Tooltip>
                                        {!order.manualReceived && (
                                            <HasPermissions permission={PERMISSIONS.POSTSALE_RECEIVED}>
                                                <Tooltip placement="bottom" title="Marcar Recibido" aria-label="add">
                                                    <button type="button" color="primary" className="btn-sm btn btn-outline-info waves-effect waves-light" onClick={() => onMarkReceived()}>
                                                        <i className={"mdi mdi-check"}> </i>
                                                    </button>
                                                </Tooltip>
                                            </HasPermissions>
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
                                            <label># Pedido: </label>
                                            <span className="p-1">{order.id}</span>
                                        </Col>
                                        <Col md={6}>
                                            <label>Destino: </label>
                                            <span className="p-1">{order.orderDelivery.deliveryLocality.name}</span>
                                        </Col>
                                    </Row>
                                    <Row>
                                        <Col md={6}>
                                            <label>Cliente: </label>
                                            <span className="p-1">{order.customer.name}</span>
                                            {order.customer.isMayorist === true && (
                                                <Tooltip placement="bottom" title="Cliente mayorista" aria-label="add">
                                                    <i className={"mdi mdi-crown font-size-18 mr-1 text-warning"}> </i>
                                                </Tooltip>
                                            )}
                                        </Col>
                                        <Col md={6}>
                                            <label>Estado del pedido: &nbsp;</label>
                                            <StatusField color={ORDER_STATUS[order.status]?.color}>
                                                {ORDER_STATUS[order.status]?.name}
                                            </StatusField>
                                        </Col>
                                    </Row>
                                    <Row>
                                        <Col md={6}>
                                            <label>Monto del pedido: </label>
                                            <span className="p-1">{priceFormat(order.totalAmount)}</span>
                                        </Col>
                                        <Col md={6}>
                                            <label>Metodo de envio: </label>
                                            <span className="p-1">{order.deliveryMethod.name}</span>
                                        </Col>
                                    </Row>
                                    <Row>
                                        <Col md={6}>
                                            <label>Guia: </label>
                                            <span className="p-1">{order.orderDelivery.tracking}</span>
                                        </Col>
                                        <Col md={6}>
                                            <label>Fecha de envío: </label>
                                            <span className="p-1">{formatDate(order.orderDelivery.deliveryDate || order.createdAt)}</span>
                                        </Col>
                                    </Row>
                                    <Row>
                                        <Col md={6}>
                                            <label>Activo: </label>
                                            <span className="p-1">{order.orderDelivery.sync ? 'SI' : 'NO'}</span>
                                        </Col>
                                    </Row>
                                </Col>
                            </Row>
                        </Card>

                        <Card id={'tracking'} className="mb-3 p-3">
                            <Row>
                                <Col md={12}>
                                    <h4 className="card-title text-info">Rastreo del paquete</h4>
                                    <hr/>
                                </Col>
                                <Col md={12}>
                                    <Row>
                                        <Col md={6}>
                                            <label>Estatus del envío: </label>
                                            <span className="p-1">{order.orderDelivery.deliveryStatus || ''}</span>
                                            {order.manualReceived && (<span className={"badge rounded-pill p-2  bg-soft-success"}><i className="mdi mdi-check"></i> Recibido</span>) }
                                        </Col>
                                        <Col md={6}>
                                            <label>Fecha del estatus del envío: </label>
                                            <span className="p-1">{order.orderDelivery.deliveryStatusDate ? formatDate(order.orderDelivery.deliveryStatusDate) : null}</span>
                                        </Col>
                                    </Row>
                                    <Row>
                                        <Col md={12}>
                                            <label>Ubicación estatus del envío: </label>
                                            <span className="p-1">{order.orderDelivery.deliveryCurrentLocality}</span>
                                        </Col>
                                    </Row>
                                </Col>
                            </Row>
                        </Card>

                        <Observations
                            entitySuggested={GROUPS.ORDER_OBSERVATIONS}
                            entity={COMMENT_ENTITIES.ORDER}
                            entityId={order.id}/>
                    </HasPermissions>
                </Container>
            </div>
        </React.Fragment>
    ) : <NoDataIndication/>;
}

const mapStateToProps = state => {
    const {error, order, refresh, loading} = state.Order;
    return {error, order, refresh, loading}
}

const mapDispatchToProps = dispatch => ({
    onGetOrder: (id) => dispatch(getOrder(id)),
    onUpdateSync: (id, payload) => dispatch(syncOrder(id,payload)),
    onRefreshOrderDelivery: (id) => dispatch(refreshOrderDelivery(id))
})

export default withRouter(
    connect(mapStateToProps, mapDispatchToProps)(PostSaleDetail)
)

PostSaleDetail.propTypes = {
    error: PropTypes.any,
    history: PropTypes.object
}
