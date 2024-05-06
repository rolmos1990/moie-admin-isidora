import React from "react"
import {Container} from "reactstrap"
import Breadcrumb from "../../components/Common/Breadcrumb";
import BillConfigList from "./list/billConfigList";
import HasPermissions from "../../components/HasPermissions";
import {PERMISSIONS} from "../../helpers/security_rol";
import NoAccess from "../../components/Common/NoAccess";

const BillConfigs = () => {
    return (
        <React.Fragment>
            <div className="page-content">
                <Container fluid>
                    <Breadcrumb path="/billConfigs" title={null} item="Configuración de Facturación"/>
                    <HasPermissions permissions={[PERMISSIONS.BILL_LIST]} renderNoAccess={() => <NoAccess/>}>
                        <BillConfigList/>
                    </HasPermissions>
                </Container>
            </div>
        </React.Fragment>
    )
}

export default BillConfigs;
