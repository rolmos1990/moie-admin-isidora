import React from "react"
import {Container} from "reactstrap"
import Breadcrumb from "../../components/Common/Breadcrumb";
import WalletList from "./list/itemsList";
import {PERMISSIONS} from "../../helpers/security_rol";
import NoAccess from "../../components/Common/NoAccess";
import HasPermissions from "../../components/HasPermissions";

const Item = () => {
    return (
        <React.Fragment>
            <div className="page-content">
                <Container fluid>
                    <Breadcrumb path="/items" title={null} item="Items"/>
                    <HasPermissions permissions={[PERMISSIONS.ITEMS_LIST]} renderNoAccess={() => <NoAccess/>}>
                        <WalletList/>
                    </HasPermissions>
                </Container>
            </div>
        </React.Fragment>
    )
}

export default Item;
