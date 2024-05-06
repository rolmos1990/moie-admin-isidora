import React, {useEffect, useState} from "react"
import {Col, Label, Row} from "reactstrap"
import {withRouter} from "react-router-dom"
import {connect} from "react-redux";
import PropTypes from "prop-types";
import {FieldAsyncSelect, FieldSelect, FieldText} from "../../../components/Fields";
import {PRODUCT} from "../../../helpers/url_helper";
import {getProduct, resetProduct} from "../../../store/product/actions";
import {getEmptyOptions} from "../../../common/converters";
import {AvForm} from "availity-reactstrap-validation";
import {map} from "lodash";
import Images from "../../../components/Common/Image";
import {buildNumericOptions, getImageByQuality, priceFormat} from "../../../common/utils";
import Conditionals from "../../../common/conditionals";
import {updateCard} from "../../../store/order/actions";

const searchByOptions = [{label: "Codigo", value: "code"}];

const OrderProducts = (props) => {
    const {car, product, onGetProduct, onUpdateCar, onResetProduct} = props;
    const [searchBy, setSearchBy] = useState(searchByOptions[0].value);
    const [productData, setProductData] = useState({});
    const [productDefault, setProductDefault] = useState(getEmptyOptions());
    const [productReferenceDefault, setProductReferenceDefault] = useState(getEmptyOptions());
    const [imgSelected, setImgSelected] = useState(0);
    const [quantityAvailable, setQuantityAvailable] = useState(0);
    const [colorsMap, setColorsMap] = useState({});
    const [colors, setColors] = useState([]);
    const [color, setColor] = useState({});
    const [sizes, setSizes] = useState([]);
    const [size, setSize] = useState({});
    const [defaultQuantity, setDefaultQuantity] = useState({});

    useEffect(() => {
        if (product.id) {
            const productImage = product.productImage.length > 0 ? product.productImage : [{}];
            setProductData({...product, _status: product.status, productImage: productImage});

            const map = {};
            if (product.productSize.length) {
                product.productSize.filter(s => s.quantity > 0).forEach((s => {
                    if (!map[s.color]) map[s.color] = [];
                    map[s.color].push({label: s.name, value: s.id});
                }))
            }
            setColorsMap(map);

            let productSizeColors = Object.keys(map).map(k => ({label: k, value: k}));
            setColors(productSizeColors);

            setColor(-1);
            setSize(-1);
            setSizes([]);
            setQuantityAvailable(0);
            setDefaultQuantity(-1);
        } else {
            resetData();
        }
    }, [product]);

    useEffect(() => {
        if (onResetProduct) {
            onResetProduct();
        }
    }, [onResetProduct]);

    const addToOrder = (e, d) => {
        const prod = {
            origin: productData,
            color: d.color.value,
            size: d.size.label,
            sizeId: d.size.value,
            quantity: d.quantity.value,
            quantityAvailable: quantityAvailable,
            discountPercentage: 0,
            discount: 0,
        };

        onUpdateCar({...car, products: [...car.products, prod]})
        resetData();
    }

    const onChangeSize = (e) => {
        const item = product.productSize.find(s => s.id === e.value);
        setQuantityAvailable(item.quantity);
        setSize(sizes.find(s => s.id === e.value));
    }

    const resetData = () => {
        setProductDefault(getEmptyOptions());
        setProductReferenceDefault(getEmptyOptions());
        setProductData({})
    }

    return (
        <React.Fragment>
            <AvForm className="needs-validation" autoComplete="off" onValidSubmit={(e, v) => addToOrder(e, v)}>
                <Row>
                    <Col>
                        <h4 className="card-title text-info"><i className="uil-filter me-2"> </i> Agregar productos</h4>
                    </Col>
                </Row>
                <Row>
                    <Col md={2}>
                        <Label htmlFor="product">Buscar por</Label>
                        <FieldSelect
                            id={"searchByOptions"}
                            name={"searchByOptions"}
                            options={searchByOptions}
                            defaultValue={searchBy}
                            onChange={(e) => {
                                setSearchBy(e.value);
                            }}
                        />
                    </Col>
                    {searchBy === "code" && (
                        <Col md={10}>
                            <Label htmlFor="product">Código</Label>
                            <FieldAsyncSelect
                                name={"productCode"}
                                urlStr={PRODUCT}
                                placeholder="Código del producto"
                                defaultValue={productReferenceDefault}
                                hasWild={false}
                                isClearable={true}
                                conditionalOptions={{fieldName: 'reference', operator: Conditionals.OPERATORS.EQUAL}}
                                onKeyPress={(e) => {
                                    if(e.which == 13){
                                        onGetProduct(e.target.value);
                                        setProductDefault(getEmptyOptions());
                                    }
                                }}
                                onChange={(d, meta) => {
                                    if(meta.action === "clear"){
                                        setProductDefault(getEmptyOptions());
                                        setProductReferenceDefault(getEmptyOptions());
                                        setProductData({})
                                    }
                                }}
                            />
                        </Col>
                    )}
                    {searchBy === "name" && (
                        <Col md={10}>
                            <Label htmlFor="product">Nombre</Label>
                            <FieldAsyncSelect
                                name={"productName"}
                                urlStr={PRODUCT}
                                placeholder="Nombre del producto"
                                defaultValue={productDefault}
                                hasWild={true}
                                isClearable={true}
                                onChange={(d, meta) => {
                                    if(meta.action === "clear"){
                                        setProductDefault(getEmptyOptions());
                                        setProductReferenceDefault(getEmptyOptions());
                                        setProductData({})
                                    } else {
                                        onGetProduct(d.value);
                                        setProductReferenceDefault(getEmptyOptions());
                                    }
                                }}
                            />
                        </Col>
                    )}
                </Row>
                {productData.id && (
                    <Row className="mt-3">
                        <Col md={3} className="text-center">
                            <Row className="">
                                <Col md={4} className="image-left-panel" style={{minHeight: '225px'}}>
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
                                </Col>
                                <Col md={8}>
                                    <div className="tab-content position-relative" id="v-pills-tabContent">
                                        {map(productData.productImage, (img, key) => (
                                            <div key={key} className={`tab-pane fade ${imgSelected === key ? 'show active bg-white border-1' : ''}`} id={`product-${key}`} role="tabpanel">
                                                <div className="product-img panel-bordered">
                                                    <Images src={`${getImageByQuality(img, 'medium')}`}
                                                            alt={img.filename}
                                                            className="img-fluid mx-auto d-block"
                                                            width={200}/>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </Col>
                            </Row>
                        </Col>
                        <Col md={9}>
                            <Row>
                                <Col md={8}>
                                    <Row>
                                        <Col md={12}>
                                            <div className="p-1">
                                                <b className="text-info font-size-16">{productData.reference}</b> - <span>{productData.name}</span>
                                            </div>
                                        </Col>
                                        <Col md={12}>
                                            <label>Categoria: </label>
                                            <span className="p-1">{productData.category?.name}</span>
                                        </Col>
                                        <Col md={12}>
                                            <label>Material: </label>
                                            <span className="p-1">{productData.material}</span>
                                        </Col>
                                        {productData.size && (
                                            <Col md={12}>
                                                <label>Tipo: </label>
                                                <span className="p-1">{productData.size.name}</span>
                                            </Col>
                                        )}
                                    </Row>
                                </Col>
                                <Col md={4}>
                                    <Row>
                                        <Col md={12} className="text-right">
                                            <div className="mt-3">
                                                <p className="text-muted mb-2">Precio</p>
                                                <h5 className="font-size-20">{priceFormat(productData.price)}</h5>
                                            </div>
                                        </Col>
                                    </Row>
                                </Col>
                            </Row>
                            <hr/>
                            <Row>
                                <Col md={4}>
                                    <Label className="control-label">Color</Label>
                                    <FieldSelect
                                        id={"color"}
                                        name={"color"}
                                        options={colors}
                                        defaultValue={color}
                                        onChange={(e) => {
                                            setSizes(colorsMap[e.label]);
                                            setColor(colors.find(s => s.id === e.value));
                                        }}
                                        isSearchable
                                        required
                                    />
                                </Col>
                                <Col md={3}>
                                    <Label className="control-label">Tallas</Label>
                                    <FieldSelect
                                        id={"size"}
                                        name={"size"}
                                        options={sizes}
                                        defaultValue={size}
                                        onChange={(e) => onChangeSize(e)}
                                        isSearchable
                                        required
                                    />
                                </Col>
                                <Col md={3}>
                                    <Label htmlFor="weight">Cantidad</Label>
                                    <FieldSelect
                                        id={"quantity"}
                                        name={"quantity"}
                                        options={buildNumericOptions(quantityAvailable, 1, 1)}
                                        defaultValue={(quantityAvailable > 0 && !!defaultQuantity) ? 1 : defaultQuantity}
                                        onChange={(e) => setDefaultQuantity(e.value)}
                                        required
                                    />
                                </Col>
                                <Col md={2} style={{display: 'flex', 'alignItems': 'normal'}}>
                                    <button type="submit" className="btn btn-primary btn-block waves-effect waves-light mt-2 me-1 w-100">
                                        <i className="uil uil-shopping-cart-alt me-2"> </i> Agregar
                                    </button>
                                </Col>
                            </Row>
                        </Col>

                    </Row>
                )}
            </AvForm>
        </React.Fragment>
    )
}

OrderProducts.propTypes = {
    onSelect: PropTypes.func.isRequired,
    history: PropTypes.object
}

const mapStateToProps = state => {
    const {product, error, loading} = state.Product;
    const {car} = state.Order;
    return {car, product, error, loading};
}

const mapDispatchToProps = dispatch => ({
    onResetProduct: () => dispatch(resetProduct()),
    onGetProduct: (id) => dispatch(getProduct(id)),
    onUpdateCar: (data) => dispatch(updateCard(data)),
})

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(OrderProducts))
