import React from "react"
import {Container} from "reactstrap"
import Breadcrumb from "../../components/Common/Breadcrumb";
import MunicipalityList from "./list/municipalityList";
import {PERMISSIONS} from "../../helpers/security_rol";
import NoAccess from "../../components/Common/NoAccess";
import HasPermissions from "../../components/HasPermissions";

const Municipalities = () => {
    return (
        <React.Fragment>
            <div className="page-content">
                <Container fluid>
                    <Breadcrumb path="/municipalities" title={null} item="Municipios"/>
                    <HasPermissions permissions={[PERMISSIONS.LOCALITY_LIST]} renderNoAccess={() => <NoAccess/>}>
                        <MunicipalityList/>
                    </HasPermissions>
                </Container>
            </div>
        </React.Fragment>
    )
}

export default Municipalities;
