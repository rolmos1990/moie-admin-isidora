import React from "react"
import {Container} from "reactstrap"
import Breadcrumb from "../../components/Common/Breadcrumb";
import PaymentsList from "./list/paymentsList";
import {PERMISSIONS} from "../../helpers/security_rol";
import NoAccess from "../../components/Common/NoAccess";
import HasPermissions from "../../components/HasPermissions";

const Payments = () => {
    return (
        <React.Fragment>
            <div className="page-content">
                <Container fluid>
                    <Breadcrumb path="/payments" title={null} item="Pagos"/>
                    <HasPermissions permissions={[PERMISSIONS.PAYMENT_LIST]} renderNoAccess={() => <NoAccess/>}>
                        <PaymentsList/>
                    </HasPermissions>
                </Container>
            </div>
        </React.Fragment>
    )
}

export default Payments;
