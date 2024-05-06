import React, {useEffect, useState} from "react"
import PropTypes from 'prop-types'
import {Col, Row} from "reactstrap"
import {FieldText} from "../../components/Fields";
import {map} from "lodash";
import {Button} from "@material-ui/core";
import {updateProductSizeList} from "../../store/productSize/actions";
import {connect} from "react-redux";
import Conditionals from "../../common/conditionals";
import {AvForm} from "availity-reactstrap-validation";
import ButtonSubmit from "../../components/Common/ButtonSubmit";

const ProductSize = props => {
    const {product, template, productSizes, refresh, readonly} = props
    const [productSizesList, setProductSizesList] = useState([]);
    const [selectValues, setSelectValues] = useState([]);
    const [sizeTotals, setSizeTotals] = useState({});
    const form = React.createRef();

    useEffect(() => {
        if (product.productSize.length) {
            setProductSizesList(parseList(product.productSize));
        } else {
            setProductSizesList([]);
        }

        fillSelectValues();
    }, [product])

    useEffect(() => {
        calculateTotals();
    }, [productSizesList])

    const getModel = () => {
        const model = {color: '', sizes: {}};
        if (template && template.sizes) {
            template.sizes.forEach(size => model.sizes[size] = 0)
        }
        return model;
    }
    const fillSelectValues = () => {
        if (selectValues.length === 0) {
            const valueList = [];
            for (let i = 0; i <= 1000; i++) {
                valueList.push({label: i, value: i});
            }
            setSelectValues(valueList);
        }
    }
    const addColor = () => {
        const list = [...productSizesList, getModel()];
        setProductSizesList(list);
        calculateTotals();
    }
    const removeColor = (index) => {
        let list = [...productSizesList];
        list.splice(index);
        setProductSizesList(list);
        calculateTotals();
    }
    const parseDefaultValue = (model, sizeName) => {
        if (!model || !model.sizes) return 0;
        return model.sizes[sizeName] ? model.sizes[sizeName] : 0;
    }
    const parseValues = () => {
        //flat data
        const dataList = [];
        productSizesList.map((ps) => {
            Object.keys(ps.sizes).forEach(sizeName => {
                const productSize = (product.productSize.filter(psf => psf.name == sizeName && psf.color ==  ps.color))[0];
                const _id = (productSize) ? productSize.id : null;
                let qty = parseFloat(ps.sizes[sizeName]);
                    dataList.push({name: sizeName, qty: qty, color: ps.color, id: _id});
            });
        });
        return dataList;
    }
    const parseList = (list) => {
        let map = {};
        list.filter(ps => null !== ps).map(ps => {
            const key = ps.color.replace(/\s/g, '');
            let mapElement = map[key];
            if (!mapElement) {
                mapElement = {color: ps.color, sizes: {}, id: ps.id};
                if(template && template.sizes) {
                    template.sizes.forEach(size => mapElement.sizes[size] = 0)
                }
            }
            mapElement.sizes[ps.name] = ps.quantity;
            map[key] = mapElement;
        });
        return Object.keys(map).map((m) => map[m]);
    }
    const handleValidSubmit = (event, values) => {
        const list = parseValues(values);
        if (list && list.length > 0) {
            props.onUpdateProductSizeList(product.id, list, props.history);
        }
    }
    const handleChangeColors = (index, color) => {
        if (!productSizesList.some(l => l.color === color)) {
            const list = [...productSizesList];
            list[index].color = color;
            setProductSizesList(list);
        }
        validateColor("color_" + index);
    }
    const handleChangeSizes = (index, sizeName, sizeValue) => {
        const list = [...productSizesList];
        list[index].sizes[sizeName] = sizeValue;
        setProductSizesList(list);
        calculateTotals();
    }

    const validateColorDuplicate = (color) => {
        //TODO validar
        if (productSizesList.some(l => l.color === color)) {
            return 'Color repetido.';
        }
        return true;
    }
    const validateColor = (inputName) => {
        form.current.validateInput(inputName);
    }
    const calculateTotals = () => {
        const totals = {total: 0};
        productSizesList.forEach((model) => {
            if(template && template.sizes) {
                template.sizes.forEach((size) => {
                    if (!totals[size]) totals[size] = 0;
                    totals[size] += parseInt(model.sizes[size]);
                    totals.total += parseInt(model.sizes[size]);
                })
            }
        })
        setSizeTotals(totals);
    }

    return (
        <React.Fragment>
            <AvForm ref={form} className="needs-validation" autoComplete="off"
                    onValidSubmit={(e, v) => {
                        handleValidSubmit(e, v)
                    }}>
                <Row>
                    <Col md="12">
                        <div className={"table-responsive"}>
                            <table className="table table-card-list table-condensed">
                                <thead>
                                <tr>
                                    <th>Color</th>
                                    {map(template?.sizes, (size, key) => (
                                        <th key={'th_' + key} className="text-center">
                                            {size}
                                            {!!(product.sizeDescription) && (
                                                <div><small className="text-muted">[{product.sizeDescription}]</small></div>
                                            )}
                                        </th>
                                    ))}
                                    {!readonly && <th>Borrar</th>}
                                </tr>
                                </thead>
                                <tbody>
                                {productSizesList && map(productSizesList, (model, k1) => (
                                    <tr key={'tr_' + k1}>
                                        <td>
                                            <FieldText
                                                id={"field_color_" + k1}
                                                name={"color_" + k1}
                                                placeholder={'Ingrese el color'}
                                                minLength={3}
                                                maxLength={40}
                                                value={model.color}
                                                defaultValue={model.color}
                                                onBlur={(e) => handleChangeColors(k1, e.target.value)}
                                                validate={{myValidation: validateColorDuplicate}}
                                                disabled={readonly}
                                                required/>
                                        </td>
                                        {template && template.sizes && map(template.sizes, (size, k2) => (
                                            <td key={'td_' + k1 + '_' + k2} style={{minWidth: '30px'}} className="text-center">
                                                <select
                                                    id={"select_" + k1 + '_' + k2}
                                                    name={"select_" + k1 + '_' + k2}
                                                    value={model.sizes[size]}
                                                    // defaultValue={parseDefaultValue(model, size)}
                                                    onChange={(e) => handleChangeSizes(k1, size, e.target.value, model)}
                                                    className="form-control"
                                                    disabled={readonly}
                                                >
                                                    {map(selectValues, (o, k3) => (
                                                        <option key={k3} value={o.value}>{o.label}</option>
                                                    ))}
                                                </select>
                                            </td>
                                        ))}
                                        {!readonly && (template && template.sizes > 1) && (
                                            <th>
                                                <button size="small" className="btn btn-sm text-danger" onClick={() => removeColor(k1)}>
                                                    <i className="uil uil-trash-alt font-size-18"> </i>
                                                </button>
                                            </th>
                                        )}
                                    </tr>
                                ))}
                                <tr>
                                    <th>Totales</th>
                                    {template && template.sizes && map(template.sizes, (size, k) => (
                                        <th key={'td_' + k} style={{minWidth: '30px'}} className="text-center">
                                    {sizeTotals[size]}
                                        </th>
                                        ))
                                    }
                                    <th>{sizeTotals.total}</th>
                                </tr>
                                </tbody>
                            </table>
                        </div>
                    </Col>
                </Row>
                {!readonly && (
                    <Row>
                        <Col md="12">
                            <div className="text-center m-3">
                                <Button color="default" type="button" onClick={() => addColor()}>
                                    Agregar color
                                </Button>
                            </div>
                        </Col>
                    </Row>
                )}
                {!readonly && (
                    <Row>
                        <Col md={12} className="text-right">
                            <ButtonSubmit loading={props.loading}/>
                        </Col>
                    </Row>
                )}
            </AvForm>
        </React.Fragment>
    )
}

ProductSize.propTypes = {
    product: PropTypes.object,
    productSizes: PropTypes.array,
    readonly: PropTypes.bool
}

const mapStateToProps = state => {
    const {productSizes, loading, meta, refresh} = state.ProductSize
    return {productSizes, loading, meta, refresh}
}

const mapDispatchToProps = dispatch => ({
    onUpdateProductSizeList: (id, data, history) => dispatch(updateProductSizeList(id, data, history))
})

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(ProductSize)

