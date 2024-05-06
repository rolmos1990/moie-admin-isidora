const hasPermissionsFunc = (permissionsRequired = [], containAll) => {
    let authUser = JSON.parse(localStorage.getItem("authUserV2"));
    let permissions = authUser && authUser.user ? authUser.user.securityRol.permissions : [];
    if (!permissions || permissions.length === 0) {
        return false;
    }

    if (permissions.includes("admin")) {
        return true;
    }

    if (containAll) {
        return permissionsRequired.every(p => permissions.includes(p))
    }
    return permissionsRequired.some(p => permissions.includes(p))
};

export default hasPermissionsFunc;
