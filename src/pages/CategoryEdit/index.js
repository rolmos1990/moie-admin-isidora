import React, {useEffect, useState} from "react"
import {CardBody, Col, Container, Label, Row} from "reactstrap"
import {AvForm} from "availity-reactstrap-validation"
import {Card} from "@material-ui/core";
import {withRouter} from "react-router-dom"
import {connect} from "react-redux";
import {apiError} from "../../store/auth/login/actions";
import PropTypes from "prop-types";
import {getCategory, getPiecesUnpublished, registerCategory, updateCategory} from "../../store/category/actions";
import {FieldNumber, FieldSwitch, FieldText} from "../../components/Fields";
import Breadcrumb from "../../components/Common/Breadcrumb";
import {STATUS} from "../../common/constants";
import ButtonSubmit from "../../components/Common/ButtonSubmit";
import HasPermissions from "../../components/HasPermissions";
import {PERMISSIONS} from "../../helpers/security_rol";
import NoAccess from "../../components/Common/NoAccess";
import DropZoneIcon from "../../components/Common/DropZoneIcon";
import Images from "../../components/Common/Image";
import {getBaseCategoryPath} from "../../common/utils";

const CategoryEdit = (props) => {
    const {getCategory, category, pieces} = props;
    const [categoryData, setCategory] = useState({_status: STATUS.ACTIVE});
    const isEdit = !!props.match.params.id;

    const [file, setFile] = useState(null);
    const [fileBanner, setFileBanner] = useState(null);
    const [fileCatalog, setFileCatalog] = useState(null);


    //carga inicial
    useEffect(() => {
        if (isEdit && getCategory) {
            setFile(null);
            setFileBanner(null);
            setFileCatalog(null);
            getCategory(props.match.params.id);
            props.getPiecesUnpublished(props.match.params.id);
        }
    }, [getCategory]);

    //cargar la información del cliente
    useEffect(() => {

        if (category.id && isEdit) {
            //foto portada
            if(!!category.filename){
                const file = {
                    preview: getBaseCategoryPath(category.filename),
                    name: category.id,
                    content: null
                };

                setFile(file);
            }
            //banner
            if(!!category.filenameBanner){
                const fileBanner = {
                    preview: getBaseCategoryPath(category.filenameBanner),
                    name: category.id,
                    content: null
                };

                setFileBanner(fileBanner);
            }
            //banner
            if(!!category.filenameCatalog){
                const fileCatalog = {
                    preview: getBaseCategoryPath(category.filenameCatalog),
                    name: category.id,
                    content: null
                };

                setFileCatalog(fileCatalog);
            }

            setCategory({...category, _status:category.status});

        }
    }, [category]);


    const handleValidSubmit = (event, values) => {
        const data = {...values, status:values._status};

        if(file && file.content){
            data.file = file.content;
        }
        if(fileBanner && fileBanner.content){
            data.fileBanner = fileBanner.content;
        }
        if(fileCatalog && fileCatalog.content){
            data.fileCatalog = fileCatalog.content;
        }

        delete data._status;

        if (!isEdit) {
            props.registerCategory(data, props.history)
        } else {
            props.updateCategory(props.match.params.id, data, props.history)
        }
    }

    function handleAcceptedFiles(_file, _type) {

        const file = {
            preview: _file.base64,
            name: category.id,
            content: _file.base64
        };

        if(_type == "banner"){
            setFileBanner(file);
        }
        else if(_type == "catalog"){
            setFileCatalog(file);
        } else {
            setFile(file);
        }
    }

    return (
        <React.Fragment>
            <div className="page-content">
                <Container fluid>
                    <Breadcrumb hasBack path="/categories" title={categoryData.name} item={"Categoria"}/>
                    <HasPermissions permission={PERMISSIONS.CATEGORY_EDIT} renderNoAccess={() => <NoAccess/>}>
                        <AvForm className="needs-validation" autoComplete="off" onValidSubmit={(e, v) => handleValidSubmit(e, v)}>
                            <Row>
                                <Col xl="8">
                                    <Card>
                                        <CardBody>
                                            <div className={"mt-1 mb-5"} style={{position: "relative"}}>
                                                <div className={"float-end"}>
                                                    <Row>
                                                        <Col>
                                                            ¿Activo?
                                                        </Col>
                                                        <Col>
                                                            <FieldSwitch defaultValue={categoryData._status} name={"_status"}/>
                                                        </Col>
                                                    </Row>
                                                </div>
                                            </div>
                                            <Row>
                                                <Col md="8">
                                                    <div className="mb-3">
                                                        <Label htmlFor="field_name">Nombre <span className="text-danger">*</span></Label>
                                                        <FieldText
                                                            id={"field_name"}
                                                            name={"name"}
                                                            value={categoryData.name}
                                                            minLength={3}
                                                            maxLength={150}
                                                            required
                                                        />
                                                    </div>
                                                </Col>
                                                <Col md="4">
                                                    <div className="mb-3">
                                                        <Label htmlFor="field_discount">Descuento<span className="text-danger">*</span></Label>
                                                        <FieldNumber
                                                            id={"field_discount"}
                                                            name={"discountPercent"}
                                                            value={categoryData.discountPercent}
                                                            required/>
                                                    </div>
                                                </Col>
                                            </Row>
                                            <br />
                                            <hr />
                                            <Col md={12} className="text-center p-2" style={{height: '400px'}}>
                                                <Label htmlFor="field_discount">Foto de Portada</Label>
                                                <DropZoneIcon
                                                    maxFiles={1}
                                                    mode="block"
                                                    hasImage={file && file.preview}
                                                    onDrop={(files) => {
                                                        handleAcceptedFiles(files, 'portada');
                                                    }}>
                                                    <Images className="img-fluid mx-auto d-block tab-img rounded"
                                                            height={370}
                                                            alt={file && file.name}
                                                            src={file && file.preview}
                                                    />
                                                </DropZoneIcon>
                                            </Col>
                                            <br />
                                            <hr />
                                            <Col md={12} className="text-center p-2" style={{height: '400px'}}>
                                                <Label htmlFor="field_discount">Foto de Banner</Label>
                                                <DropZoneIcon
                                                    maxFiles={1}
                                                    mode="block"
                                                    hasImage={fileBanner && fileBanner.preview}
                                                    onDrop={(files) => {
                                                        handleAcceptedFiles(files, 'banner');
                                                    }}>
                                                    <Images className="img-fluid mx-auto d-block tab-img rounded"
                                                            height={370}
                                                            alt={fileBanner && fileBanner.name}
                                                            src={fileBanner && fileBanner.preview}
                                                    />
                                                </DropZoneIcon>
                                            </Col>
                                            <Col md={12} className="text-center p-2" style={{height: '400px'}}>
                                                <Label htmlFor="field_discount">Foto de Catalogo</Label>
                                                <DropZoneIcon
                                                    maxFiles={1}
                                                    mode="block"
                                                    hasImage={fileCatalog && fileCatalog.preview}
                                                    onDrop={(files) => {
                                                        handleAcceptedFiles(files, 'catalog');
                                                    }}>
                                                    <Images className="img-fluid mx-auto d-block tab-img rounded"
                                                            height={370}
                                                            alt={fileCatalog && fileCatalog.name}
                                                            src={fileCatalog && fileCatalog.preview}
                                                    />
                                                </DropZoneIcon>
                                            </Col>
                                            <Row>
                                                <Col md={12} className="text-right">
                                                    <ButtonSubmit loading={props.loading}/>
                                                </Col>
                                            </Row>
                                        </CardBody>
                                    </Card>
                                </Col>
                                <Col xl={"4"}>
                                    <Card>
                                        <CardBody>
                                            <h4>Piezas no publicadas</h4><br />
                                            {pieces && pieces.map(item => <p className="mb-0 badge bg-soft-primary p-2">{item}</p>)}
                                        </CardBody>
                                    </Card>
                                </Col>
                            </Row>
                        </AvForm>
                    </HasPermissions>
                </Container>
            </div>
        </React.Fragment>
    )
}

const mapStateToProps = state => {
    const {error, category, loading, pieces} = state.Category
    return {error, category, loading, pieces}
}

export default withRouter(
    connect(mapStateToProps, {apiError, registerCategory, updateCategory, getCategory, getPiecesUnpublished})(CategoryEdit)
)

CategoryEdit.propTypes = {
    error: PropTypes.any,
    history: PropTypes.object
}

