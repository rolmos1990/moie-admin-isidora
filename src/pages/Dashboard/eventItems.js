import React, {useEffect, useState} from "react";
import {Card, CardBody, Col, Row} from "reactstrap"

//Import Image
import {connect} from "react-redux";
import {fetchEventsApi} from "../../helpers/backend_helper";
import {PERMISSIONS} from "../../helpers/security_rol";
import HasPermissions from "../../components/HasPermissions";
import {getEvents} from "../../store/items/actions";
import {getFieldOptionByGroups} from "../../store/fieldOptions/actions";
import {GROUPS} from "../../common/constants";

const EventItems = (props) => {
    const {onGetEvents, onGetFieldOptions, fieldOptions} = props;
    const [interrapidisimo, setInterrapidisimo] = useState({});
    const [bolsas, setBolsas] = useState({});
    const [alarms, setAlarms] = useState([]);

    useEffect(() => {
        fetchEventsApi({}).then((p => {
            const event = p.event;
            setInterrapidisimo((event.filter(item => item.eventType == 1))[0]);
            setBolsas((event.filter(item => item.eventType == 2))[0]);
        }))

    }, [onGetEvents])

    useEffect(() => {
        if (onGetFieldOptions) {
            onGetFieldOptions();
        }
    }, [onGetFieldOptions]);

    useEffect(() => {
        if (fieldOptions && fieldOptions.length > 0) {
            const alarms = fieldOptions.filter(op => (op.groups === GROUPS.ALARMS)).map(op => {
                return {label: op.name, value: op.value};
            });
            setAlarms(alarms);
        } else {
            setAlarms([]);
        }
    }, [fieldOptions]);


    const getLimitColor = (type, value) => {
        if(alarms.length <= 0){
            return value;
        }
        const limits = alarms;
        const val = parseInt(value);
        const down = (limits.filter(item => item.label === type+'_DOWN'))[0];
        const medium = (limits.filter(item => item.label === type+'_MEDIUM'))[0];

        if(val < parseInt(down['value'])){
            return <p class="text-danger">{value}</p>
        } else if(val < parseInt(medium['value'])){
            return <p class="text-warning">{value}</p>
        } else {
            return <p class="text-success">{value}</p>
        }
    }

    const renderInventario = (allowed = false) => {
        return <Card>
            <CardBody>
                <h5>Alarmas</h5> <br />
                <Row>
                <Col md={6}>
                    <h5 className="mb-2 mt-1"><b>Creditos Int.</b></h5>
                    <h4>
                            <span>
                            <i class="me-2"></i> &nbsp; { allowed ? getLimitColor('ICREDIT', interrapidisimo.amount) : ''}
                            </span>
                    </h4>
                </Col>
                <Col md={6}>
                    <div>
                        <h5 className="mb-2 mt-1"><b>Bolsas</b></h5>
                        <h4>
                                <span>
                                <i class="me-2"></i> &nbsp; { allowed ? getLimitColor('BAGS', bolsas.amount) : ''}
                                </span>
                        </h4>
                    </div>
                </Col>
                </Row>

            </CardBody>
        </Card>
    }


    return (
        <React.Fragment>
            <HasPermissions permission={PERMISSIONS.DASHBOARD_ALARMS} renderNoAccess={() => renderInventario(false)}>
                {renderInventario(true)}
            </HasPermissions>
        </React.Fragment>
    )
}

const mapStateToProps = state => {
    const {fieldOptions} = state.FieldOption
    const {items, loading, meta, refresh} = state.Item
    return {items, loading, meta, refresh, fieldOptions}
}
const mapDispatchToProps = dispatch => ({
    onGetFieldOptions: (conditional = null, limit = 500, page) => dispatch(getFieldOptionByGroups([GROUPS.ALARMS], limit, page)),
    onGetEvents: () => dispatch(getEvents()),
})

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(EventItems)
