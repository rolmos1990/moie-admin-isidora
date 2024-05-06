import React, {useEffect, useState} from "react"
import PropTypes from "prop-types"
import {connect} from "react-redux"
import {Card, CardBody, Col, Row} from "reactstrap"
import {map} from "lodash";
import {AvForm} from "availity-reactstrap-validation";
import {deleteDataApi, fetchDataApi, registerDataApi, updateDataApi} from "../../helpers/backend_helper";
import * as url from "../../helpers/url_helper";
import {ConfirmationModalAction} from "../../components/Modal/ConfirmationModal";
import {Tooltip} from "@material-ui/core";

const SecurityAuthorizations = (props) => {

    const [authorizations, setAuthorizations] = useState([]);
    const [permissionEdited, setPermissionEdited] = useState(null);

    useEffect(() => {
        getAuthorizations();
    }, [setAuthorizations]);

    const getAuthorizations = () => {
        fetchDataApi(url.SECURITY_AUTHORIZATIONS).then(resp => {
            setAuthorizations(sort(resp.data, 'id'));
        });
    };

    const sort = (data, fieldName) => {
        return (data || []).sort((a, b) => a[fieldName] === b[fieldName] ? 0 : (a[fieldName] > b[fieldName]) ? 1 : -1)
    };

    const onAdd = () => {
        setPermissionEdited(null);
        const list = [...authorizations];
        list.unshift({id: null, name: ''});
        setAuthorizations(list);
    };

    const onDelete = (id) => {

        const func = deleteDataApi(url.SECURITY_AUTHORIZATIONS, id);
        func.then(resp => {
            if (resp.status === 200) {
                getAuthorizations();
            }
            getAuthorizations(null)
        })

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
                getAuthorizations();
            }
            getAuthorizations(null)
        })
    };

    const onChange = (id, status, alias) => {
        let payload = {id: id, status: status, alias};
        const func = updateDataApi(url.SECURITY_AUTHORIZATIONS, id, payload);

        func.then(resp => {
            if (resp.status === 200) {
                getAuthorizations();
            }
        })
    };

    const openChangeAlias = (id,status) => {
        ConfirmationModalAction({
            title: `Agregue el nuevo valor para el Alias`,
            description: 'Esta acción no puede revertirse.',
            input: true,
            id: '_alias',
            onConfirm: (alias) => onChange(id, status, alias)
        });
    }

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
                                            <th style={{width: '30%'}}>#</th>
                                            <th style={{width: '30%'}}>Fecha</th>
                                            <th style={{width: '30%'}}>Autorizacion</th>
                                            <th style={{width: '55%'}}>Alias</th>
                                            <th style={{width: '15%'}}>Estado</th>
                                        </tr>
                                        </thead>
                                        <tbody>
                                        {map(authorizations, (permission, key) => (
                                            <tr key={key}>
                                                <td>
                                                    {permission.id}
                                                </td>
                                                <td>
                                                    {permission.createdAt}
                                                </td>
                                                <td>
                                                    {permission.device}
                                                </td>
                                                <td>
                                                    {permission.alias ? permission.alias : <button type="button" color="primary" className="btn-sm btn btn-outline-info waves-effect waves-light" onClick={() => openChangeAlias(permission.id, permission.status)}>
                                                        Modificar Alias
                                                    </button>}
                                                </td>
                                                <td>
                                                    <ul className="list-inline font-size-20 contact-links mb-0">
                                                        <li className="list-inline-item">
                                                            <div className="btn-group">
                                                                <div className="btn-group">
                                                                    {permission.status == false ? (
                                                                        <Tooltip placement="bottom" title="Modificar Alias" aria-label="modify">
                                                                            <button type="button" size="small"
                                                                                    className="btn btn-sm text-primary"
                                                                                    onClick={() => onChange(permission.id, true, permission.alias)}>
                                                                                <i className="uil uil-check font-size-18"> </i>
                                                                            </button>
                                                                        </Tooltip>
                                                                        ) :
                                                                        (
                                                                            <Tooltip placement="bottom" title="Desactivar" aria-label="add">
                                                                            <button type="button" size="small"
                                                                                    className="btn btn-sm text-primary"
                                                                                    onClick={() => onChange(permission.id, false, permission.alias)}>
                                                                                <i className="uil uil-lock font-size-18"> </i>
                                                                            </button>
                                                                            </Tooltip>
                                                                        )}
                                                                        <Tooltip placement="bottom" title="Eliminar" aria-label="delete">
                                                                        <button type="button" size="small"
                                                                                className="btn btn-sm text-primary"
                                                                                onClick={() => onDelete(permission.id, false, permission.alias)}>
                                                                            <i className="uil uil-trash font-size-18"> </i>
                                                                        </button>
                                                                        </Tooltip>
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

SecurityAuthorizations.propTypes = {
    onChange: PropTypes.func
}

const mapStateToProps = state => {
    return {}
}

const mapDispatchToProps = dispatch => ({})

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(SecurityAuthorizations)
