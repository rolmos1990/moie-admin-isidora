import React from "react"
import {Container} from "reactstrap"
import Breadcrumb from "../../components/Common/Breadcrumb";
import OfficeList from "./list/officeList";
import {PERMISSIONS} from "../../helpers/security_rol";
import NoAccess from "../../components/Common/NoAccess";
import HasPermissions from "../../components/HasPermissions";

const Offices = () => {
    return (
        <React.Fragment>
            <div className="page-content">
                <Container fluid>
                    <Breadcrumb path="/offices" title={null} item="Despachos"/>
                    <HasPermissions permissions={[PERMISSIONS.OFFICE_LIST]} renderNoAccess={() => <NoAccess/>}>
                        <OfficeList/>
                    </HasPermissions>
                </Container>
            </div>
        </React.Fragment>
    )
}

export default Offices;
