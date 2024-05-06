import React, {useEffect, useState} from "react"
import PropTypes from 'prop-types'
import {Card, CardBody, Col, Row, Spinner} from "reactstrap"
import {Button} from "@material-ui/core";
import {getProductImage, updateProductImage} from "../../store/productImages/actions";
import {connect} from "react-redux";
import {AvForm} from "availity-reactstrap-validation";
import Images from "../../components/Common/Image";
import DropZoneIcon from "../../components/Common/DropZoneIcon";
import {getImageByQuality} from "../../common/utils";
import ButtonSubmit from "../../components/Common/ButtonSubmit";


const groups = [
    {group: 'Izquierda', groupId: 1},
    {group: 'Centro', groupId: 2},
    {group: 'Derecha', groupId: 3}
];

const ProductImage = props => {
    const {product, onGetProductImage, productImages, refresh} = props
    const [productImageList, setProductImageList] = useState(false);
    const [selectedFiles, setSelectedFiles] = useState([]);
    const [productImageGroups, setProductImageGroups] = useState(groups);
    const form = React.createRef();

    useEffect(() => {
        const files = groups.map(g => ({...g, file: {name: '', preview: ''}}));
        if (product.productImage && product.productImage.length > 0) {
            files.forEach((f, i) => {
                    const imgData = (product.productImage.filter(_pi => _pi.group === f.groupId))[0];
                    if (imgData) {
                        // f.groupId = imgData.group;
                        f.file.preview = `${getImageByQuality(imgData, 'high')}`
                        f.file.name = imgData.filename;
                    }
            })
        }

        setSelectedFiles(files);
    }, [product])

    useEffect(() => {
        if (productImages && productImages.length > 0) {
            setProductImageList(productImages);
        } else {
            setProductImageList([]);
        }
    }, [productImages])

    function handleAcceptedFiles(groupId, file) {
        const filesSelected = [...selectedFiles];
        let group = filesSelected.find(f => f.groupId === groupId);
        group.file = {
            ...file,
            preview: URL.createObjectURL(file.f),
            formattedSize: formatBytes(file.f.size)
        }
        setSelectedFiles(filesSelected);

    }

    function formatBytes(bytes, decimals = 2) {
        if (bytes === 0) return "0 Bytes"
        const k = 1024
        const dm = decimals < 0 ? 0 : decimals
        const sizes = ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"]

        const i = Math.floor(Math.log(bytes) / Math.log(k))
        return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i]
    }

    const handleValidSubmit = (event, values) => {
        const files = selectedFiles.filter(selectedFile => selectedFile.groupId && selectedFile.file.base64).map(f => ({group: f.groupId, file: f.file.base64}));
        if (files.length > 0) {
            props.onUpdateProductImage(product.id, files, props.history);
        }
    }

    const onDeletePhoto = (fileNumber) => {
        if(props.onDeleteProductImage){
            props.onDeleteProductImage(product.id, fileNumber);
        }
    }

    return (
        <React.Fragment>
            <AvForm ref={form} className="needs-validation" autoComplete="off" onValidSubmit={(e, v) => handleValidSubmit(e, v)}>
                <Row className="p-4 border-top">
                    {selectedFiles.map((f, i) => (
                        <Col md={4} key={i + "-file"}>
                            <Card className="mt-1 mb-0 shadow-none border dz-processing dz-image-preview dz-success dz-complete">
                                <div className="p-2">
                                    <Row className="align-items-center" style={{borderBottom: '1px solid #f5f6f8'}}>
                                        <div>
                                            <button className="btn btn-danger m-2" onClick={() => onDeletePhoto(i)}>
                                            <i className="fa fa-trash"></i>
                                            </button>
                                        </div>

                                        <Col md={12} className="text-center p-2" style={{height: '400px'}}>
                                            <DropZoneIcon
                                                maxFiles={1}
                                                mode="block"
                                                hasImage={f.file && f.file.preview}
                                                onDrop={(files) => {
                                                    handleAcceptedFiles(f.groupId, files);
                                                }}>
                                                <Images className="img-fluid mx-auto d-block tab-img rounded"
                                                        height={370}
                                                        alt={f.file?.f?.name}
                                                        src={f.file?.preview}
                                                />
                                            </DropZoneIcon>
                                        </Col>
                                    </Row>
                                    <Row className="p-2">
                                        <Col md={8}>
                                            <>
                                                <div className="text.muted"><strong>Grupo:</strong> {f.groupId}</div>
                                                {(f.file && f.file.f) && (
                                                    <>
                                                        <div className="text.muted">{f.file.f.path}</div>
                                                        <div className="text.muted">{f.file.formattedSize}</div>
                                                    </>
                                                )}
                                            </>
                                        </Col>
                                        <Col md={4} className="text-right">
                                            <DropZoneIcon
                                                maxFiles={1}
                                                mode="icon"
                                                onDrop={(files) => {
                                                    handleAcceptedFiles(f.groupId, files);
                                                }}
                                            />
                                        </Col>
                                    </Row>
                                </div>
                            </Card>
                        </Col>
                    ))}
                </Row>
                <Row className="p-4">
                    <Col md={12} className="text-right">
                        <ButtonSubmit loading={props.loading}/>
                    </Col>
                </Row>
            </AvForm>
        </React.Fragment>
    )
}

ProductImage.propTypes = {
    product: PropTypes.object.isRequired
}

const mapStateToProps = state => {
    const {productImages, loading, meta, refresh} = state.ProductImage
    return {productImages, loading, meta, refresh}
}

const mapDispatchToProps = dispatch => ({
    onGetProductImage: (productId) => {
        if (productId) dispatch(getProductImage(productId, null, 0));
    },
    onUpdateProductImage: (id, data, history) => dispatch(updateProductImage(id, data, history))
})

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(ProductImage)

