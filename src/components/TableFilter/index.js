import React, {useState} from "react";
import {Button, Card, CardBody, Col, Label, Row} from "reactstrap";
import {AvForm} from "availity-reactstrap-validation";
import PropTypes from "prop-types";
import {Button as ButtonMaterial} from "@material-ui/core";
import Conditionals from "../../common/conditionals";
import {FieldAsyncSelect, FieldDate, FieldNumber, FieldSelect, FieldText} from "../Fields";
import {
    __trim,
    formatDateToServer,
    formatDateToServerEndOfDay,
    formatDateToServerStartOfDay,
    isValidObject,
    isValidOption
} from "../../common/utils";
import moment from "moment";
import {DATE_MODES} from "../Fields/InputDate";

export const TableFilter = (props) => {
    const {fields} = props;
    const [show, setShow] = useState(true);
    const form = React.createRef();

    if (!props.isActive) {
        return false;
    }

    const handleValidSubmit = (event, values) => {
        if (props.onSubmit) {

            let data = {...values};
            const ranges = {};
            Object.keys(values).filter(v => v.includes('_number')).forEach(v => {
                const key = "_"+v.replace('_numberA_', '').replace('_numberB_', '');
                if(!ranges[key]) ranges[key] = [];
                ranges[key].push(values[v]);
                delete data[v]
            });

            data = {...data, ...ranges};

            const conditions = new Conditionals.Condition;
            Object.keys(data)//FieldNames
                .filter(dataField => data[dataField] && data[dataField] !== "")
                .forEach(dataField => {

                    // const isObject = data[dataField];
                    //Se borra el "_" del inicio porque algunos campos se renderizan mal, ejemplo el status
                    const fieldName = dataField.substr(1);

                    let field = fields.filter(field => field.filter).filter(field => field.dataField === fieldName);

                    if (!field || field.length === 0) {
                        //para buscar dentro de nodos
                        field = fields.filter(field => field.filter)
                            .filter(field => field.dataField.includes('.') || field.dataField.includes('__'))
                            .filter(field => field.dataField.startsWith(fieldName));
                    }

                    if (field && field.length > 0) {
                        if (field.length === 1) {
                            addConditionals(conditions, data, field, dataField, fieldName);
                        }else{
                            //agregar los los valores de los distintos nodos
                            field.forEach(f => {
                                const attr = f.dataField.split('.')[1];
                                const d = {};
                                d[f.dataField] = data[dataField][attr];

                                if(d[f.dataField] && d[f.dataField] !== ""){
                                    addConditionals(conditions, d, [f], f.dataField, f.dataField);
                                }
                            })
                        }
                    }
                });

            props.onSubmit(conditions.all());
        }
    }

    const addConditionals = (conditions, data, field, dataField, fieldName) => {
        if (field && field.length) {
            fieldName = fieldName.replace('__', ".")
            const filter = field[0];
            let value = data[dataField];

            let operator;
            if (filter.filterType === "text") {
                operator = filter.filterCondition ? filter.filterCondition : Conditionals.OPERATORS.LIKE;
                value = __trim(value);
                conditions.add(fieldName, value, operator);
            }
            if (filter.filterType === "voyed") {//for status
                    operator = resolveOperator(filter, value.value ? Conditionals.OPERATORS.NOT_NULL : Conditionals.OPERATORS.NULL);
                    conditions.add(fieldName, null, operator);
            }
            if (filter.filterType === "select" && isValidOption(filter.filterOptions, value.value)) {//for status
                if(value.value === true || value.value === false){
                    operator = resolveOperator(filter, value.value ? Conditionals.OPERATORS.TRUE : Conditionals.OPERATORS.FALSE);
                    conditions.add(fieldName, null, operator);
                }else{
                    operator = resolveOperator(filter, Conditionals.OPERATORS.EQUAL);
                    conditions.add(fieldName, value.value, operator);
                }
            }
            if (filter.filterType === "asyncSelect" && value.value) {
                operator = resolveOperator(filter, Conditionals.OPERATORS.EQUAL);
                conditions.add(fieldName, value.value, operator);
            }

            if (filter.filterType === "number" && isValidObject(value) && value.length > 0) {

                if (value.length > 1 && value[0] && value[1]) {
                    conditions.add(fieldName, value[0], Conditionals.OPERATORS.BETWEEN,[value[1]]);

                } else if (value.length > 0 && value[0]) {
                    conditions.add(fieldName, value[1], Conditionals.OPERATORS.GREATER_THAN_OR_EQUAL);

                } else if (value.length > 1 && value[1]) {
                    conditions.add(fieldName, value[1], Conditionals.OPERATORS.LESS_THAN);
                }

            }
            if (filter.filterType === "dateRange" && value && value.length > 0) {
                if(moment(value[0]).isSame(moment(value[1]))){
                    conditions.add(fieldName,formatDateToServerStartOfDay(value[0]), Conditionals.OPERATORS.BETWEEN,[formatDateToServerEndOfDay(value[0])]);
                }
                else {
                    conditions.add(fieldName,formatDateToServerStartOfDay(value[0]), Conditionals.OPERATORS.BETWEEN,[formatDateToServerEndOfDay(value[1])]);
                }
            }
        }
    }

    const resolveOperator = (filter, defaultOperator) => {
        return  filter.filterCondition ? filter.filterCondition : defaultOperator;
    }

    const cleanFilters = () => {
        const conditions = new Conditionals.Condition;
        props.onSubmit(conditions.all());
        form && form.current && form.current.reset();
        setShow(false);
        setTimeout(() => {
            setShow(true);
        }, 10)
    }

    return (<div className="col-md-4">
        <Card>
            <CardBody>
                {props.onPressDisabled && (
                    <div className={"float-end"}>
                        <ButtonMaterial color="primary" size="small" onClick={props.onPressDisabled}>
                            <i className={"mdi mdi-minus"}> </i>
                        </ButtonMaterial>
                    </div>
                )}
                <div className="mb-4">
                    <h5><i className={"mdi mdi-filter-menu"}> </i> Filtros Avanzados &nbsp;</h5>
                </div>
                {show && (
                    <AvForm className="needs-validation" autoComplete="off"
                            onValidSubmit={(e, v) => {
                                handleValidSubmit(e, v)
                            }}
                            ref={form}>

                        {fields.filter(f => f.filter).map((field, idx) => (
                            <Row key={idx}>
                                {field.filterType === 'text' && (
                                    <Col md="12">
                                        <div className="mb-3">
                                            <Label htmlFor={"_" + field.dataField}>{field.text}</Label>
                                            <FieldText name={"_" + field.dataField}
                                                       defaultValue={field.filterDefaultOption}
                                                       placeholder={field.text}/>
                                        </div>
                                    </Col>
                                )}
                                {field.filterType === 'number' && (
                                    <Col md="12">
                                        <div className="mb-3">
                                            <Label htmlFor={"_" + field.dataField}>{field.text}</Label>
                                            <Row>
                                                <Col xs="6">
                                                    <FieldNumber name={"_numberA_" + field.dataField}
                                                                 defaultValue={field.filterDefaultOption}
                                                                 placeholder="Desde"
                                                    />
                                                </Col>
                                                <Col xs="6">
                                                    <FieldNumber name={"_numberB_" + field.dataField}
                                                                 defaultValue={field.filterDefaultOption}
                                                                 placeholder="Hasta"
                                                    />
                                                </Col>
                                            </Row>
                                        </div>
                                    </Col>
                                )}
                                {field.filterType === 'select' && (
                                    <Col md="12" >
                                        <div className="mb-3">
                                            <Label htmlFor={"_" + field.dataField}>{field.text}</Label>
                                            <FieldSelect
                                                id={"_" + field.dataField}
                                                name={"_" + field.dataField}
                                                options={field.filterOptions}
                                                defaultValue={field.filterDefaultOption}
                                                placeholder={field.text}
                                            />
                                        </div>
                                    </Col>
                                )}
                                {field.filterType === 'voyed' && (
                                    <Col md="12" >
                                        <div className="mb-3">
                                            <Label htmlFor={"_" + field.dataField}>{field.text}</Label>
                                            <FieldSelect
                                                name={"_" + field.dataField}
                                                options={field.filterOptions}
                                                defaultValue={field.filterDefaultOption}
                                                placeholder={field.text}
                                            />
                                        </div>
                                    </Col>
                                )}
                                {field.filterType === 'asyncSelect' && (
                                    <Col md="12" >
                                        <div className="mb-3">
                                            <Label htmlFor={"_" + field.dataField}>{field.text}</Label>
                                            <FieldAsyncSelect
                                                name={"_" + field.dataField}
                                                urlStr={field.urlStr}
                                                placeholder={field.text}
                                                defaultValue={field.filterDefaultOption}
                                                conditionalOptions={field.conditionalOptions}
                                                defaultConditions={field.defaultConditions}
                                                hasWild={field.hasWild}
                                            />
                                        </div>
                                    </Col>
                                )}
                                {field.filterType === 'dateRange' && (
                                    <Col md="12" >
                                        <div className="mb-3">
                                            <Label htmlFor={"_" + field.dataField}>{field.text}</Label>
                                            <FieldDate
                                                name={"_" + field.dataField}
                                                mode={DATE_MODES.RANGE}
                                            />
                                        </div>
                                    </Col>
                                )}
                            </Row>
                        ))}
                        <Row>
                            <Col md={"12"}>
                                <div className={"float-end"}>
                                    <Button type="submit" color="primary" className="btn-sm btn-rounded waves-effect waves-light">
                                        <i className={"mdi mdi-magnify"}> </i> Buscar
                                    </Button>
                                </div>
                                <div className={"float-end ml-5"}>
                                    <Button type="button"
                                            onClick={cleanFilters}
                                            color="default"
                                            className="btn-sm btn-rounded waves-effect waves-light">
                                        Limpiar
                                    </Button>
                                </div>
                            </Col>
                        </Row>
                    </AvForm>
                )}
            </CardBody>
        </Card>
    </div>)
}
TableFilter.propTypes = {
    isActive: PropTypes.bool,
    onSubmit: PropTypes.func,
    onPressDisabled: PropTypes.func,
    fields: PropTypes.array.isRequired
};
