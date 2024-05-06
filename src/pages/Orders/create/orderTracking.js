import React, {useEffect, useState} from "react"
import {Col, Label, Row} from "reactstrap"
import {withRouter} from "react-router-dom"
import {connect} from "react-redux";
import PropTypes from "prop-types";
import {FieldText} from "../../../components/Fields";
import {AvForm} from "availity-reactstrap-validation";
import {Button} from "@material-ui/core";
import {updateCard} from "../../../store/order/actions";

const OrderTracking = (props) => {
    const {
        car, showAsModal, onCloseModal, onAcceptModal, orderDelivery, onUpdateCar
    } = props;

    const [tracking, setTracking] = useState(null);

    //Carga inicial
    useEffect(() => {
            setTracking(orderDelivery.tracking || "");
    }, [showAsModal]);

    const acceptModal = () => {
        onAcceptModal(tracking);
    }

    return (
        <React.Fragment>
            <AvForm className="needs-validation" autoComplete="off" onValidSubmit={(e, v) => acceptModal(e, v)}>
                <Row>
                    <Col>
                        <h4 className="card-title text-info"><i className="uil uil-truck"> </i> Opciones de envio</h4>
                    </Col>
                </Row>
                <Row>
                    <Col md={12} className="p-1">
                        <Label htmlFor="weight">Guia número</Label>
                        <FieldText
                            id={"tracking"}
                            name={"tracking"}
                            value={tracking}
                            onChange={item => setTracking(item.target.value)}
                        />
                    </Col>
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

OrderTracking.propTypes = {
    history: PropTypes.object
}

const mapDispatchToProps = dispatch => ({
    onUpdateCar: (data) => dispatch(updateCard(data)),
})

const mapStateToProps = state => {
    const {car} = state.Order
    return {car};
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(OrderTracking))
