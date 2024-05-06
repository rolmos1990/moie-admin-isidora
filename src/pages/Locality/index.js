import React from "react"
import {Container} from "reactstrap"
import Breadcrumb from "../../components/Common/Breadcrumb";
import LocalityList from "./list/localityList";
import {PERMISSIONS} from "../../helpers/security_rol";
import HasPermissions from "../../components/HasPermissions";
import NoAccess from "../../components/Common/NoAccess";

const Locality = () => {
    return (
        <React.Fragment>
            <div className="page-content">
                <Container fluid>
                    <Breadcrumb path="/deliveryLocalities" title={null} item="Localidades"/>
                    <HasPermissions permission={PERMISSIONS.DELIVERY_LOCALITY_LIST} renderNoAccess={() => <NoAccess/>}>
                        <LocalityList/>
                    </HasPermissions>
                </Container>
            </div>
        </React.Fragment>
    )
}

export default Locality;
