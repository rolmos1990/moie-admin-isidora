import React, {useEffect, useState} from "react";
import {Card, CardBody, Col, Row, Table} from "reactstrap"

//Simple bar
import SimpleBar from "simplebar-react"

//Import Image
import {DEFAULT_PAGE_LIMIT} from "../../common/pagination";
import {getUsers} from "../../store/user/actions";
import {connect} from "react-redux";
import {fetchOrderStatusStatsProductsApi, fetchProductsApi} from "../../helpers/backend_helper";
import CountUp from "react-countup";
import {PERMISSIONS} from "../../helpers/security_rol";
import HasPermissions from "../../components/HasPermissions";
import {STATUS_COLORS} from "../../components/StatusField";

const OrderStatusStats = (props) => {
    const {onGetUsers} = props;

    const [pending, setPending] = useState(0);
    const [confirmed, setConfirmed] = useState(0);
    const [reconcilied, setReconcilied] = useState(0);
    const [printed, setPrinted] = useState(0);
    const [cancelled, setCancelled] = useState(0);

    useEffect(() => {

        fetchOrderStatusStatsProductsApi({}).then((p => {
            if (p && p.data) {
                setPending(p.data.pending);
                setConfirmed(p.data.confirmed);
                setReconcilied(p.data.reconcilied);
                setPrinted(p.data.printed);
                setCancelled(p.data.cancelled);
            }
        }))

    }, [onGetUsers])

    const renderInventario = () => {
        return <Card>
            <CardBody>
                <h5>Pedidos por Estado</h5> <br />
                <Row>
                    <Col md={6}>
                        <h5 className="mb-2 mt-1"><b>Pendientes</b></h5>
                        <h4>
                            <span>
                            <i class={`text-${STATUS_COLORS.DANGER} uil-shopping-cart-alt me-2`}></i> &nbsp; -
                            </span>
                        </h4>
                    </Col>
                    <Col md={6}>
                        <div>
                            <h5 className="mb-2 mt-1"><b>Confirmados</b></h5>
                            <h4>
                                <span>
                                <i class={`text-${STATUS_COLORS.SUCCESS} uil-shopping-cart-alt me-2`}></i> &nbsp; -
                                </span>
                            </h4>
                        </div>
                    </Col>
                    <Col md={6}>
                        <div>
                            <h5 className="mb-2 mt-1"><b>Conciliados</b></h5>
                            <h4>
                                <span>
                                <i class={`text-${STATUS_COLORS.INFO} uil-shopping-cart-alt me-2`}></i> &nbsp; -
                                </span>
                            </h4>
                        </div>
                    </Col>
                    <Col md={6}>
                        <h5 className="mb-2 mt-1"><b>Impresos</b></h5>
                        <h4>
                            <span>
                            <i class={`text-${STATUS_COLORS.WARNING} uil-shopping-cart-alt me-2`}></i> &nbsp; -
                            </span>
                        </h4>
                    </Col>
                    <Col md={6}>
                        <h5 className="mb-2 mt-1"><b>Anulados</b></h5>
                        <h4>
                            <span>
                            <i class={`text-${STATUS_COLORS.SECONDARY} uil-shopping-cart-alt me-2`}></i> &nbsp; -
                            </span>
                        </h4>
                    </Col>
                </Row>
            </CardBody>
        </Card>
    }


    return (
        <React.Fragment>
            <HasPermissions permission={PERMISSIONS.DASHBOARD_ORDER_STATUS} renderNoAccess={renderInventario}>
                <Card>
                    <CardBody>
                        <h5>Pedidos por Estado</h5> <br />
                        <Row>
                            <Col md={6}>
                            <h5 className="mb-2 mt-1"><b>Pendientes</b></h5>
                            <h4>
                            <span>
                            <i class={`text-${STATUS_COLORS.DANGER} uil-shopping-cart-alt me-2`}></i> &nbsp; <CountUp end={pending} separator="," prefix={''} suffix={''} decimals={0}/>
                            </span>
                            </h4>
                            </Col>
                            <Col md={6}>
                                <div>
                                    <h5 className="mb-2 mt-1"><b>Confirmados</b></h5>
                                    <h4>
                                <span>
                                <i class={`text-${STATUS_COLORS.SUCCESS} uil-shopping-cart-alt me-2`}></i> &nbsp; <CountUp end={confirmed} separator="," prefix={''} suffix={''} decimals={0}/>
                                </span>
                                    </h4>
                                </div>
                            </Col>
                            <Col md={6}>
                            <div>
                                <h5 className="mb-2 mt-1"><b>Conciliados</b></h5>
                                <h4>
                                <span>
                                <i class={`text-${STATUS_COLORS.INFO} uil-shopping-cart-alt me-2`}></i> &nbsp; <CountUp end={reconcilied} separator="," prefix={''} suffix={''} decimals={0}/>
                                </span>
                                </h4>
                                </div>
                            </Col>
                            <Col md={6}>
                            <h5 className="mb-2 mt-1"><b>Impresos</b></h5>
                            <h4>
                            <span>
                            <i class={`text-${STATUS_COLORS.WARNING} uil-shopping-cart-alt me-2`}></i> &nbsp; <CountUp end={printed} separator="," prefix={''} suffix={''} decimals={0}/>
                            </span>
                            </h4>
                            </Col>
                            <Col md={6}>
                            <h5 className="mb-2 mt-1"><b>Anulados</b></h5>
                            <h4>
                            <span>
                            <i class={`text-${STATUS_COLORS.SECONDARY} uil-shopping-cart-alt me-2`}></i> &nbsp; <CountUp end={cancelled} separator="," prefix={''} suffix={''} decimals={0}/>
                            </span>
                            </h4>
                            </Col>
                        </Row>

                    </CardBody>
                </Card>
            </HasPermissions>
        </React.Fragment>
    )
}

const mapStateToProps = state => {
    const {users, loading, meta, refresh} = state.User
    return {users, loading, meta, refresh}
}
const mapDispatchToProps = dispatch => ({
    onGetUsers: (conditional = null, limit = DEFAULT_PAGE_LIMIT, page) => dispatch(getUsers(conditional, 6, page)),
})

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(OrderStatusStats)
