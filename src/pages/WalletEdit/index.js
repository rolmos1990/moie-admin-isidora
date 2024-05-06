import React, {useEffect, useState} from "react"
import {CardBody, Col, Container, Label, Row} from "reactstrap"
import {AvForm} from "availity-reactstrap-validation"
import {Button, Card, Tooltip} from "@material-ui/core";
import {withRouter} from "react-router-dom"
import {connect} from "react-redux";
import {apiError} from "../../store/auth/login/actions";
import PropTypes from "prop-types";
import {addAttachmentWallet, getWallet, registersWallet, updateWallet} from "../../store/wallet/actions";
import {FieldDate, FieldDecimalNumber, FieldSelect, FieldText} from "../../components/Fields";
import Breadcrumb from "../../components/Common/Breadcrumb";
import {STATUS} from "../../common/constants";
import ButtonSubmit from "../../components/Common/ButtonSubmit";
import {PERMISSIONS} from "../../helpers/security_rol";
import NoAccess from "../../components/Common/NoAccess";
import HasPermissions from "../../components/HasPermissions";
import {DATE_MODES} from "../../components/Fields/InputDate";
import {DATE_FORMAT, formatDate, priceFormat} from "../../common/utils";
import HasPermissionsFunc from "../../components/HasPermissionsFunc";
import DropZoneIcon from "../../components/Common/DropZoneIcon";
import Images from "../../components/Common/Image";
import moment from "moment";
import ButtonLoading from "../../components/Common/ButtonLoading";

const WalletEdit = (props) => {
    const {getWallet, wallet, refresh, loading} = props;
    const [walletData, setWalletData] = useState({_status: STATUS.ACTIVE});
    const [walletAttachment, setWalletAttachment] = useState({});
    const isEdit = props.match.params.id;

    //carga inicial
    useEffect(() => {
        if (isEdit && getWallet) {
            getWallet(props.match.params.id);
        }
        setWalletAttachment(false);
    }, [getWallet, refresh]);

    //cargar la información del cliente
    useEffect(() => {
        if (wallet.id && isEdit) {
            setWalletData({...wallet, _status:wallet.status});
        }
    }, [wallet]);

    const handleValidSubmit = (event, values) => {
        if(canEdit) {
            const data = Object.assign({}, values, {status: values._status});
            delete data._status;

            if(data.type){
                data.amount = (data.type && data.type.value == 1) ? priceFormat(Math.abs(data.amount), "", false) : priceFormat(Math.abs(data.amount) * -1, "", false);
            }

            if (!isEdit) {
                props.registersWallet(data, props.history)
            } else {
                props.updateWallet(props.match.params.id, data, props.history)
            }
        }
    }

    /** Genera el reverso */
    const cancelMovement = () => {

        if(canCancel && walletData) {
            const newMovement = {...walletData};
            newMovement.id = null;
            newMovement.amount = priceFormat(parseFloat(walletData.amount) * -1, '', false);
            newMovement.description = 'REVERSO MOV '+walletData.id+' - ' + walletData.description;
            newMovement.canceled = 1;

            props.registersWallet(newMovement);

            const data = Object.assign({}, walletData, {status: walletData._status});
            data.amount = priceFormat(parseFloat(data.amount), '', false);
            data.canceled = 1;
            props.updateWallet(props.match.params.id, data, props.history);

        }
    }

    const handleAcceptedFiles = (files) => {
        if(canAttach) {
            const payload = {
                description: 'test',
                file: files.base64,
                filename: files.f.name
            };
            setWalletAttachment(payload);
        }
    }

    const handleConfirmFiles = (event, values) => {
        if(!loading && canAttach) {
            walletAttachment.description = values.description;
            props.addAttachmentWallet(wallet.id, walletAttachment);
        }
    }

    const handleCancelFiles = () => {
        if(canAttach) {
            setWalletAttachment(false);
        }
    }

    const addDays = moment(walletData.date, "YYYY-MM-DD").add(4, 'days');
    const isNotExpired = moment().isSameOrBefore(addDays);

    const canEdit = ((HasPermissionsFunc([PERMISSIONS.WALLET_EDIT])) && isEdit && isNotExpired || !isEdit) && !walletData.canceled;
    const canCancel = ((HasPermissionsFunc([PERMISSIONS.WALLET_EDIT])) && (isEdit || !isEdit)) && !walletData.canceled;
    const canAttach = ((HasPermissionsFunc([PERMISSIONS.WALLET_EDIT])) && isEdit) && !walletData.canceled;

    //only show mode
    const renderShowMode = <HasPermissions permissions={[PERMISSIONS.WALLET_CREATE, PERMISSIONS.WALLET_EDIT]} renderNoAccess={() => <NoAccess/>}>
        <AvForm className="needs-validation" autoComplete="off"
                onValidSubmit={(e, v) => {}}>
            <Row>
                <Col xl="8">
                    <Card>
                        <CardBody>
                            <Row>
                                <Col md="6">
                                    <div className="mb-3">
                                        <Label htmlFor="field_type">Tipo <span className="text-danger">*</span></Label>
                                        <FieldSelect
                                            disabled={!canEdit}
                                            id={"field_type"}
                                            name={"type"}
                                            options={[
                                                {value: 1, label: 'INGRESO'},
                                                {value: 2, label: 'EGRESO'}
                                            ]}
                                            defaultValue={walletData.amount < 0 ? 2 : 1}
                                            required
                                        />
                                    </div>
                                </Col>
                                <Col md="6">
                                    <div className="mb-3">
                                        <Label htmlFor="field_date">Fecha <span className="text-danger">*</span></Label>
                                        <FieldText
                                            disabled
                                            id={"field_date"}
                                            name={"date"}
                                            value={formatDate(walletData.date, DATE_FORMAT.ONLY_DATE)}
                                        />
                                    </div>
                                </Col>
                            </Row>
                            <Row>
                                <Col md="6">
                                    <div className="mb-3">
                                        <Label htmlFor="field_amount">Monto <span className="text-danger">*</span></Label>
                                        <FieldText
                                            disabled
                                            id={"field_amount"}
                                            name={"amount"}
                                            value={walletData.amount ? walletData.amount.toFixed(2) : "0.00"}
                                        />
                                    </div>
                                </Col>
                                <Col md="6">
                                    <div className="mb-3">
                                        <Label htmlFor="field_name">Descripción <span className="text-danger">*</span></Label>
                                        <FieldText
                                            disabled
                                            id={"field_description"}
                                            name={"description"}
                                            value={walletData.description}
                                        />
                                    </div>
                                </Col>
                            </Row>
                            <Row>
                                <Col md="12">
                                    <div className="mb-3">
                                        <Label htmlFor="field_comment">Comentario <span className="text-danger"></span></Label>
                                        <FieldText
                                            disabled
                                            id={"field_comment"}
                                            name={"comment"}
                                            type={"textarea"}
                                            value={walletData.comment}
                                            minLength={0}
                                            maxLength={255}
                                        />
                                    </div>
                                </Col>
                            </Row>
                        </CardBody>
                    </Card>
                </Col>
            </Row>
        </AvForm>
    </HasPermissions>;

    const renderAttachments = walletData.attachments && walletData.attachments.length > 0 && walletData.attachments.map(item => (
                    <Col md={4} className="image-left-panel" style={{minHeight: '225px'}}>
                        <div className={`nav flex-column nav-pills`} id="v-pills-tab" role="tablist" aria-orientation="vertical">
                            <a href={item.fileUrl} target={"_blank"}>
                            <div className={`cursor-pointer nav-link`}>
                                <Images src={item.fileUrl}
                                alt={item.fileUrl}
                                className="img-fluid mx-auto d-block tab-img rounded"/>
                                <div className="text-center"><p>{item.description}</p>
                                </div>
                            </div>
                            </a>
                        </div>
                    </Col>
                    ))

    const addAttachment = <DropZoneIcon
        maxFiles={1}
        mode="icon"
        onDrop={(files) => {
            handleAcceptedFiles(files);
        }}
    />

    //bloque de adjuntos
    const renderAddAttachment = <Row>
            <Col xl="8">
                <Card>
                    {canAttach && (
                        <div>
                            <div style={{padding: "40px"}}>
                                <h2>Nuevo Adjunto</h2>

                                {walletAttachment && walletAttachment.file ? (
                                    <AvForm className="needs-validation" autoComplete="off"
                                            onValidSubmit={(e, v) => {
                                                handleConfirmFiles(e, v)
                                            }}>
                                        <div className="text-center">
                                            <Images src={walletAttachment.file}
                                                    alt={walletAttachment.file}
                                                    className="img-fluid mx-auto d-block tab-img rounded"/>
                                            <div style={{"margin": "20px"}}>
                                                <FieldText
                                                    id={"field_description_image"}
                                                    name={"description"}
                                                    value={""}
                                                    minLength={2}
                                                    maxLength={30}
                                                    maxWidth="200"
                                                    placeholder={"Description de imagen"}
                                                />
                                            </div>
                                            <>
                                                <Tooltip placement="bottom" title="Aceptar" aria-label="add">
                                                    <ButtonSubmit loading={props.loading}/>
                                                </Tooltip>
                                                <Tooltip placement="bottom" title="Cancelar" aria-label="add">
                                                    <Button color="default" onClick={() => handleCancelFiles()}>
                                                        Cancelar
                                                    </Button>
                                                </Tooltip>
                                            </>
                                        </div>
                                    </AvForm>
                                ) : addAttachment}
                            </div>
                            <hr />
                        </div>
                    )}
                    <div style={{"padding": "20px"}}>
                        <Row>
                            {renderAttachments}
                        </Row>
                    </div>
                </Card>
            </Col>
        </Row>

    //formulario principal
    const renderForm  = (
        <AvForm className="needs-validation" autoComplete="off"
                onValidSubmit={(e, v) => {
                    handleValidSubmit(e, v)
                }}>
            <Row>
                <Col xl="8">
                    <Card>
                        <CardBody>
                            <Row>
                                <Col md="6">
                                    <div className="mb-3">
                                        <Label htmlFor="field_type">Tipo <span className="text-danger">*</span></Label>
                                        <FieldSelect
                                            id={"field_type"}
                                            name={"type"}
                                            options={[
                                                {value: 1, label: 'INGRESO'},
                                                {value: 2, label: 'EGRESO'}
                                            ]}
                                            defaultValue={walletData.amount < 0 ? 2 : 1}
                                            required
                                        />
                                    </div>
                                </Col>
                                <Col md="6">
                                    <div className="mb-3">
                                        <Label htmlFor="field_date">Fecha <span className="text-danger">*</span></Label>
                                        <FieldDate
                                            id={"field_date"}
                                            name={"date"}
                                            mode={DATE_MODES.SINGLE}
                                            defaultValue={walletData.date}
                                            maxDate={formatDate(moment(), DATE_FORMAT.ONLY_DATE)}
                                            minDate={formatDate(moment().subtract(4,'d'), DATE_FORMAT.ONLY_DATE)}
                                        />
                                    </div>
                                </Col>
                            </Row>
                            <Row>
                                <Col md="6">
                                    <div className="mb-3">
                                        <Label htmlFor="field_amount">Monto <span className="text-danger">*</span></Label>
                                        <FieldDecimalNumber
                                            id={"field_amount"}
                                            name={"amount"}
                                            value={walletData.amount ? walletData.amount.toFixed(2) : "0.00"}
                                            required/>
                                    </div>
                                </Col>
                                <Col md="6">
                                    <div className="mb-3">
                                        <Label htmlFor="field_name">Descripción <span className="text-danger">*</span></Label>
                                        <FieldText
                                            id={"field_description"}
                                            name={"description"}
                                            value={walletData.description}
                                            minLength={3}
                                            maxLength={100}
                                            required
                                        />
                                    </div>
                                </Col>
                            </Row>
                            <Row>
                                <Col md="12">
                                    <div className="mb-3">
                                        <Label htmlFor="field_comment">Comentario <span className="text-danger"></span></Label>
                                        <FieldText
                                            id={"field_comment"}
                                            name={"comment"}
                                            type={"textarea"}
                                            value={walletData.comment}
                                            minLength={0}
                                            maxLength={255}
                                        />
                                    </div>
                                </Col>
                            </Row>
                            <Row>
                                <Col md={12} className="text-right">
                                    <ButtonSubmit loading={props.loading}/>
                                </Col>
                            </Row>
                        </CardBody>
                    </Card>
                </Col>
            </Row>
        </AvForm>
    );

    return (
        <React.Fragment>
            <div className="page-content">
                <Container fluid>
                    <Breadcrumb hasBack path="/wallets" title={walletData.name} item={"Billeteras"}/>
                    <HasPermissions permissions={[PERMISSIONS.WALLET_CREATE, PERMISSIONS.WALLET_EDIT, PERMISSIONS.WALLET_SHOW]} renderNoAccess={() => <NoAccess/>}>

                        <div className={"mb-3 float-md-end"}>
                            {canCancel && (
                                <div className="button-items">
                                    <Tooltip placement="bottom" title="Generar Reverso" aria-label="add">
                                        <ButtonLoading loading={props.loading} type="button" color="primary" className="btn-sm btn btn-outline-danger waves-effect waves-light" onClick={() => cancelMovement()}>
                                            <i className={"mdi mdi-delete"}> </i>
                                        </ButtonLoading>
                                    </Tooltip>
                                </div>
                            )}
                        </div>

                        <div>
                        {canEdit ? renderForm : renderShowMode}
                        </div>
                        <hr />
                        {renderAddAttachment}
                    </HasPermissions>
                </Container>
            </div>
        </React.Fragment>
    )
}

const mapWalletToProps = state => {
    const {wallet, error, loading, refresh} = state.Wallet
    return {error, wallet, loading, refresh}
}

export default withRouter(
    connect(mapWalletToProps, {apiError, registersWallet, updateWallet, getWallet, addAttachmentWallet})(WalletEdit)
)

WalletEdit.propTypes = {
    error: PropTypes.any,
    history: PropTypes.object
}

