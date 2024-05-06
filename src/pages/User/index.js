import React from "react"
import {Container} from "reactstrap"
import Breadcrumb from "../../components/Common/Breadcrumb";
import UserList from "./list/userList";
import HasPermissions from "../../components/HasPermissions";
import {PERMISSIONS} from "../../helpers/security_rol";
import NoAccess from "../../components/Common/NoAccess";

const Users = () => {
    return (
        <React.Fragment>
            <div className="page-content">
                <Container fluid>
                    <Breadcrumb path="/users" title={null} item="Usuarios"/>
                    <HasPermissions permissions={[PERMISSIONS.USER_LIST]} renderNoAccess={() => <NoAccess/>}>
                        <UserList/>
                    </HasPermissions>
                </Container>
            </div>
        </React.Fragment>
    )
}

export default Users;
