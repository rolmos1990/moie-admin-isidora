import React, {useEffect, useState} from "react"
import PropTypes from 'prop-types'
import {Link} from "react-router-dom"
import {Col, Dropdown, DropdownMenu, DropdownToggle, Row} from "reactstrap"
import SimpleBar from "simplebar-react"

//Import images
import userImage from "../../../assets/images/users/user.png"

//i18n
import {connect} from "react-redux";
import {countUsersOrders} from "../../../helpers/service";
import {getImagePath, priceFormat} from "../../../common/utils";
import {Tooltip} from "@material-ui/core";

const UsersSalesDropdown = ({countUsers}) => {

    const [loading, setLoading] = useState(false)
    const [menu, setMenu] = useState(false)
    const [users, setUsers] = useState([])
    const [mainUser, setMainUser] = useState({})

    useEffect(() => {
        findData(countUsers);
    }, [countUsers])

    const findData = (countUsers) => {
        const resp = countUsers;
        if (resp && resp.data && resp.data.length > 0) {
            let u = [];

/*            resp.data = [
                {totalAmount: 1800, origen: 6, user: {id: 1, name: 'Ramon', image: null}},
                {totalAmount: 2000, origen: 5, user: {id: 3, name: 'Andres', image: null}},
                {totalAmount: 3000, origen: 6, user: {id: 4, name: 'Michael', image: null}},
                {totalAmount: 1500, origen: 1, user: {id: 5, name: 'Jose', image: null}},
                {totalAmount: 1800, origen: 7, user: {id: 2, name: 'Mario', image: null}},
            ];*/

            resp.data.filter(o => o.user && o.user.id).forEach(o => u.push({name: o.user.name, sales: o.origen, amountNumber: parseFloat(o.totalAmount), amount: priceFormat(o.totalAmount), image: getImagePath(o.user?.photo)}))

            const limit = 8;

            u = u.sort(function (a, b) {
                if(a.sales === b.sales)
                {
                    return (a.amountNumber > b.amountNumber) ? -1 : (a.amountNumber < b.amountNumber) ? 1 : 0;
                }
                else
                {
                    return (a.sales > b.sales) ? -1 : 1;
                }
            });

            //u = u.sort((a, b) => a.sales === b.sales ? 0 : (a.sales > b.sales) ? -1 : 1);

            if (u.length > limit) {
                u.splice(limit);
            }

            if (u.length > 0) {
                let user = u[0];
                user.hasCrown = true;
            }

            setUsers(u);
            setMainUser(u[0]);
        }
    }

    return (
        <>
            <div className="user-sales-dropdown-menu">
                <Dropdown
                    isOpen={menu}
                    toggle={() => setMenu(!menu)}
                    className="dropdown d-inline-block"
                    tag="li"
                >
                    <DropdownToggle
                        className="btn header-item noti-icon waves-effect"
                        tag="button"
                        id="page-header-notifications-dropdown"
                    >
                        <img className="rounded-circle header-profile-user" src={mainUser.image || userImage} alt="Header Avatar"/>
                        <span className="badge rounded-pill"><i className={"mdi mdi-crown font-size-18 mr-1 text-warning"}> </i></span>
                    </DropdownToggle>

                    <DropdownMenu className="dropdown-menu-lg dropdown-menu-end p-0">
                        <div className="p-3">
                            <Row className="align-items-center">
                                <Col xs={10}>
                                    <h6 className="m-0 font-size-16"> Ventas por usuarios</h6>
                                </Col>
                                <Col xs={2} className="text-right">
                                    <Tooltip placement="bottom" title="Refrescar" aria-label="add">
                                        <button size="small" className="btn btn-sm text-primary" onClick={() => findData()}>
                                            {!loading && <i className="uil uil-refresh"> </i>}
                                            {loading && <i className="fa fa-spinner fa-spin"> </i>}
                                        </button>
                                    </Tooltip>
                                </Col>
                            </Row>
                        </div>
                        <SimpleBar style={{height: "284px"}}>
                            {users.map((user, k) => (
                                <Link to="" key={k} className="text-reset notification-item">
                                    <div className="d-flex p-1">
                                        <img  src={user.image} className="me-3 rounded-circle avatar-xs" alt="user-pic"/>
                                        <div className="flex-1">
                                            <h6 className="mt-0 mb-1">{user.hasCrown && <i className={"mdi mdi-crown font-size-18 mr-1 text-warning"}> </i>}{user.name}</h6>
                                            <div className="font-size-12 text-muted">
                                                <p className="mb-1">
                                                    Pedidos completados {user.sales}
                                                </p>
                                                <p className="mb-0">
                                                    <i className="fa fa-dollar-sign"/>{" "} {user.amount}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </SimpleBar>
                    </DropdownMenu>
                </Dropdown>
            </div>
        </>
    )
}

const mapStateToProps = state => {
    const {countUsers} = state.User
    return {countUsers}
}
const mapDispatchToProps = dispatch => ({
    countUsersOrders,
})

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(UsersSalesDropdown)

UsersSalesDropdown.propTypes = {
    t: PropTypes.any
}
