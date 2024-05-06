import React, {useEffect, useState} from "react"
import {CardBody, Col, Container, Label, Row} from "reactstrap"
import {AvForm} from "availity-reactstrap-validation"
import {Card} from "@material-ui/core";
import {withRouter} from "react-router-dom"
import {connect} from "react-redux";
import {apiError} from "../../store/auth/login/actions";
import PropTypes from "prop-types";
import {getUser, registerUser, updateUser} from "../../store/user/actions";
import {FieldSelect, FieldSwitch, FieldText} from "../../components/Fields";
import Breadcrumb from "../../components/Common/Breadcrumb";
import {STATUS} from "../../common/constants";
import ButtonSubmit from "../../components/Common/ButtonSubmit";
import {fetchDataApi} from "../../helpers/backend_helper";
import * as url from "../../helpers/url_helper";
import {sortList} from "../../common/utils";
import {PERMISSIONS} from "../../helpers/security_rol";
import NoAccess from "../../components/Common/NoAccess";
import HasPermissions from "../../components/HasPermissions";

const UserEdit = (props) => {
    const {registerUser, updateUser, getUser, user} = props;
    const [userData, setUserData] = useState({_status: STATUS.ACTIVE});
    const [rolesOptions, setRolesOptions] = useState([]);
    const [roles, setRoles] = useState([]);//group
    const isEdit = props.match.params.id;

    //carga inicial
    useEffect(() => {
        getRoles();
        if (isEdit && getUser) {
            getUser(props.match.params.id);
        }
    }, [getUser]);

    useEffect(() => {
        if (user.id && isEdit) {
            let rol = null;
            if (user.securityRol) {
                rol = {label: user.securityRol.name, value: user.securityRol.id}
            }
            setUserData({...user, _status: user.status, rol});
        }
    }, [user]);

    const getRoles = () => {
        fetchDataApi(url.SECURITY_ROLES).then(resp => {
            let list = sortList(resp.data, 'name');
            setRoles(list);
            setRolesOptions(list.map(p => ({label: p.name, value: p.id})));
        })
    };

    const handleValidSubmit = (event, values) => {
        const data = {...values, status: values._status};
        if (data.rol) {
            data.securityRol = {id: data.rol.value};
        }
        delete data.rol;
        delete data._status;
        if (!isEdit) {
            registerUser(data, props.history)
        } else {
            updateUser(props.match.params.id, data, props.history)
        }
    }
    return (
        <React.Fragment>
            <div className="page-content">
                <Container fluid>
                    <Breadcrumb hasBack path="/users" title={userData.name} item={"Usuario"}/>
                    <HasPermissions permissions={[PERMISSIONS.USER_EDIT, PERMISSIONS.USER_CREATE]} renderNoAccess={() => <NoAccess/>}>
                        <AvForm className="needs-validation" autoComplete="off" onValidSubmit={(e, v) => handleValidSubmit(e, v)}>
                            <Row className="mb-5">
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
                                                            <FieldSwitch defaultValue={userData._status} name={"_status"}/>
                                                        </Col>
                                                    </Row>
                                                </div>
                                            </div>
                                            <Row>
                                                <Col md="6">
                                                    <div className="mb-3">
                                                        <Label htmlFor="name">Nombre <span className="text-danger">*</span></Label>
                                                        <FieldText
                                                            id={"name"}
                                                            name={"name"}
                                                            value={userData.name}
                                                            minLength={1}
                                                            maxLength={255}
                                                            required
                                                        />
                                                    </div>
                                                </Col>
                                                <Col md="6">
                                                    <div className="mb-3">
                                                        <Label htmlFor="lastname">Apellido <span className="text-danger">*</span></Label>
                                                        <FieldText
                                                            id={"lastname"}
                                                            name={"lastname"}
                                                            value={userData.lastname}
                                                            minLength={1}
                                                            maxLength={255}
                                                            required
                                                        />
                                                    </div>
                                                </Col>
                                            </Row>
                                            <Row>
                                                <Col md="6">
                                                    <div className="mb-3">
                                                        <Label htmlFor="email">Correo</Label>
                                                        <FieldText
                                                            id={"email"}
                                                            name={"email"}
                                                            value={userData.email}
                                                            maxLength={300}
                                                        />
                                                    </div>
                                                </Col>
                                                <Col md="6">
                                                    <div className="mb-3">
                                                        <Label htmlFor="lastname">Usuario <span className="text-danger">*</span></Label>
                                                        <FieldText
                                                            id={"username"}
                                                            name={"username"}
                                                            value={userData.username}
                                                            minLength={1}
                                                            maxLength={45}
                                                            required
                                                        />
                                                    </div>
                                                </Col>
                                            </Row>
                                            <Row>
                                                <Col md="6">
                                                    <div className="mb-3">
                                                        <Label htmlFor="rol">Rol <span className="text-danger">*</span></Label>
                                                        <FieldSelect
                                                            id={"rol"}
                                                            name={"rol"}
                                                            options={rolesOptions}
                                                            defaultValue={userData.rol && userData.rol.value}
                                                            isSearchable
                                                        />
                                                    </div>
                                                </Col>
                                                {!userData.id && (
                                                    <Col md="6">
                                                        <div className="mb-3">
                                                            <Label htmlFor="password">Clave</Label>
                                                            <FieldText
                                                                id={"password"}
                                                                name={"password"}
                                                                type="password"
                                                                value={userData.password}
                                                                maxLength={50}
                                                            />
                                                        </div>
                                                    </Col>
                                                )}
                                            </Row>
                                            <Row>
                                                <Col md="12">
                                                    <div className="mb-3">
                                                        <Label htmlFor="lastname">Whatsapps <span className="text-danger">*</span></Label>
                                                        <FieldText
                                                            id={"whatsapps"}
                                                            name={"whatsapps"}
                                                            value={userData.whatsapps}
                                                            minLength={5}
                                                            maxLength={500}
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
    const {error, user, loading} = state.User
    return {error, user, loading}
}

export default withRouter(
    connect(mapStateToProps, {apiError, registerUser, updateUser, getUser})(UserEdit)
)

UserEdit.propTypes = {
    error: PropTypes.any,
    history: PropTypes.object
}

