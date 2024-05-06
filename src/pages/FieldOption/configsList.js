import React, {useEffect, useState} from "react"
import PropTypes from "prop-types"
import {connect} from "react-redux"
import {Card, CardBody, Col, Row} from "reactstrap"

import {ConfirmationModalAction} from "../../components/Modal/ConfirmationModal";
import {deleteFieldOption, getFieldOptionByGroup, registerFieldOption, updateFieldOption} from "../../store/fieldOptions/actions";
import {GROUPS} from "../../common/constants";
import {map} from "lodash";
import {FieldNumber, FieldText} from "../../components/Fields";
import {AvForm} from "availity-reactstrap-validation";

const ConfigsList = props => {
    const {fieldOptions, refresh, onGetByGroup, onCreateFieldOption, onUpdateFieldOption, onDeleteFieldOption} = props;

    const [groupsList, setGroupsList] = useState([GROUPS.OP_GROUPS]);
    const [groupSelected, setGroupSelected] = useState(null);
    const [fieldOptionsList, setFieldOptionsList] = useState([]);
    const [fieldOption, setFieldOption] = useState({options: []});
    const [fieldOptionEdited, setFieldOptionEdited] = useState(null);

    useEffect(() => {
        onGetByGroup(groupSelected || GROUPS.OP_GROUPS);
    }, [onGetByGroup, refresh, groupSelected]);

    useEffect(() => {
        if (fieldOptions && fieldOptions.length > 0) {
            const options = {};

            if (fieldOptions.some(item => item.groups === GROUPS.OP_GROUPS)) {
                const list = fieldOptions.map(item => item.name);
                list.unshift(GROUPS.OP_GROUPS);
                setGroupsList(list);
            }

            if (groupSelected) {
                fieldOptions.forEach(op => {
                    const key = op.groups;
                    if (!options[key]) {
                        options[key] = {groups: op.groups, options: []};
                    }
                    options[key].options.push({id: op.id, name: op.name, value: op.value});
                });
                const list = [];
                Object.keys(options).forEach(op => list.push(options[op]))
                setFieldOptionsList(list);

                setFieldOption(list.find(l => l.groups === groupSelected));
                setFieldOptionEdited(null);
            }
        } else {
            setFieldOptionsList([])
            setFieldOption({options: []});
        }
    }, [fieldOptions])

    const onAddFieldOptions = (ev, data) => {
        if (!data.groups || !data.groups.value) return;

        const items = fieldOptionsList ? fieldOptionsList : [];

        //If item doesnt exist It will be added
        if (items.some(i => i.groups === data.groups.value)) return;

        const item = {groups: data.groups.value, options: [{id: null, name: null, value: ''}]};
        items.push(item);
        setFieldOptionsList(items);
        setGroupSelected(data.groups.value);
    };

    const onAddFieldOption = () => {
        //to avoid multiple
        if (fieldOption && fieldOption.options.some(item => !item.id)) return;

        setFieldOptionEdited(null);
        setFieldOption({...fieldOption, options: [...fieldOption.options, {id: null, name: null, value: ''}]});
    };

    const onDeleteOption = (id) => {
        ConfirmationModalAction({
            title: '¿Seguro desea eliminar este registro?',
            description: 'Usted está eliminado este registro, una vez eliminado no podrá ser recuperado.',
            id: '_fieldOptionsModal',
            onConfirm: () => onDeleteFieldOption(id)
        });
    };

    const handleValidSubmit = (ev, data) => {
        const name = data.name ? data.name : data.value;

        //avoid duplicate
        if (fieldOption && fieldOption.options.some(item => item.id && item.name === name && item.value === data.value)) {
            const optionGroup = {...fieldOption};
            const option = optionGroup.options.find(item => !item.id && item.name === name && item.value === data.value);
            optionGroup.options.splice(optionGroup.options.indexOf(option), 1);
            setFieldOption(optionGroup);
            return;
        }

        const payload = {
            groups: groupSelected,
            name: data.name ? data.name : data.value,
            value: data.value
        }

        if (fieldOptionEdited) {
            onUpdateFieldOption(fieldOptionEdited, payload);
        } else {
            onCreateFieldOption(payload);
        }
    };

    const namesAndValueConfig = [GROUPS.REFERENCE_KEY, GROUPS.ALARMS];

    return (
        <Row>
            <Col md={5}>
                <Card>
                    <CardBody>
                        <AvForm className="needs-validation" autoComplete="off" onValidSubmit={(e, v) => onAddFieldOptions(e, v)}>
                            <Row>
                                <Col>
                                    <table className="table table-bordered table-condensed">
                                        <thead>
                                        <tr>
                                            <th style={{width: '80%'}}>Grupo</th>
                                            <th style={{width: '20%'}}>Acciones</th>
                                        </tr>
                                        </thead>
                                        <tbody>
                                        {map(groupsList, (group, key) => (
                                            <tr key={key} className={group === groupSelected ? 'bg-light font-weight-600' : ''}>
                                                <td>{group}</td>
                                                <td className="text-center">
                                                    <ul className="list-inline font-size-20 contact-links mb-0">
                                                        <li className="list-inline-item">
                                                            <button type="button" size="small" className="btn btn-sm text-primary" onClick={() => setGroupSelected(group)}>
                                                                <i className="uil uil-eye font-size-18"> </i>
                                                            </button>
                                                        </li>
                                                    </ul>
                                                </td>
                                            </tr>
                                        ))}
                                        </tbody>
                                    </table>
                                </Col>
                            </Row>
                        </AvForm>
                    </CardBody>
                </Card>
            </Col>
            <Col md={7}>
                <Card>
                    <CardBody>
                        <AvForm className="needs-validation" autoComplete="off" onValidSubmit={(e, v) => handleValidSubmit(e, v)}>
                            <Row>
                                <Col className="text-right p-2">
                                    {groupSelected && (
                                        <button size="small" type="button" className="btn btn-sm text-primary" onClick={() => onAddFieldOption()}>
                                            <i className="uil uil-plus font-size-18"> </i> Agregar
                                        </button>
                                    )}
                                </Col>
                            </Row>
                            <Row>
                                <Col>
                                    <table className="table table-bordered table-condensed">
                                        <thead>
                                        <tr>
                                            <th>Nombre</th>
                                            {groupSelected === GROUPS.REFERENCE_KEY && (
                                                <>
                                                    <th>Inicia en</th>
                                                </>
                                            )}
                                            <th style={{width: '20%'}}>Acciones</th>
                                        </tr>
                                        </thead>
                                        <tbody>
                                        {map(fieldOption.options, (option, key) => (
                                            <tr key={key}>
                                                {namesAndValueConfig.includes(groupSelected) && (
                                                    <>
                                                        {fieldOptionEdited !== option.id && (
                                                            <>
                                                                <td>{option.name}</td>
                                                                <td>{option.value}</td>
                                                            </>
                                                        )}
                                                        {fieldOptionEdited === option.id && (
                                                            <>
                                                                <td>
                                                                    <FieldText
                                                                        id={"name"}
                                                                        name={"name"}
                                                                        value={option.name}
                                                                        required/>
                                                                </td>
                                                                <td>
                                                                    <FieldNumber
                                                                        id={"value"}
                                                                        name={"value"}
                                                                        value={option.value}
                                                                        required/>
                                                                </td>
                                                            </>
                                                        )}
                                                    </>
                                                )}

                                                {!(namesAndValueConfig.includes(groupSelected)) && (
                                                    <td>
                                                        {fieldOptionEdited !== option.id && (
                                                            <>
                                                                {option.value}
                                                            </>
                                                        )}
                                                        {fieldOptionEdited === option.id && (
                                                            <>
                                                                <FieldText
                                                                    id={"value"}
                                                                    name={"value"}
                                                                    value={option.value}
                                                                    required/>
                                                            </>
                                                        )}
                                                    </td>
                                                )}
                                                <td className="text-center">
                                                    <div className="btn-group">

                                                        {(fieldOptionEdited !== option.id && option.id) && (
                                                            <div>
                                                                <button type="button" size="small" className="btn btn-sm text-primary" disabled={fieldOptionEdited} onClick={() => setFieldOptionEdited(option.id)}>
                                                                    <i className="uil uil-pen font-size-18"> </i>
                                                                </button>
                                                                <button type="button" size="small" className="btn btn-sm text-danger" disabled={fieldOptionEdited} onClick={() => onDeleteOption(option.id)}>
                                                                    <i className="uil uil-trash-alt font-size-18"> </i>
                                                                </button>
                                                            </div>
                                                        )}
                                                        {(fieldOptionEdited === option.id || !option.id) && (
                                                            <div>
                                                                <button type="submit" size="small" className="btn btn-sm text-success">
                                                                    <i className="uil uil-check font-size-18"> </i>
                                                                </button>
                                                                {option.id && (
                                                                    <button type="button" size="small" className="btn btn-sm text-primary" onClick={() => setFieldOptionEdited(null)}>
                                                                        <i className="uil uil-multiply font-size-18"> </i>
                                                                    </button>
                                                                )}
                                                            </div>
                                                        )}
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                        </tbody>
                                    </table>
                                </Col>
                            </Row>

                        </AvForm>
                    </CardBody>
                </Card>
            </Col>
        </Row>
    )
}

ConfigsList.propTypes = {
    fieldOptions: PropTypes.array,
    onGetFieldOptions: PropTypes.func,
    onCreateFieldOption: PropTypes.func,
    onUpdateFieldOption: PropTypes.func,
    onDeleteFieldOption: PropTypes.func,
}

const mapStateToProps = state => {
    const {fieldOptions, loading, meta, refresh} = state.FieldOption
    return {fieldOptions, loading, meta, refresh}
}

const mapDispatchToProps = dispatch => ({
    onGetByGroup: (group) => dispatch(getFieldOptionByGroup(group, 500, 0)),
    onCreateFieldOption: (data, history) => dispatch(registerFieldOption(data, history)),
    onUpdateFieldOption: (id, data, history) => dispatch(updateFieldOption(id, data, history)),
    onDeleteFieldOption: (id, history) => dispatch(deleteFieldOption(id, history))
})

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(ConfigsList)
