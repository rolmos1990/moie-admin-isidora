import React, {useEffect, useState} from "react"
import PropTypes from "prop-types"
import {connect} from "react-redux"
import {Card, CardBody, Col, Row} from "reactstrap"
import paginationFactory, {PaginationListStandalone, PaginationProvider,} from "react-bootstrap-table2-paginator"
import ToolkitProvider from "react-bootstrap-table2-toolkit"
import BootstrapTable from "react-bootstrap-table-next"

import {Link} from "react-router-dom"
import {Button, Tooltip} from "@material-ui/core";
import {DEFAULT_PAGE_LIMIT} from "../../../common/pagination";
import {TableFilter} from "../../../components/TableFilter";
import {normalizeColumnsList} from "../../../common/converters";
import {getUsers, resetUser, setUserToChangePassword} from "../../../store/user/actions";
import userColumns from "./userColumn";
import NoDataIndication from "../../../components/Common/NoDataIndication";
import ForgetPassword from "./forgetPassword";
import {PERMISSIONS} from "../../../helpers/security_rol";
import HasPermissions from "../../../components/HasPermissions";

const UserList = props => {
    const {users, meta, onGetUsers, onResetUsers, onSelectUser, refresh} = props;
    const [usersList, setCategoriesList] = useState([])
    const [filter, setFilter] = useState(false);
    const [conditional, setConditional] = useState(null);
    const [defaultPage, setDefaultPage] = useState(1);


    const pageOptions = {
        sizePerPage: DEFAULT_PAGE_LIMIT,
        totalSize: meta?.totalRegisters, // replace later with size(users),
        custom: true,
        page: defaultPage,
        onPageChange: (page, sizePerPage) => {
            setDefaultPage(page);
        },
    }
    // const {SearchBar} = Search

    useEffect(() => {
        if(refresh === null){
            onResetUsers();
        }
        onGetUsers();
    }, [refresh, onGetUsers])

    useEffect(() => {
        setCategoriesList(users)
    }, [users])

    const handleTableChange = (type, {page}) => {
        onGetUsers(conditional, DEFAULT_PAGE_LIMIT, (page - 1) * DEFAULT_PAGE_LIMIT);
    }

    const onFilterAction = (condition) => {
        setConditional(condition);
        onGetUsers(condition, DEFAULT_PAGE_LIMIT, 0);
        setDefaultPage(1);
    }

    const columns = userColumns(onSelectUser);

    return (
        <>
            <Row>
                <TableFilter
                    onPressDisabled={() => setFilter(false)}
                    isActive={filter}
                    fields={columns}
                    onSubmit={onFilterAction.bind(this)}/>

                <Col lg={filter ? "8" : "12"}>
                    <Card>
                        <CardBody>
                            <PaginationProvider pagination={paginationFactory(pageOptions)}>
                                {({paginationProps, paginationTableProps}) => (
                                    <ToolkitProvider
                                        keyField="id"
                                        data={usersList || []}
                                        columns={normalizeColumnsList(columns)}
                                        bootstrap4
                                        search
                                    >
                                        {toolkitProps => (
                                            <React.Fragment>
                                                <Row className="row mb-2">
                                                    <Col md={6}>
                                                        <div className="form-inline mb-3">
                                                        <div className="search-box ms-2">
                                                            <h4 className="text-info"><i className="uil-users-alt me-2"></i> Usuarios</h4>
                                                        </div>
                                                    </div>
                                                    </Col>
                                                    <Col md={6}>
                                                        <div className="mb-3 float-md-end">
                                                            {columns.some(s => s.filter) && (
                                                                <Tooltip placement="bottom" title="Filtros Avanzados" aria-label="add">
                                                                    <Button onClick={() => setFilter(!filter)}>
                                                                        <i className={"mdi mdi-filter"}> </i>
                                                                    </Button>
                                                                </Tooltip>
                                                            )}
                                                            <HasPermissions permissions={[PERMISSIONS.USER_CREATE]}>
                                                                <Link to={"/user"} className="btn btn-primary waves-effect waves-light text-light">
                                                                    <i className="mdi mdi-plus"> </i> Nuevo usuario
                                                                </Link>
                                                            </HasPermissions>
                                                        </div>
                                                    </Col>
                                                </Row>
                                                <Row>
                                                    <Col xl="12">
                                                        <div className="table-responsive mb-4">
                                                            <BootstrapTable
                                                                remote
                                                                responsive
                                                                loading={true}
                                                                bordered={false}
                                                                striped={true}
                                                                classes={"table table-centered table-nowrap mb-0"}
                                                                noDataIndication={() => <NoDataIndication/>}
                                                                {...toolkitProps.baseProps}
                                                                onTableChange={handleTableChange}
                                                                {...paginationTableProps}
                                                            />
                                                        </div>
                                                    </Col>
                                                </Row>
                                                <div className="float-sm-start">
                                                    <PaginationListStandalone {...paginationProps} />
                                                </div>
                                            </React.Fragment>
                                        )}
                                    </ToolkitProvider>
                                )}
                            </PaginationProvider>
                        </CardBody>
                    </Card>
                </Col>
            </Row>
            <ForgetPassword/>
        </>
    )
}

UserList.propTypes = {
    users: PropTypes.array,
    onGetUsers: PropTypes.func,
}

const mapStateToProps = state => {
    const {users, loading, meta, refresh} = state.User
    return {users, loading, meta, refresh}
}

const mapDispatchToProps = dispatch => ({
    onResetUsers: () => {
        dispatch(resetUser());
    },
    onGetUsers: (conditional = null, limit = DEFAULT_PAGE_LIMIT, page) => dispatch(getUsers(conditional, limit, page)),
    onSelectUser: (user) => dispatch(setUserToChangePassword(user)),
    // onDeleteStates: (id) => dispatch(deleteState(id))
})

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(UserList)
