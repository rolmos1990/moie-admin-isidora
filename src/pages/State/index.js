import React from "react"
import {Container} from "reactstrap"
import Breadcrumb from "../../components/Common/Breadcrumb";
import StatesList from "./list/statesList";
import {PERMISSIONS} from "../../helpers/security_rol";
import NoAccess from "../../components/Common/NoAccess";
import HasPermissions from "../../components/HasPermissions";

const States = () => {
    return (
        <React.Fragment>
            <div className="page-content">
                <Container fluid>
                    <Breadcrumb path="/states" title={null} item="Estados"/>
                    <HasPermissions permissions={[PERMISSIONS.LOCALITY_LIST]} renderNoAccess={() => <NoAccess/>}>
                        <StatesList/>
                    </HasPermissions>
                </Container>
            </div>
        </React.Fragment>
    )
}

export default States;
