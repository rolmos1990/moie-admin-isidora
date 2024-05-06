import React, {useEffect, useState} from "react"
import { Card, CardBody, Table, CardTitle, Label ,Input ,Row, Col, Button} from "reactstrap"
import { Link } from "react-router-dom"
import {DEFAULT_PAGE_LIMIT} from "../../common/pagination";
import {getUsers} from "../../store/user/actions";
import {connect} from "react-redux";
import {getOrders} from "../../store/order/actions";
import {ORDER_STATUS} from "../../common/constants";
import {StatusField} from "../../components/StatusField";
import {formatDate, formatDateToServer, getMoment, priceFormat} from "../../common/utils";
import Conditionals from "../../common/conditionals";
import {Tooltip} from "@material-ui/core";

const LatestTransaction = (props) => {
    const {orders, meta, onGetOrders, loading, refresh} = props;
    const [ordersList, setOrdersList] = useState([]);

    useEffect(() => {
        onGetOrders()
    }, [onGetOrders]);

    useEffect(() => {
        setOrdersList(orders)
    }, [orders])

    return (
        <Row>
            <Col lg={12}>
                <Card>
                    <CardBody>
                        <CardTitle className="h4 mb-4">Pedidos Pendientes</CardTitle>
                        <div className="table-responsive">
                            <Table className="table-centered table-nowrap mb-0">
                                <thead className="table-light">
                                <tr>
                                    <th>ID</th>
                                    <th>Cliente</th>
                                    <th>Fecha</th>
                                    <th>Monto</th>
                                    <th>Estado</th>
                                    <th>Metodo de Envio</th>
                                    <th></th>
                                </tr>
                                </thead>
                                <tbody>
                                {ordersList.map((order, k) => (
                                <tr>
                                    <td><Link to="#" className="text-body fw-bold">{ order.id }</Link> </td>
                                    <td>{order.customer.name}
                                    {order.customer.isMayorist === true && (
                                        <Tooltip placement="bottom" title="Cliente mayorista" aria-label="add">
                                            <i className={"mdi mdi-crown font-size-18 mr-1 text-warning"}> </i>
                                        </Tooltip>
                                    )}</td>
                                    <td>
                                        <small className="badge rounded-pill bg-light p-2">{formatDate(order.createdAt)}</small>
                                    </td>
                                    <td>
                                        {priceFormat(order.totalAmount)}
                                    </td>
                                    <td>
                                        <StatusField color={ORDER_STATUS[order.status]?.color}>
                                            {ORDER_STATUS[order.status].name}
                                        </StatusField>
                                    </td>
                                    <td>
                                        {order.deliveryMethod.name}
                                    </td>
                                    <td>
                                        <Link to={`/order/${order.id}`} className="btn btn-primary btn-sm btn-rounded waves-effect waves-light">
                                            <i className={"mdi mdi-magnify"}></i>
                                        </Link>
                                    </td>
                                </tr>
                                ))}

                                </tbody>
                            </Table>
                        </div>
                    </CardBody>
                </Card>
            </Col>
        </Row>
    )
}

//add some conditions
const conditions = new Conditionals.Condition;
conditions.add('status', '1::2', Conditionals.OPERATORS.BETWEEN);
conditions.add('createdAt', formatDateToServer(getMoment().subtract(3, 'days')), Conditionals.OPERATORS.GREATER_THAN_OR_EQUAL);


const mapStateToProps = state => {
    const {orders, loading, meta, refresh} = state.Order;
    return {orders, loading, meta, refresh};
}
const mapDispatchToProps = dispatch => ({
    onGetOrders: (conditional = conditions.all(), limit = 6, page) => dispatch(getOrders(conditional, limit, page)),
})

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(LatestTransaction)
