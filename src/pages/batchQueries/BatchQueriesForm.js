import React, {useEffect, useState} from "react"
import {AvForm} from "availity-reactstrap-validation";
import {Card, Tooltip} from "@material-ui/core";
import {CardBody, Col, Label, Row} from "reactstrap";
import {FieldSelect, FieldText} from "../../components/Fields";
import Conditionals from "../../common/conditionals";
import {withRouter} from "react-router-dom";
import {connect} from "react-redux";
import PropTypes from "prop-types";
import {getProducts, resetProduct} from "../../store/product/actions";
import {map} from "lodash";
import {arrayToOptions} from "../../common/converters";
import {getCategories} from "../../store/category/actions";
import {getSizes} from "../../store/sizes/actions";
import {ButtonCopy} from "../../components/Common/ButtonCopy";


const BatchQueriesForm = (props) => {
    const {onGetProducts, products, onResetProduct, loading, categories, sizes, onGetSizes, onGetCategories} = props;
    const [canclear, setCanclear] = useState(true);
    const [productRefs, setProductRefs] = useState([]);
    const [productList, setProductList] = useState([]);
    const [categoriesList, setCategoriesList] = useState([]);
    const [sizesList, setSizesList] = useState([]);
    const [sizeSelected, setSizeSelected] = useState(null);
    const [categorySelected, setCategorySelected] = useState(null);
    const [textToCopy, setTextToCopy] = useState(null);
    const [form, setForm] = useState(null);
    const [defaultValue, setDefaultValue] = useState(null);

    useEffect(() => {
        onGetCategories();
        onGetSizes();
        onResetProduct();
    }, [])

    useEffect(() => {

        //categories
        if (categories && categories.length > 0) {
            const list = [emptyOptions('Todos'), ...arrayToOptions(categories)]
            setCategoriesList(list);
        } else {
            setCategoriesList([emptyOptions('Todos')]);
        }

        //sizes
        if (sizes && sizes.length > 0) {
            const list = [emptyOptions('Todos'), ...arrayToOptions(sizes)]
            setSizesList(list);
        } else {
            setSizesList([emptyOptions('Todos')]);
        }


    }, [categories, sizes])

    useEffect(() => {
        if (products && products.length > 0) {
            const list = products
                .filter((p) => p.productSize.length > 0)
                .map((p) => {
                    return {
                        reference: p.reference,
                        productSize: p.productSize.map((s) => {
                            return {
                                name: s.name,
                                quantity: s.quantity,
                                color: s.color,
                                label: s.quantity > 0 ? s.color : 'AGOTADO',
                            }
                        })
                    }
                });

            let tmpProductList = list;
            if(productList.length > 0) {
                const _productList = productList.concat(list);
                setProductList(_productList);

                tmpProductList = _productList;
            } else {
                setProductList(list);
            }

            const listToCopy = tmpProductList.map(p => {
                const ll = p.productSize.map(s => {
                    return s.quantity > 0 ? `TALLA ${s.name}: ${s.label}` : 'AGOTADO';
                })
                return `${p.reference}\n${ll.join("\n")}\n`
            });
            setTextToCopy(listToCopy.join("\n"));



        } else if(canclear){
            setProductList([]);
            setCanclear(false);
        }
    }, [products])

    const emptyOptions = (label) => {
        return {label: label ? label : '-', value: -1};
    }

    const onSearchRefs = (e) => {

        if (productRefs.length === 0) {
            return;
        }
        const refs = productRefs.split(" ");

        const conditions = new Conditionals.Condition;
        if (productRefs.length > 0) conditions.add("reference", refs.join("::"), Conditionals.OPERATORS.IN);
        onGetProducts(conditions.all(), refs.length);
        form.reset();
    }

    const onSearch = () => {
        const conditions = new Conditionals.Condition;
        if (sizeSelected && sizeSelected.value && sizeSelected.value > 0) {
            conditions.add("size.id", sizeSelected.value, Conditionals.OPERATORS.EQUAL);
        }
        if (categorySelected && categorySelected.value && categorySelected.value > 0) {
            conditions.add("category.id", categorySelected.value, Conditionals.OPERATORS.EQUAL);
        }

        onGetProducts(conditions.all());
    }

    const clearFilters = () => {
        setProductList([]);
        setTextToCopy([]);
        setCategorySelected(null)
        setSizeSelected(null)
        setProductRefs([])
        setDefaultValue(-1)
        if (form) form.reset();
    }


    return (
        <React.Fragment>
            <AvForm className="needs-validation" autoComplete="off" ref={c => setForm(c)}>
                <Card>
                    <CardBody>
                        <Row className="mb-3">
                            <Col xs={6}>
                                <h4 className="text-info"><i className="fa fa-search"></i> Consultas Masivas</h4>
                            </Col>
                            <Col xs={6} className="text-right">
                                <Tooltip placement="bottom" title="Limpiar" aria-label="add">
                                    <button onClick={clearFilters} className="btn btn-xs btn-primary mr-5">
                                        <i className="fa fa-eraser"></i> Limpiar
                                    </button>
                                </Tooltip>
                                <Tooltip placement="bottom" title="Copiar" aria-label="add">
                                    <ButtonCopy text={textToCopy} disabled={productList.length === 0}/>
                                </Tooltip>
                            </Col>
                        </Row>
                        <Row className="mb-3">
                            <Col xs={10}>
                                <Label htmlFor="orders">Productos</Label>
                                <FieldText
                                    id={"products"}
                                    name={"products"}
                                    onKeyPress={e => {
                                        if (e.key === "Enter") {
                                            e.preventDefault();
                                            onSearchRefs(e);
                                        }
                                    }}
                                    onChange={(e) => {
                                        if(e.target.value) {
                                            setProductRefs(e.target.value);
                                        }
                                    }}
                                />
                            </Col>
                            <Col xs={2} style={{display: 'flex', 'alignItems': 'flex-end'}}>
                                <Tooltip placement="bottom" title="Consultar" aria-label="add">
                                    <button type="button" className="btn btn-primary btn-block waves-effect waves-light mt-2 me-1 w-100"
                                            disabled={loading}
                                            onClick={onSearchRefs}>
                                        <i className="mdi mdi-text-box-search-outline"> </i>
                                    </button>
                                </Tooltip>
                            </Col>
                        </Row>
                        <hr/>
                        <Row className="mb-3">
                            <Col xs="5">
                                <Label className="control-label">Categoria <span className="text-danger">*</span></Label>
                                <FieldSelect
                                    id={"field_category"}
                                    name={"category"}
                                    options={categoriesList}
                                    defaultValue={defaultValue}
                                    isClearable={true}
                                    onChange={(e) => {
                                        setCategorySelected(e);
                                    }}
                                    isSearchable
                                />
                            </Col>
                            <Col xs="5">
                                <Label className="control-label">Tallas</Label>
                                <FieldSelect
                                    id={"field_sizes"}
                                    name={"size"}
                                    options={sizesList}
                                    defaultValue={defaultValue}
                                    isClearable={true}
                                    onChange={(e) => {
                                        setSizeSelected(e);
                                    }}
                                    isSearchable
                                />
                            </Col>
                            <Col xs={2} style={{display: 'flex', 'alignItems': 'flex-end'}}>
                                <Tooltip placement="bottom" title="Consultar" aria-label="add">
                                    <button type="button" className="btn btn-primary btn-block waves-effect waves-light mt-2 me-1 w-100"
                                            disabled={loading}
                                            onClick={onSearch}>
                                        <i className="mdi mdi-text-box-search-outline"> </i>
                                    </button>
                                </Tooltip>
                            </Col>
                        </Row>
                        <hr/>
                        <Row>
                            <Col sx={12}>

                                {loading && <div className="text-center"><i className="fa fa-spinner fa-spin"> </i></div>}
                                {map(productList, (prod, k) => (
                                    <div key={k}>
                                        <table className="table table-condensed table-bordered text-center table-striped">
                                            <thead>
                                            <tr style={{background: '#50a5f1', color: '#FFF'}}>
                                                <th colSpan={prod.productSize.length}>{prod.reference}</th>
                                            </tr>
                                            </thead>
                                            <tbody>
                                            <tr>
                                                {map(prod.productSize, (pSize, k2) => (
                                                    <td key={k2}>{pSize.name}</td>
                                                ))}
                                            </tr>
                                            <tr>
                                                {map(prod.productSize, (pSize, k2) => (
                                                    <td key={k2}>{pSize.label}</td>
                                                ))}
                                            </tr>
                                            </tbody>
                                        </table>
                                    </div>
                                ))}
                            </Col>
                        </Row>
                    </CardBody>
                </Card>
            </AvForm>
        </React.Fragment>
    )
}

const mapStateToProps = state => {
    const {products, error, loading} = state.Product
    const {categories} = state.Category
    const {sizes} = state.Sizes
    return {categories, sizes, products, error, loading}
}

const mapDispatchToProps = dispatch => ({
    onResetProduct: () => dispatch(resetProduct()),
    onGetCategories: (conditional = null, limit = 100, page) => dispatch(getCategories(conditional, limit, page)),
    onGetSizes: (conditional = null, limit = 100, page) => dispatch(getSizes(conditional, limit, page)),
    onGetProducts: (conditional = null, limit = 1000, page) => dispatch(getProducts(conditional, limit, page)),
})

export default withRouter(
    connect(mapStateToProps, mapDispatchToProps)(BatchQueriesForm)
)

BatchQueriesForm.propTypes = {
    error: PropTypes.any,
    onCloseModal: PropTypes.func
}
