import React, {useEffect, useState} from "react"
import {Col, Row} from "reactstrap"
import {withRouter} from "react-router-dom"
import {connect} from "react-redux";
import {apiError} from "../../../store/auth/login/actions";
import PropTypes from "prop-types";
import {priceFormat} from "../../../common/utils";

const modelSummary = () => ({quantity: 0, totalDiscount: 0, totalWithoutDiscount: 0, totalWithDiscount: 0, delivery: 0, totalWithDelivery: 0, weight: 0});

const OrderSummary = (props) => {
    const {car} = props;
    const [summary, setSummary] = useState(modelSummary());

    useEffect(() => {
        const s = modelSummary();
        car.products.forEach(prod => {
            s.quantity += parseInt(prod.quantity);
            s.weight += (parseFloat(prod.origin.weight) * prod.quantity) || 0;
            s.totalDiscount += parseFloat(prod.discount);
            s.totalWithoutDiscount += parseFloat(prod.origin.price) * parseInt(prod.quantity);
            s.totalWithDiscount += parseFloat(prod.total);
        });
        s.delivery = parseFloat(car.deliveryOptions?.cost) || 0;
        s.totalWithDelivery = parseFloat(s.totalWithDiscount) + s.delivery;
        setSummary(s);
    }, [car])

    return (
        <React.Fragment>
            <Row>
                <Col>
                    <h4 className="card-title text-info"><i className="uil uil-bill"> </i> Totales</h4>
                </Col>
            </Row>
            <Row>
                {/*<Col md={{size: 6, order: 1, offset: 6}}>*/}
                <Col md={6}>
                    <div className="card border shadow-none">
                        <div className="card-body p-2">
                            <div className="table-responsive">
                                <table className="table table-sm mb-0">
                                    <tbody>
                                    <tr>
                                        <td>Prendas:</td>
                                        <td className="text-end">{summary.quantity}</td>
                                    </tr>
                                    <tr>
                                        <td>Peso:</td>
                                        <td className="text-end">{summary.weight}</td>
                                    </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </Col>
                <Col md={6}>
                    <div className="card border shadow-none">
                        <div className="card-body p-2">
                            <div className="table-responsive">
                                <table className="table table-sm mb-0">
                                    <tbody>
                                    <tr>
                                        <td>Total sin descuento:</td>
                                        <td className="text-end">{priceFormat(summary.totalWithoutDiscount)}</td>
                                    </tr>
                                    <tr>
                                        <td>Descuento:</td>
                                        <td className="text-end text-danger">- {priceFormat(summary.totalDiscount)}</td>
                                    </tr>
                                    <tr>
                                        <td>Total con descuento:</td>
                                        <td className="text-end">{priceFormat(summary.totalWithDiscount)}</td>
                                    </tr>
                                    <tr>
                                        <td>Envio:</td>
                                        <td className="text-end">{priceFormat(summary.delivery)}</td>
                                    </tr>
                                    <tr className="bg-light">
                                        <th className="font-size-16">Total :</th>
                                        <td className="text-end"><span className="fw-bold font-size-16">{priceFormat(summary.totalWithDelivery)}</span></td>
                                    </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </Col>
            </Row>
        </React.Fragment>
    )
}

OrderSummary.propTypes = {
    products: PropTypes.array.isRequired,
    deliveryOptions: PropTypes.object.isRequired,
}

const mapStateToProps = state => {
    const {car} = state.Order
    return {car};
}

export default withRouter(connect(mapStateToProps, {apiError})(OrderSummary))
