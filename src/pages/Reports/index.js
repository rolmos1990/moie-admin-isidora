import React from "react"
import {Container} from "reactstrap"
import Breadcrumb from "../../components/Common/Breadcrumb";
import Stats from "./Stats";
import HasPermissions from "../../components/HasPermissions";
import {PERMISSIONS} from "../../helpers/security_rol";
import NoAccess from "../../components/Common/NoAccess";

const Reports = () => {
    return (
        <React.Fragment>
            <div className="page-content Stats">
                <Container fluid>
                    <Breadcrumb path="/reports" title={null} item="Reportes"/>
                    <HasPermissions permissions={[PERMISSIONS.REPORT_LIST]} renderNoAccess={() => <NoAccess/>}>
                        <Stats/>
                    </HasPermissions>
                </Container>
            </div>
        </React.Fragment>
    )
}
export default Reports;
