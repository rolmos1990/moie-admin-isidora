import React, {useEffect, useState} from "react"
import {Col, Label, Row} from "reactstrap"
import {withRouter} from "react-router-dom"
import {connect} from "react-redux";
import PropTypes from "prop-types";
import {FieldDecimalNumber, FieldNumber, FieldSelect, FieldText} from "../../../components/Fields";
import {getProduct} from "../../../store/product/actions";
import {AvForm} from "availity-reactstrap-validation";
import {getFieldOptionByGroups} from "../../../store/fieldOptions/actions";
import {
    DELIVERY_METHODS,
    DELIVERY_METHODS_IDS,
    DELIVERY_METHODS_PAYMENT_TYPES,
    DELIVERY_TYPES,
    GROUPS,
    PAYMENT_TYPES,
    PAYMENT_TYPES_LIST
} from "../../../common/constants";
import {getDeliveryMethods, getDeliveryQuote, updateCard} from "../../../store/order/actions";
import {arrayToOptions, getEmptyOptions} from "../../../common/converters";
import {Button} from "@material-ui/core";
import {getAllDeliveryLocalities} from "../../../store/deliveryLocality/actions";
import {sortAlphanumeric} from "../../../common/utils";
import OrderList from "../orderList";
import CustomModal from "../../../components/Modal/CommosModal";
import LocalityEdit from "../../LocalityEdit";
import Conditionals from "../../../common/conditionals";
import HasPermissions from "../../../components/HasPermissions";
import {PERMISSIONS} from "../../../helpers/security_rol";

const OrderDeliveryOptions = (props) => {
    const {
        onUpdateCar, car, fieldOptions, onGetFieldOptions, onGetDeliveryMethods, onGetDeliveryQuote, deliveryMethods, deliveryQuote,
        showAsModal, onCloseModal, onAcceptModal, pOriginOrder,
        onGetDeliveryLocalities, deliveryLocalities,
        order
    } = props;

    const [initComponent, setInitComponent] = useState(true);
    const [deliveryMethodList, setDeliveryMethodList] = useState([]);
    const [deliveryMethod, setDeliveryMethod] = useState(null);
    const [deliveryLocalitiesList, setDeliveryLocalitiesList] = useState([]);
    const [deliveryLocality, setDeliveryLocality] = useState(null);
    const [originOrders, setOriginOrders] = useState([]);
    const [originOrder, setOriginOrder] = useState(pOriginOrder || null);
    const [deliveryTypes, setDeliveryTypes] = useState(null);
    const [deliveryType, setDeliveryType] = useState(null);
    const [paymentTypes, setPaymentTypes] = useState(null);
    const [paymentType, setPaymentType] = useState(null);
    const [tracking, setTracking] = useState(null);
    const [deliveryCost, setDeliveryCost] = useState(null);
    const [otherMethod, setOtherMethod] = useState(null);
    const [pieceToChange, setPieceToChange] = useState(null);
    const [showPaymentType, setShowPaymentType] = useState(false);
    const [hasAddress, setHasAddress] = useState(false);
    const [productQty, setProductQty] = useState(0);

    //Carga inicial
    useEffect(() => {
        setDeliveryTypes([getEmptyOptions(), ...DELIVERY_TYPES.map(dt => ({label: dt.label, value: dt.id}))]);
        setPaymentTypes([getEmptyOptions(), ...PAYMENT_TYPES_LIST]);
        onGetFieldOptions();
        if(!deliveryMethods || deliveryMethods.length === 0) onGetDeliveryMethods();

        const conditions = new Conditionals.Condition;
        conditions.add('status', 1, Conditionals.OPERATORS.EQUAL);
        onGetDeliveryLocalities(conditions.condition);

        if (car.reset) {
            setDeliveryMethod(null);
            setOriginOrder(null);
            setDeliveryType(null);
            setPaymentType(null);
            setDeliveryCost(null);
            setPieceToChange(null);
            setShowPaymentType(false);
            setDeliveryLocality(null);
            setOtherMethod(null);
            setProductQty(0);
            setTracking("");
            setHasAddress(false);
        }
    }, [onGetFieldOptions, car.reset]);

    useEffect(() => {
        const list = fieldOptions || [];
        setOriginOrders([getEmptyOptions(), ...list.filter(op => (op.groups === GROUPS.ORDERS_ORIGIN)).map(op => ({label: op.name, value: op.name}))]);
    }, [fieldOptions]);

    useEffect(() => {
        if(deliveryMethod === "INTERRAPIDISIMO" || deliveryMethod === "SERVIENTREGA") {
            const list = deliveryLocalities.map(item => {
                if(deliveryMethod === 'SERVIENTREGA') {
                    if (item.deliveryType == 1) {
                        //sucursal
                        item.icon = "&nbsp;&nbsp;&nbsp;&nbsp;"+ item.timeInDays +"&nbsp;&nbsp;<i class='fa fa-building' ></i>";
                    }
                    if (item.deliveryType == 2) {
                        //delivery
                        item.icon = "&nbsp;&nbsp;&nbsp;&nbsp;"+ item.timeInDays +"&nbsp;&nbsp;<i class='fa fa-motorcycle' ></i>";
                    }
                    if (item.deliveryType == 3) {
                        //sucursal y delivery
                        item.icon = "&nbsp;&nbsp;&nbsp;&nbsp;"+ item.timeInDays +"&nbsp;&nbsp;<span><i class='fa fa-building' ></i>&nbsp;<i class='fa fa-motorcycle' ></i></span>";
                    }
                }
                return item;
            }).filter(me => me.deliveryMethodId === DELIVERY_METHODS_IDS[deliveryMethod]) || [];
            setDeliveryLocalitiesList([getEmptyOptions(), ...arrayToOptions(list, deliveryMethod === "SERVIENTREGA")]);
        }
    }, [deliveryLocalities, deliveryMethod]);

    useEffect(() => {
        const list = deliveryMethods || [];
        const ot = deliveryType + '';
        setDeliveryMethodList([getEmptyOptions(), ...list.filter(op => (op.settings.includes(ot))).map(op => ({label: op.name, value: op.code}))]);

        if(!(deliveryMethod && !showPaymentType && hasAddress)) {
            setDeliveryLocality(null);
        }

        onChangeDeliveryOptions();
    }, [deliveryType]);

    useEffect(() => {
        if (deliveryMethod) {
            setShowPaymentType(DELIVERY_METHODS_PAYMENT_TYPES.includes(deliveryMethod));

            if(deliveryMethod !== DELIVERY_METHODS.OTRO) {
                setOtherMethod(null);
            }
            //getQuote();
            onChangeDeliveryOptions();
        }
    }, [deliveryMethod]);

    useEffect(() => {
        if (deliveryMethods) {
            const ot = deliveryType ? deliveryType + '' : null;
            setDeliveryMethodList([getEmptyOptions(), ...deliveryMethods.filter(op => (!ot || op.settings.includes(ot))).map(op => ({label: op.name, value: op.code}))]);
        }
    }, [deliveryMethods]);

    useEffect(() => {
        if (deliveryMethod && deliveryQuote) {
            /*if (!car.isEdit) {
                setDeliveryCost(parseFloat(deliveryQuote.amount));
            }*/
            onChangeDeliveryOptions();
        }
    }, [deliveryQuote]);

    useEffect(() => {
        onChangeDeliveryOptions();
    }, [deliveryCost, paymentType, pieceToChange, tracking, deliveryLocality, otherMethod]);

    useEffect(() => {
        //getQuote();
    }, [car.products]);

    useEffect(() => {
        if (car.isEdit && car.deliveryOptions && car.deliveryOptions.origin && initComponent) {
            setInitComponent(false);
            setDeliveryMethod(car.deliveryOptions.method);
            setOriginOrder(car.deliveryOptions.origin);
            setDeliveryType(car.deliveryOptions.type);
            setDeliveryCost(car.deliveryOptions.cost);
            setPieceToChange(car.deliveryOptions.piecesForChanges);
            setDeliveryLocality(car.deliveryOptions.deliveryLocality);
            setTracking(car.deliveryOptions.tracking);
            setOtherMethod(car.deliveryOptions.otherMethod);
            setShowPaymentType(DELIVERY_METHODS_PAYMENT_TYPES.includes(car.deliveryOptions.method));

            if (car.deliveryOptions.paymentType)
                setPaymentType(car.deliveryOptions.paymentType === 1 ? PAYMENT_TYPES.CASH : PAYMENT_TYPES.TRANSFER);
            //getQuote()
        }
    }, [car.deliveryOptions]);

    const getQuote = () => {
        let qty = 0;
        car.products.forEach(prod => (qty += prod.quantity));
        if (qty > 0 && deliveryMethod && (qty !== productQty || car.deliveryOptions.method !== deliveryMethod)) {
            setProductQty(qty);
            let products = car.products.map(prod => ({id: prod.origin.id, qty: prod.quantity}));
            onGetDeliveryQuote({deliveryType: deliveryType, deliveryMethodCode: deliveryMethod, products});
        }
    }

    const onChangeDeliveryOptions = () => {
        let deliveryOps = {
            origin: originOrder,
            type: deliveryType,
            method: deliveryMethod,
            cost: parseFloat(deliveryCost),
            paymentType: paymentType,
            piecesForChanges: pieceToChange,
            deliveryLocality: deliveryLocality,
            otherMethod: otherMethod,
        };

        //Se agrega validacion si es mensajero, previo pago o previo pago cod no tiene direccion de envio
        setHasAddress(!(deliveryMethod === "MENSAJERO" || [1,2].includes(deliveryType)) || deliveryMethod === "PAYU");

        if(tracking && tracking !== ''){
            deliveryOps.tracking = tracking;
        }
        onUpdateCar({...car, deliveryOptions: deliveryOps});
    }

    const acceptModal = () => {
        onAcceptModal(car);
    }

    const isDisabled = () => {
        if(!order || !order.orderDelivery){
            return false;
        }
        return (order.status == 5 && order.orderDelivery && order.orderDelivery.deliveryType === 1);
    }

    const [openLocalityModal, setOpenLocalityModal] = useState(false);
    const onCloseLocalityModal = () => {
        setOpenLocalityModal(false);
    };

    const onSave = () => {
        onGetDeliveryLocalities();
        setOpenLocalityModal(false);
    }

    const showGuia = () => car.deliveryOptions.tracking
    return (
        <React.Fragment>
            <CustomModal title={"Editar Localidad"} size="lg" showFooter={false} isOpen={openLocalityModal} onClose={onCloseLocalityModal}>
                <LocalityEdit customActions={onSave} showAsModal={true} externalId={deliveryLocality} externalView/>
            </CustomModal>
            <AvForm className="needs-validation" autoComplete="off" onValidSubmit={(e, v) => acceptModal(e, v)}>
                <Row>
                    <Col>
                        <h4 className="card-title text-info"><i className="uil uil-truck"> </i> Opciones de envio</h4>
                    </Col>
                </Row>
                <Row>
                    <Col md={6} className="p-1">
                        <Label htmlFor="weight">Origen del pedido</Label>
                        <FieldSelect
                            id={"originOrder"}
                            name={"originOrder"}
                            isSearchable={true}
                            options={sortAlphanumeric(originOrders,'label')}
                            defaultValue={originOrder}
                            onChange={item => setOriginOrder(item.value)}
                            required
                        />
                    </Col>
                    <Col md={6} className="p-1">
                        <Label htmlFor="weight">Tipo de pedido</Label>
                        <FieldSelect
                            id={"deliveryType"}
                            name={"deliveryType"}
                            options={deliveryTypes}
                            defaultValue={deliveryType}
                            onChange={item => setDeliveryType(item.value)}
                            required
                            disabled={isDisabled()}
                        />
                    </Col>
                    <Col md={6} className="p-1">
                        <Label htmlFor="weight">Metodo de envio</Label>
                        <FieldSelect
                            id={"deliveryMethod"}
                            name={"deliveryMethod"}
                            options={deliveryMethodList}
                            defaultValue={deliveryMethod}
                            onChange={item => setDeliveryMethod(item.value)}
                            required
                        />
                    </Col>
                    <Col md={6} className="p-1">
                        <Label htmlFor="weight">Costo del envio</Label>
                        <FieldDecimalNumber
                            id={"deliveryCost"}
                            name={"deliveryCost"}
                            value={deliveryCost}
                            onChange={val => setDeliveryCost(val)}
                            required/>
                    </Col>
                    {deliveryMethod === DELIVERY_METHODS.OTRO && (
                        <Col md={6} className="p-1">
                            <Label htmlFor="weight">Especifique</Label>
                            <FieldText
                                id={"otherMethod"}
                                name={"otherMethod"}
                                value={otherMethod}
                                onChange={item => setOtherMethod(item.target.value)}
                                required/>
                        </Col>
                    )}

                    {(deliveryMethod && !showPaymentType && hasAddress && deliveryType !== null) && (
                        <Col md={12} className="p-1">
                            <Label htmlFor="weight">Localidad</Label>
                            <FieldSelect
                                id={"deliveryLocality"}
                                name={"deliveryLocality"}
                                options={deliveryLocalitiesList}
                                defaultValue={deliveryLocality}
                                onChange={item => setDeliveryLocality(item.value)}
                                required
                                isSearchable
                            />
                            <HasPermissions permission={PERMISSIONS.DELIVERY_LOCALITY_EDIT} renderNoAccess={() => ""}>
                            <br />
                            {deliveryLocality && <button onClick={() => setOpenLocalityModal(true)} className="btn btn-sm btn-outline-primary"><i className="mdi mdi-pencil"></i></button>}
                            </HasPermissions>
                        </Col>
                    )}
                    {showPaymentType && (
                        <>
                            <Col md={6} className="p-1">
                                <Label htmlFor="weight">Forma de pago</Label>
                                <FieldSelect
                                    id={"paymentType"}
                                    name={"paymentType"}
                                    options={paymentTypes}
                                    defaultValue={paymentType}
                                    onChange={item => {
                                        setPaymentType(item.value)
                                    }}
                                    required
                                />
                            </Col>
                            <Col md={6} className="p-1">
                                <Label htmlFor="weight">Prendas para cambio</Label>
                                <FieldNumber
                                    id={"pieceToChange"}
                                    name={"pieceToChange"}
                                    value={pieceToChange}
                                    onChange={val => setPieceToChange(val)}
                                    />
                            </Col>
                        </>
                    )}
                    {!!(showGuia() && tracking && tracking !== '') && (
                        <Col md={6} className="p-1">
                            <Label htmlFor="weight">Guia número</Label>
                            <div className="form-control">{tracking}</div>
                            {/* <FieldText
                                id={"tracking"}
                                name={"tracking"}
                                value={tracking}
                                onChange={item => setTracking(item.target.value)}
                            />*/}
                        </Col>
                    )}
                </Row>
                {showAsModal && (
                    <>
                        <hr/>
                        <Row>
                            <Col md={12} className="text-right">
                                {onCloseModal && (
                                    <button type="button" className="btn btn-light" onClick={() => props.onCloseModal()}>Cancelar</button>
                                )}
                                {onAcceptModal && (
                                    <Button color="primary" type="submit">Guardar</Button>
                                )}
                            </Col>
                        </Row>
                    </>
                )}
            </AvForm>
        </React.Fragment>
    )
}

OrderDeliveryOptions.propTypes = {
    history: PropTypes.object
}

const mapDispatchToProps = dispatch => ({
    onGetProduct: (id) => dispatch(getProduct(id)),
    onGetFieldOptions: (conditional = null, limit = 500, page) => dispatch(getFieldOptionByGroups([GROUPS.ORDERS_ORIGIN], limit, page)),
    onGetDeliveryLocalities: (conditional = null) => dispatch(getAllDeliveryLocalities(conditional)),
    onGetDeliveryMethods: (conditional = null, limit = 50, page) => dispatch(getDeliveryMethods(conditional, limit, page)),
    onGetDeliveryQuote: (request) => dispatch(getDeliveryQuote(request)),
    onUpdateCar: (data) => dispatch(updateCard(data)),
})

const mapStateToProps = state => {
    const {deliveryLocalities} = state.DeliveryLocality
    const {fieldOptions} = state.FieldOption
    const {car, deliveryMethods, deliveryQuote, order} = state.Order
    return {car, deliveryLocalities, deliveryMethods: deliveryMethods.data, deliveryQuote: deliveryQuote.data, fieldOptions, order};
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(OrderDeliveryOptions))
