import React from "react"
import {Container} from "reactstrap"
import Breadcrumb from "../../components/Common/Breadcrumb";
import BillList from "./list/billList";
import HasPermissions from "../../components/HasPermissions";
import {PERMISSIONS} from "../../helpers/security_rol";
import NoAccess from "../../components/Common/NoAccess";

const Bills = () => {
    return (
        <React.Fragment>
            <div className="page-content">
                <Container fluid>
                    <Breadcrumb path="/bills" title={null} item="Facturas"/>
                    <HasPermissions permissions={[PERMISSIONS.BILL_LIST]} renderNoAccess={() => <NoAccess/>}>
                        <BillList/>
                    </HasPermissions>
                </Container>
            </div>
        </React.Fragment>
    )
}

export default Bills;
