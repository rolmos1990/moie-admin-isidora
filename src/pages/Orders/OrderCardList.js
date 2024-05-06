import React, {useEffect, useState} from "react"
import {Col, Row} from "reactstrap"
import {Link, withRouter} from "react-router-dom"
import {connect} from "react-redux";
import PropTypes from "prop-types";

import {map} from "lodash";
import {getOrder, getOrders} from "../../store/order/actions";
import Conditionals from "../../common/conditionals";
import {formatDate, priceFormat} from "../../common/utils";
import {Tooltip} from "@material-ui/core";
import {DELIVERY_TYPES, ORDER_STATUS} from "../../common/constants";
import {StatusField} from "../../components/StatusField";

const OrderCardList = (props) => {

    const {onGetOrder, onGetOrders, order, orders, productId, customerId} = props;
    const [ordersList, setOrdersList] = useState([]);
    const [openCustomerModal, setOpenCustomerModal] = useState(false);

    useEffect(() => {
        if (customerId) {
            const conditions = new Conditionals.Condition;
            conditions.add("customer", customerId, Conditionals.OPERATORS.EQUAL);
            onGetOrders(conditions);
        }
    }, [customerId]);

    useEffect(() => {
        if (orders && orders.length > 0) {
            setOrdersList(orders);
        }
    }, [orders]);

    const getDeliveryType = (delivery) => {
        const deliveryType = delivery ? delivery.deliveryType : '';
        let find = DELIVERY_TYPES.find(dt => dt.id === deliveryType);
        return find ? find.label : '';
    }

    return (
        <React.Fragment>
            <Row>
                <Col md={12}>
                    <h4 className="card-title text-info"><i className="uil-shopping-cart-alt me-2"> </i> Pedidos recientes</h4>
                </Col>
                {ordersList.sort((a,b) => a.id < b.id).map((order, k) => (
                    <div key={k} className="order-box">
                        <Row>
                            <Col md={6} className="">
                                <div>
                                    <Link to={`/order/${order.id}`} className="text-primary">
                                        <small className="font-weight-600 text-info">Pedido #: {order.id}</small>
                                    </Link>
                                    <br/>
                                    <small><span className="font-weight-600">Origen:</span> {order.origen}</small>
                                    <br/>
                                    <small><span className="font-weight-600">Tipo de entrega:</span> {getDeliveryType(order.orderDelivery)}</small>
                                    <br/>
                                    <small><span className="font-weight-600">Método de entrega:</span> {order.deliveryMethod.name}</small>
                                </div>
                            </Col>
                            <Col md={6} className="text-right">
                                <div>
                                    <div>
                                        <span className="m-2 mb-4">
                                            <Tooltip placement="bottom" title="Estado" aria-label="add">
                                                <StatusField color={ORDER_STATUS[order.status]?.color}>{ORDER_STATUS[order.status]?.name}</StatusField>
                                            </Tooltip>
                                        </span>
                                        <span className="m-2 mb-4">
                                            <Tooltip placement="bottom" title="Fecha creación" aria-label="add">
                                                <small className="badge rounded-pill bg-light p-2">{formatDate(order.createdAt)}</small>
                                            </Tooltip>
                                        </span>
                                    </div>
                                    <div className="m-1">
                                        <Tooltip placement="bottom" title="Cantidad de prendas" aria-label="add">
                                             <small className="badge rounded-pill bg-light p-2"><span className="font-weight-600">Cant. prendas :</span> {order.quantity}</small>
                                        </Tooltip>
                                    </div>
                                    <div>
                                        <small className="m-2 fw-bold font-size-16">{priceFormat(order.totalAmount)}</small>
                                    </div>
                                </div>
                            </Col>
                        </Row>
                    </div>
                ))}
            </Row>
        </React.Fragment>
    );
}

const mapStateToProps = state => {
    const {products, product} = state.Product
    const {error, car, order, orders, loading} = state.Order;
    return {error, car, order, orders, products, loading}
}

const mapDispatchToProps = dispatch => ({
    onGetOrder: (id) => dispatch(getOrder(id)),
    onGetOrders: (conditions) => dispatch(getOrders(conditions.all(), 5, 0)),
})

export default withRouter(
    connect(mapStateToProps, mapDispatchToProps)(OrderCardList)
)

OrderCardList.propTypes = {
    customerId: PropTypes.number,
    error: PropTypes.any,
    history: PropTypes.object
}
