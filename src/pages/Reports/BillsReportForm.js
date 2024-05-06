import React, {useEffect} from "react"
import {CardBody, Col, Label, Row} from "reactstrap"
import {AvForm} from "availity-reactstrap-validation"
import {Card} from "@material-ui/core";
import {withRouter} from "react-router-dom"
import {connect} from "react-redux";
import PropTypes from "prop-types";
import {FieldDate, FieldSelect} from "../../components/Fields";
import {DATE_MODES} from "../../components/Fields/InputDate";
import ButtonSubmit from "../../components/Common/ButtonSubmit";
import {formatDateToServer, formatDateToServerEndOfDay} from "../../common/utils";
import {generateReport, generateReportRestart} from "../../store/reports/actions";
import { BILL_MEMO_TYPES, REPORT_TYPES } from "../../common/constants";

const types = [{label: 'Facturas electrónicas', value: BILL_MEMO_TYPES.INVOICE }, {label: 'Notas de crédito', value: BILL_MEMO_TYPES.CREDIT }];

const BillsReportForm = ({onCloseModal, loading, error, success, onGenerateReport, onRestartReport}) => {

    useEffect(() => {
        if (onRestartReport) {
            onRestartReport();
        }
    }, [onRestartReport]);

    useEffect(() => {
        if (success && !error) {
            onCloseModal(true);
        }
    }, [success]);

    const handleValidSubmit = (e, values) => {
        const payload = {
            type: values.type.value,
            dateFrom: formatDateToServer(values.reportDate[0]),
            dateTo: formatDateToServerEndOfDay(values.reportDate[1])
        };
        onGenerateReport(payload);
    }

    return (
        <React.Fragment>
            <AvForm className="needs-validation" autoComplete="off" onValidSubmit={(e, v) => handleValidSubmit(e, v)}>
                <Card>
                    <CardBody>
                        <Row>
                            <Col md="12">
                                <div className="mb-3">
                                    <Label htmlFor="field_name">Tipo<span className="text-danger">*</span></Label>
                                    <FieldSelect
                                        id={"type"}
                                        name={"type"}
                                        options={types}
                                        defaultValue={types[0]}
                                        required
                                    />
                                </div>
                            </Col>
                            <Col md="12">
                                <div className="mb-3">
                                    <Label htmlFor="field_name">Fechas <span className="text-danger">*</span></Label>
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
    const {report} = state.Bill;
    return {loading: report.loading, error: report.error, success: report.success}
}

const mapDispatchToProps = dispatch => ({
    onGenerateReport: (data) => dispatch(generateReport(REPORT_TYPES.BILLS, data)),
    onRestartReport: () => dispatch(generateReportRestart()),
})

export default withRouter(
    connect(mapStateToProps, mapDispatchToProps)(BillsReportForm)
)

BillsReportForm.propTypes = {
    error: PropTypes.any,
    onCloseModal: PropTypes.func
}

