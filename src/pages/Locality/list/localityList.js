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
import NoDataIndication from "../../../components/Common/NoDataIndication";
import {normalizeColumnsList} from "../../../common/converters";
import {TableFilter} from "../../../components/TableFilter";
import {PERMISSIONS} from "../../../helpers/security_rol";
import HasPermissions from "../../../components/HasPermissions";
import localityColumn from "./localityColumn";
import {getDeliveryLocalities} from "../../../store/deliveryLocality/actions";

const LocalityList = props => {
    const {deliveryLocalities, meta, onGetDeliveryLocalities} = props;
    const [deliveryLocalityList, setDeliveryLocalityList] = useState([])
    const [filter, setFilter] = useState(false);
    const [conditional, setConditional] = useState(null);
    const [defaultPage, setDefaultPage] = useState(1);

    const pageOptions = {
        sizePerPage: DEFAULT_PAGE_LIMIT,
        totalSize: meta?.totalRegisters,
        custom: true,
        page: defaultPage,
        onPageChange: (page, sizePerPage) => {
            setDefaultPage(page);
        },
    }

    useEffect(() => {
        onGetDeliveryLocalities();
    }, [onGetDeliveryLocalities])

    useEffect(() => {
        setDeliveryLocalityList(deliveryLocalities)
    }, [deliveryLocalities])

    const handleTableChange = (type, {page}) => {
        onGetDeliveryLocalities(conditional, DEFAULT_PAGE_LIMIT, (page - 1) * DEFAULT_PAGE_LIMIT);
    }

    const onFilterAction = (condition) => {
        setConditional(condition);
        onGetDeliveryLocalities(condition, DEFAULT_PAGE_LIMIT, 0);
        setDefaultPage(1);
    }

    const columns = localityColumn(null);

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
                            <PaginationProvider
                                pagination={paginationFactory(pageOptions)}
                            >
                                {({paginationProps, paginationTableProps}) => (
                                    <ToolkitProvider
                                        keyField="id"
                                        data={deliveryLocalityList || []}
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
                                                                <h4 className="text-info"><i className="uil-users-alt me-2"></i> Localidades </h4>
                                                            </div>
                                                        </div>
                                                    </Col>
                                                    <Col md={6}>
                                                        <div className="mb-3 float-md-end">
                                                            <Tooltip placement="bottom" title="Filtros Avanzados" aria-label="add">
                                                                <Button onClick={() => setFilter(!filter)}>
                                                                    <i className={"mdi mdi-filter"}></i>
                                                                </Button>
                                                            </Tooltip>
                                                            <HasPermissions permission={PERMISSIONS.DELIVERY_LOCALITY_CREATE}>
                                                                <Link to={"/deliveryLocality"} className="btn btn-primary waves-effect waves-light text-light">
                                                                    <i className="mdi mdi-plus"></i> Nueva Localidad
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
                                                    <PaginationListStandalone {...paginationProps}/>
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
        </>
    )
}

LocalityList.propTypes = {
    deliveryLocalities: PropTypes.array,
    onGetDeliveryLocalities: PropTypes.func,
}

const mapStateToProps = state => {
    const {deliveryLocalities, loading, meta} = state.DeliveryLocality
    return {deliveryLocalities, loading, meta}
}

const mapDispatchToProps = dispatch => ({
    onGetDeliveryLocalities: (conditional = null, limit = DEFAULT_PAGE_LIMIT, page) => dispatch(getDeliveryLocalities(conditional, limit, page)),
})

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(LocalityList)
