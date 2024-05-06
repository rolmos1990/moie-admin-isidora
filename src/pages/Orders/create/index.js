import React, {useEffect, useState} from "react"
import {CardBody, Col, Container, Row, Spinner} from "reactstrap"
import {Card} from "@material-ui/core";
import {withRouter} from "react-router-dom"
import {connect} from "react-redux";
import PropTypes from "prop-types";
import Breadcrumb from "../../../components/Common/Breadcrumb";
import OrderCustomer from "./orderCustomer";
import OrderProducts from "./orderProducts";
import OrderCar from "./orderCar";
import OrderDeliveryOptions from "./orderDeliveryOptions";
import {resetCustomer} from "../../../store/customer/actions";
import {resetProduct} from "../../../store/product/actions";
import {ConfirmationModalAction} from "../../../components/Modal/ConfirmationModal";
import OrderSummary from "./orderSummary";
import {registerOrder, resetCar} from "../../../store/order/actions";
import {CHARGE_ON_DELIVERY, DELIVERY_METHODS_PAYMENT_TYPES, PAYMENT_TYPES} from "../../../common/constants";
import {PERMISSIONS} from "../../../helpers/security_rol";
import NoAccess from "../../../components/Common/NoAccess";
import HasPermissions from "../../../components/HasPermissions";
import {showMessage} from "../../../components/MessageToast/ShowToastMessages";

const CreateOrder = (props) => {
    const {onResetOrder, car, onRegisterOrder, error, loading} = props;
    const [initComponent, setInitComponent] = useState(true);
    const [isValidOrder, setIsValidOrder] = useState(false);

    useEffect(() => {
        console.log('only first time...');
        onResetOrder();
    }, []);

    useEffect(() => {
        if (initComponent) {
            onResetOrder();
            setInitComponent(false);
        }
    }, [initComponent]);

    useEffect(() => {
        if (car) {
            const validCost = null != car.deliveryOptions.cost && car.deliveryOptions.cost >= 0
            const isValidCustomer = !!car.customer.id;
            const isValidProducts = car.products.length > 0;
            const isValidDeliveryOptions = car.deliveryOptions && car.deliveryOptions.origin && car.deliveryOptions.type && car.deliveryOptions.method && validCost;
            //se agrega valicacion para no permitir clientes contrapagos que esten inactivos
            const validCustomerType = (car.customer && car.customer.status === true) || (car.customer && car.customer.status === false && car.deliveryOptions && car.deliveryOptions.type !== CHARGE_ON_DELIVERY);

            setIsValidOrder(isValidCustomer && isValidProducts && isValidDeliveryOptions && validCustomerType);
        }
    }, [car]);

    const onCancelOrder = () => {
        const dirty = car.customer.id || car.products.length > 0;

        if (!dirty) {
            resetOrder();
            return;
        }

        ConfirmationModalAction({
            title: 'Confirmación',
            description: '¿Seguro desea cancelar el pedido?',
            id: '_OrderModal',
            onConfirm: () => {
                resetOrder();
            }
        });
    }

    const resetOrder = () => {
        onResetOrder();
        props.history.push("/orders");
    }

    const onCreateOrder = () => {
        if(!loading) {
            const order = {
                customer: car.customer.id,
                deliveryMethod: car.deliveryOptions.method,
                deliveryCost: car.deliveryOptions.cost,
                chargeOnDelivery: car.deliveryOptions.type === 3,
                origen: car.deliveryOptions.origin,
                deliveryType: parseInt(car.deliveryOptions.type),
                otherMethod: car.deliveryOptions.otherMethod,
                products: car.products.map(prod => ({
                    id: prod.origin.id,
                    productSize: prod.sizeId,
                    quantity: prod.quantity,
                    discountPercentage: prod.discountPercentage,
                }))
            };

            if (DELIVERY_METHODS_PAYMENT_TYPES.includes(order.deliveryMethod)) {
                order.piecesForChanges = parseInt(car.deliveryOptions.piecesForChanges);
                order.paymentMode = car.deliveryOptions.paymentType === PAYMENT_TYPES.CASH ? 1 : 2;
            } else {
                order.deliveryLocality = car.deliveryOptions.deliveryLocality;

                if (((order.deliveryType == CHARGE_ON_DELIVERY && order.deliveryMethod != 'MENSAJERO') || order.deliveryMethod == 'PAYU') && order.deliveryLocality == null) {
                        showMessage.error("Localidad Requerida");
                        return false;
                }

            }

            onRegisterOrder(order, props.history);
        }
    }

    return (
        <React.Fragment>
            <div className="page-content">
                <Container fluid>
                    <Breadcrumb hasBack path="/orders" title="Crear pedido" item={"Pedido"}/>
                    <HasPermissions permission={PERMISSIONS.ORDER_CREATE} renderNoAccess={() => <NoAccess/>}>
                        <Card className="mb-3">
                            <CardBody>
                                <Row>
                                    <Col md={12}>
                                        <OrderCustomer/>
                                    </Col>
                                </Row>
                                <hr/>
                                <Row>
                                    <Col md={12}>
                                        <OrderProducts/>
                                    </Col>
                                </Row>
                                <hr/>
                                <Row>
                                    <Col md={12}>
                                        <OrderCar/>
                                    </Col>
                                </Row>
                                <hr/>
                                <Row>
                                    <Col md={12}>
                                        <OrderDeliveryOptions/>
                                    </Col>
                                </Row>
                                <hr/>
                                <Row>
                                    <Col md={12}>
                                        <OrderSummary/>
                                    </Col>
                                </Row>
                                <hr/>
                                <Row>
                                    {error && (
                                        <Col md={12} className="text-center">
                                            <div className="alert alert-danger">
                                                {error}
                                            </div>
                                        </Col>
                                    )}

                                    <Col md={12} className="text-center">
                                        <div className="btn-group">
                                            <button type="button" className="btn btn-light text-danger" onClick={() => onCancelOrder()}>
                                                Cancelar
                                            </button>
                                            <button type="button" className="btn btn-primary" disabled={!isValidOrder} onClick={() => onCreateOrder()}>
                                                {loading && <Spinner size="sm" className="m-1" color="primary"/>}
                                                <i className="uil uil-shopping-cart-alt me-2"> </i> Crear pedido
                                            </button>
                                        </div>
                                    </Col>
                                </Row>
                            </CardBody>
                        </Card>
                    </HasPermissions>
                </Container>
            </div>
        </React.Fragment>
    )
}

const mapStateToProps = state => {
    const {car, loading, error} = state.Order
    return {car, loading, error}
}

const mapDispatchToProps = dispatch => ({
    onResetOrder: () => {
        dispatch(resetCustomer());
        dispatch(resetProduct());
        dispatch(resetCar());
    },
    onRegisterOrder: (order, history) => dispatch(registerOrder(order, history))
})

export default withRouter(
    connect(mapStateToProps, mapDispatchToProps)(CreateOrder)
)

CreateOrder.propTypes = {
    onResetOrder: PropTypes.func,
    error: PropTypes.any,
    history: PropTypes.object
}
