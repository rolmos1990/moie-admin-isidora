import React, {useEffect, useState} from "react"
import PropTypes from 'prop-types'
import {Col, Label, Row} from "reactstrap"
import {FieldSwitch, FieldText} from "../../components/Fields";
import {connect} from "react-redux";
import {AvForm} from "availity-reactstrap-validation";
import {updateProduct} from "../../store/product/actions";
import ButtonSubmit from "../../components/Common/ButtonSubmit";
import {map} from "lodash";

const ProductPublish = props => {
    const {product, updateProduct} = props
    const [productData, setProductData] = useState(product);
    const [discount, setDiscount] = useState(0);
    const [selectValues, setSelectValues] = useState([]);

    useEffect(() => {
        fillValues();
    }, [product])

    const handleValidSubmit = (event, values) => {
        const data = {
            video: values.video || null,
            published: values.published === true,
            discount: Number.parseFloat(discount)
        };
        updateProduct(product.id, data, props.history);
    }

    const fillValues = () => {
        if (selectValues.length === 0) {
            const valueList = [];
            for (let i = 0; i <= 100;) {
                valueList.push({label: i, value: i});
                i += 5;
            }
            setSelectValues(valueList);
        }
    }

    return (
        <React.Fragment>
            <AvForm className="needs-validation" autoComplete="off" onValidSubmit={(e, v) => handleValidSubmit(e, v)}>
                <div className="p-4 border-top">
                    <Row>
                        <Col lg={6}>
                            <div className="mb-3">
                                <Label htmlFor="productpublished">Publicación Activa</Label>
                                <FieldSwitch name={"published"} defaultValue={productData.published}/>
                            </div>
                        </Col>
                        <Col lg={6}>
                            <div className="mb-3">
                                <Label htmlFor="field_discount">Descuento especial</Label>
                                <select
                                    id={"field_discount"}
                                    name={"discount"}
                                    value={discount}
                                    onChange={(e) => setDiscount(e.target.value)}
                                    className="form-control"
                                >
                                    {map(selectValues, (o, k3) => (
                                        <option key={k3} value={o.value}>{o.label}</option>
                                    ))}
                                </select>
                            </div>
                        </Col>
                        <Col lg={12}>
                            <div className="mb-3">
                                <Label htmlFor="video">Enlace de Video</Label>
                                <FieldText
                                    id={"field_video"}
                                    name={"video"}
                                    value={productData.video}
                                    maxLength={300}
                                    />
                            </div>
                        </Col>
                    </Row>
                    <Row>
                        <Col md={12} className="text-right">
                            <ButtonSubmit loading={props.loading}/>
                        </Col>
                    </Row>
                </div>
            </AvForm>
        </React.Fragment>
    )
}

ProductPublish.propTypes = {
    product: PropTypes.object,
    onGetProductSizes: PropTypes.func,
}

const mapStateToProps = state => {
    const {product, loading, meta, refresh} = state.Product
    return {product, loading, meta, refresh}
}


export default connect(mapStateToProps, {updateProduct})(ProductPublish)

