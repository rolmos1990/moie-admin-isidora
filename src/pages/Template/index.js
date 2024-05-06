import React from "react"
import {Container} from "reactstrap"
import Breadcrumb from "../../components/Common/Breadcrumb";
import TemplateList from "./list/templateList";
import HasPermissions from "../../components/HasPermissions";
import {PERMISSIONS} from "../../helpers/security_rol";
import NoAccess from "../../components/Common/NoAccess";

const Templates = () => {
    return (
        <React.Fragment>
            <div className="page-content">
                <Container fluid>
                    <Breadcrumb path="/templates" title={null} item="Plantillas"/>
                    <HasPermissions permissions={[PERMISSIONS.TEMPLATE_LIST]} renderNoAccess={() => <NoAccess/>}>
                        <TemplateList/>
                    </HasPermissions>
                </Container>
            </div>
        </React.Fragment>
    )
}

export default Templates;
