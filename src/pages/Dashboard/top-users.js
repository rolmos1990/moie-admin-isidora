import React, {useEffect, useState} from "react";
import {Card, CardBody, Table} from "reactstrap"

//Simple bar
import SimpleBar from "simplebar-react"

//Import Image
import avatar4 from "../../assets/images/users/avatar-4.jpg"
import avatar5 from "../../assets/images/users/avatar-5.jpg"
import avatar6 from "../../assets/images/users/avatar-6.jpg"
import avatar7 from "../../assets/images/users/avatar-7.jpg"
import avatar8 from "../../assets/images/users/avatar-8.jpg"
import {DEFAULT_PAGE_LIMIT} from "../../common/pagination";
import {getUsers} from "../../store/user/actions";
import {connect} from "react-redux";

const TopUsers = (props) => {
    const {users, meta, onGetUsers, loading, refresh} = props;
    const [usersList, setCategoriesList] = useState([])

    useEffect(() => {
        onGetUsers()
    }, [onGetUsers])

    useEffect(() => {
        setCategoriesList(users)
    }, [users])

    return (
        <React.Fragment>
            <Card>
                <CardBody>
                    <div className="float-end">
                    </div>
                    <h4 className="card-title mb-4">Usuarios</h4>
                    <SimpleBar style={{maxHeight: "336px"}}>
                        <div className="table-responsive">
                            <Table className="table-borderless table-centered table-nowrap">
                                <tbody>
                                {usersList.map((user, k) => (
                                    <tr key={k}>
                                        <td style={{width: "20px"}}>
                                            <i className="mdi mdi-account-circle m-0 font-size-20 text-primary"></i>
                                        </td>
                                        <td>
                                            <h6 className="font-size-15 mb-1 fw-normal">{`${user.name} ${user.lastname}`}</h6>
                                            <p className="text-muted font-size-13 mb-0">
                                                <i className="mdi mdi-mail"> </i> {user.email}
                                            </p>
                                        </td>
                                        <td className="text-muted fw-semibold text-end">
                                            {user.username}
                                        </td>
                                    </tr>
                                ))}
                                </tbody>
                            </Table>
                        </div>
                    </SimpleBar>
                </CardBody>
            </Card>
        </React.Fragment>
    )
}

const mapStateToProps = state => {
    const {users, loading, meta, refresh} = state.User
    return {users, loading, meta, refresh}
}
const mapDispatchToProps = dispatch => ({
    onGetUsers: (conditional = null, limit = DEFAULT_PAGE_LIMIT, page) => dispatch(getUsers(conditional, 6, page)),
})

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(TopUsers)
