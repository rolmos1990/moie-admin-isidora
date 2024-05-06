import React, {useState} from "react";
import {Button, Card, CardBody, Col, Label, Row} from "reactstrap";
import {FieldDate, FieldEmail, FieldSelect, FieldText} from "../../../components/Fields";
import {AvForm} from "availity-reactstrap-validation";
import {DATE_MODES} from "../../../components/Fields/InputDate";
import PropTypes from "prop-types";
import Conditionals from "../../../common/conditionals";
import moment from 'moment';
import {Button as ButtonMaterial} from "@material-ui/core";

export const CustomerFilter = (props) => {

    const form = React.createRef();
    const [filters, setFilters] = useState({isMayorist: null, _status: null, createdAt:null})

    if(!props.isActive){
        return false;
    }
    const yesNoOptions = [
        {label: '-', value: null},
        {label: 'Si', value: true},
        {label: 'No', value: false}];

    const ActiveInactive = [
        {label: '-', value: null},
        {label: 'Activo', value: true},
        {label: 'Inactivo', value: false}];
    /* retorna  - Conditionals.all - Array */
    const handleValidSubmit = (event,values) => {
        if (props.onSubmit) {
            setFilters(values);
            const conditions = new Conditionals.Condition;
            const {name, email, _status, isMayorist, createdAt} = values;

            if (name) {
                conditions.add('name', name, Conditionals.OPERATORS.LIKE);
            }
            if (email) {
                conditions.add('email', email, Conditionals.OPERATORS.EQUAL);
            }
            if (yesNoOptions.filter(o => o.value !== null).map(o => o.value).includes(isMayorist.value)) {
                    conditions.add('isMayorist', null, isMayorist.value ? Conditionals.OPERATORS.TRUE : Conditionals.OPERATORS.FALSE);
            }
            if (createdAt) {
                if(moment(createdAt[0]).isSame(moment(createdAt[1]))){
                    conditions.add('createdAt',
                        moment(createdAt[0]).format("YYYY-MM-DD[T]HH:mm:ss"),
                        Conditionals.OPERATORS.LESS_THAN_OR_EQUAL
                    );
                }
                else {
                    conditions.add('createdAt',
                        moment(createdAt[0]).format("YYYY-MM-DD[T]HH:mm:ss"),
                        Conditionals.OPERATORS.BETWEEN,
                        [moment(createdAt[1]).format("YYYY-MM-DD[T]HH:mm:ss")]
                    );
                }
            }

            if (ActiveInactive.filter(o => o.value !== null).map(o => o.value).includes(_status.value)){
                conditions.add('status', null,
                    _status.value ?
                    Conditionals.OPERATORS.TRUE :
                    Conditionals.OPERATORS.FALSE);
            }
            props.onSubmit(conditions.all());
        }
    }
    const cleanFilters = () => {
        setFilters({isMayorist: null, _status: null, createdAt:null});
        const conditions = new Conditionals.Condition;
        props.onSubmit(conditions.all());
        form && form.current && form.current.reset();
    }
    return (<div className="col-md-4">
                <Card>
                    <CardBody>
                        {props.onPressDisabled && (
                            <div className={"float-end"}>
                                <ButtonMaterial color="primary" size="small" onClick={props.onPressDisabled}>
                                    <i className={"mdi mdi-minus"}></i>
                                </ButtonMaterial>
                            </div>
                        )}
                        <div className="mb-4">
                            <h5><i className={"mdi mdi-filter-menu"}></i> Filtros Avanzados &nbsp;</h5>
                        </div>
                        <AvForm className="needs-validation"
                                onValidSubmit={(e, v) => {
                                    handleValidSubmit(e, v)
                                }}
                                ref={form}>
                            <Row>
                                <Col md="12">
                                    <div className="mb-3">
                                        <Label htmlFor="name">Nombre</Label>
                                        <FieldText
                                            name={"name"}
                                        />
                                    </div>
                                </Col>
                                <Col md="12">
                                    <div className="mb-3">
                                        <Label htmlFor="name">Email</Label>
                                        <FieldEmail
                                            name={"email"}
                                        />
                                    </div>
                                </Col>
                                <Col md="12">
                                    <div className="mb-3">
                                        <Label htmlFor="name">¿Es Mayorista?</Label>
                                        <FieldSelect
                                            name={"isMayorist"}
                                            options={yesNoOptions}
                                            defaultValue={filters.isMayorist}
                                        />
                                    </div>
                                </Col>
                                <Col md="12">
                                    <div className="mb-3">
                                        <Label htmlFor="name">Telefono Celular</Label>
                                        <FieldText
                                            name={"cellphone"}
                                        />
                                    </div>
                                </Col>
                                <Col md="12">
                                    <div className="mb-3">
                                        <Label htmlFor="name">Telefono Residencial</Label>
                                        <FieldText
                                            name={"phone"}
                                        />
                                    </div>
                                </Col>
                                <Col md="12">
                                    <div className="mb-3">
                                        <Label htmlFor="name">Fecha de Creación</Label>
                                        <FieldDate
                                            name={"createdAt"}
                                            mode={DATE_MODES.RANGE}
                                            defaultValue={filters.createdAt}
                                            onChange={(e)=> {
                                                let newVar = {...filters, createdAt:e};
                                                setFilters(newVar )
                                            }}
                                        />
                                    </div>
                                </Col>
                                <Col md="12">
                                    <div className="mb-3">
                                        <Label htmlFor="_status">Estado</Label>
                                        <FieldSelect
                                            name={"_status"}
                                            options={ActiveInactive}
                                            defaultValue={filters._status}
                                        />
                                    </div>
                                </Col>
                                <Col md={"12"}>
                                    <div className={"float-end"}>
                                        <Button type="submit" color="primary" className="btn-sm btn-rounded waves-effect waves-light">
                                            <i className={"mdi mdi-magnify"}></i> Buscar
                                        </Button>
                                    </div>
                                    <div className={"float-end ml-5"}>
                                        <Button type="button"
                                                onClick={cleanFilters.bind(this)}
                                                color="default"
                                                className="btn-sm btn-rounded waves-effect waves-light">
                                            Limpiar
                                        </Button>
                                    </div>
                                </Col>
                            </Row>
                        </AvForm>
                    </CardBody>
                </Card>
            </div>)
}

CustomerFilter.propTypes = {
    isActive: PropTypes.bool,
    onSubmit: PropTypes.func,
    onPressDisabled: PropTypes.func
};
