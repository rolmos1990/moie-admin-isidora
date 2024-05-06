import React, {useEffect, useState} from "react"
import {Col, Container, Row} from "reactstrap"
import {Card, Tooltip} from "@material-ui/core";
import {Link, withRouter} from "react-router-dom"
import {connect} from "react-redux";
import PropTypes from "prop-types";
import Breadcrumb from "../../components/Common/Breadcrumb";
import {formatDate, hiddenPhone} from "../../common/utils";
import NoDataIndication from "../../components/Common/NoDataIndication";
import {getCustomer} from "../../store/customer/actions";
import OrderCardList from "../Orders/OrderCardList";
import {STATUS_COLORS, StatusField} from "../../components/StatusField";
import {ConverterCustomerStatus} from "../Customer/customer_status";
import {customerCategoryStats, customerProductStats, hasCustomerOpenOrders} from "../../helpers/service";
import {COMMENT_ENTITIES, GROUPS} from "../../common/constants";
import Observations from "../../components/Common/Observations";
import OrdersPieChart from "./OrdersPieChart";
import CategoriesPieChart from "./CategoriesPieChart";
import {PERMISSIONS} from "../../helpers/security_rol";
import HasPermissions from "../../components/HasPermissions";
import HasPermissionsFunc from "../../components/HasPermissionsFunc";

const CustomerDetail = (props) => {

    const {onGetCustomer, customer} = props;
    const [customerData, setCustomerData] = useState({});
    const [hasPendingOrders, setHasPendingOrders] = useState(false);
    const [activeTab, setActiveTab] = useState(1);
    const [productChart, setProductChart] = useState({series: [], labels: []});

    const hasPhonePermission = HasPermissionsFunc([PERMISSIONS.CUSTOMER_PHONE]);

    useEffect(() => {
        if (props.match.params.id) {
            onGetCustomer(props.match.params.id);
            hasCustomerOpenOrders(props.match.params.id).then(resp => setHasPendingOrders(resp && resp.data && resp.data.length > 0));
            getStats(props.match.params.id);
        }
    }, [onGetCustomer]);

    useEffect(() => {
        if (customer.id) {
            setCustomerData(customer);
        }
    }, [customer]);

    const getStats = (customerId) => {
        /*customerProductStats(customerId, moment()).then(resp => {
            const chartData = {series: [], labels:[]};
            if(resp){
                resp.forEach(pc => {
                    chartData.series.push(pc.qty);
                    chartData.labels.push(pc.name);
                })
            }
            setProductChart(chartData);
        });*/
    }

    return customerData.id ? (
        <React.Fragment>
            <div className="page-content">
                <Container fluid className="pb-3">
                    <Breadcrumb hasBack path="/customers" title={customerData.name} item={"Cliente"}/>
                    <Row className="mb-3">
                        <Col md={7}>
                            <Card id={'details'} className="mb-3 p-3">

                                <Row>
                                    <Col xs={10}>
                                        <h4 className="card-title text-info">Descripción del cliente</h4>
                                    </Col>
                                    <Col md={2} className="text-right">
                                        <HasPermissions permission={PERMISSIONS.CUSTOMER_EDIT}>
                                            <li className="list-inline-item">
                                                <Link to={`/customer/${customerData.id}`} className="px-2 text-primary">
                                                    <i className="uil uil-pen font-size-18"> </i>
                                                </Link>
                                            </li>
                                        </HasPermissions>
                                    </Col>
                                </Row>
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
                                        <label>Documento: </label>
                                        <span className="p-1">{customerData.document}</span>
                                    </Col>
                                </Row>
                                <hr/>
                                <Row>
                                    <Col xs={12}>
                                        <h4 className="card-title text-info">Datos de contacto</h4>
                                    </Col>
                                    <Col md={6}>
                                        <label>Email: </label>
                                        <span className="p-1">{customerData.email}</span>
                                    </Col>
                                    <Col md={6}>
                                        <label>Teléfono Celular: </label>
                                        <span className="p-1">{hasPhonePermission ? customerData.cellphone : hiddenPhone(customerData.cellphone) }</span>
                                    </Col>
                                    <Col md={6}>
                                        <label>Teléfono Residencial: </label>
                                        <span className="p-1">{hasPhonePermission ? customerData.phone : hiddenPhone(customerData.phone) }</span>
                                    </Col>
                                    <HasPermissions permission={PERMISSIONS.CUSTOMER_WHATSAPP}>
                                    <Col md={6}>
                                        <a target="_new" href={`https://wa.me/${customerData.cellphone}`} > <i className="fa fa-customer"></i> Contactar Whatsapp</a>
                                    </Col>
                                    </HasPermissions>
                                </Row>
                                <hr/>
                                <Row>
                                    <Col xs={12}>
                                        <h4 className="card-title text-info">Localidad</h4>
                                    </Col>
                                    <Col md={6}>
                                        <label>Departamento: </label>
                                        <span className="p-1">{customerData.state?.name}</span>
                                    </Col>
                                    <Col md={6}>
                                        <label>Municipio: </label>
                                        <span className="p-1">{customerData.municipality?.name}</span>
                                    </Col>
                                </Row>
                                <hr/>
                                <Row>
                                    <Col xs={12} className="footer-details">
                                        {customerData.hasNotification && (
                                            <Tooltip placement="bottom" title="Recibe notificaciones" aria-label="add">
                                                <span className="badge rounded-pill bg-info font-size-12 p-2"><i className="fa fa-envelope"> </i></span>
                                            </Tooltip>
                                        )}
                                        <Tooltip placement="bottom" title="Estado" aria-label="add">
                                            <StatusField color={customerData.status === true ? STATUS_COLORS.SUCCESS : STATUS_COLORS.DANGER}>
                                                {ConverterCustomerStatus(customerData.status)}
                                            </StatusField>
                                        </Tooltip>
                                        <Tooltip placement="bottom" title="Fecha creación" aria-label="add">
                                            <small className="badge rounded-pill bg-light p-2">{formatDate(customerData.createdAt)}</small>
                                        </Tooltip>
                                    </Col>
                                </Row>
                                {hasPendingOrders && (
                                    <Row>
                                        <Col>
                                            <div className="alert alert-warning mb-0 mt-3"><i className="uil uil-exclamation-triangle"> </i> Este cliente tiene pedidos por completar.</div>
                                        </Col>
                                    </Row>
                                )}
                            </Card>
                        </Col>
                        <Col md={5}>
                            <Card id={'orders'} className="p-3">
                                <OrderCardList customerId={customerData.id}/>
                            </Card>
                        </Col>
                    </Row>
                    <Row>
                        <Col>
                            <Card id={'order-tabs'} className="p-3">
                                <ul className="nav nav-tabs nav-tabs-custom nav-justified" role="tablist">
                                    <li className="nav-item">
                                        <a className={`nav-link ${activeTab === 1 ? 'active' : ''}`} data-bs-toggle="tab" href="#tab1" role="tab" aria-selected="false" onClick={() => setActiveTab(1)}>
                                            <span className="d-block d-sm-none"><i className="fas fa-home"> </i></span>
                                            <span className="d-none d-sm-block">Historial de compras</span>
                                        </a>
                                    </li>
                                    <li className="nav-item">
                                        <a className={`nav-link ${activeTab === 3 ? 'active' : ''}`} data-bs-toggle="tab" href="#tab2" role="tab" aria-selected="false" onClick={() => setActiveTab(3)}>
                                            <span className="d-block d-sm-none"><i className="far fa-user"> </i></span>
                                            <span className="d-none d-sm-block">Observaciones</span>
                                        </a>
                                    </li>
                                </ul>
                                <div className="tab-content p-3 text-muted">
                                    <div className={`tab-pane ${activeTab === 1 ? 'active' : ''}`} id="tab1" role="tabpanel">
                                        <Row>
                                            <Col md={6} className="mb-3">
                                                <OrdersPieChart customerId={customerData.id}/>
                                            </Col>
                                            <Col md={6} className="mb-3">
                                                <CategoriesPieChart customerId={customerData.id}/>
                                            </Col>
                                        </Row>
                                    </div>
                                    <div className={`tab-pane ${activeTab === 3 ? 'active' : ''}`} id="tab2" role="tabpanel">
                                        <Observations
                                            entitySuggested={GROUPS.CUSTOMER_OBSERVATIONS}
                                            entity={COMMENT_ENTITIES.CUSTOMER}
                                            entityId={customerData.id}/>
                                    </div>
                                </div>
                            </Card>
                        </Col>
                    </Row>
                </Container>
            </div>
        </React.Fragment>
    ) : <NoDataIndication/>;
}

const mapStateToProps = state => {
    const {error, customer, loading} = state.Customer
    const {fieldOptions} = state.FieldOption
    return {error, customer, fieldOptions, loading}
}

const mapDispatchToProps = dispatch => ({
    hasCustomerOpenOrders,
    customerProductStats,
    customerCategoryStats,
    onGetCustomer: (id) => dispatch(getCustomer(id)),
})

export default withRouter(
    connect(mapStateToProps, mapDispatchToProps)(CustomerDetail)
)

CustomerDetail.propTypes = {
    error: PropTypes.any,
    history: PropTypes.object
}
