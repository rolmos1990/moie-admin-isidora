import React, {useEffect, useState} from "react";
import {Col, Collapse, Container, Label, Media, Row} from "reactstrap";
import Breadcrumb from "../../components/Common/Breadcrumb";
import {Link, withRouter} from "react-router-dom";
import {connect} from "react-redux";
import PropTypes from "prop-types";
import {getProduct, registerProduct, updateProduct} from "../../store/product/actions";
import {getFieldOptionByGroups, registerFieldOption} from "../../store/fieldOptions/actions";
import {deleteProductImage, resetProductImages} from "../../store/productImages/actions";
import {resetProductSize} from "../../store/productSize/actions";
import {AvForm} from "availity-reactstrap-validation";
import {FieldNumber, FieldSelect, FieldSwitch, FieldText} from '../../components/Fields';
import {Card} from "@material-ui/core";
import {getCategories} from "../../store/category/actions";
import {getSizes} from "../../store/sizes/actions";
import {arrayToOptions, arrayToOptionsDescription} from "../../common/converters";
import {GROUPS, STATUS} from "../../common/constants";
import ProductSize from "./ProductSize";
import ProductImage from "./ProductImage";
import ProductPublish from "./ProductPublish";
import ButtonSubmit from "../../components/Common/ButtonSubmit";
import Autocomplete from "../../components/Fields/Autocomplete";
import {PERMISSIONS} from "../../helpers/security_rol";
import NoAccess from "../../components/Common/NoAccess";
import HasPermissions from "../../components/HasPermissions";
import {getTemplatesCatalog} from "../../store/template/actions";
import Images from "../../components/Common/Image";
import {HtmlTooltip} from "../../components/Common/HtmlTooltip";

const ProductEdit = (props) => {

    const [isOpen, setIsOpen] = useState(true);
    const toggle = () => setIsOpen(!isOpen);

    const [isOpenDropImages, setIsOpenDropImages] = useState(false);
    const toggleDropImages = () => setIsOpenDropImages(!isOpenDropImages);

    const [isOpenWebConfig, setIsOpenWebConfig] = useState(false);
    const toggleWebConfig = () => setIsOpenWebConfig(!isOpenWebConfig);

    const [isOpenInventary, setIsOpenInventary] = useState(false);
    const toggleInventary = () => setIsOpenInventary(!isOpenInventary);


    const {
        product, categories, sizes, fieldOptions, refreshProduct,
        onGetProduct, onCreateProduct, onUpdateProduct,
        onGetCategories, onGetSizes, onResetProductSize, onResetProductImages,
        onGetFieldOptions, onCreateFieldOption, refreshFieldOptions, onDeleteProductImage,
        templatesCatalog, onGetTemplateCatalogs
    } = props;

    const [productData, setProductData] = useState({_status: STATUS.ACTIVE, sizeModelList: []});

    const [categoriesList, setCategoriesList] = useState([]);
    const [categoryDefault, setCategoryDefault] = useState({});
    const [templateCatalogList, setTemplateCatalogList] = useState([]);
    const [templateCatalogDefault, setTemplateCatalogDefault] = useState({});

    const [materialsList, setMaterialsList] = useState([]);
    const [providerList, setProviderList] = useState([]);
    const [referenceList, setReferenceList] = useState([]);
    const [materialDefault, setMaterialDefault] = useState({});
    const [publication, setPublication] = useState({_status: "true"});

    const [sizesList, setSizesList] = useState([]);
    const [sizeDefault, setSizeDefault] = useState({});
    const [sizeSelected, setSizeSelected] = useState(null);

    const isEdit = props.match.params.id;
    const hasOrders = false;

    //Carga inicial
    useEffect(() => {
        if (isEdit && onGetProduct) {
            onGetProduct(props.match.params.id);
        }
        onGetCategories();
        onGetSizes();
        onGetFieldOptions();
        onGetTemplateCatalogs();

    }, [onGetProduct]);

    useEffect(() => {
        if (product.id) {
            onGetProduct(product.id);
        }
        onResetProductSize();
        onResetProductImages();
    }, [refreshProduct]);

    //cargar info relacionada al prod
    useEffect(() => {
        if (product.id) {
            setProductData({...product, _status: product.status});
            setCategoryDefault(product.category?.id || null);
            setTemplateCatalogDefault(product.template || null);
            setSizeDefault(product.size?.id || null);
            if (!isEdit) {
                if (product.productSize.length === 0) {
                    setIsOpen(false)
                    setIsOpenInventary(true);
                } else if (product.productImage.length === 0) {
                    setIsOpen(false)
                    setIsOpenInventary(false);
                    setIsOpenDropImages(true);
                }
            }
        }
    }, [product]);

    useEffect(() => {
        if (categories && categories.length > 0) {
            setCategoriesList(arrayToOptions(categories));
        } else {
            setCategoriesList([]);
        }
    }, [categories])

    useEffect(() => {
        if (templatesCatalog && templatesCatalog.length > 0) {
            console.log('data: ', templatesCatalog);
            setTemplateCatalogList(arrayToOptionsDescription(templatesCatalog));
        } else {
            setTemplateCatalogList([]);
        }
    }, [templatesCatalog])

    useEffect(() => {
        if (sizes && sizes.length > 0) {
            const sizeList = arrayToOptions(sizes);
            if (product.size && product.size.id) {
                const defaultSize = sizeList.filter(m => m.value === product.size.id)[0];
                setSizeDefault(defaultSize.value);
            }
            setSizesList(sizeList);
        } else {
            setSizesList([]);
        }
    }, [sizes])

    useEffect(() => {
        if (fieldOptions && fieldOptions.length > 0) {
            setMaterialsList(filterFieldOptions(fieldOptions, GROUPS.MATERIALS).map(op => {
                const key = op.name ? op.name : '';
                return {label: key, value: key};
            }));
            setProviderList(filterFieldOptions(fieldOptions, GROUPS.PROVIDERS));
            setReferenceList(filterFieldOptions(fieldOptions, GROUPS.REFERENCE_KEY).map(op => {
                const key = op.name ? op.name : '';
                return {label: key, value: key};
            }));
        } else {
            setMaterialsList([]);
            setProviderList([]);
            setReferenceList([]);
        }
    }, [fieldOptions])

    useEffect(() => {
        if (refreshFieldOptions) {
            onGetFieldOptions();
        }
    }, [refreshFieldOptions])

    const filterFieldOptions = (arr, groups) => {
        return arr.filter(op => (op.groups === groups)).map(op => ({name: op.name}));
    }

    const handleValidSubmit = (event, values) => {
        const data = {
            ...values,
            material: values.material && values.material.value,
            category: values.category.value,
            size: values.size.value,
            status: values._status,
            weight: values.weight ? Number.parseFloat(values.weight) : 0,
            price: Number.parseFloat(values.price),
            providerReference: values.providerReference,
            cost: Number.parseFloat(values.cost),
            template: values.template.value || 1
        };

        delete data._status;

        if (values.referenceKey && values.referenceKey.value) {
            data.referenceKey = values.referenceKey.value;
        }

        if (!isEdit) {
            data.status = 1;
            onCreateProduct(data, props.history)
        } else {
            onUpdateProduct(props.match.params.id, data, props.history)
        }

        //if (!materialsList.some(op => op.name === data.material)) {
            //onCreateFieldOption({groups: GROUPS.MATERIALS, name: data.material, value: data.material}, props.history);
        //}

        if (!providerList.some(op => op.name === data.provider)) {
            onCreateFieldOption({groups: GROUPS.PROVIDERS, name: data.provider, value: data.provider}, props.history);
        }
    }

    const handleDeleteProductImage = (product, number) => {
        onDeleteProductImage(product, number)
    }

    return (
        <React.Fragment>
            <div className="page-content">
                <Container fluid>
                    <Breadcrumb hasBack path="/products" title={productData.reference} item={"Producto"}/>
                    <HasPermissions permissions={[PERMISSIONS.PRODUCT_CREATE, PERMISSIONS.PRODUCT_EDIT]} renderNoAccess={() => <NoAccess/>}>
                        <Row>
                            <Col md={12}>
                                <Card id={'main-data'}>
                                    <Link to="#" onClick={toggle} className="text-dark">
                                        <div className="p-4">
                                            <Media className="d-flex align-items-center">
                                                <div className="me-3">
                                                    <div className="avatar-xs">
                                                        <div className="avatar-title rounded-circle bg-soft-primary text-primary">
                                                            01
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="flex-1 overflow-hidden">
                                                    <Row>
                                                        <Col md={8}>
                                                            <h5 className="font-size-16 mb-1">General</h5>
                                                            <p className="text-muted text-truncate mb-0">Datos principales del producto</p>
                                                        </Col>
                                                        {isEdit && (
                                                            <Col md={4}>
                                                                <div className="text-right pr-10">
                                                                    <h5 className="font-size-16 mb-1">Código</h5>
                                                                    <b className="font-size-18 text-info">{productData.reference}</b>
                                                                </div>
                                                            </Col>
                                                        )}
                                                    </Row>
                                                </div>
                                                <i className="mdi mdi-chevron-up accor-down-icon font-size-24"> </i>
                                            </Media>
                                        </div>
                                    </Link>
                                    <Collapse isOpen={isOpen}>
                                        <AvForm className="needs-validation" autoComplete="off"
                                                onValidSubmit={(e, v) => {
                                                    handleValidSubmit(e, v)
                                                }}>
                                            <div className="p-4 border-top">
                                                <Row>
                                                    {!(product && product.id) && (
                                                        <Col md={2}>
                                                            <div className="mb-3">
                                                                <Label htmlFor="field_referenceKey">Ref. <span className="text-danger">*</span></Label>
                                                                <FieldSelect
                                                                    id={"field_referenceKey"}
                                                                    name={"referenceKey"}
                                                                    options={referenceList}
                                                                    defaultValue={productData.referenceKey}
                                                                    required
                                                                    isSearchable
                                                                />
                                                            </div>
                                                        </Col>
                                                    )}
                                                    <Col md={10}>
                                                        <div className="mb-3">
                                                            <Label htmlFor="field_name">Descripción <span className="text-danger">*</span></Label>
                                                            <FieldText
                                                                id={"field_name"}
                                                                name={"name"}
                                                                value={productData.name}
                                                                minLength={3}
                                                                maxLength={255}
                                                                required/>
                                                        </div>
                                                    </Col>
                                                    {(product && product.id) && (
                                                        <Col md={2}>
                                                            <div className={"mt-1 mb-5"} style={{position: "relative"}}>
                                                                <div className={"float-end"}>
                                                                    <Row>
                                                                        <Col>
                                                                            ¿Activo?
                                                                        </Col>
                                                                        <Col>
                                                                            <FieldSwitch defaultValue={productData._status} name={"_status"}/>
                                                                        </Col>
                                                                    </Row>
                                                                </div>
                                                            </div>
                                                        </Col>
                                                    )}
                                                </Row>
                                                <Row>
                                                    <Col md="12">
                                                        <div className="mb-3">
                                                            <Label className="control-label">Categoria <span className="text-danger">*</span></Label>
                                                            <FieldSelect
                                                                id={"field_category"}
                                                                name={"category"}
                                                                options={categoriesList}
                                                                defaultValue={categoryDefault}
                                                                required
                                                                disabled={hasOrders}
                                                                isSearchable
                                                            />
                                                        </div>
                                                    </Col>
                                                    <Col md="4">
                                                        <div className="mb-0">
                                                            <Label className="control-label">Tallas</Label>
                                                            <FieldSelect
                                                                id={"field_sizes"}
                                                                name={"size"}
                                                                options={sizesList}
                                                                defaultValue={sizeDefault}
                                                                onChange={(e) => {
                                                                    if(sizes) {
                                                                        setSizeSelected(sizes.find(s => s.id === e.value));
                                                                    }
                                                                }}
                                                                required
                                                                disabled={hasOrders || product.id}
                                                                isSearchable
                                                            />
                                                        </div>
                                                    </Col>
                                                    {((sizeSelected && sizeSelected.name == "Unica") || (!sizeSelected && sizeDefault == 9)) && (
                                                        <Col md="3">
                                                            <div className="mb-0">
                                                                <Label className="control-label">Sirve para</Label>
                                                                <FieldText
                                                                    id={"size_descripcion"}
                                                                    name={"sizeDescription"}
                                                                    value={productData.sizeDescription}
                                                                    minLength={1}
                                                                    maxLength={30}
                                                                />
                                                            </div>
                                                        </Col>
                                                    )}
                                                    <Col md="5">
                                                        <div className="mb-3">
                                                            <Label className="control-label">Material</Label>
                                                            <FieldSelect
                                                                id={"field_material"}
                                                                name={"material"}
                                                                options={materialsList}
                                                                defaultValue={productData.material}
                                                                isSearchable
                                                            />
                                                        </div>
                                                    </Col>
                                                </Row>
                                                <Row>
                                                    <Col md="6">
                                                        <div className="mb-3">
                                                            <Label htmlFor="field_provider">Proveedor</Label>
                                                            <Autocomplete
                                                                id={"field_provider"}
                                                                name={"provider"}
                                                                options={providerList}
                                                                defaultValue={productData.provider}
                                                                onChange={(provider) => setProductData({...productData, provider: provider})}
                                                            />
                                                        </div>
                                                    </Col>

                                                    <Col md="6">
                                                        <div className="mb-3">
                                                            <Label htmlFor="field_provider">Referencia Proveedor</Label>
                                                            <FieldText
                                                                id={"field_provider_reference"}
                                                                name={"providerReference"}
                                                                value={productData.providerReference}
                                                                minLength={1}
                                                                maxLength={12}
                                                            />
                                                        </div>
                                                    </Col>

                                                    <Col md="4">
                                                        <div className="mb-3">
                                                            <Label htmlFor="weight">Peso (g) </Label>
                                                            <FieldNumber
                                                                id={"field_weight"}
                                                                name={"weight"}
                                                                value={productData.weight}
                                                            />
                                                        </div>
                                                    </Col>
                                                    <Col md="4">
                                                        <div className="mb-3">
                                                            <Label htmlFor="cost">Costo <span className="text-danger">*</span></Label>
                                                            <FieldNumber
                                                                id={"field_cost"}
                                                                name={"cost"}
                                                                value={productData.cost}
                                                                required/>
                                                        </div>
                                                    </Col>
                                                    <Col md="4">
                                                        <div className="mb-3">
                                                            <Label htmlFor="price">Precio <span className="text-danger">*</span></Label>
                                                            <FieldNumber
                                                                id={"field_price"}
                                                                name={"price"}
                                                                value={productData.price}
                                                                required/>
                                                        </div>
                                                    </Col>
                                                </Row>
                                                <Row>
                                                    <Col md="6">
                                                        <div className="mb-0">
                                                            <Label htmlFor="description">Nombre en el Catálogo</Label>
                                                            <FieldText
                                                                id={"field_description"}
                                                                name={"description"}
                                                                value={productData.description}
                                                                minLength={3}
                                                                maxLength={255}
                                                            />
                                                        </div>
                                                    </Col>
                                                    <Col md="6">
                                                        <div className="mb-3">
                                                            <Label className="control-label">Plantilla
                                                                <span className="text-danger">*</span></Label>
                                                            <FieldSelect
                                                                id={"field_template"}
                                                                name={"template"}
                                                                options={templateCatalogList}
                                                                defaultValue={templateCatalogDefault}
                                                                required
                                                                disabled={hasOrders}
                                                            />
                                                        </div>
                                                    </Col>
                                                </Row>
                                                <Row>
                                                    <Col md="12">
                                                        <div className="text-center m-5">
                                                            <h3>Vista Previa</h3> <br />
                                                            <div style={{backgroundColor: '1px lightgray solid', padding: '10px'}}>
                                                            <Images src={`http://moie2.lucymodas.com/./uploads/catalogs/${productData.reference}.jpg`}
                                                                    alt={productData.reference}
                                                                    height={300}
                                                                    className="img-fluid mx-auto d-block tab-img"/>
                                                            </div>
                                                        </div>
                                                    </Col>
                                                </Row>
                                                <Row className="pt-2">
                                                    <Col md={12} className="text-right">
                                                        <ButtonSubmit loading={props.loading}/>
                                                    </Col>
                                                </Row>
                                            </div>
                                        </AvForm>

                                    </Collapse>
                                </Card>
                            </Col>
                        </Row>
                        <Row>
                            <Col md={12} className="mt-2">
                                <Card id={'inventory'}>
                                    <Link to="#" className="text-dark collapsed" onClick={toggleInventary}>
                                        <div className="p-4">

                                            <Media className="d-flex align-items-center">
                                                <div className="me-3">
                                                    <div className="avatar-xs">
                                                        <div className="avatar-title rounded-circle bg-soft-primary text-primary">
                                                            02
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="flex-1 overflow-hidden">
                                                    <h5 className="font-size-16 mb-1">Inventario</h5>
                                                    <p className="text-muted text-truncate mb-0">Agregue existencia a su producto.</p>
                                                </div>
                                                <i className="mdi mdi-chevron-up accor-down-icon font-size-24"> < /i>
                                            </Media>

                                        </div>
                                    </Link>
                                    <Collapse isOpen={isOpenInventary}>
                                        <div className="p-4 border-top">
                                            {(productData.id && productData.size) ? (
                                                <>
                                                    <h4>{productData.size ? productData.size.name : ''}</h4>
                                                    <p>Ingrese color y tallas para el producto.</p>
                                                    <ProductSize template={productData.size} product={productData}/>
                                                </>
                                            ) : (
                                                <div className="alert alert-warning">Debe agregar una talla al producto.</div>
                                            )}
                                        </div>
                                    </Collapse>
                                </Card>
                            </Col>
                        </Row>
                        <Row>
                            <Col md={12}>
                                <Card id={'images'} className="mt-2 disabled">
                                    <Link to="#" className="text-dark collapsed" onClick={toggleDropImages}>
                                        <div className="p-4">

                                            <Media className="d-flex align-items-center">
                                                <div className="me-3">
                                                    <div className="avatar-xs">
                                                        <div className="avatar-title rounded-circle bg-soft-primary text-primary">
                                                            03
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="flex-1 overflow-hidden">
                                                    <h5 className="font-size-16 mb-1">Imagenes</h5>
                                                    <p className="text-muted text-truncate mb-0">Agrega las imagenes a su producto.</p>
                                                </div>
                                                <i className="mdi mdi-chevron-up accor-down-icon font-size-24"></i>
                                            </Media>

                                        </div>
                                    </Link>
                                    <Collapse isOpen={isOpenDropImages}>
                                        <ProductImage product={product} onDeleteProductImage={handleDeleteProductImage}/>
                                    </Collapse>
                                </Card>
                            </Col>
                        </Row>
                        <Row>
                            <Col md={12}>
                                <Card id={'publication'} className="mt-2">
                                    <Link to="#" className="text-dark collapsed" onClick={toggleWebConfig}>
                                        <div className="p-4">

                                            <Media className="d-flex align-items-center">
                                                <div className="me-3">
                                                    <div className="avatar-xs">
                                                        <div className="avatar-title rounded-circle bg-soft-primary text-primary">
                                                            04
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="flex-1 overflow-hidden">
                                                    <h5 className="font-size-16 mb-1">Publicación</h5>
                                                    <p className="text-muted text-truncate mb-0">Configuraciones para la publicación en la Página Web.</p>
                                                </div>
                                                <i className="mdi mdi-chevron-up accor-down-icon font-size-24"> </i>
                                            </Media>

                                        </div>
                                    </Link>
                                    <Collapse isOpen={isOpenWebConfig}>
                                        {productData.id && (
                                            <ProductPublish product={product}/>
                                        )}
                                    </Collapse>
                                </Card>
                            </Col>
                        </Row>
                    </HasPermissions>
                </Container>
            </div>
        </React.Fragment>
    );
}

const mapStateToProps = state => {
    const {error, product, loading} = state.Product
    const {fieldOptions, refresh} = state.FieldOption
    const refreshProduct = state.ProductSize.refresh || state.ProductImage.refresh || state.Product.refresh;
    const {categories} = state.Category
    const {sizes} = state.Sizes
    const {templatesCatalog} = state.Template;
    return {error, product, categories, sizes, fieldOptions, loading, refreshProduct, refreshFieldOptions: refresh, templatesCatalog}
}

const mapDispatchToProps = dispatch => ({
    onGetCategories: (conditional = null, limit = 100, page) => dispatch(getCategories(conditional, limit, page)),
    onGetSizes: (conditional = null, limit = 100, page) => dispatch(getSizes(conditional, limit, page)),
    onGetFieldOptions: (conditional = null, limit = 500, page) => dispatch(getFieldOptionByGroups([GROUPS.MATERIALS, GROUPS.PROVIDERS, GROUPS.REFERENCE_KEY], limit, page)),
    onGetProduct: (id) => dispatch(getProduct(id)),
    onCreateProduct: (data, history) => dispatch(registerProduct(data, history)),
    onUpdateProduct: (data, history) => dispatch(updateProduct(data, history)),
    onCreateFieldOption: (data, history) => dispatch(registerFieldOption(data, history)),
    onResetProductSize: () => dispatch(resetProductSize()),
    onResetProductImages: () => dispatch(resetProductImages()),
    onDeleteProductImage: (product,number) => dispatch(deleteProductImage(product,number)),
    onGetTemplateCatalogs: () => dispatch(getTemplatesCatalog(null, 500, 0)),
})

export default withRouter(
    connect(mapStateToProps, mapDispatchToProps)(ProductEdit)
)

ProductEdit.propTypes = {
    error: PropTypes.any,
    history: PropTypes.object
}
