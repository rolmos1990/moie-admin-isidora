import React, {useEffect, useState} from "react"
import {Col, Label, Row} from "reactstrap"
import {AvField, AvForm} from "availity-reactstrap-validation"
import {withRouter} from "react-router-dom"
import {connect} from "react-redux";
import {apiError} from "../../store/auth/login/actions";
import PropTypes from "prop-types";
import {getCustomer, registerCustomer, updateCustomer} from "../../store/customer/actions";
import {getMunicipalities, getStates} from "../../store/location/actions";
import Conditionals from "../../common/conditionals";
import {FieldEmail, FieldPhone, FieldSelect, FieldSwitch, FieldText} from "../../components/Fields";
import ButtonSubmit from "../../components/Common/ButtonSubmit";
import {hiddenPhone} from "../../common/utils";
import HasPermissionsFunc from "../../components/HasPermissionsFunc";
import {PERMISSIONS} from "../../helpers/security_rol";

const CustomerForm = (props) => {
    const {getCustomer, customer, showAsModal = false, onCloseModal= false, onAcceptModal= false} = props;
    const [customerData, setCustomerData] = useState({_status: "true"});
    const [validPhone, setValidPhone] = useState(false);

    // definición de localidades
    const {getStates, states} = props;
    const {getMunicipalities, municipalities} = props;
    const [state, setState] = useState(null);
    const [municipality, setMunicipality] = useState(null);
    const [phoneedit, setPhoneedit] = useState(false);
    const [cellphoneedit, setCellphoneedit] = useState(false);

    const [statesOptions, setStates] = useState([]);
    const [municipalitiesOptions, setMunicipalities] = useState([]);

    const hasPhonePermission = HasPermissionsFunc([PERMISSIONS.CUSTOMER_PHONE]);

    //carga inicial
    useEffect(() => {
        if (props.match.params.id && getCustomer) {
            getCustomer(props.match.params.id);
        }
        getStates();
    }, [getCustomer]);

    //cargar la información del cliente
    useEffect(() => {
        if (customer.id) {

            if(!hasPhonePermission) {
                setCustomerData({...customer, phone: '', cellphone: ''});
            } else {
                setCustomerData(customer);
            }

            //definir estado por defecto
            const defaultState = customer.state?.id || null;
            setState(defaultState);

            //definir municipalidad por defecto
            const defaultMunicipality = customer.municipality?.id || null;
            setMunicipality(defaultMunicipality);

        }
    }, [customer]);

    //cargar estados
    useEffect(() => {
        if (states && states.length > 0) {
            const itemsConverter = item => ({
                label: item.name,
                value: item.id
            });
            setStates(states.map(itemsConverter));
        } else {
            setStates([]);
        }
    }, [states]);

    //cargar municipios
    useEffect(() => {
        if (municipalities && municipalities.length > 0) {
            const itemsConverter = item => ({
                label: item.name,
                value: item.id
            });
            setMunicipalities(municipalities.map(itemsConverter));
        } else {
            setMunicipalities([]);
        }
    }, [municipalities]);

    useEffect(() => {
        if (state != null) {
            const conditions = new Conditionals.Condition;
            conditions.add('state', state);
            getMunicipalities(conditions.all(), 500);
        }
    }, [state]);

    const handleValidSubmit = (event, values) => {
        const data = filteredValues(values);

        if(!validPhone && !phoneedit){
            return false;
        }

        if (!customer.id) {
            props.registerCustomer(data, props.history)
        } else {
            props.updateCustomer(customer.id, data, props.history)
        }
        if(showAsModal && onAcceptModal){
            onAcceptModal(customer.id);
        }
    }

    const filteredValues = (values) => {
        const data = {...values};
        data.state = values.state?.value;
        data.municipality = values.municipality?.value;
        data.status = values._status;

        if(data.cellphone) {
            data.cellphone = values.cellphone ? values.cellphone.replace(/\s/g, '') : '';
        }
        if(data.phone) {
            data.phone = values.phone ? values.phone.replace(/\s/g, '') : '';
        }

        if(data.document) {
            data.document = data.document.replace(/\./g, '');
            data.document = data.document.trim();
            data.document = data.document.replace(/\s+/g, ' ').trim();
        }

        if(data.name){
            data.name = data.name.trim();
            data.name = data.name.replace(/\s+/g, ' ').trim();
        }

        if(data.phone){
            data.phone = data.phone.trim();
            data.phone = data.phone.replace(/\s+/g, ' ').trim();
        }

        if(data.cellphone){
            data.cellphone = data.cellphone.trim();
            data.cellphone = data.cellphone.replace(/\s+/g, ' ').trim();
        }

        delete data._status;
        return data;
    }

    function handleSelectDepartment(option) {
        setState(option.value);
    }


    return (
        <React.Fragment>
            <AvForm className="needs-validation" autoComplete="off" onValidSubmit={(e, v) => handleValidSubmit(e, v)}>
                <Row>
                    <Col xl={12}>
                        {!showAsModal && (
                            <div className={"mt-1 mb-5"} style={{position: "relative"}}>
                                <div className={"float-end"}>
                                    <Row>
                                        <Col>
                                            ¿Contrapago?
                                        </Col>
                                        <Col>
                                            <FieldSwitch
                                                value={customerData.status}
                                                defaultValue={customerData.document ? customerData.status : true}
                                                name={"_status"}
                                            />
                                        </Col>
                                    </Row>
                                </div>
                            </div>
                        )}
                        <Row>
                            <Col md="6">
                                <div className="mb-3">
                                    <Label htmlFor="name">Nombre <span className="text-danger">*</span></Label>
                                    <FieldText
                                        id={"name"}
                                        name={"name"}
                                        value={customerData.name}
                                        required
                                    />
                                </div>
                            </Col>
                            <Col md="6">
                                <div className="mb-3">
                                    <Label htmlFor="validationCustom02">Email </Label>
                                    <FieldEmail
                                        name={"email"}
                                        value={customerData.email}
                                    />
                                </div>
                            </Col>
                        </Row>
                        <Row>
                            <Col md="4">
                                <div className="mb-3">
                                    <Label htmlFor="document">Documento <span className="text-danger">*</span></Label>
                                    <FieldText
                                        id='document'
                                        name={"document"}
                                        value={customerData.document}
                                        pattern={"/^[0-9]{0,}$/"}
                                        patternMessage={'Debe contener solo numeros sin espacios'}
                                        required/>
                                </div>
                            </Col>
                            <Col md="4">
                                <div className="mb-3">
                                    <Label htmlFor="cellphone">Teléfono Celular {!hasPhonePermission && <a href="#" onClick={() => setCellphoneedit(!cellphoneedit)}>{!cellphoneedit ? "( Edit )" : "( Show )" }</a>} <span className="text-danger">*</span></Label>

                                    {customer.id && !cellphoneedit && !hasPhonePermission ? <FieldText
                                        id='cellphone'
                                        name={"cellphone"}
                                        value={hiddenPhone(customer.cellphone)}
                                        disabled={true}
                                    /> : <FieldPhone
                                        id="cellphone"
                                        name="cellphone"
                                        placeholder=""
                                        type="text"
                                        value={customerData.cellphone}
                                        errorMessage="Ingrese un número valido (Ejemplo: 00000000)"
                                        className="form-control"
                                        validate={{required: {value: true}}}
                                        onChange={(value) => setCustomerData({...customerData, cellphone: value})}
                                        onValidate={(value, country) => {
                                            if(country.iso2 === 'co' && (value && value.length === 12)){
                                                setValidPhone(true);
                                                return true
                                            }
                                            setValidPhone(false);
                                            return false;
                                        }}
                                    />}
                                </div>
                            </Col>
                            <Col md="4">
                                <div className="mb-3">
                                    <Label htmlFor="phone">Teléfono Residencial {!hasPhonePermission && <a href="#" onClick={() => setPhoneedit(!phoneedit)}>{!phoneedit ? "( Edit )" : "( Show )" }</a>}</Label>
                                    {customer.id && !phoneedit && !hasPhonePermission ? <FieldText
                                        id='phone'
                                        name={"phone"}
                                        value={hiddenPhone(customer.phone)}
                                        disabled={true}
                                    /> :<FieldPhone
                                        id="phone"
                                        name="phone"
                                        value={customerData.phone}
                                        placeholder=""
                                        type="text"
                                        errorMessage="Ingrese un número valido (Ejemplo: 00000000)"
                                        className="form-control"
                                        validate={{required: {value: true}}}
                                        onChange={(value) => setCustomerData({...customerData, phone: value})}
                                    />}
                                </div>
                            </Col>
                        </Row>
                        <Row>
                            <Col md="6">
                                <div className="mb-3">
                                    <Label htmlFor="state">Departamento <span className="text-danger">*</span></Label>
                                    <FieldSelect
                                        id="state"
                                        defaultValue={state}
                                        name={"state"}
                                        placeholder={"Indique un departamento"}
                                        options={statesOptions}
                                        onChange={handleSelectDepartment}
                                        required
                                        isSearchable
                                    />
                                </div>
                            </Col>
                            <Col md="6">
                                <div className="mb-3">
                                    <Label htmlFor="validationCustom03">Municipio <span className="text-danger">*</span></Label>
                                    <FieldSelect
                                        id="municipality"
                                        defaultValue={municipality}
                                        name={"municipality"}
                                        placeholder={"Indique un municipio"}
                                        options={municipalitiesOptions}
                                        required
                                        isSearchable
                                    />
                                </div>
                            </Col>
                            <Col md="12">
                                <div className="mb-3">
                                    <Label htmlFor="validationCustom03">Dirección</Label>
                                    <FieldText
                                        id='address'
                                        name={"address"}
                                        value={customerData.address}
                                        maxLength={80}
                                        required/>
                                </div>
                            </Col>
                        </Row>

                        {(customerData.temporalAddress && customerData.temporalAddress.length > 0) && (
                            <Row>
                                <hr/>
                                <p className="alert alert-warning">Este cliente tiene una dirección de una versión anterior, es recomendable que por favor agregue la dirección en la parte superior.</p>
                                <Col md="12">
                                    <div className="mb-3">
                                        <h4>Dirección temporal</h4>
                                    </div>
                                </Col>
                                <Col md="6">
                                    <div className="mb-3">
                                        <Label htmlFor="validationCustom04">Departamento temporal</Label>
                                        <div className="form-control">
                                            {customerData.temporalAddress[0].state}
                                        </div>
                                    </div>
                                </Col>
                                <Col md="6">
                                    <div className="mb-3">
                                        <Label htmlFor="validationCustom04">Municipio temporal</Label>
                                        <div className="form-control">
                                            {customerData.temporalAddress[0].municipality}
                                        </div>
                                    </div>
                                </Col>
                            </Row>
                        )}
                        <Row>
                            <Col>
                                <div className="">
                                    <AvField
                                        checked={customerData.hasNotification ? true : false}
                                        className="form-check-input"
                                        type="checkbox"
                                        name="hasNotification"
                                        label="Recibe notificaciones"/>
                                </div>
                            </Col>
                        </Row>
                        <hr/>
                        <Row>
                            <Col md={12} className="text-right">
                                {showAsModal && onCloseModal && (
                                    <button type="button" className="btn btn-light" onClick={() => props.onCloseModal()}>Cancelar</button>
                                )}
                                <ButtonSubmit loading={props.loading}/>
                            </Col>
                        </Row>
                    </Col>
                </Row>
            </AvForm>
        </React.Fragment>
    )
}

const mapStateToProps = state => {
    const {error, loading} = state.Customer
    const {states, municipalities} = state.Location
    return {error, states, municipalities, loading}
}

export default withRouter(
    connect(mapStateToProps, {apiError, registerCustomer, updateCustomer, getCustomer, getStates, getMunicipalities})(CustomerForm)
)

CustomerForm.propTypes = {
    error: PropTypes.any,
    history: PropTypes.object
}

