import React, {useEffect, useState} from "react"
import {CardBody, Col, Label, Row} from "reactstrap"
import {AvForm} from "availity-reactstrap-validation"
import {Card, Tooltip} from "@material-ui/core";
import {withRouter} from "react-router-dom"
import {connect} from "react-redux";
import PropTypes from "prop-types";
import {FieldAsyncSelect, FieldSelect, FieldText} from "../../components/Fields";
import ButtonSubmit from "../../components/Common/ButtonSubmit";
import {ORDERS, ORDERS_CHARGE_ON_DELIVERY, ORDERS_FOR_CONCILIATE} from "../../helpers/url_helper";
import {getEmptyOptions} from "../../common/converters";
import {confirmConciliation, confirmConciliationRestart, getOrder, restartOrder} from "../../store/order/actions";
import Conditionals from "../../common/conditionals";
import {priceFormat} from "../../common/utils";
import {StatusField} from "../../components/StatusField";
import {ORDER_STATUS} from "../../common/constants";
import {fetchOrdersApi} from "../../helpers/backend_helper";

const searchByOptions = [{label: "Pedido", value: "ID"}, {label: "Guia", value: "GUIA"}, {label: "Lote Guia", value: "LOTE_GUIA"}, {label: "Lote pedido", value: "LOTE_PEDIDO"}];
const emptyOption = getEmptyOptions();

const OrderConciliationForm = ({
                                   onConfirmConciliationRestart,
                                   conciliationSuccess,
                                   conciliationError,
                                   conciliationLoading,
                                   onGetOrder,
                                   onCloseModal,
                                   order,
                                   loading,
                                   success,
                                   error,
                                   onRestartOrder,
                                   onConfirmConciliate
                               }) => {

    const [showNotValid, setShowNotValid] = useState(false);
    const [orderId, setOrderId] = useState(null);
    const [orders, setOrders] = useState([]);
    const [searchBy, setSearchBy] = useState(searchByOptions[0].value);
    const [defaultOption, setDefaultOption] = useState(emptyOption);
    const [lote, setLote] = useState(null);

    useEffect(() => {
        if (order) {
            const list = [...orders];
            if (!list.some(o => o.id === order.id)) {
                list.push(order);
                list.sort((a, b) => (a.id > b.id) ? 1 : -1);
                setOrders(list);
            }
        } else {
            setOrders([]);
        }
    }, [order]);

    useEffect(() => {
        if (onRestartOrder) {
            onRestartOrder();
        }
    }, [onRestartOrder]);

    useEffect(() => {
        if (conciliationSuccess && !conciliationError) {
            onCloseModal(true);
            onConfirmConciliationRestart();
        }
    }, [conciliationSuccess]);

    const addLote = () => {
        lote.split(' ')
            .filter(l => l)
            .filter(l => !orders.some(o => o.id == l && o.orderDelivery && o.orderDelivery.deliveryType != 3))
            .forEach(id => {
                onGetOrder(id);
            })
        setLote("");
    }
    const addLoteGuia = () => {

        const trackingList = lote.split(' ')
            .filter(tracking => tracking)
            .filter(tracking => !orders.some(o => o.orderDelivery && o.orderDelivery.tracking === tracking && o.orderDelivery.deliveryType != 3))
            .map(tracking => tracking);

        const list = [...orders];

        trackingList.forEach((tracking, index) => {
            const conditions = new Conditionals.Condition;
            conditions.add("orderDelivery.tracking", tracking, Conditionals.OPERATORS.EQUAL);
            const cond = Conditionals.getConditionalFormat(conditions.all());
            const query = Conditionals.buildHttpGetQuery(cond, 1, 0);

            fetchOrdersApi(query).then(resp => {
                if (resp && resp.data && resp.data.length === 1) {
                    let _order = resp.data[0];
                    if (!list.some(o => o.id === _order.id)) {
                        list.push(_order);
                        list.sort((a, b) => (a.id > b.id) ? 1 : -1);
                    }
                }

                if ((index + 1) === trackingList.length) {
                    setOrders(list);
                }
            })
        })
        setLote("");
    }

    /*const addLoteGuia = () => {

        const trackingList = lote.split(' ')
            .filter(tracking=> tracking)
            .filter(tracking => !orders.some(o => o.orderDelivery && o.orderDelivery.tracking === tracking))
            .map(tracking=> tracking);

        const conditions = new Conditionals.Condition;
        conditions.add("orderDelivery.tracking", trackingList, Conditionals.OPERATORS.IN);
        const cond = Conditionals.getConditionalFormat(conditions.all());
        const query = Conditionals.buildHttpGetQuery(cond, 1, 0);

        fetchOrdersApi(query).then(o => {
            if(o && o.data && o.data.length > 0){
                const list = [...orders];
                o.data.forEach((_order) => {
                    if (!list.some(o => o.id === _order.id)) {
                        list.push(_order);
                        list.sort((a, b) => (a.id > b.id) ? 1 : -1);
                    }
                })
                setOrders(list);
            }
        })
        setLote("");
    }*/

    const addOrder = () => {
        if (searchBy === 'LOTE_GUIA') {
            addLoteGuia();
            return;
        }
        if (searchBy === 'LOTE_PEDIDO') {
            addLote();
            return;
        }
        onGetOrder(orderId);
        setDefaultOption(getEmptyOptions());
        setOrderId(null);
    }

    const removeOrder = (orderId) => {
        const list = [...orders];
        const orderToRemove = list.find(o => o.id === orderId);
        list.splice(list.indexOf(orderToRemove), 1);
        setOrders(list);
    }

    const doConciliation = (e) => {
        onConfirmConciliate(orders.filter(o => o.status === 4).map(o => o.id));
    }

    return (
        <React.Fragment>
            <AvForm className="needs-validation" autoComplete="off" onValidSubmit={(e, v) => doConciliation(e, v)}>
                <Card>
                    <CardBody>
                        <Row className="mb-3">
                            <Col md={4}>
                                <Label htmlFor="product">Buscar por</Label>
                                <FieldSelect
                                    id={"searchByOptions"}
                                    name={"searchByOptions"}
                                    options={searchByOptions}
                                    defaultValue={searchBy}
                                    onChange={(e) => {
                                        setSearchBy(e.value);
                                    }}
                                />
                            </Col>
                            {searchBy === "ID" && (
                                <Col md={6}>
                                    <Label htmlFor="product">Pedido # </Label>
                                    <FieldAsyncSelect
                                        name={"order"}
                                        urlStr={ORDERS_FOR_CONCILIATE}
                                        placeholder="Buscar por Pedido"
                                        defaultValue={defaultOption}
                                        conditionalOptions={{fieldName: 'id', operator: Conditionals.OPERATORS.EQUAL}}
                                        defaultConditions={[]}
                                        onChange={(c) => {
                                            setOrderId(c.value);
                                        }}
                                    />
                                </Col>
                            )}
                            {searchBy === "GUIA" && (
                                <Col md={6}>
                                    <Label htmlFor="customer">Guia</Label>
                                    <FieldAsyncSelect
                                        name={"tracking"}
                                        urlStr={ORDERS_FOR_CONCILIATE}
                                        placeholder="Buscar por Guia"
                                        defaultValue={defaultOption}
                                        defaultConditions={[]}
                                        conditionalOptions={{fieldName: 'orderDelivery.tracking', operator: Conditionals.OPERATORS.EQUAL}}
                                        onChange={(c) => {
                                            setOrderId(c.value);
                                        }}
                                    />
                                </Col>
                            )}
                            {searchBy === "LOTE_GUIA" && (
                                <Col md={6}>
                                    <Label htmlFor="orders">Lote - Guias</Label>
                                    <FieldText
                                        id='loteTracking'
                                        name={"loteTracking"}
                                        value={lote}
                                        defaultValue={lote}
                                        onChange={(e) => {
                                            setLote(e.target.value);
                                        }}
                                        maxLength={3000}
                                    />
                                </Col>
                            )}
                            {searchBy === "LOTE_PEDIDO" && (
                                <Col md={6}>
                                    <Label htmlFor="orders">Lote - Pedidos</Label>
                                    <FieldText
                                        id='loteOrder'
                                        name={"loteOrder"}
                                        value={lote}
                                        defaultValue={lote}
                                        onChange={(e) => {
                                            setLote(e.target.value);
                                        }}
                                        maxLength={3000}
                                    />
                                </Col>
                            )}
                            <Col md={2} style={{display: 'flex', 'alignItems': 'flex-end'}}>
                                <Tooltip placement="bottom" title="Agregar" aria-label="add">
                                    <button type="button"
                                            className="btn btn-primary btn-block waves-effect waves-light mt-2 me-1 w-100"
                                            disabled={(!orderId && !lote) || loading}
                                            onClick={() => addOrder()}>
                                        {loading && <i className="fa fa-spinner fa-spin"> </i>}
                                        {!loading && <i className="mdi mdi-plus"> </i>}
                                    </button>
                                </Tooltip>
                            </Col>
                        </Row>
                        <Row>
                            <Col md={12}>
                                <table className="table table-condensed table-bordered">
                                    <thead>
                                    <tr>
                                        <th>Pedido</th>
                                        <th>Estado</th>
                                        <th>Guia</th>
                                        <th>Cliente</th>
                                        <th>Monto</th>
                                        <th></th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                    {orders.filter(o => o.status === 4).map(o => (
                                        <tr>
                                            <td>{o.id}</td>
                                            <td>
                                                <StatusField color={ORDER_STATUS[o.status]?.color}>
                                                    {ORDER_STATUS[o.status]?.name}
                                                </StatusField>
                                            </td>
                                            <td>{o.orderDelivery?.tracking}</td>
                                            <td>{o.customer?.name}</td>
                                            <td className="text-end">{priceFormat(o.totalAmount)}</td>
                                            <td className="text-center">
                                                <a title="button" className="btn btn-sm text-danger" onClick={() => removeOrder(o.id)}>
                                                    <i className="uil uil-trash-alt font-size-16"> </i>
                                                </a>
                                            </td>
                                        </tr>
                                    ))}
                                    </tbody>
                                </table>
                            </Col>
                            <Col>
                                <div><b>Cant pedidos:</b> {orders.filter(o => o.status === 4).length}</div>
                                <div><b>Total:</b> {priceFormat(orders.filter(o => o.status === 4).reduce((acc, item) => parseFloat(acc) + parseFloat(item.totalAmount), 0))}</div>
                            </Col>
                        </Row>
                        <Row>
                            <Col md={12} className="text-right">
                                <ButtonSubmit loading={conciliationLoading} disabled={conciliationLoading || orders.filter(o => o.status === 4).length === 0}/>
                            </Col>
                        </Row>
                    </CardBody>
                </Card>
            </AvForm>
            <div>
            <button className="btn btn-xs btn-primary m-2" onClick={() => setShowNotValid(!showNotValid)}> No validos  {showNotValid && <i className={"fa fa-minus"}></i>} {!showNotValid && <i className={"fa fa-plus"}></i>} </button>
            {showNotValid &&
            orders.some(o => o.status !== 4) && (
                <Row className="mt-5">
                    <Col md={12}>
                        <h5>Pedidos con estados no validos</h5>
                        <table className="table table-condensed table-bordered">
                            <thead>
                            <tr>
                                <th>Pedido</th>
                                <th>Estado</th>
                                <th>Guia</th>
                                <th>Cliente</th>
                                <th>Monto</th>
                                <th></th>
                            </tr>
                            </thead>
                            <tbody>
                            {orders.filter(o => o.status !== 4).map(o => (
                                <tr>
                                    <td>{o.id}</td>
                                    <td>
                                        <StatusField color={ORDER_STATUS[o.status]?.color}>
                                            {ORDER_STATUS[o.status]?.name}
                                        </StatusField>
                                    </td>
                                    <td>{o.orderDelivery?.tracking}</td>
                                    <td>{o.customer?.name}</td>
                                    <td className="text-end">{priceFormat(o.totalAmount)}</td>
                                    <td className="text-center">
                                        <a className="btn btn-sm text-danger" onClick={() => removeOrder(o.id)}>
                                            <i className="uil uil-trash-alt font-size-16"> </i>
                                        </a>
                                    </td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    </Col>
                    <Col>
                        <div><b>Cant pedidos:</b> {orders.filter(o => o.status !== 4).length}</div>
                        <div><b>Total:</b> {priceFormat(orders.filter(o => o.status !== 4).reduce((acc, item) => parseFloat(acc) + parseFloat(item.totalAmount), 0))}</div>
                    </Col>
                </Row>
            )
            }
            </div>
        </React.Fragment>
    )
}

const mapStateToProps = state => {
    const {order, loading, conciliation} = state.Order;
    return {order, loading, conciliationSuccess: conciliation.success, conciliationError: conciliation.error, conciliationLoading: conciliation.loading}
}

const mapDispatchToProps = dispatch => ({
    onConfirmConciliationRestart: () => dispatch(confirmConciliationRestart()),
    onConfirmConciliate: (orders) => dispatch(confirmConciliation(orders)),
    onRestartOrder: () => dispatch(restartOrder()),
    onGetOrder: (id) => dispatch(getOrder(id)),
})

export default withRouter(
    connect(mapStateToProps, mapDispatchToProps)(OrderConciliationForm)
)

OrderConciliationForm.propTypes = {
    error: PropTypes.any,
    onCloseModal: PropTypes.func
}

