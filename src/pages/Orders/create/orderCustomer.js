import React, {useEffect, useState} from "react"
import {Col, Label, Row} from "reactstrap"
import {withRouter} from "react-router-dom"
import {connect} from "react-redux";
import PropTypes from "prop-types";
import {FieldAsyncSelect, FieldSelect} from "../../../components/Fields";
import {CUSTOMER} from "../../../helpers/url_helper";
import {getCustomer, updateCustomer} from "../../../store/customer/actions";
import {getEmptyOptions} from "../../../common/converters";
import {AvForm} from "availity-reactstrap-validation";
import {Button, Tooltip} from "@material-ui/core";
import Conditionals from "../../../common/conditionals";
import CustomModal from "../../../components/Modal/CommosModal";
import CustomerForm from "../../CustomerEdit/CustomerForm";
import {updateCard} from "../../../store/order/actions";
import {hasCustomerOpenOrders} from "../../../helpers/service";
import OrdersPieChart from "../../CustomerEdit/OrdersPieChart";
import CategoriesPieChart from "../../CustomerEdit/CategoriesPieChart";
import {hiddenPhone, trim} from "../../../common/utils";
import HasPermissionsFunc from "../../../components/HasPermissionsFunc";
import {PERMISSIONS} from "../../../helpers/security_rol";
import HasPermissions from "../../../components/HasPermissions";

const searchByOptions = [{label: "Nombre", value: "name"}, {label: "Documento", value: "doc"}, {label: "Correo", value: "email"}, {label: "Teléfono", value: "phone"}];

const OrderCustomer = (props) => {
    const {car, customer, onGetCustomer, hasCustomerOpenOrders, onUpdateCar, showAsModal, onUpdateCustomer} = props;
    const [initComponent, setInitComponent] = useState(true);
    const [searchBy, setSearchBy] = useState(searchByOptions[0].value);
    const [editCustomer, setEditCustomer] = useState(false);
    const [openCustomerModal, setOpenCustomerModal] = useState(false);
    const [openCustomerStatsModal, setOpenCustomerStatsModal] = useState(false);
    const [hasPendingOrders, setHasPendingOrders] = useState(false);
    const [customerData, setCustomerData] = useState({});
    const [customerDefault, setCustomerDefault] = useState(getEmptyOptions());
    const [customerEmailDefault, setCustomerEmailDefault] = useState(getEmptyOptions());
    const [customerDocumentDefault, setCustomerDocumentDefault] = useState(getEmptyOptions());
    const [isNewCustomer, setIsNewCustomer] = useState(true);
    const hasPhonePermission = HasPermissionsFunc([PERMISSIONS.CUSTOMER_PHONE]);


    useEffect(() => {
        if (showAsModal && car.isEdit && car.customer && car.customer.id && initComponent) {
            setInitComponent(false);
            onGetCustomer(car.customer.id);
        }
    }, [showAsModal]);

    useEffect(() => {
        if (customer.id) {
            setCustomerData(customer);
            if(customer.id) onUpdateCar({...car, customer});
            if (car && !car.orderId) hasCustomerOpenOrders(customer.id).then(resp => setHasPendingOrders(resp && resp.data && resp.data.length > 0));
        } else {
            resetData();
        }
    }, [customer]);

    const toggleCustomerStatsModal = () => {
        setOpenCustomerStatsModal(!openCustomerStatsModal);
    }
    const toggleModalNew = () => {
        setIsNewCustomer(true);
        setOpenCustomerModal(!openCustomerModal);
    }
    const toggleModal = () => {
        setIsNewCustomer(false);
        setOpenCustomerModal(!openCustomerModal);
    }
    const toggleActivateCustomer = () => {
        onUpdateCustomer(customer.id, {status: !customer.status});
        setTimeout(() => {
            onGetCustomer(customer.id)
        }, 500);
        ;
        //resetData();
    }

    const resetData = () => {
        setCustomerDefault(getEmptyOptions());
        setCustomerEmailDefault(getEmptyOptions());
        setCustomerDocumentDefault(getEmptyOptions());
        setCustomerData({})
        setHasPendingOrders(false)
    }

    const onCloseCustomerModal = () => {
        toggleModal();
        setEditCustomer(false);
    }

    const onAcceptCustomerModal = () => {
        toggleModal();
        setCustomerDefault(getEmptyOptions());
        setCustomerEmailDefault(getEmptyOptions());
        setCustomerDocumentDefault(getEmptyOptions());
        if (editCustomer) {
            onGetCustomer(customer.id);
        }
        setEditCustomer(false);
    }

    return (
        <React.Fragment>
            <Row>
                <Col>
                    <h4 className="card-title text-info"><i className="uil-users-alt me-2"> </i> Datos del cliente</h4>
                </Col>
            </Row>
            <AvForm className="needs-validation" autoComplete="off">
                <Row>
                    <Col md={2}>
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
                    {searchBy === "name" && (
                        <Col md={9}>
                            <Label htmlFor="customer">Nombre</Label>
                            <FieldAsyncSelect
                                name={"customer"}
                                urlStr={CUSTOMER}
                                placeholder="Buscar por nombre"
                                defaultValue={customerDefault}
                                isClearable={true}
                                hasWild={true}
                                noDoubleSpaces={true}
                                conditionalOptions={{fieldName: 'name', operator: Conditionals.OPERATORS.LIKE}}
                                onChange={(c, meta) => {
                                    if(meta.action === "clear"){
                                        resetData();
                                    }
                                    else {
                                        onGetCustomer(c.value);
                                        setCustomerDocumentDefault(getEmptyOptions());
                                    }
                                }}
                            />
                        </Col>
                    )}
                    {searchBy === "doc" && (
                        <Col md={9}>
                            <Label htmlFor="doc">Documento</Label>
                            <FieldAsyncSelect
                                name={"doc"}
                                urlStr={CUSTOMER}
                                placeholder="Buscar por documento"
                                defaultValue={customerDocumentDefault}
                                noDoubleSpaces={true}
                                removeDots={true}
                                isClearable={true}
                                hasWild={false}
                                conditionalOptions={{fieldName: 'document', operator: Conditionals.OPERATORS.EQUAL}}
                                onChange={(c, meta) => {
                                    if(meta.action === "clear"){
                                        resetData();
                                    }
                                    else {
                                        onGetCustomer(c.value);
                                        setCustomerDocumentDefault(getEmptyOptions());
                                    }
                                }}
                            />
                        </Col>
                    )}
                    {searchBy === "email" && (
                        <Col md={9}>
                            <Label htmlFor="customer">Correo</Label>
                            <FieldAsyncSelect
                                name={"email"}
                                urlStr={CUSTOMER}
                                placeholder="Buscar por correo"
                                defaultValue={customerEmailDefault}
                                isClearable={true}
                                hasWild={true}
                                noDoubleSpaces={true}
                                conditionalOptions={{fieldName: 'email', operator: Conditionals.OPERATORS.LIKE}}
                                onChange={(c, meta) => {
                                    if(meta.action === "clear"){
                                        resetData();
                                    } else {
                                        onGetCustomer(c.value);
                                        setCustomerEmailDefault(getEmptyOptions());
                                    }
                                }}
                            />
                        </Col>
                    )}
                    {searchBy === "phone" && (
                        <Col md={9}>
                            <Label htmlFor="customer">Teléfono</Label>
                            <FieldAsyncSelect
                                name={"phone"}
                                urlStr={CUSTOMER}
                                noSpaces={true}
                                placeholder="Buscar por número de teléfono"
                                defaultValue={customerEmailDefault}
                                isClearable={true}
                                noSpaces={true}
                                hasWild={true}
                                conditionalOptions={{fieldName: 'cellphone', operator: Conditionals.OPERATORS.EQUAL}}
                                onChange={(c, meta) => {
                                    if (meta.action === "clear") {
                                        resetData();
                                    } else {
                                        onGetCustomer(c.value);
                                    }
                                }}
                            />
                        </Col>
                    )}
                    <Col md={1} style={{display: 'flex', 'alignItems': 'flex-end'}}>
                        <Tooltip placement="bottom" title="Agregar nuevo cliente" aria-label="add">
                            <button type="button" className="btn btn-primary btn-block waves-effect waves-light mt-2 me-1 w-100" onClick={() => toggleModalNew()}>
                                <i className="fa fa-user-plus"> </i>
                            </button>
                        </Tooltip>
                    </Col>
                </Row>
            </AvForm>
            {customerData.id && (
                <Row className="mt-3">
                    <Col md={10}>
                        <Row>
                            <Col md={6}>
                                <label>Nombre: </label>
                                <span className="p-1">{customerData.name}</span>
                                {customerData.isMayorist === true && (
                                    <Tooltip placement="bottom" title="Cliente mayorista" aria-label="add">
                                        <i className={"mdi mdi-crown font-size-18 mr-1 text-warning"}> </i>
                                    </Tooltip>
                                )}
                            </Col>
                            <Col md={6}>
                                <label>Correo: </label>
                                <span className="p-1">{customerData.email}</span>
                            </Col>
                            <Col md={6}>
                                <label>Departamento: </label>
                                <span className="p-1">{customerData.state?.name}</span>
                            </Col>
                            <Col md={6}>
                                <label>Municipio: </label>
                                <span className="p-1">{customerData.municipality?.name}</span>
                            </Col>
                            <Col md={6}>
                                <label>Documento: </label>
                                <span className="p-1">{customerData.document}</span>
                            </Col>
                            <Col md={6}>
                                <label>Teléfono Celular: </label>
                                <span className="p-1">{hasPhonePermission ? customerData.cellphone : hiddenPhone(customerData.cellphone) }</span>
                            </Col>
                            <Col md={6}>
                                <label>Teléfono Residencial: </label>
                                <span className="p-1">{hasPhonePermission ? customerData.phonee : hiddenPhone(customerData.phone) }</span>
                            </Col>
                            <Col md={12}>
                                <label>Dirección: </label>
                                <small className="p-1" style={{wordBreak: 'break-all'}}>{customerData.address}</small>
                            </Col>
                            <HasPermissions permission={PERMISSIONS.CUSTOMER_WHATSAPP}>
                            <Col md={12}>
                                <a href={`https://wa.me/${customerData.cellphone}`} > Contactar Whatsapp </a>
                            </Col>
                            </HasPermissions>
                        </Row>

                    </Col>
                    <Col md={2} className="text-right">
                        <Tooltip placement="bottom" title={`${customer.status ? 'Inactivar Contrapago' : 'Activar Contrapago'}`} aria-label="add">
                            <button type="button"
                                    size="small"
                                    className={`btn btn-sm ${customer.status ? 'text-danger' : 'text-success'}`}
                                    onClick={() => {
                                        toggleActivateCustomer();
                                    }}>
                                <i className={`uil ${customer.status ? 'uil-multiply' : 'uil-check'} font-size-18`}> </i>
                            </button>
                        </Tooltip>
                        <Tooltip placement="bottom" title="Editar cliente" aria-label="add">
                            <button type="button"
                                    size="small"
                                    className="btn btn-sm text-primary"
                                    onClick={() => {
                                        toggleModal();
                                        setEditCustomer(true);
                                    }}>
                                <i className="uil uil-pen font-size-18"> </i>
                            </button>
                        </Tooltip>
                        <Tooltip placement="bottom" title="Estadisticas del cliente" aria-label="add">
                            <button type="button"
                                    size="small"
                                    className="btn btn-sm text-primary"
                                    onClick={() => {
                                        toggleCustomerStatsModal();
                                    }}>
                                <i className="uil uil-chart font-size-18"> </i>
                            </button>
                        </Tooltip>

                    </Col>

                    {hasPendingOrders && (
                        <Col md={12} >
                            <div className="alert alert-warning m-0 font-size-14">
                                <i className="uil uil-exclamation-triangle"> </i> <b>Existe un pedido apartado para el cliente seleccionado, Solicite autorización para realizar este pedido.</b>
                            </div>
                        </Col>
                    )}

                    {!customer.status && (
                        <Col md={12} >
                            <div className="alert alert-danger m-0 font-size-14">
                                <i className="uil uil-exclamation-triangle"> </i> <b>Este cliente no puede generar pedidos ContraPago.</b>
                            </div>
                        </Col>
                    )}

                    {showAsModal && (
                        <>
                            <hr/>
                            <Row>
                                <Col md={12} className="text-right">
                                    {props.onCloseModal && (
                                        <button type="button" className="btn btn-light" onClick={() => props.onCloseModal()}>Cancelar</button>
                                    )}
                                    {props.onAcceptModal && (
                                        <Button color="primary" type="button" onClick={() => props.onAcceptModal()}>Guardar</Button>
                                    )}
                                </Col>
                            </Row>
                        </>
                    )}
                </Row>
            )}
            <CustomModal title={editCustomer && !isNewCustomer ? "Modificar cliente" : "Nuevo cliente"} size="lg" showFooter={false} isOpen={openCustomerModal} onClose={onCloseCustomerModal}>
                <CustomerForm customer={!isNewCustomer ? customerData : {}}
                              showAsModal={true}
                              onCloseModal={onCloseCustomerModal}
                              onAcceptModal={onAcceptCustomerModal}
                />
            </CustomModal>
            <CustomModal title={"Estadisticas del cliente"} size="lg" isOpen={openCustomerStatsModal} onClose={toggleCustomerStatsModal}>
                <Row>
                    <Col md={6} className="mb-3">
                        <OrdersPieChart customerId={customerData.id}/>
                    </Col>
                    <Col md={6} className="mb-3">
                        <CategoriesPieChart customerId={customerData.id}/>
                    </Col>
                </Row>
            </CustomModal>
        </React.Fragment>
    )
}

OrderCustomer.propTypes = {
    onSelect: PropTypes.func.isRequired,
    history: PropTypes.object
}

const mapStateToProps = state => {
    const {customer, error, loading} = state.Customer
    const {car} = state.Order
    return {car, customer, error, loading};
}

const mapDispatchToProps = dispatch => ({
    hasCustomerOpenOrders,
    onGetCustomer: (id) => dispatch(getCustomer(id)),
    onUpdateCustomer: (id, data) => dispatch(updateCustomer(id, data)),
    onUpdateCar: (data) => dispatch(updateCard(data)),
})

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(OrderCustomer))
