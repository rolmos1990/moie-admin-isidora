import React, {useEffect, useState} from "react"
import {CardBody, Col, Container, Label, Row} from "reactstrap"
import {AvForm} from "availity-reactstrap-validation"
import {Card} from "@material-ui/core";
import {withRouter} from "react-router-dom"
import {connect} from "react-redux";
import PropTypes from "prop-types";
import {FieldEmail, FieldNumber, FieldPhone, FieldSelect, FieldText} from "../../components/Fields";
import Breadcrumb from "../../components/Common/Breadcrumb";
import {BANKS_LIST, GROUPS, PAYMENT_FORMS, PAYMENT_FORMS_LIST, STATUS} from "../../common/constants";
import ButtonSubmit from "../../components/Common/ButtonSubmit";
import {getPayment, registerPayment, updatePayment} from "../../store/payments/actions";
import {getFieldOptionByGroups, registerFieldOption} from "../../store/fieldOptions/actions";
import {PERMISSIONS} from "../../helpers/security_rol";
import NoAccess from "../../components/Common/NoAccess";
import HasPermissions from "../../components/HasPermissions";

const PaymentEdit = (props) => {
    const {onGetPayment, payment, onGetFieldOptions, fieldOptions} = props;
    const [paymentFormSelected, setPaymentFormSelected] = useState(PAYMENT_FORMS.DEPOSIT);
    const [paymentData, setPaymentData] = useState({_status: STATUS.ACTIVE});
    const [banks, setBankList] = useState([]);
    const isEdit = props.match.params.id;

    useEffect(() => {
        if (isEdit && onGetPayment) {
            onGetPayment(props.match.params.id);
        }
    }, [onGetPayment]);

    useEffect(() => {
        if (payment.id && isEdit) {
            setPaymentData({...payment, _status: payment.status});
        }
    }, [payment]);

    useEffect(() => {
        if (onGetFieldOptions) {
            onGetFieldOptions();
        }
    }, [onGetFieldOptions]);

    useEffect(() => {
        if (fieldOptions && fieldOptions.length > 0) {
            setBankList(fieldOptions.filter(op => (op.groups === GROUPS.BANKS)).map(op => ({name: op.name})).map(op => {
                const key = op.name ? op.name : '';
                return {label: key, value: key};
            }));
        } else {
            setBankList([]);
        }
    }, [fieldOptions])

    const handleValidSubmit = (event, values) => {
        const data = {...values, status: values._status};
        if (values.type) data.type = values.type.value;
        if (values.targetBank) data.targetBank = values.targetBank.value;
        if (values.originBank) data.originBank = values.originBank.value;
        delete data._status;
        if (!isEdit) {
            props.onCreate(data, props.history)
        } else {
            props.onUpdate(props.match.params.id, data, props.history)
        }
    }
    return (
        <React.Fragment>
            <div className="page-content">
                <Container fluid>
                    <Breadcrumb hasBack path="/payments" title={paymentData.name} item={"Pagos"}/>
                    <HasPermissions permissions={[PERMISSIONS.PAYMENT_CREATE]} renderNoAccess={() => <NoAccess/>}>
                        <AvForm className="needs-validation" autoComplete="off" onValidSubmit={(e, v) => handleValidSubmit(e, v)}>
                            <Row>
                                <Col xl="12">
                                    <Card>
                                        <CardBody>
                                            <Row>
                                                <Col md="6">
                                                    <div className="mb-3">
                                                        <Label htmlFor="field_name">Nombre <span className="text-danger">*</span></Label>
                                                        <FieldText
                                                            id={"field_name"}
                                                            name={"name"}
                                                            value={paymentData.name}
                                                            minLength={3}
                                                            maxLength={255}
                                                            required
                                                        />
                                                    </div>
                                                </Col>
                                                <Col md="6">
                                                    <div className="mb-3">
                                                        <Label htmlFor="field_name">Correo</Label>
                                                        <FieldEmail
                                                            name={"email"}
                                                            value={paymentData.email}
                                                        />
                                                    </div>
                                                </Col>
                                                <Col md="6">
                                                    <div className="mb-3">
                                                        <Label htmlFor="field_name">Teléfono <span className="text-danger">*</span></Label>
                                                        <FieldPhone
                                                            id="phone"
                                                            name="phone"
                                                            value={paymentData.phone}
                                                            placeholder=""
                                                            type="text"
                                                            errorMessage="Ingrese un número valido (Ejemplo: 00000000)"
                                                            className="form-control"
                                                            validate={{required: {value: true}}}
                                                            onChange={(value) => setPaymentData({...paymentData, phone: value})}
                                                        />
                                                    </div>
                                                </Col>
                                                <Col md="6">
                                                    <div className="mb-3">
                                                        <Label htmlFor="state">Forma de pago <span className="text-danger">*</span></Label>
                                                        <FieldSelect
                                                            id="type"
                                                            name={"type"}
                                                            placeholder={"Indique una forma de pago"}
                                                            defaultValue={paymentData.type}
                                                            options={PAYMENT_FORMS_LIST}
                                                            onChange={item => setPaymentFormSelected(item.value)}
                                                            required
                                                            isSearchable
                                                        />
                                                    </div>
                                                </Col>
                                                {(PAYMENT_FORMS.BANK_TRANSFER === paymentFormSelected) && (
                                                    <>
                                                        <Col md="6">
                                                            <div className="mb-3">
                                                                <Label htmlFor="state">Banco origen <span className="text-danger">*</span></Label>
                                                                <FieldSelect
                                                                    id="originBank"
                                                                    name={"originBank"}
                                                                    placeholder={"Seleccione un banco"}
                                                                    defaultValue={paymentData.originBank}
                                                                    options={BANKS_LIST}
                                                                    required
                                                                    isSearchable
                                                                />
                                                            </div>
                                                        </Col>
                                                        <Col md="6">
                                                            <div className="mb-3">
                                                                <Label htmlFor="state">Banco destino <span className="text-danger">*</span></Label>
                                                                <FieldSelect
                                                                    id="targetBank"
                                                                    name={"targetBank"}
                                                                    placeholder={"Seleccione un banco"}
                                                                    defaultValue={paymentData.targetBank}
                                                                    options={banks && banks.filter(item => item.value != "Efecty")}
                                                                    required
                                                                    isSearchable
                                                                />
                                                            </div>
                                                        </Col>
                                                    </>
                                                )}
                                                {(PAYMENT_FORMS.DEPOSIT === paymentFormSelected) && (
                                                    <Col md="6">
                                                        <div className="mb-3">
                                                            <Label htmlFor="state">Banco <span className="text-danger">*</span></Label>
                                                            <FieldSelect
                                                                id="targetBank"
                                                                name={"targetBank"}
                                                                placeholder={"Seleccione un banco"}
                                                                defaultValue={paymentData.targetBank}
                                                                options={banks}
                                                                required
                                                                isSearchable
                                                            />
                                                        </div>
                                                    </Col>
                                                )}
                                                <Col md="6">
                                                    <div className="mb-3">
                                                        <Label htmlFor="field_name">Número de consignación o transferencia</Label>
                                                        <FieldText
                                                            id={"consignmentNumber"}
                                                            name={"consignmentNumber"}
                                                            value={paymentData.consignmentNumber}
                                                            minLength={1}
                                                            maxLength={255}
                                                        />
                                                    </div>
                                                </Col>
                                                <Col md="6">
                                                    <div className="mb-3">
                                                        <Label htmlFor="field_name">Monto de consignación o transferencia <span className="text-danger">*</span></Label>
                                                        <FieldNumber
                                                            id={"consignmentAmount"}
                                                            name={"consignmentAmount"}
                                                            value={paymentData.consignmentAmount}
                                                            required/>
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

const mapStateToProps = state => {
    const {error, payment, loading} = state.Payments
    const {fieldOptions} = state.FieldOption
    return {error, payment, loading, fieldOptions}
}

const mapDispatchToProps = dispatch => ({
    onGetFieldOptions: (conditional = null, limit = 500, page) => dispatch(getFieldOptionByGroups([GROUPS.BANKS], limit, page)),
    onGetPayment: (id) => dispatch(getPayment(id)),
    onCreate: (data, history) => dispatch(registerPayment(data, history)),
    onUpdate: (data, history) => dispatch(updatePayment(data, history)),
    onCreateFieldOption: (data, history) => dispatch(registerFieldOption(data, history)),
})

export default withRouter(
    connect(mapStateToProps, mapDispatchToProps)(PaymentEdit)
)

PaymentEdit.propTypes = {
    error: PropTypes.any,
    history: PropTypes.object
}

