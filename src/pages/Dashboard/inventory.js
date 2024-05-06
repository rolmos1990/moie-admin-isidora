import React, {useEffect, useState} from "react";
import {Card, CardBody, Table} from "reactstrap"

//Simple bar
import SimpleBar from "simplebar-react"

//Import Image
import {DEFAULT_PAGE_LIMIT} from "../../common/pagination";
import {getUsers} from "../../store/user/actions";
import {connect} from "react-redux";
import {fetchInventoryProductsApi, fetchProductsApi} from "../../helpers/backend_helper";
import CountUp from "react-countup";
import {PERMISSIONS} from "../../helpers/security_rol";
import HasPermissions from "../../components/HasPermissions";

const Inventory = (props) => {
    const {users, meta, onGetUsers, loading, refresh} = props;
    const [price, setPrice] = useState(0);
    const [qty, setQty] = useState(0);

    useEffect(() => {

        fetchInventoryProductsApi({}).then((p => {
            if (p && p.data && p.data[0]) {
                setPrice(p.data[0].cost);
                setQty(p.data[0].qty);
                console.log('p: data', p.data);
                //props.history.push(`/product/detail/${p.data[0].id}`);
            }
        }))

    }, [onGetUsers])

    const renderInventario = () => {
        return <Card>
            <CardBody>
                <h5>Total en Inventario</h5> <br />
                <div>
                    <h4 className="mb-1 mt-1">
                        <span>
                            <i class="text-success uil-money-bill me-2"></i> &nbsp; -
                        </span>
                    </h4>
                    <p className="text-muted mb-0">Monto</p>
                </div>

                <div>
                    <h4 className="mb-1 mt-1">
                        <span>
                            <i class="text-warning uil-box me-2"></i> &nbsp; -
                        </span>
                    </h4>
                    <p className="text-muted mb-0">Cantidades</p>
                </div>
            </CardBody>
        </Card>
    }


    return (
        <React.Fragment>
            <HasPermissions permission={PERMISSIONS.DASHBOARD_INVENTORY} renderNoAccess={renderInventario}>
            <Card>
                <CardBody>
                    <h5>Total en Inventario</h5> <br />
                    <div>
                        <h4 className="mb-1 mt-1">
                        <span>
                            <i class="text-success uil-money-bill me-2"></i> &nbsp; <CountUp end={price} separator="," prefix={'$'} suffix={''} decimals={2}/>
                        </span>
                        </h4>
                        <p className="text-muted mb-0">Monto</p>
                    </div>

                    <div>
                        <h4 className="mb-1 mt-1">
                        <span>
                            <i class="text-warning uil-box me-2"></i> &nbsp; <CountUp end={qty} separator="," prefix={''} suffix={''} decimals={2}/>
                        </span>
                        </h4>
                        <p className="text-muted mb-0">Cantidades</p>
                    </div>

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
)(Inventory)
