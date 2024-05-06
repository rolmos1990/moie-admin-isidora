import React, {useEffect, useState} from "react"
import {CardBody, Col, Container, Label, Row} from "reactstrap"
import {withRouter} from "react-router-dom"
import {connect} from "react-redux";
import PropTypes from "prop-types";
import Breadcrumb from "../../components/Common/Breadcrumb";
import {PERMISSIONS} from "../../helpers/security_rol";
import NoAccess from "../../components/Common/NoAccess";
import HasPermissions from "../../components/HasPermissions";
import {AvForm} from "availity-reactstrap-validation";
import {FieldDate, FieldText} from "../../components/Fields";
import {Card} from "@material-ui/core";
import {DATE_MODES} from "../../components/Fields/InputDate";
import {hiddenPhone} from "../../common/utils";
import ButtonSubmit from "../../components/Common/ButtonSubmit";
import {showMessage} from "../../components/MessageToast/ShowToastMessages";
import {registerVCard} from "../../store/customer/actions";
import {
    deleteallDataApi,
    fileVCardContacts
} from "../../helpers/backend_helper";
import moment from "moment";
import {ConfirmationModalAction} from "../../components/Modal/ConfirmationModal";
import * as url from "../../helpers/url_helper";

const VCard = (props) => {

    const {onGetOrder, refresh, order, onCreateVCard} = props;

    const [list, setList] = useState([]);
    const [text, setText] = useState("");

    useEffect(() => {
        if (props.match.params.id) {
            onGetOrder(props.match.params.id);
        }
    }, [onGetOrder, refresh]);

    const downloadContact = () => fileVCardContacts(moment().format('YYYY-MM-DD') + '.vcf').then(function(){
        setTimeout(function () {

            ConfirmationModalAction({
                title: '¿Pudo descargar correctamente?',
                description: 'Si logro descargar, confirme para borrar los registros ya descargados.',
                id: '_clienteModal',
                onConfirm: deleteHandler
            });

        }, 2000);
    });

    const deleteHandler = () => {
        deleteallDataApi(url.VCARD + '/c/clearVCard').then(resp => {
            console.log('deleted', resp);
        })
    }

    const handleValidSubmit = (event, values) => {

        if(!values.initial || !values.createdAt[0] || list.length <= 0){
            return;
        }

        const payload = {
            initial: values.initial,
            date: values.createdAt[0],
            phones: list
        };

        onCreateVCard(payload);

        setList([]);
        setText("");
    }

    const addNumber = () => {
        const numbers = text.replace(/\s+/g, ' ').split(' ');
        console.log('numbers: ', numbers);

        const duplicated = hasDuplicates(numbers, list);

        if(!duplicated) {
            const numbersRegistered = [...list, ...numbers];
            setList(numbersRegistered);
            setText('');

        } else {
            showMessage.error("Contiene numero duplicados en la lista actual");
        }

    }

    function hasDuplicates(phones1, phones2) {
        const seenNumbers = {};

        // Check duplicates in the first array
        for (let i = 0; i < phones1.length; i++) {
            const number = phones1[i];
            seenNumbers[number] = (seenNumbers[number] || 0) + 1;
        }

        // Check duplicates in the second array
        for (let i = 0; i < phones2.length; i++) {
            const number = phones2[i];

            // If the number is in the object and has not been fully processed, it's a duplicate
            if (seenNumbers[number] && seenNumbers[number] > 0) {
                return true;
            }
        }

        // No duplicates found
        return false;
    }

    const renderPhones = () => {
        if (list && list.length > 0) {
            return list.map(item => (
                <div>
                    <p class="list-group-item"><i className="uil uil-phone"></i> {hiddenPhone(item)}</p>
                </div>
            ))
        }
        return <div></div>;
    }

    function changeText(e){
        console.log('value to change: ', e.target.value);
        setText(e.target.value);
    }

    return (
        <React.Fragment>
            <div className="page-content">

                <Container fluid>
                    <Breadcrumb hasBack={false} path="/" title={order.name} item={`VCard`}/>
                    <HasPermissions permissions={[PERMISSIONS.VCARD_EXPORT]} renderNoAccess={() => <></>}>
                    <div className="mb-3">
                        <button onClick={downloadContact} className="btn btn-primary"><i className="uil uil-file-export"></i> Descargar</button>
                    </div>
                    </HasPermissions>
                    <HasPermissions permissions={[PERMISSIONS.VCARD_MANAGE]} renderNoAccess={() => <NoAccess/>}>
                        <Row className="mb-2">
                                    <AvForm className="needs-validation" autoComplete="off" onValidSubmit={(e, v) => handleValidSubmit(e, v)}>

                                        <Card>
                                            <CardBody>
                                                <Row>
                                                    <Col md={6}>
                                                        <div className="mb-3">
                                                            <Label htmlFor="resolutionDate">Numeros de Teléfonos</Label>
                                                            <FieldText
                                                                value={text}
                                                                rows={10}
                                                                type="textarea"
                                                                id='numbers'
                                                                name={"numbers"}
                                                                minLength={1}
                                                                onChange={changeText}
                                                                />
                                                        </div>
                                                    </Col>
                                                    <Col md={12}>
                                                        <button onClick={addNumber} type="button" color="primary" className=" btn-sm btn btn-outline-info waves-effect waves-light">
                                                            Agregar <i className={`uil-plus me-2`}> </i>
                                                        </button>
                                                    </Col>
                                                </Row>
                                                <Row className="mt-3">
                                                    <Col md={6}>
                                                        <div className="mb-3">
                                                            <Label htmlFor="resolutionDate">Lista de Teléfonos</Label>
                                                            {renderPhones()}
                                                        </div>
                                                    </Col>
                                                </Row>
                                            </CardBody>
                                        </Card>
                                        <hr />


                                        <Card>
                                        <CardBody>
                                            <Row>
                                            <Col md={6}>
                                                <div className="mb-3">
                                                    <Label htmlFor="createdAt">Fecha de Creación</Label>
                                                <FieldDate
                                                    name={"createdAt"}
                                                    mode={DATE_MODES.SINGLE}
                                                />
                                                </div>
                                            </Col>
                                            <Col md={6}>
                                                <div className="mb-3">
                                                    <Label htmlFor="initial">Inicio</Label>
                                                    <FieldText
                                                        id='initial'
                                                        name={"initial"}
                                                        minLength={1}
                                                        maxLength={1000000}
                                                        required/>
                                                </div>
                                            </Col>
                                            </Row>
                                            <Row><br />
                                                <Col md={12} className="text-right">
                                                    <ButtonSubmit disabled={list.length <= 0} name="Registrar" loading={props.loading}/>
                                                </Col>
                                            </Row>
                                        </CardBody>
                                        </Card>

                                    </AvForm>

                        </Row>
                    </HasPermissions>
                </Container>
            </div>
        </React.Fragment>);
}

const mapStateToProps = state => {
    const {error, order, refresh, loading} = state.Order;
    return {error, order, refresh, loading}
}

const mapDispatchToProps = dispatch => ({
    onCreateVCard: (payload) => dispatch(registerVCard(payload))
})

export default withRouter(
    connect(mapStateToProps, mapDispatchToProps)(VCard)
)

VCard.propTypes = {
    error: PropTypes.any,
    history: PropTypes.object
}
