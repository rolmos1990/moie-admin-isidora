import React, {useEffect, useState} from "react"
import {Col, Label, Row} from "reactstrap"
import {AvForm} from "availity-reactstrap-validation"
import {withRouter} from "react-router-dom"
import {connect} from "react-redux";
import {apiError} from "../../store/auth/login/actions";
import PropTypes from "prop-types";
import {getBillConfig, registerBillConfig, updateBillConfig} from "../../store/billConfig/actions";
import {getMunicipalities, getStates} from "../../store/location/actions";
import {FieldDate, FieldSwitch, FieldText} from "../../components/Fields";
import ButtonSubmit from "../../components/Common/ButtonSubmit";
import {DATE_MODES} from "../../components/Fields/InputDate";

const BillConfigForm = (props) => {
    const {getBillConfig, billConfig, showAsModal = false, onCloseModal= false, onAcceptModal= false} = props;
    const [billConfigData, setBillConfigData] = useState({_status: "true"});

    //carga inicial
    useEffect(() => {
        if (props.match.params.id && getBillConfig) {
            getBillConfig(props.match.params.id);
        }
    }, [getBillConfig]);

    //cargar la información del cliente
    useEffect(() => {
        if (billConfig.id) {
            setBillConfigData(billConfig);
        }
    }, [billConfig]);

    const handleValidSubmit = (event, values) => {
        const data = filteredValues(values);

        if (!billConfig.id) {
            props.registerBillConfig(data, props.history)
        } else {
            props.updateBillConfig(billConfig.id, data, props.history)
        }

        if(showAsModal && onAcceptModal){
            onAcceptModal(billConfig.id);
        }
    }

    const filteredValues = (values) => {
        const data = {...values};

        data.status = values._status === "true" ? true : false;
        delete data._status;
        return data;
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
                                            ¿Activo?
                                        </Col>
                                        <Col>
                                            <FieldSwitch
                                                id={"_status"}
                                                defaultValue={billConfigData.status}
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
                                    <Label htmlFor="name">Número Resolución<span className="text-danger">*</span></Label>
                                    <FieldText
                                        id={"number"}
                                        name={"number"}
                                        value={billConfigData.number}
                                        required
                                    />
                                </div>
                            </Col>
                            <Col md="6">
                                <div className="mb-3">
                                    <Label htmlFor="prefix">Prefijo<span className="text-danger">*</span></Label>
                                    <FieldText
                                        id='prefix'
                                        name={"prefix"}
                                        value={billConfigData.prefix}
                                        required />
                                </div>
                            </Col>
                        </Row>
                        <Row>
                            <Col md="4">
                                <div className="mb-3">
                                    <Label htmlFor="_startNumber">Numero Inicial <span className="text-danger">*</span></Label>
                                    <FieldText
                                        id='_startNumber'
                                        name={"startNumber"}
                                        value={billConfigData.startNumber}
                                        minLength={1}
                                        maxLength={255}
                                        required/>
                                </div>
                            </Col>
                            <Col md="4">
                                <div className="mb-3">
                                    <Label htmlFor="_finalNumber">Numero Final <span className="text-danger">*</span></Label>
                                    <FieldText
                                        id='_finalNumber'
                                        name={"finalNumber"}
                                        value={billConfigData.finalNumber}
                                        minLength={1}
                                        maxLength={255}
                                        required/>
                                </div>
                            </Col>
                            <Col md="4">
                                <div className="mb-3">
                                    <Label htmlFor="resolutionDate">Fecha de Resolución</Label>
                                    <FieldDate
                                        name={"resolutionDate"}
                                        mode={DATE_MODES.SINGLE}
                                        defaultValue={billConfigData.resolutionDate}
                                    />
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
    const {error, loading} = state.BillConfig
    return {error,loading}
}

export default withRouter(
    connect(mapStateToProps, {apiError, registerBillConfig, updateBillConfig, getBillConfig})(BillConfigForm)
)

BillConfigForm.propTypes = {
    error: PropTypes.any,
    history: PropTypes.object
}

