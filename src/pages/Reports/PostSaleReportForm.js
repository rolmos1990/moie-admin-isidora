import React, {useEffect, useState} from "react"
import {CardBody, Col, Label, Row} from "reactstrap"
import {AvForm} from "availity-reactstrap-validation"
import {Card, Tooltip} from "@material-ui/core";
import {withRouter} from "react-router-dom"
import {connect} from "react-redux";
import PropTypes from "prop-types";
import {FieldDate, FieldSelect} from "../../components/Fields";
import {DATE_MODES} from "../../components/Fields/InputDate";
import ButtonSubmit from "../../components/Common/ButtonSubmit";
import {formatDateToServer} from "../../common/utils";
import {DELIVERY_METHODS, ORDER_STATUS_LIST, ORDER_STATUS_LIST_POST_SALE, REPORT_TYPES} from "../../common/constants";
import {getEmptyOptions} from "../../common/converters";
import {getDeliveryMethods} from "../../store/order/actions";
import {generateReport, generateReportRestart} from "../../store/reports/actions";

const PostSaleReportForm = ({onCloseModal, deliveryMethods, onGetDeliveryMethods, loading, error, success, onGenerateReport, onRestartReport}) => {

    const [deliveryMethodList, setDeliveryMethodList] = useState([]);
    const [deliveryMethod, setDeliveryMethod] = useState({});

    useEffect(() => {
        if (onRestartReport) {
            onRestartReport();
        }
        if (onGetDeliveryMethods) onGetDeliveryMethods();
    }, [onRestartReport]);

    useEffect(() => {
        if (success && !error) {
            onCloseModal(true);
        }
    }, [success]);

    useEffect(() => {
        if (deliveryMethods && deliveryMethods.length > 0) {
            setDeliveryMethod(deliveryMethods.find(op => op.name === DELIVERY_METHODS.INTERRAPIDISIMO).code);
            setDeliveryMethodList([getEmptyOptions(),
                ...deliveryMethods.filter(op => [DELIVERY_METHODS.INTERRAPIDISIMO, DELIVERY_METHODS.SERVIENTREGA].includes(op.name)).map(op => ({label: op.name, value: op.id}))]
            );
        }
    }, [deliveryMethods]);

    const handleValidSubmit = (e, values) => {
        const payload = {
            status: values._status.value,
            deliveryMethod: values.deliveryMethod.value,
            dateFrom: formatDateToServer(values.reportDate[0]),
            dateTo: formatDateToServer(values.reportDate[1])
        };
        onGenerateReport(payload);
    }

    return (
        <React.Fragment>
            <AvForm className="needs-validation" autoComplete="off" onValidSubmit={(e, v) => handleValidSubmit(e, v)}>
                <Card>
                    <CardBody>
                        <Row>
                            <Col md="6">
                                <div className="mb-3">
                                    <Label htmlFor="field_name">Metodo<span className="text-danger">*</span></Label>
                                    <FieldSelect
                                        id={"deliveryMethod"}
                                        name={"deliveryMethod"}
                                        options={deliveryMethodList}
                                        defaultValue={deliveryMethod}
                                        required
                                    />
                                </div>
                            </Col>
                            <Col md="6">
                                <div className="mb-3">
                                    <Label htmlFor="field_name">Estatus<span className="text-danger">*</span></Label>
                                    <FieldSelect
                                        id={"_status"}
                                        name={"_status"}
                                        options={ORDER_STATUS_LIST_POST_SALE}
                                        defaultValue={ORDER_STATUS_LIST_POST_SALE[0]}
                                        required
                                    />
                                </div>
                            </Col>
                            <Col md="12">
                                <div className="mb-3">
                                    <Label htmlFor="field_name">Fechas <span className="text-danger">*</span> &nbsp; <Tooltip placement="bottom" title="Fecha de Envio" aria-label="add"><p className="fa fa-question-circle"></p></Tooltip></Label>
                                    <FieldDate
                                        name={"reportDate"}
                                        mode={DATE_MODES.RANGE}
                                    />
                                </div>
                            </Col>
                        </Row>
                        <Row>
                            <Col md={12} className="text-center">
                                {!!(!success && error) && (
                                    <div className="alert alert-danger">{error}</div>
                                )}
                            </Col>
                        </Row>
                        <Row>
                            <Col md={12} className="text-right">
                                <ButtonSubmit loading={loading} disabled={loading}/>
                            </Col>
                        </Row>
                    </CardBody>
                </Card>
            </AvForm>
        </React.Fragment>
    )
}

const mapStateToProps = state => {
    const {report} = state.PostSale;
    const {deliveryMethods} = state.Order;
    return {deliveryMethods: deliveryMethods.data, loading: report.loading, error: report.error, success: report.success}
}

const mapDispatchToProps = dispatch => ({
    onGenerateReport: (data) => dispatch(generateReport(REPORT_TYPES.POST_SALE, data)),
    onRestartReport: () => dispatch(generateReportRestart()),
    onGetDeliveryMethods: (conditional = null, limit = 50, page) => dispatch(getDeliveryMethods(conditional, limit, page)),
})

export default withRouter(
    connect(mapStateToProps, mapDispatchToProps)(PostSaleReportForm)
)

PostSaleReportForm.propTypes = {
    error: PropTypes.any,
    onCloseModal: PropTypes.func
}

