import React from "react"
import {Container} from "reactstrap"
import Breadcrumb from "../../components/Common/Breadcrumb";
import SecurityManagement from "./SecurityManagement";
import {PERMISSIONS} from "../../helpers/security_rol";
import NoAccess from "../../components/Common/NoAccess";
import HasPermissions from "../../components/HasPermissions";

const Security = () => {
    return (
        <React.Fragment>
            <div className="page-content">
                <Container fluid>
                    <Breadcrumb path="/security" title={null} item="Seguridad"/>
                    <HasPermissions permissions={[PERMISSIONS.SECURITY_LIST]} renderNoAccess={() => <NoAccess/>}>
                        <SecurityManagement/>
                    </HasPermissions>
                </Container>
            </div>
        </React.Fragment>
    )
}

export default Security;
