import React, {useEffect, useState} from "react"
import {CardBody, Col, Label, Row} from "reactstrap"
import {AvForm} from "availity-reactstrap-validation"
import {Card, Tooltip} from "@material-ui/core";
import {withRouter} from "react-router-dom"
import {connect} from "react-redux";
import PropTypes from "prop-types";
import {getDeliveryMethods} from "../../store/order/actions";
import {FieldDate, FieldSelect} from "../../components/Fields";
import ButtonSubmit from "../../components/Common/ButtonSubmit";
import {DATE_MODES} from "../../components/Fields/InputDate";
import DropZoneIcon from "../../components/Common/DropZoneIcon";
import {getEmptyOptions} from "../../common/converters";
import {importFile, importFileReset} from "../../store/office/actions";
import {DATE_FORMAT, formatDate, formatDateToServerEndOfDay} from "../../common/utils";
import {DELIVERY_METHODS} from "../../common/constants";

const PostSaleImportFileForm = ({onCloseModal, deliveryMethods, loading, error, success, getDeliveryMethods, importFileReset, importFile}) => {

    const [deliveryMethodList, setDeliveryMethodList] = useState([]);
    const [deliveryMethod, setDeliveryMethod] = useState({});
    const [file, setFile] = useState(null);

    //carga inicial
    useEffect(() => {
        if (importFileReset) importFileReset();
        if (onGetDeliveryMethods) onGetDeliveryMethods();
    }, [importFileReset]);


    useEffect(() => {
        if (deliveryMethods && deliveryMethods.length > 0) {
            setDeliveryMethod(deliveryMethods.find(op => [DELIVERY_METHODS.INTERRAPIDISIMO, DELIVERY_METHODS.SERVIENTREGA].includes(op.name)).code);
            setDeliveryMethodList([getEmptyOptions(),
                ...deliveryMethods.filter(op => [DELIVERY_METHODS.INTERRAPIDISIMO, DELIVERY_METHODS.PAYU, DELIVERY_METHODS.SERVIENTREGA].includes(op.name)).map(op => ({label: op.name, value: op.code}))]
            );
        }
    }, [deliveryMethods]);

    useEffect(() => {
        if (success && !error) {
            onCloseModal(true);
        }
    }, [success]);

    const handleValidSubmit = (e, values) => {
        const payload = {
            file: file.base64.replace('data:image/xlsx;base64,', ''),
            deliveryMethod: values.deliveryMethod.value,
            deliveryDate: values.deliveryDate[0] ? formatDateToServerEndOfDay(values.deliveryDate[0]) : null
        };
        onImportFile(payload);
    }

    const onGetDeliveryMethods = (conditional = null, limit = 50, page) => getDeliveryMethods(conditional, limit, page);
    const onImportFile = (data) => importFile(data);

    return (
        <React.Fragment>
            <AvForm className="needs-validation" autoComplete="off" onValidSubmit={(e, v) => handleValidSubmit(e, v)}>
                <Card>
                    <CardBody>
                        <Row>
                            <Col md="6">
                                <div className="mb-3">
                                    <Label htmlFor="field_name">Fecha <span className="text-danger">*</span></Label>
                                    <FieldDate
                                        name={"deliveryDate"}
                                        mode={DATE_MODES.SINGLE}
                                    />
                                </div>
                            </Col>
                            <Col md="6">
                                <div className="mb-3">
                                    <Label htmlFor="field_name">Metodo<span className="text-danger">*</span></Label>
                                    <FieldSelect
                                        id={"deliveryMethod"}
                                        name={"deliveryMethod"}
                                        options={deliveryMethodList}
                                        defaultValue={deliveryMethod}
                                        required
                                    />
                                </div>
                            </Col>
                            <Col md="12">
                                <div className="mb-3 text-center">
                                    <Tooltip placement="bottom" title="Importar archivo" aria-label="add">
                                        <div className={"btn"}>
                                            <DropZoneIcon
                                                maxFiles={1}
                                                mode="icon"
                                                iconClass="display-4 mdi mdi-file-excel"
                                                onDrop={(f) => setFile(f)}>
                                            </DropZoneIcon>
                                            {(file && file.f)? (<span>{file.f.name}</span>) : (<span>Seleccione un archivo</span>)}
                                        </div>
                                    </Tooltip>
                                </div>
                            </Col>
                        </Row>

                        <Row>
                            <Col md={12} className="text-center">
                                {!!(!success && error) && (
                                    <div className="alert alert-danger">{error}</div>
                                )}
                            </Col>
                        </Row>

                        <Row>
                            <Col md={12} className="text-right">
                                <ButtonSubmit loading={loading} disabled={loading || !file || !file.f}/>
                            </Col>
                        </Row>
                    </CardBody>
                </Card>
            </AvForm>
        </React.Fragment>
    )
}

const mapStateToProps = state => {
    const {deliveryMethods} = state.Order;
    const {importFile} = state.Office
    return {deliveryMethods: deliveryMethods.data, loading: importFile.loading, error: importFile.error, success: importFile.success}
}

export default withRouter(
    connect(mapStateToProps, {getDeliveryMethods, importFile, importFileReset})(PostSaleImportFileForm)
)

PostSaleImportFileForm.propTypes = {
    error: PropTypes.any,
    onCloseModal: PropTypes.func
}

