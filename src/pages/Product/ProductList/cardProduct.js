import React from "react"
import PropTypes from 'prop-types'
import { Card, Col, Row ,CardBody ,Media} from "reactstrap"
import { Link } from "react-router-dom"

const CardProduct = props => {
    const { product } = props
    const name = product.name
    const nameIcon = name.charAt(0)
    return (
        <React.Fragment>
            <Col xl="4" sm="6">
                <Card>
                    <CardBody>
                        <Media className="d-flex">
                            <div className="avatar-sm me-4">
                                <span className={
                                        "avatar-title rounded-circle bg-soft-" +
                                        product.color +
                                        " primary text-" +
                                        product.color +
                                        " font-size-16"
                                    }
                                >
                                  {nameIcon}
                                </span>
                            </div>
                            <Media body className="flex-1 align-self-center">
                                <Row className="border-bottom pb-1">
                                    <Col xs={10} >

                                            <h5 className="text-truncate font-size-16 mb-1"><Link to="#" className="text-dark">{product.name}</Link></h5>
                                            <p className="text-muted">
                                                <i className="uil-box me-2"> </i> Ref: {product.reference} <br />
                                            </p>

                                    </Col>
                                    <Col xs={2}>
                                        <Link to={`/product/${product.id}`} className="px-2 text-primary">
                                            <i className="uil uil-pen font-size-18"> </i>
                                        </Link>
                                    </Col>
                                </Row>
                                <Row>
                                    <div className="col-4">
                                        <div className="mt-3">
                                            <p className="text-muted mb-2">Disponible</p>
                                            <h5 className="font-size-14 mb-0 badge bg-success">10.000.000</h5>
                                        </div>
                                    </div>
                                    <div className="col-4">
                                        <div className="mt-3">
                                            <p className="text-muted mb-2">Apartado</p>
                                            <h5 className="font-size-14 mb-0 badge bg-danger">50000</h5>
                                        </div>
                                    </div>
                                    <div className="col-4">
                                        <div className="mt-3">
                                            <p className="text-muted mb-2">Vendidos</p>
                                            <h5 className="font-size-14 mb-0">10.000.000</h5>
                                        </div>
                                    </div>
                                </Row>
                            </Media>
                        </Media>
                    </CardBody>
                </Card>
            </Col>
        </React.Fragment>
    )
}

CardProduct.propTypes = {
    product: PropTypes.object
}

export default CardProduct
