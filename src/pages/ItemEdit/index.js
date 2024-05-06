import React, {useEffect, useState} from "react"
import {CardBody, Col, Container, Label, Row} from "reactstrap"
import {AvForm} from "availity-reactstrap-validation"
import {Card, Tooltip} from "@material-ui/core";
import {withRouter} from "react-router-dom"
import {connect} from "react-redux";
import {apiError} from "../../store/auth/login/actions";
import PropTypes from "prop-types";
import {getItem, registersItem, updateItem} from "../../store/items/actions";
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
import moment from "moment";
import ButtonLoading from "../../components/Common/ButtonLoading";

const ItemEdit = (props) => {
    const {getItem, item, refresh, loading} = props;
    const [itemData, setItemData] = useState({});
    const isEdit = props.match.params.id;

    //carga inicial
    useEffect(() => {
        if (isEdit && getItem) {
            getItem(props.match.params.id);
        }
    }, [getItem, refresh]);

    //cargar la información del cliente
    useEffect(() => {
        if (item.id && isEdit) {
            setItemData({...item, _status:item.status});
        }
    }, [item]);

    const handleValidSubmit = (event, values) => {
        if(canEdit) {
            const data = Object.assign({}, values, {});
            data.type = values.type?.value;
            delete data._status;

            if (!isEdit) {
                props.registersItem(data, props.history)
            } else {
                props.updateItem(props.match.params.id, data, props.history)
            }
        }
    }

    const addDays = moment(itemData.date, "YYYY-MM-DD").add(4, 'days');
    const isNotExpired = moment().isSameOrBefore(addDays);

    const canEdit = ((HasPermissionsFunc([PERMISSIONS.ITEMS_EDIT])) && isEdit && isNotExpired || !isEdit) && !itemData.canceled;

    //only show mode
    const renderShowMode = <HasPermissions permissions={[PERMISSIONS.ITEMS_CREATE, PERMISSIONS.ITEMS_EDIT]} renderNoAccess={() => <NoAccess/>}>
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
                                                {value: 1, label: 'CREDITO_INTERRAPIDISIMO'},
                                                {value: 2, label: 'BOLSAS'}
                                            ]}
                                            defaultValue={itemData.type || 1}
                                            required
                                        />
                                    </div>
                                </Col>
                                <Col md="6">
                                    <div className="mb-3">
                                        <Label htmlFor="field_amount">Monto <span className="text-danger">*</span></Label>
                                        <FieldText
                                            disabled
                                            id={"field_amount"}
                                            name={"amount"}
                                            value={itemData.amount ? itemData.amount.toFixed(2) : "0.00"}
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
                                                {value: 1, label: 'CREDITO_INTERRAPIDISIMO'},
                                                {value: 2, label: 'BOLSAS'}
                                            ]}
                                            defaultValue={itemData.type || 1}
                                            required
                                        />
                                    </div>
                                </Col>
                                <Col md="6">
                                    <div className="mb-3">
                                        <Label htmlFor="field_amount">Monto <span className="text-danger">*</span></Label>
                                        <FieldDecimalNumber
                                            id={"field_amount"}
                                            name={"amount"}
                                            value={itemData.amount ? itemData.amount.toFixed(2) : "0.00"}
                                            required/>
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
                    <Breadcrumb hasBack path="/items" title={itemData.name} item={"Billeteras"}/>
                    <HasPermissions permissions={[PERMISSIONS.ITEMS_CREATE, PERMISSIONS.ITEMS_EDIT, PERMISSIONS.ITEMS_SHOW]} renderNoAccess={() => <NoAccess/>}>
                        <div>
                        {canEdit ? renderForm : renderShowMode}
                        </div>
                    </HasPermissions>
                </Container>
            </div>
        </React.Fragment>
    )
}

const mapItemToProps = state => {
    const {item, error, loading, refresh} = state.Item
    return {error, item, loading, refresh}
}

export default withRouter(
    connect(mapItemToProps, {apiError, registersItem, updateItem, getItem})(ItemEdit)
)

ItemEdit.propTypes = {
    error: PropTypes.any,
    history: PropTypes.object
}

