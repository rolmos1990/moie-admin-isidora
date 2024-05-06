import React, {useEffect, useState} from "react"
import {connect} from "react-redux"
import {Card, CardBody, Col, Label, Row} from "reactstrap"
import {map} from "lodash";
import {AvForm} from "availity-reactstrap-validation";
import {deleteDataApi, fetchDataApi, postApi, registerDataApi, updateDataApi} from "../../helpers/backend_helper";
import * as url from "../../helpers/url_helper";
import {FieldSelect, FieldText} from "../../components/Fields";
import PropTypes from "prop-types";
import {sortList} from "../../common/utils";

const SecurityRoles = ({reloadPermissions}) => {

    const [permissions, setPermissions] = useState([]);//list
    const [permissionsOptions, setPermissionsOptions] = useState([]);
    const [permissionsOptionSelected, setPermissionsOptionSelected] = useState({});
    const [roles, setRoles] = useState([]);//group
    const [roleSelected, setRoleSelected] = useState({});
    const [rolEdited, setRolEdited] = useState(null);

    useEffect(() => {
        getPermissions();
        getRoles();
    }, [setPermissions]);

    useEffect(() => {
        if (reloadPermissions && permissions && permissions.length > 0) {
            filterPermissionsOptions();
        }
    }, [permissions]);

    useEffect(() => {
        if (roleSelected && roleSelected.id) {
            filterPermissionsOptions();
        }
    }, [roleSelected]);

    useEffect(() => {
        if (reloadPermissions) {
            getPermissions();
        }
    }, [reloadPermissions]);

    const filterPermissionsOptions = () => {
        if (!roleSelected || !roleSelected.permissions) return;
        setPermissionsOptions(permissions.filter(p => !roleSelected.permissions.includes(p.permission)).map(p => ({label: p.permission, value: p.id})));
    };

    const getRoles = (rol) => {
        fetchDataApi(url.SECURITY_ROLES).then(resp => {
            let data = sortList(resp.data, 'name');
            setRoles(data);
            let selected = null;
            if (rol && rol.id && (!roleSelected || roleSelected.id !== rol.id)) {
                selected = data.find(d => d.id === rol.id);
            } else if (roleSelected && roleSelected.id) {
                selected = data.find(d => d.id === roleSelected.id);
            }
            setRoleSelected(selected || {});
        })
    };

    const getPermissions = () => {
        fetchDataApi(url.SECURITY_PERMISSIONS).then(resp => {
            setPermissions(sortList(resp.data, 'permission'));
        })
    };

    const onAddPermission = (data) => {
        if (!data || !data.label) return;
        const payload = {permission: data.label};
        postApi(`${url.SECURITY_ROLES}/${roleSelected.id}/addPermission`, payload).then(resp => {
            if (resp.status === 200) {
                getRoles();
                filterPermissionsOptions();
                setPermissionsOptionSelected(-1);
            }
        })
    };

    const onRemovePermission = (permission) => {
        postApi(`${url.SECURITY_ROLES}/${roleSelected.id}/removePermission`, {permission: permission}).then(resp => {
            if (resp.status === 200) {
                getRoles();
                filterPermissionsOptions();
                setPermissionsOptionSelected(-1);
            }
        })
    };

    const onAddRole = () => {
        setRolEdited(null);
        const list = [...roles];
        list.unshift({id: null, name: ''});
        setRoles(list);
    };

    const onSaveRole = (ev, data) => {
        let func;
        if (rolEdited) {
            func = updateDataApi(url.SECURITY_ROLES, rolEdited, {name: data.name});
        } else {
            func = registerDataApi(url.SECURITY_ROLES, {name: data.name});
        }

        func.then(resp => {
            if (resp.status === 200) {
                getRoles(resp.securityrol);
            }
            setRolEdited(null)
        })
    };

    const onDeleteRole = (role) => {
        deleteDataApi(url.SECURITY_ROLES, role.id, {}).then(resp => {
            if (resp.status === 200) {
                if (roleSelected && roleSelected.id === role.id) {
                    setRoleSelected({});
                }
                getRoles();
            }
        })
    };

    const onCancel = (index) => {
        const list = [...roles];
        list.splice(index, 1);
        setRoles(list);
    };

    return (
        <Row>
            <Col md={6}>
                <Card>
                    <CardBody>
                        <Row className="mb-3">
                            <Col sm={12}>
                                <button size="small" type="button" className="btn btn-sm text-primary float-md-end" onClick={() => onAddRole()}>
                                    <i className="uil uil-plus font-size-18"> </i> Agregar
                                </button>
                            </Col>
                        </Row>
                        <Row>
                            <Col>
                                <AvForm className="needs-validation" autoComplete="off" onValidSubmit={(e, v) => onSaveRole(e, v)}>
                                    <table className="table table-bordered table-condensed">
                                        <thead>
                                        <tr>
                                            <th style={{width: '70%'}}>Rol</th>
                                            <th style={{width: '30%'}}>Acciones</th>
                                        </tr>
                                        </thead>
                                        <tbody>
                                        {map(roles, (rol, key) => (
                                            <tr key={key} className={rol.id === roleSelected.id ? 'bg-light font-weight-600' : ''}>
                                                <td>
                                                    {rolEdited !== rol.id && (
                                                        <>
                                                            {rol.name}
                                                        </>
                                                    )}
                                                    {rolEdited === rol.id && (
                                                        <>
                                                            <FieldText id={"name"} name={"name"} value={rol.name} required/>
                                                        </>
                                                    )}
                                                </td>
                                                <td className="text-center">
                                                    <ul className="list-inline font-size-20 contact-links mb-0">
                                                        <li className="list-inline-item">
                                                            <div className="btn-group">
                                                                <div className="btn-group">

                                                                    {(rolEdited !== rol.id && rol.id) && (
                                                                        <div>
                                                                            <button type="button" size="small" className="btn btn-sm text-primary" disabled={rolEdited}
                                                                                    onClick={() => setRoleSelected(rol)}>
                                                                                <i className="uil uil-eye font-size-18"> </i>
                                                                            </button>
                                                                            <button type="button" size="small" className="btn btn-sm text-primary" disabled={rolEdited}
                                                                                    onClick={() => setRolEdited(rol.id)}>
                                                                                <i className="uil uil-pen font-size-18"> </i>
                                                                            </button>
                                                                            <button type="button" size="small" className="btn btn-sm text-danger" disabled={rolEdited}
                                                                                    onClick={() => onDeleteRole(rol)}>
                                                                                <i className="uil uil-trash-alt font-size-18"> </i>
                                                                            </button>
                                                                        </div>
                                                                    )}
                                                                    {(rolEdited === rol.id || !rol.id) && (
                                                                        <div>
                                                                            <button type="submit" size="small" className="btn btn-sm text-success">
                                                                                <i className="uil uil-check font-size-18"> </i>
                                                                            </button>
                                                                            {!rol.id && (
                                                                                <button type="submit" size="small" className="btn btn-sm text-danger" onClick={() => onCancel(key)}>
                                                                                    <i className="uil uil-multiply font-size-18"> </i>
                                                                                </button>
                                                                            )}
                                                                            {rol.id && (
                                                                                <button type="button" size="small" className="btn btn-sm text-primary" onClick={() => setRolEdited(null)}>
                                                                                    <i className="uil uil-multiply font-size-18"> </i>
                                                                                </button>
                                                                            )}
                                                                        </div>
                                                                    )}
                                                                </div>
                                                            </div>
                                                        </li>
                                                    </ul>
                                                </td>
                                            </tr>
                                        ))}
                                        </tbody>
                                    </table>
                                </AvForm>
                            </Col>
                        </Row>
                    </CardBody>
                </Card>
            </Col>
            <Col md={6}>
                <Card>
                    <CardBody>
                        <AvForm className="needs-validation" autoComplete="off">
                            <Row className="mb-3">
                                <Col sm={12}>
                                    <Label className="control-label">Permisos</Label>
                                    <FieldSelect
                                        id={"permission"}
                                        name={"permission"}
                                        options={permissionsOptions}
                                        defaultValue={permissionsOptionSelected}
                                        onChange={(e) => onAddPermission(e)}
                                        isSearchable
                                        disabled={!(roleSelected && roleSelected.id)}
                                    />
                                </Col>
                            </Row>
                        </AvForm>
                        <Row>
                            <Col>
                                <table className="table table-bordered table-condensed">
                                    <thead>
                                    <tr>
                                        <th>Nombre</th>
                                        <th style={{width: '20%'}}>Acciones</th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                    {map(roleSelected.permissions, (permission, key) => (
                                        <tr key={key}>
                                            <td>{permission}</td>
                                            <td className="text-center">
                                                <button type="button" size="small" className="btn btn-sm text-danger" onClick={() => onRemovePermission(permission)}>
                                                    <i className="uil uil-trash-alt font-size-18"> </i>
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                    </tbody>
                                </table>
                            </Col>
                        </Row>
                    </CardBody>
                </Card>
            </Col>
        </Row>
    )
}

SecurityRoles.propTypes = {
    reloadPermissions: PropTypes.bool
}

const mapStateToProps = state => {
    return {}
}

const mapDispatchToProps = dispatch => ({})

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(SecurityRoles)
