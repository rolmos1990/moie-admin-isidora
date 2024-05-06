import React, {useEffect, useState} from "react"
import {CardBody, Col, Container, Label, Row} from "reactstrap"
import {AvForm} from "availity-reactstrap-validation"
import {Card} from "@material-ui/core";
import {withRouter} from "react-router-dom"
import {connect} from "react-redux";
import {apiError} from "../../store/auth/login/actions";
import PropTypes from "prop-types";
import {getMunicipality, getStates, registerMunicipality, updateMunicipality} from "../../store/location/actions";
import {FieldSelect, FieldSwitch, FieldText} from "../../components/Fields";
import Breadcrumb from "../../components/Common/Breadcrumb";
import {STATUS} from "../../common/constants";
import {statesToOptions} from "../../common/converters";
import ButtonSubmit from "../../components/Common/ButtonSubmit";
import {PERMISSIONS} from "../../helpers/security_rol";
import NoAccess from "../../components/Common/NoAccess";
import HasPermissions from "../../components/HasPermissions";

const MunicipalityEdit = (props) => {
    const {getMunicipality, getStates, municipality, states} = props;
    const [municipalityData, setMunicipalityData] = useState({_status: STATUS.ACTIVE});
    const [statesOptions, setStates] = useState([]);
    const [municipalityDefault, setMunicipalityDefault] = useState(null);
    const isEdit = props.match.params.id;

    //carga inicial
    useEffect(() => {
        if (isEdit && getMunicipality) {
            getMunicipality(props.match.params.id);
        }
        getStates();
    }, [getMunicipality]);

    //cargar la información del municipio
    useEffect(() => {
        if (municipality.id && isEdit) {
            setMunicipalityData({...municipality, _status:municipality.status});

            const defaultMunicipality = municipality.state?.id || null;
            setMunicipalityDefault(defaultMunicipality);
        }
    }, [municipality]);

    //cargar estados
    useEffect(() => {
        if (states && states.length > 0) {
            setStates(statesToOptions(states));
        } else {
            setStates([]);
        }
    }, [states]);

    const handleValidSubmit = (event, values) => {
        const data = {...values, status: values._status, state: values.state.value};
        delete data._status;
        if (!isEdit) {
            props.registerMunicipality(data, props.history)
        } else {
            props.updateMunicipality(props.match.params.id, data, props.history)
        }
    }

    return (
        <React.Fragment>
            <div className="page-content">
                <Container fluid>
                    <Breadcrumb hasBack path="/municipalities" title={municipalityData.name} item={"Estado"}/>
                    <HasPermissions permissions={[PERMISSIONS.LOCALITY_CREATE, PERMISSIONS.LOCALITY_EDIT]} renderNoAccess={() => <NoAccess/>}>
                        <AvForm className="needs-validation" autoComplete="off"
                                onValidSubmit={(e, v) => {
                                    handleValidSubmit(e, v)
                                }}>
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
                                                            <FieldSwitch defaultValue={municipalityData._status} name={"_status"}/>
                                                        </Col>
                                                    </Row>
                                                </div>
                                            </div>
                                            <Row>
                                                <Col md="12">
                                                    <div className="mb-3">
                                                        <Label htmlFor="state">Estado <span className="text-danger">*</span></Label>
                                                        <FieldSelect
                                                            name={"state"}
                                                            options={statesOptions}
                                                            defaultValue={municipalityDefault}
                                                            required
                                                            isSearchable
                                                        />
                                                    </div>
                                                </Col>

                                            </Row>
                                            <Row>
                                                <Col md="8">
                                                    <div className="mb-3">
                                                        <Label htmlFor="field_name">Nombre <span className="text-danger">*</span></Label>
                                                        <FieldText
                                                            id={"field_name"}
                                                            name={"name"}
                                                            value={municipalityData.name}
                                                            minLength={3}
                                                            maxLength={255}
                                                            required
                                                        />
                                                    </div>
                                                </Col>
                                                <Col md="4">
                                                    <div className="mb-3">
                                                        <Label htmlFor="field_name">Código DIAN <span className="text-danger">*</span></Label>
                                                        <FieldText
                                                            id={"field_dianCode"}
                                                            name={"dianCode"}
                                                            value={municipalityData.dianCode}
                                                            minLength={3}
                                                            maxLength={10}
                                                            required
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
                    </HasPermissions>
                </Container>
            </div>
        </React.Fragment>
    )
}

const mapStateToProps = state => {
    const {error, municipality, states, loading} = state.Location
    return {error, municipality, states, loading}
}

export default withRouter(
    connect(mapStateToProps, {apiError, getStates, registerMunicipality, updateMunicipality, getMunicipality})(MunicipalityEdit)
)

MunicipalityEdit.propTypes = {
    error: PropTypes.any,
    history: PropTypes.object
}

