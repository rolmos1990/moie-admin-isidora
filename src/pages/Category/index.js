import React from "react"
import {Container} from "reactstrap"
import Breadcrumb from "../../components/Common/Breadcrumb";
import CategoryList from "./list/categoryList";
import {PERMISSIONS} from "../../helpers/security_rol";
import HasPermissions from "../../components/HasPermissions";
import NoAccess from "../../components/Common/NoAccess";

const Categories = () => {
    return (
        <React.Fragment>
            <div className="page-content">
                <Container fluid>
                    <Breadcrumb path="/categories" title={null} item="Categorias"/>
                    <HasPermissions permission={PERMISSIONS.CATEGORY_LIST} renderNoAccess={() => <NoAccess/>}>
                        <CategoryList/>
                    </HasPermissions>
                </Container>
            </div>
        </React.Fragment>
    )
}

export default Categories;
