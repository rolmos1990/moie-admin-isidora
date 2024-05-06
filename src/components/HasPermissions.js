import {connect} from 'react-redux';
import PropTypes from "prop-types";
import HasPermissionsFunc from "./HasPermissionsFunc";

const HasPermissions = ({permission, permissions, containAll, children, renderNoAccess}) => {
    if (HasPermissionsFunc(permission ? [permission] : permissions, containAll)) {
        return children;
    }
    return renderNoAccess ? renderNoAccess() : null;
};

HasPermissions.propTypes = {
    permission: PropTypes.string,
    permissions: PropTypes.array,
    containAll: PropTypes.bool,
    renderNoAccess: PropTypes.func
}

const mapStateToProps = (state, props) => {
    return {};
}

export default connect(mapStateToProps)(HasPermissions);
