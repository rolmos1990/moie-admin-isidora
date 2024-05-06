import React, {useEffect, useState} from "react"
import PropTypes from "prop-types"
import {connect} from "react-redux"
import {Card, CardBody, Col, Row} from "reactstrap"
import {map} from "lodash";
import {AvForm} from "availity-reactstrap-validation";
import {deleteDataApi, fetchDataApi, registerDataApi, updateDataApi} from "../../helpers/backend_helper";
import * as url from "../../helpers/url_helper";
import {FieldText} from "../../components/Fields";

const SecurityPermissions = (props) => {

    const [permissions, setPermissions] = useState([]);
    const [permissionEdited, setPermissionEdited] = useState(null);

    useEffect(() => {
        getPermissions();
    }, [setPermissions]);

    const getPermissions = () => {
        fetchDataApi(url.SECURITY_PERMISSIONS).then(resp => {
            setPermissions(sort(resp.data, 'permission'));
        });
    };

    const sort = (data, fieldName) => {
        return (data || []).sort((a, b) => a[fieldName] === b[fieldName] ? 0 : (a[fieldName] > b[fieldName]) ? 1 : -1)
    };

    const onDelete = (permission) => {
        deleteDataApi(url.SECURITY_PERMISSIONS, permission.id, {}).then(resp => {
            if (resp.status === 200) {
                getPermissions();
            }
        })
    };

    const onAdd = () => {
        setPermissionEdited(null);
        const list = [...permissions];
        list.unshift({id: null, name: ''});
        setPermissions(list);
    };

    const onSave = (ev, data) => {
        let payload = {permission: data.permission, description: data.description};

        let func;
        if (permissionEdited) {
            func = updateDataApi(url.SECURITY_PERMISSIONS, permissionEdited, payload);
        } else {
            func = registerDataApi(url.SECURITY_PERMISSIONS, payload);
        }

        func.then(resp => {
            if (resp.status === 200) {
                getPermissions();
            }
            setPermissionEdited(null)
        })
    };

    const onCancel = (index) => {
        const list = [...permissions];
        list.splice(index, 1);
        setPermissions(list);
    };

    return (
        <Row>
            <Col md={12}>
                <Card>
                    <CardBody>
                        <Row className="mb-3">
                            <Col sm={12}>
                                <button size="small" type="button" className="btn btn-sm text-primary float-md-end" onClick={() => onAdd()}>
                                    <i className="uil uil-plus font-size-18"> </i> Agregar
                                </button>
                            </Col>
                        </Row>
                        <Row>
                            <Col>
                                <AvForm className="needs-validation" autoComplete="off" onValidSubmit={(e, v) => onSave(e, v)}>
                                    <table className="table table-bordered table-condensed">
                                        <thead>
                                        <tr>
                                            <th style={{width: '30%'}}>Permiso</th>
                                            <th style={{width: '55%'}}>Descripcion</th>
                                            <th style={{width: '15%'}}>Acciones</th>
                                        </tr>
                                        </thead>
                                        <tbody>
                                        {map(permissions, (permission, key) => (
                                            <tr key={key}>
                                                <td>
                                                    {permissionEdited !== permission.id && (
                                                        <>
                                                            {permission.permission}
                                                        </>
                                                    )}
                                                    {permissionEdited === permission.id && (
                                                        <>
                                                            <FieldText id={"permission"} name={"permission"} value={permission.permission} required/>
                                                        </>
                                                    )}
                                                </td>
                                                <td>
                                                    {permissionEdited !== permission.id && (
                                                        <>
                                                            {permission.description}
                                                        </>
                                                    )}
                                                    {permissionEdited === permission.id && (
                                                        <>
                                                            <FieldText id={"description"} name={"description"} value={permission.description} required/>
                                                        </>
                                                    )}
                                                </td>
                                                <td className="text-center">
                                                    <ul className="list-inline font-size-20 contact-links mb-0">
                                                        <li className="list-inline-item">
                                                            <div className="btn-group">
                                                                <div className="btn-group">

                                                                    {(permissionEdited !== permission.id && permission.id) && (
                                                                        <div>
                                                                            <button type="button" size="small" className="btn btn-sm text-primary" disabled={permissionEdited}
                                                                                    onClick={() => setPermissionEdited(permission.id)}>
                                                                                <i className="uil uil-pen font-size-18"> </i>
                                                                            </button>
                                                                            <button type="button" size="small" className="btn btn-sm text-danger" disabled={permissionEdited}
                                                                                    onClick={() => onDelete(permission)}>
                                                                                <i className="uil uil-trash-alt font-size-18"> </i>
                                                                            </button>
                                                                        </div>
                                                                    )}
                                                                    {(permissionEdited === permission.id || !permission.id) && (
                                                                        <div>
                                                                            <button type="submit" size="small" className="btn btn-sm text-success">
                                                                                <i className="uil uil-check font-size-18"> </i>
                                                                            </button>
                                                                            {!permission.id && (
                                                                                <button type="submit" size="small" className="btn btn-sm text-danger" onClick={() => onCancel(key)}>
                                                                                    <i className="uil uil-multiply font-size-18"> </i>
                                                                                </button>
                                                                            )}
                                                                            {permission.id && (
                                                                                <button type="button" size="small" className="btn btn-sm text-primary" onClick={() => setPermissionEdited(null)}>
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
        </Row>
    )
}

SecurityPermissions.propTypes = {
    onChange: PropTypes.func
}

const mapStateToProps = state => {
    return {}
}

const mapDispatchToProps = dispatch => ({})

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(SecurityPermissions)
