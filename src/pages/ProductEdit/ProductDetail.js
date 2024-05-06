import React, {useEffect, useState} from "react";
import {Col, Container, Row} from "reactstrap";
import Breadcrumb from "../../components/Common/Breadcrumb";
import {Link, withRouter} from "react-router-dom";
import {connect} from "react-redux";
import PropTypes from "prop-types";
import {getProduct} from "../../store/product/actions";
import {Card} from "@material-ui/core";
import {STATUS} from "../../common/constants";
import Images from "../../components/Common/Image";
import {getImageByQuality, priceFormat} from "../../common/utils";
import NoDataIndication from "../../components/Common/NoDataIndication";
import {map} from "lodash";
import ProductsPendingList from "./ProductsPending";
import {PERMISSIONS} from "../../helpers/security_rol";
import HasPermissions from "../../components/HasPermissions";
import ProductSize from "./ProductSize";

const ProductDetail = (props) => {

    const {getProduct, product} = props;
    const [productData, setProductData] = useState({_status: STATUS.ACTIVE});
    const [imgSelected, setImgSelected] = useState(0);

    useEffect(() => {
        getProduct(props.match.params.id);
    }, [getProduct]);

    useEffect(() => {
        if (product.id) {
            const productImage = product.productImage.length > 0 ? product.productImage : [{}];
            setProductData({...product, _status: product.status, productImage: productImage});
        }
    }, [product]);

    return productData.id ? (
        <React.Fragment>
            <div className="page-content">
                <Container fluid>
                    <Breadcrumb hasBack path="/products" title={productData.reference} item={"Producto"}/>

                    <Card id={'details'} className="mb-3">
                        <Row>
                            <Col md={4} className="p-3 text-center">
                                <div className="row p-2">
                                    <div className="col-3 image-left-panel">
                                        <div className={`nav flex-column nav-pills`} id="v-pills-tab" role="tablist" aria-orientation="vertical">
                                            {map(productData.productImage, (img, key) => (
                                                <div key={key}
                                                     className={`cursor-pointer nav-link ${imgSelected === key ? 'custom-active' : ''}`}
                                                     onClick={() => (setImgSelected(key))}>
                                                    <Images src={`${getImageByQuality(img, 'small')}`}
                                                            alt={img.filename}
                                                            className="img-fluid mx-auto d-block tab-img rounded"/>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="col-9">
                                        <div className="tab-content position-relative" id="v-pills-tabContent">
                                            {map(productData.productImage, (img, key) => (
                                                <div key={key} className={`tab-pane fade ${imgSelected === key ? 'show active bg-white border-1' : ''}`} id={`product-${key}`} role="tabpanel">
                                                    <div className="product-img panel-bordered">
                                                        <Images src={`${getImageByQuality(img, 'high')}`}
                                                                alt={img.filename}
                                                                height={370}
                                                                className="img-fluid mx-auto d-block"
                                                                data-zoom={`${img.path}`}/>
                                                    </div>
                                                    <div className="text-left panel-bordered p-2">
                                                        <div className="text.muted"><b>Grupo:</b> {img.group}</div>
                                                        <div className="text.muted">{img.filename}</div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </Col>
                            <Col md={8} className="p-3">
                                <Row>
                                    <Col md={12}>
                                        <h3>Código: <b className="text-info">{productData.reference}</b></h3>
                                    </Col>
                                </Row>
                                <hr/>
                                <Row>
                                    <Col xs={10}>
                                        <h4 className="card-title">Descripción del producto</h4>
                                    </Col>
                                    <Col xs={2} className="text-right">
                                        <HasPermissions permission={PERMISSIONS.PRODUCT_EDIT}>
                                            <li className="list-inline-item">
                                                <Link to={`/product/${productData.id}`} className="px-2 text-primary">
                                                    <i className="uil uil-pen font-size-18"> </i>
                                                </Link>
                                            </li>
                                        </HasPermissions>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col md={12}>
                                        <ul style={{listStyle: 'none'}}>
                                            <li><b>Description:</b> <small>{productData.name}</small></li>
                                            <li><b>Tipo:</b> {productData.description}</li>
                                            <li><b>Costo:</b> {priceFormat(productData.cost, "", true)}</li>
                                            <li><b>Precio:</b> {priceFormat(productData.price, "", true)}</li>
                                        </ul>
                                    </Col>
                                </Row>
                                <hr/>
                                <Row>
                                    <Col md={12}>
                                        <h4 className="card-title">Especificaciones</h4>
                                    </Col>
                                    <Col md={12}>
                                        <ul style={{listStyle: 'none'}}>
                                            {productData.size && (
                                                <li><b>Tipo:</b> {productData.size?.name}</li>
                                            )}
                                            <li><b>Categoria:</b> {productData.category?.name}</li>
                                            <li><b>Material:</b> {productData.material}</li>
                                            <li><b>Peso (g):</b> {productData.weight}</li>
                                            <li><b>Proveedor:</b> {productData.provider}</li>
                                        </ul>
                                    </Col>
                                </Row>
                            </Col>
                        </Row>
                    </Card>

                    <ProductsPendingList product={productData}/>

                    <Card className="p-3 mt-3 mb-3">
                        <Row>
                            <Col md={12}>
                                <h4 className="card-title text-info">Inventario</h4>
                            </Col>
                        </Row>
                        <Row>
                            <Col md={12}>
                            <ProductSize template={productData.size} product={productData} readonly={true}/>
                            </Col>
                        </Row>
                    </Card>
                </Container>
            </div>
        </React.Fragment>
    ) : <NoDataIndication/>;
}

const mapStateToProps = state => {
    const {error, product, loading} = state.Product
    return {error, product, loading}
}

export default withRouter(
    connect(mapStateToProps, {getProduct})(ProductDetail)
)

ProductDetail.propTypes = {
    error: PropTypes.any,
    history: PropTypes.object
}
