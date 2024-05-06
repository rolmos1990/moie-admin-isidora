import React from "react"
import {Container} from "reactstrap"
import Breadcrumb from "../../components/Common/Breadcrumb";
import PostSaleList from "./postSaleList";
import {PERMISSIONS} from "../../helpers/security_rol";
import NoAccess from "../../components/Common/NoAccess";
import HasPermissions from "../../components/HasPermissions";

const PostSale = () => {
    return (
        <React.Fragment>
            <div className="page-content">
                <Container fluid>
                    <Breadcrumb path="/postSales" title={null} item="Post Venta"/>
                    <HasPermissions permissions={[PERMISSIONS.POSTSALE_LIST]} renderNoAccess={() => <NoAccess/>}>
                        <PostSaleList/>
                    </HasPermissions>
                </Container>
            </div>
        </React.Fragment>
    )
}
export default PostSale;
