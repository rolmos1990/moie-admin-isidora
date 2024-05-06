import React, {useEffect, useState} from "react"
import PropTypes from "prop-types"
import {connect} from "react-redux"
import {Card, CardBody, Col, Row} from "reactstrap"
import paginationFactory, {PaginationListStandalone, PaginationProvider,} from "react-bootstrap-table2-paginator"
import ToolkitProvider, {Search} from "react-bootstrap-table2-toolkit"
import BootstrapTable from "react-bootstrap-table-next"

import {Link} from "react-router-dom"
import {Button, Tooltip} from "@material-ui/core";
import {DEFAULT_PAGE_LIMIT} from "../../../common/pagination";
import {getItems, resetItem} from "../../../store/items/actions";
import itemsColumns from "./itemsColumn";
import {TableFilter} from "../../../components/TableFilter";
import {normalizeColumnsList} from "../../../common/converters";
import NoDataIndication from "../../../components/Common/NoDataIndication";
import HasPermissions from "../../../components/HasPermissions";
import {PERMISSIONS} from "../../../helpers/security_rol";
import NoAccess from "../../../components/Common/NoAccess";
import Conditionals from "../../../common/conditionals";

const ItemsList = props => {
    const {items, meta, onGetItems, onResetitems, refresh, loading} = props;
    const [itemsList, setWalletsList] = useState([])
    const [filter, setFilter] = useState(false);
    const [conditional, setConditional] = useState(null);
    const [defaultPage, setDefaultPage] = useState(1);
    const [type, setType] = useState(2);

    const pageOptions = {
        sizePerPage: DEFAULT_PAGE_LIMIT,
        totalSize: meta?.totalRegisters,
        custom: true,
        page: defaultPage,
        onPageChange: (page, sizePerPage) => {
            setDefaultPage(page);
        },
    }

    useEffect( () => {

        const conditions = new Conditionals.Condition;
        conditions.add('type', type, Conditionals.OPERATORS.EQUAL);
        onGetItems(conditions.condition);

    }, [type])

    useEffect(() => {
        if(refresh === null){
            onResetitems();
            onGetItems()
        } else {

            const conditions = new Conditionals.Condition;
            conditions.add('type', type, Conditionals.OPERATORS.EQUAL);

            onGetItems(conditions.condition);
        }
    }, [refresh, onGetItems])

    useEffect(() => {
        setWalletsList(items)
    }, [items])

    // eslint-disable-next-line no-unused-vars
    const handleTableChange = (type, {page, searchText}) => {
        onGetItems(conditional, DEFAULT_PAGE_LIMIT, (page - 1)*DEFAULT_PAGE_LIMIT);
    }

    const onFilterAction = (condition) => {
        setConditional(condition);
        onGetItems(condition, DEFAULT_PAGE_LIMIT, 0);
        setDefaultPage(1);
    }

    const columns = itemsColumns();

    return (
        <Row>
            <TableFilter
                onPressDisabled={() => setFilter(false)}
                isActive={filter}
                fields={columns}
                onSubmit={onFilterAction.bind(this)}/>

            <Col lg={filter ? "8" : "12"}>
                <Card>
                    <CardBody>
                        <div className="button-items mb-3">
                        <button onClick={() => setType(2)} className={`btn ${type == 2 ? 'btn-primary' : 'btn-secondary'}`}>Bolsas</button>
                        <button onClick={() => setType(1)} className={`btn ${type == 1 ? 'btn-primary' : 'btn-secondary'}`}>Interrapidisimo</button>
                        </div>

                        <PaginationProvider pagination={paginationFactory(pageOptions)}>
                            {({paginationProps, paginationTableProps}) => (
                                <ToolkitProvider
                                    keyField="id"
                                    data={itemsList || []}
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
                                                            <h4 className="text-info"><i className="uil-shopping-cart-alt me-2"></i> Items</h4>
                                                        </div>
                                                    </div>
                                                </Col>
                                                <Col md={6}>
                                                    <div className="mb-3 float-md-end">
                                                        {/*{columns.some(s => s.filter) && (
                                                            <Tooltip placement="bottom" title="Filtros Avanzados" aria-label="add">
                                                                <Button onClick={() => setFilter(!filter)}>
                                                                    <i className={"mdi mdi-filter"}></i>
                                                                </Button>
                                                            </Tooltip>
                                                        )}*/}
                                                        <HasPermissions permissions={[PERMISSIONS.ITEMS_CREATE]} renderNoAccess={() => <NoAccess/>}>
                                                            <Link to={"/item"} className="btn btn-primary waves-effect waves-light text-light">
                                                                <i className="mdi mdi-plus"></i> Nuevo registro
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
                                                            loading={loading}
                                                            bordered={false}
                                                            striped={true}
                                                            classes={
                                                                "table table-centered table-nowrap mb-0"
                                                            }
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
    )
}

ItemsList.propTypes = {
    items: PropTypes.array,
    onGetItems: PropTypes.func,
    onDeleteWallets: PropTypes.func,
}

const mapWalletToProps = state => {
    const {items, loading, meta, refresh} = state.Item
    return {items, loading, meta, refresh}
}

const mapDispatchToProps = dispatch => ({
    onResetitems: () => {
        dispatch(resetItem());
    },
    onGetItems: (conditional = null, limit = DEFAULT_PAGE_LIMIT, page) => dispatch(getItems(conditional, limit, page))
})

export default connect(
    mapWalletToProps,
    mapDispatchToProps
)(ItemsList)
