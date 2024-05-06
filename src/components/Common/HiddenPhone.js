import React from "react"
import HasPermissions from "../HasPermissions";
import {PERMISSIONS} from "../../helpers/security_rol";
import {hiddenPhone} from "../../common/utils";

export const HiddenPhone = props => {
    return (
        <HasPermissions permission={PERMISSIONS.CUSTOMER_PHONE}
                        renderNoAccess={<span>** ** ** {props && props.phone}</span>}>
            {props && props.phone}
        </HasPermissions>
    )
}
