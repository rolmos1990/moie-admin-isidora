import React from "react"
import {Container} from "reactstrap"
import CustomersList from "./CustomerList/customers-list";
import Breadcrumb from "../../components/Common/Breadcrumb";
import {PERMISSIONS} from "../../helpers/security_rol";
import NoAccess from "../../components/Common/NoAccess";
import HasPermissions from "../../components/HasPermissions";

const Customer = () => {

    return (
        <React.Fragment>
            <div className="page-content">
                <Container fluid>
                    <Breadcrumb path="/customers" title={null} item="Clientes"/>
                    <HasPermissions permission={PERMISSIONS.CUSTOMER_LIST} renderNoAccess={() => <NoAccess/>}>
                        <CustomersList/>
                    </HasPermissions>
                </Container>
            </div>
        </React.Fragment>
    )
}

export default Customer
