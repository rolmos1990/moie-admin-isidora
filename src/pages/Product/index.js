import React from "react"
import {Container} from "reactstrap"
import Breadcrumb from "../../components/Common/Breadcrumb";
import ProductList from "./ProductList/products-list";
import HasPermissions from "../../components/HasPermissions";
import {PERMISSIONS} from "../../helpers/security_rol";
import NoAccess from "../../components/Common/NoAccess";

const Product = () => {

    return (
        <React.Fragment>
            <div className="page-content">
                <Container fluid>
                    <Breadcrumb path="/products" title={null} item="Productos"/>
                    <HasPermissions permission={PERMISSIONS.PRODUCT_LIST} renderNoAccess={() => <NoAccess/>}>
                        <ProductList/>
                    </HasPermissions>
                </Container>
            </div>
        </React.Fragment>
    )
}

export default Product
