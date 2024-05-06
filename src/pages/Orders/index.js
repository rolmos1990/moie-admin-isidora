import React from "react"
import {Container} from "reactstrap"
import Breadcrumb from "../../components/Common/Breadcrumb";
import OrderList from "./orderList";
import HasPermissions from "../../components/HasPermissions";
import {PERMISSIONS} from "../../helpers/security_rol";
import NoAccess from "../../components/Common/NoAccess";

const Orders = () => {
    return (
        <React.Fragment>
            <div className="page-content">
                <Container fluid>
                    <Breadcrumb path="/orders" title={null} item="Pedidos"/>
                    <HasPermissions permission={PERMISSIONS.ORDER_LIST} renderNoAccess={() => <NoAccess/>}>
                        <OrderList/>
                    </HasPermissions>
                </Container>
            </div>
        </React.Fragment>
    )
}
export default Orders;
