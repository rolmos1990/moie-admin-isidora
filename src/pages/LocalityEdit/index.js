import React, {useEffect, useState} from "react"
import {CardBody, Col, Container, Label, Row} from "reactstrap"
import {AvForm} from "availity-reactstrap-validation"
import {Card} from "@material-ui/core";
import {withRouter} from "react-router-dom"
import {connect} from "react-redux";
import {apiError} from "../../store/auth/login/actions";
import PropTypes from "prop-types";
import {getDeliveryLocality, registerDeliveryLocality, updateDeliveryLocality} from "../../store/deliveryLocality/actions";
import {FieldSelect, FieldSwitch, FieldText} from "../../components/Fields";
import Breadcrumb from "../../components/Common/Breadcrumb";
import {STATUS} from "../../common/constants";
import ButtonSubmit from "../../components/Common/ButtonSubmit";
import {PERMISSIONS} from "../../helpers/security_rol";
import NoAccess from "../../components/Common/NoAccess";
import HasPermissions from "../../components/HasPermissions";

const LocalityEdit = (props) => {
    const {getDeliveryLocality, deliveryLocality, externalView, externalId, customActions} = props;
    const [deliveryLocalityData, setDeliveryLocalityData] = useState({_status: STATUS.ACTIVE});
    const [deliveryMethod, setDeliveryMethod] = useState(1);
    const isEdit = props.match.params.id || (deliveryLocality && deliveryLocality.id);

    const deliveryMethods = [{label: "Interrapidisimo", value: 1}, {label: "ServiEntrega", value: 4}];

    const serviEntrega = [{label: "Contado", value: 1}, {label: "Contado - AlCobro", value: 2}, {label: "AlCobro", value: 3}];
    const interrapidisimo = [{label: "Contado", value: 1}, {label: "Contado - AlCobro", value: 2}, {label: "AlCobro", value: 3}];

    const [deliveryMethodTypeList, setDeliveryMethodTypeList] = useState([]);

    //carga inicial
    useEffect(() => {
        if(externalView) {
            getDeliveryLocality(externalId);
        } else {
            if (isEdit && getDeliveryLocality) {
                getDeliveryLocality(props.match.params.id);
            }
        }
    }, [getDeliveryLocality]);

    useEffect(() => {

        if(deliveryMethod === 1){
            setDeliveryMethodTypeList(interrapidisimo);
        } else if(deliveryMethod === 4){
            setDeliveryMethodTypeList(serviEntrega);
        } else {
            setDeliveryMethodTypeList([]);
        }

    }, [deliveryMethod]);

    //cargar la información del cliente
    useEffect(() => {
        if (deliveryLocality.id && isEdit) {
            setDeliveryLocalityData({...deliveryLocality, _status:deliveryLocality.status});
            setDeliveryMethod(deliveryLocality.deliveryMethod);

            if(deliveryLocality.deliveryMethodId === 1){
                setDeliveryMethodTypeList(interrapidisimo);
            } else if(deliveryLocality.deliveryMethodId === 4){
                setDeliveryMethodTypeList(serviEntrega);
            } else {
                setDeliveryMethodTypeList([]);
            }

        }
    }, [deliveryLocality]);

    const handleValidSubmit = (event, values) => {
        const data = Object.assign({},values, {status:values._status});
        delete data._status;

        data.deliveryType = data.deliveryType.value || deliveryLocalityData.deliveryType;
        if(data.deliveryMethodId) {
            data.deliveryMethodId = data.deliveryMethodId.value;
        }
        if(data.priceFirstKilo) {
        data.priceFirstKilo = parseFloat(data.priceFirstKilo).toFixed(2) || deliveryLocalityData.priceFirstKilo;
        }
        if(data.priceAdditionalKilo) {
            data.priceAdditionalKilo = parseFloat(data.priceAdditionalKilo).toFixed(2) || deliveryLocalityData.priceAdditionalKilo;
        }
        data.timeInDays = parseInt(data.timeInDays) || 0;

        if (!isEdit) {
            props.registerDeliveryLocality(data, props.history, customActions)
        } else {
            const id = externalId ? externalId : props.match.params.id;
            props.updateDeliveryLocality(id, data, props.history, customActions)
        }
    }
    return (
        <React.Fragment>
            <div className={!externalView ? `page-content` : ''}>
                <Container fluid>
                    {!externalView && <Breadcrumb hasBack path="/deliveryLocalities" title={deliveryLocalityData.name} item={"deliveryLocalities"}/>}
                    <HasPermissions permissions={[PERMISSIONS.DELIVERY_LOCALITY_EDIT, PERMISSIONS.DELIVERY_LOCALITY_CREATE]} renderNoAccess={() => <NoAccess/>}>
                        <AvForm className="needs-validation" autoComplete="off"
                                onValidSubmit={(e, v) => {
                                    handleValidSubmit(e, v)
                                }}>
                            <Row>
                                <Col xl="12">
                                    <Card>
                                        <CardBody>
                                            <div className={"mt-1 mb-5"} style={{position: "relative"}}>
                                                <div className={"float-end"}>
                                                    <Row>
                                                        <Col>
                                                            ¿Activo?
                                                        </Col>
                                                        <Col>
                                                            <FieldSwitch defaultValue={deliveryLocalityData._status} name={"_status"}/>
                                                        </Col>
                                                    </Row>
                                                </div>
                                            </div>
                                            <Row>
                                                <Col md="12">
                                                    <div className="mb-3">
                                                        <Label htmlFor="field_name">Nombre <span className="text-danger">*</span></Label>
                                                        <FieldText
                                                            id={"field_name"}
                                                            name={"name"}
                                                            value={deliveryLocalityData.name}
                                                            minLength={3}
                                                            maxLength={255}
                                                            required
                                                        />
                                                    </div>
                                                </Col>
                                            </Row>
                                            <Row>
                                                {!externalView && (
                                                <Col md="6">
                                                    <div className="mb-3">
                                                        <Label htmlFor="field_name">Codigo de Area <span className="text-danger"></span></Label>
                                                        <FieldText
                                                            id={"field_delivery_area_code"}
                                                            name={"deliveryAreaCode"}
                                                            value={deliveryLocalityData.deliveryAreaCode}
                                                        />
                                                    </div>
                                                </Col>
                                                )}
                                                <Col md={externalView ? '12' : '6'}>
                                                    <div className="mb-3">
                                                        <Label htmlFor="field_name">Tiempo en Días<span className="text-danger"></span></Label>
                                                        <FieldText
                                                            id={"field_time_in_days"}
                                                            name={"timeInDays"}
                                                            value={deliveryLocalityData.timeInDays ?? ""}
                                                            required={false}
                                                        />
                                                    </div>
                                                </Col>
                                            </Row>
                                            <Row>
                                                {!externalView && (
                                                    <Col md="6">
                                                        <div className="mb-3">
                                                            <Label htmlFor="field_name">Metodo de Envio<span className="text-danger">*</span></Label>
                                                            <FieldSelect
                                                                id={"field_delivery_method_id"}
                                                                name={"deliveryMethodId"}
                                                                options={deliveryMethods}
                                                                defaultValue={deliveryMethod}
                                                                onChange={(e) => {
                                                                    setDeliveryMethod(e.value);
                                                                }}
                                                            />
                                                        </div>
                                                    </Col>
                                                )}
                                                <Col md={externalView ? `12` : '6'}>
                                                    <div className="mb-3">
                                                        <Label htmlFor="field_name">Tipo de Envio<span className="text-danger">*</span></Label>
                                                        <FieldSelect
                                                            id={"field_delivery_type"}
                                                            name={"deliveryType"}
                                                            options={deliveryMethodTypeList}
                                                            defaultValue={deliveryLocalityData.deliveryType}
                                                        />
                                                    </div>
                                                </Col>
                                            </Row>
                                            <Row>
                                                <Col md="6">
                                                    <div className="mb-3">
                                                        <Label htmlFor="field_name">Precio primer Kilo<span className="text-danger"></span></Label>
                                                        <FieldText
                                                            id={"field_price_first_kilo"}
                                                            name={"priceFirstKilo"}
                                                            value={deliveryLocalityData.priceFirstKilo}
                                                        />
                                                    </div>
                                                </Col>
                                                <Col md="6">
                                                    <div className="mb-3">
                                                        <Label htmlFor="field_name">Precio kilo adicional<span className="text-danger"></span></Label>
                                                        <FieldText
                                                            id={"field_additional_kilo"}
                                                            name={"priceAdditionalKilo"}
                                                            value={deliveryLocalityData.priceAdditionalKilo}
                                                        />
                                                    </div>
                                                </Col>
                                            </Row>
                                            <Row>
                                                <Col md={12} className="text-right">
                                                    <ButtonSubmit loading={props.loading}/>
                                                </Col>
                                            </Row>
                                        </CardBody>
                                    </Card>
                                </Col>
                            </Row>
                        </AvForm>
                    </HasPermissions>
                </Container>
            </div>
        </React.Fragment>
    )
}

const mapLocalityToProps = state => {
    const {error, loading, deliveryLocality} = state.DeliveryLocality;
    return {error, deliveryLocality, loading}
}

export default withRouter(
    connect(mapLocalityToProps, {apiError, registerDeliveryLocality, updateDeliveryLocality, getDeliveryLocality})(LocalityEdit)
)

LocalityEdit.propTypes = {
    error: PropTypes.any,
    history: PropTypes.object
}

