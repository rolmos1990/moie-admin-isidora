import React from "react"
import {Container} from "reactstrap"
import Breadcrumb from "../../components/Common/Breadcrumb";
import WalletList from "./list/walletList";
import {PERMISSIONS} from "../../helpers/security_rol";
import NoAccess from "../../components/Common/NoAccess";
import HasPermissions from "../../components/HasPermissions";

const Wallet = () => {
    return (
        <React.Fragment>
            <div className="page-content">
                <Container fluid>
                    <Breadcrumb path="/wallet" title={null} item="Billetera"/>
                    <HasPermissions permissions={[PERMISSIONS.WALLET_LIST]} renderNoAccess={() => <NoAccess/>}>
                        <WalletList/>
                    </HasPermissions>
                </Container>
            </div>
        </React.Fragment>
    )
}

export default Wallet;
