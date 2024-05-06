import React, {useEffect, useState} from "react"
import {Col, Label, Row} from "reactstrap"
import {withRouter} from "react-router-dom"
import {connect} from "react-redux";
import PropTypes from "prop-types";
import {getProduct} from "../../../store/product/actions";
import {map} from "lodash";
import Images from "../../../components/Common/Image";
import {buildNumericOptions, getImageByQuality, priceFormat} from "../../../common/utils";
import {FieldDecimalNumber, FieldSelect} from "../../../components/Fields";
import {HtmlTooltip} from "../../../components/Common/HtmlTooltip";
import {AvForm} from "availity-reactstrap-validation";
import {updateCard} from "../../../store/order/actions";


const OrderCar = (props) => {
    const {car, onUpdateCar} = props;
    const [globalDiscount, setGlobalDiscount] = useState(0);
    const [totalAmount, setTotalAmount] = useState(0);

    useEffect(() => {
        if (car.products && car.products.length > 0) {
            const list = [...car.products];
            let totaledProductList = getProductListWithTotals(list);

            if(JSON.stringify(totaledProductList) !== JSON.stringify(car.products)){
                calculateAll(totaledProductList);
                onUpdateCar({...car, products: totaledProductList})
            }
        }
    }, [car.products, globalDiscount])

    const getProductListWithTotals = (list) => {
        var map = {};
        list.map((prod) => {
            const discountPercentage = globalDiscount > 0 ? globalDiscount : prod.discountPercentage;
            let total = prod.origin.price * prod.quantity;
            const discount = total * (discountPercentage / 100);
            total = total - discount;

            return {
                ...prod,
                quantity: parseInt(prod.quantity),
                discountPercentage: discountPercentage,
                discount: discount,
                total: total,
            };
        }).forEach((prod) => {
            const key = prod.origin.id + '_' + prod.color + '_' + prod.sizeId;
            if (map[key]) {
                map[key].quantity += prod.quantity;
                if (map[key].quantity > prod.quantityAvailable) map[key].quantity = prod.quantityAvailable;
                map[key].total += prod.total;
            } else {
                map[key] = prod;
            }
        });
        return Object.keys(map).map((key) => (map[key]));
    }

    const removeProduct = (prod) => {
        const list = [...car.products];
        list.splice(list.indexOf(prod), 1);
        onUpdateCar({...car, products: list})
    }

    const onChangeQuantity = (quantity, p) => {
        if (quantity === 0) {
            removeProduct(p);
        } else {
            const list = [...car.products];
            list.forEach((prod) => {
                if (prod.origin.id === p.origin.id) {
                    prod.quantity = parseInt(quantity);
                }
            });
            calculateAll(list);
            onUpdateCar({...car, products: getProductListWithTotals(list)})
        }
    }

    const calculateAll = (list) => {
        const totals = getProductListWithTotals(list);

        let _sum = totals.reduce((accumulator, _product) => {
            return accumulator + _product.total;
        }, 0);

        if(car.deliveryOptions && car.deliveryOptions.cost) {
            _sum = _sum + car.deliveryOptions.cost;
        }
        setTotalAmount(_sum);
    }

    const onChangeDiscount = (discountPercentage, p) => {
        const list = [...car.products];
        list.forEach((prod) => {
            if (prod.origin.id === p.origin.id && prod.color === p.color && prod.size === p.size) {
                prod.discountPercentage = parseFloat(discountPercentage);
            }
        });
        calculateAll(list);
        onUpdateCar({...car, products: getProductListWithTotals(list)})
    }

    return (
        <React.Fragment>
            <AvForm className="needs-validation" autoComplete="off">
                <Row>
                    <Col md={12} className="mb-3">
                        <h4 className="card-title text-info"><i className="uil-box me-2"> </i> Productos</h4>
                    </Col>
                    <Col md={4} className="mb-3">
                        <Label htmlFor="weight">Descuento Global</Label>
                        <FieldSelect
                            id={"discount"}
                            name={"discount"}
                            isSearchable={true}
                            options={buildNumericOptions(100, 5, 0)}
                            defaultValue={globalDiscount}
                            onChange={(item => setGlobalDiscount(parseInt(item.value)))}
                            required
                        />
                    </Col>
                    <Col md={12}>
                        <table className="table table-sm table-striped table-bordered table-centered table-nowrap font-size-11">
                            <thead>
                            <tr>
                                <th className="text-center">Código</th>
                                <th className="text-center">Color</th>
                                <th className="text-center">Talla</th>
                                <th className="text-center">Cantidad</th>
                                <th className="text-center">Precio Unit.</th>
                                <th className="text-center">% Desc.</th>
                                <th className="text-center">Total Desc.</th>
                                <th className="text-center">SubTotal</th>
                                <th className="text-center"> </th>
                            </tr>
                            </thead>
                            <tbody>
                            {map(car.products, (product, key) => (
                                <tr key={key}>
                                    <td style={{width: '10%'}}>
                                        <HtmlTooltip
                                            title={
                                                <React.Fragment>
                                                    <Images src={`${getImageByQuality(product.origin.productImage.length > 0 ? product.origin.productImage[0] : {}, 'medium')}`}
                                                            alt={product.origin.reference}
                                                            height={100}
                                                            className="img-fluid mx-auto d-block tab-img rounded"/>
                                                </React.Fragment>
                                            }>
                                            <div className="text-info">{product.origin.reference}</div>
                                        </HtmlTooltip>
                                    </td>
                                    <td style={{width: '25%'}} className="text-center">{product.color}</td>
                                    <td style={{width: '15%'}} className="text-center">{product.size}</td>
                                    <td style={{width: '10%'}}>
                                        <FieldSelect
                                            id={"quantity"}
                                            name={"quantity"}
                                            options={buildNumericOptions((product.quantityAvailable > 0) ? product.quantityAvailable : product.quantity)}
                                            defaultValue={product.quantity}
                                            onChange={item => onChangeQuantity(item.value, product)}
                                            required
                                        />
                                    </td>
                                    <td style={{width: '10%'}} className="text-end">{priceFormat(product.origin.price)}</td>
                                    <td style={{width: '10%'}} className="text-center">
                                        {globalDiscount > 0 && (<>{product.discountPercentage + '%'}</>)}
                                        {globalDiscount === 0 && (
                                            <FieldDecimalNumber
                                                id={"discountProd"}
                                                name={"discountProd"}
                                                value={product.discountPercentage}
                                                onChange={val => onChangeDiscount((val ? val : 0), product)}
                                            />
                                        )}
                                    </td>
                                    <td style={{width: '10%'}} className="text-end">{priceFormat(product.discount)}</td>
                                    <td style={{width: '15%'}} className="text-end">{priceFormat(product.total)}</td>
                                    <td style={{width: '5%'}} className="text-end">
                                        <button size="small" className="btn btn-sm text-danger" onClick={() => removeProduct(product)}>
                                            <i className="uil uil-trash-alt font-size-18"> </i>
                                        </button>
                                    </td>
                                </tr>
                            ))}
                            {car.products.length === 0 && (
                                <tr>
                                    <td colSpan={8} className="text-center text-muted">Pedido vacio</td>
                                </tr>
                            )}
                            </tbody>
                            {props.showTotalAmount && (
                                <tfoot>
                                <tr>
                                    <th colSpan={7} className={'text-right p-2'}>Total con Envio:</th>
                                    <td><b>{priceFormat(totalAmount)}</b></td>

                                </tr>
                                </tfoot>
                            )}
                        </table>
                    </Col>
                </Row>
            </AvForm>
        </React.Fragment>
    )
}

OrderCar.propTypes = {
    history: PropTypes.object,
    showTotalAmount: PropTypes.bool
}

const mapStateToProps = state => {
    const {product, error, loading} = state.Product
    const {car} = state.Order
    return {car, product, error, loading};
}

const mapDispatchToProps = dispatch => ({
    onGetProduct: (id) => dispatch(getProduct(id)),
    onUpdateCar: (data) => dispatch(updateCard(data)),
})

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(OrderCar))
