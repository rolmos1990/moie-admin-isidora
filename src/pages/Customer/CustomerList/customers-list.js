import React, {useEffect, useState} from "react"
import PropTypes from "prop-types"
import {connect} from "react-redux"
import {Card, CardBody, Col, Row} from "reactstrap"
import paginationFactory, {PaginationListStandalone, PaginationProvider,} from "react-bootstrap-table2-paginator"
import ToolkitProvider from "react-bootstrap-table2-toolkit"
import BootstrapTable from "react-bootstrap-table-next"

import customerColumn from "./customerColumn"
import {Link} from "react-router-dom"
import {deleteCustomer, getCustomerRegistereds, getCustomers, resetCustomer} from "../../../store/customer/actions";
import {Button, Tooltip} from "@material-ui/core";
import {DEFAULT_PAGE_LIMIT} from "../../../common/pagination";
import {ConfirmationModalAction} from "../../../components/Modal/ConfirmationModal";
import NoDataIndication from "../../../components/Common/NoDataIndication";
import {normalizeColumnsList} from "../../../common/converters";
import {TableFilter} from "../../../components/TableFilter";
import {countCustomersByStatus, countMayoristas} from "../../../helpers/service";
import StatsStatusCard from "../../../components/Common/StatsStatusCard";
import StatsRegisteredCard from "../../../components/Common/StatsRegisteredCard";
import CountUp from "react-countup";
import {PERMISSIONS} from "../../../helpers/security_rol";
import HasPermissions from "../../../components/HasPermissions";
import {clearTableConditions, saveTableConditions} from "../../../store/layout/actions";
import {generateReport} from "../../../store/reports/actions";
import {REPORT_TYPES} from "../../../common/constants";
import {formatDateToServer, formatDateToServerEndOfDay} from "../../../common/utils";
import Conditionals from "../../../common/conditionals";

const CustomersList = props => {
    const {customers, meta, onGetCustomers, onResetCustomers, onDeleteCustomer, onGetCustomerRegistereds, refresh, countCustomersByStatus, registereds, onSaveTableConditions, onClearTableConditions, conditionType, conditions, offset, onGenerateReport} = props;
    const [customerList, setCustomerList] = useState([])
    const [filter, setFilter] = useState(false);
    const [conditional, setConditional] = useState(null);
    const [countMayorista, setCountMayorista] = useState(0);
    const [defaultPage, setDefaultPage] = useState(1);
    const pageOptions = {
        sizePerPage: DEFAULT_PAGE_LIMIT,
        totalSize: meta?.totalRegisters,
        custom: true,
        page: defaultPage,
        onPageChange: (page, sizePerPage) => {
            setDefaultPage(page);
            const offset = (page - 1) * DEFAULT_PAGE_LIMIT;
            onSaveTableConditions(conditions, offset, 'customer');
        },
    }

    useEffect(() => {

        onGetCustomerRegistereds();
        countMayoristas().then(data => {
            if (data[1]) {
                setCountMayorista(data[1])
            }
        })

        if(conditionType !== 'customer'){
            onClearTableConditions();
            onResetCustomers();
            onGetCustomers();
        } else {
            //reload the filter loaded
            onFilterAction(conditions, offset);
        }


    }, [refresh, onGetCustomers])

    useEffect(() => {
        setCustomerList(customers)
    }, [customers])

    const handleTableChange = (type, {page}) => {
        onGetCustomers(conditional, DEFAULT_PAGE_LIMIT, (page - 1) * DEFAULT_PAGE_LIMIT);
    }

    const onFilterAction = (condition) => {
        const page = Math.floor(offset / DEFAULT_PAGE_LIMIT);
        setConditional(condition);
        onGetCustomers(condition, DEFAULT_PAGE_LIMIT, offset);
        setDefaultPage(page + 1);
        if(condition && condition.length > 0) {
            onSaveTableConditions(condition, offset, 'customer');
        } else {
            onClearTableConditions();
        }

    }
    const onConfirmDelete = (id) => {
        onDeleteCustomer(id);
    };

    const onDelete = (id) => {
        ConfirmationModalAction({
            title: '¿Seguro desea eliminar Cliente?',
            description: 'Usted está eliminado este cliente, una vez eliminado no podrá ser recuperado.',
            id: '_clienteModal',
            onConfirm: () => onConfirmDelete(id)
        });
    };

    const onDownload = () => {
        console.log('payload: ', conditional);
        onGenerateReport({
            conditional,
            limit: 100,
            offset: 0
        });
    };

    const columns = customerColumn(onDelete);

    return (
        <>
            <Row className="text-center">
                <Col md={4}>
                    <StatsStatusCard title="Clientes" getData={countCustomersByStatus}/>
                </Col>
                <Col md={4}>
                    <StatsRegisteredCard title="Clientes Registrados esta semana" getData={registereds.lastWeek} getDataToday={registereds.today}/>
                </Col>
                <Col md={4}>
                    <Card>
                        <CardBody>
                            <div className="float-end mt-2">
                                <Tooltip placement="bottom" title="Clientes mayoristas" aria-label="add">
                                    <i className="mdi mdi-crown font-size-24 mr-1 text-warning p-3"> </i>
                                </Tooltip>
                            </div>
                            <div>
                                <h4 className="mb-1 mt-2">
                                    <CountUp end={countMayorista} separator="," decimals={0}/>
                                </h4>
                                <p className="text-muted mb-0">{"Clientes mayoristas"}</p>
                            </div>
                            <p className="text-muted mb-0 mt-3">
                            </p>
                        </CardBody>
                    </Card>
                </Col>
            </Row>
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
                                        data={customerList || []}
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
                                                                <h4 className="text-info"><i className="uil-users-alt me-2"></i> Clientes {conditionType && <small className={'font-size-12 badge rounded-pill bg-grey'}>Filtrados</small>}</h4>
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
                                                            <HasPermissions permission={PERMISSIONS.CUSTOMER_EXPORT}>
                                                                <Tooltip placement="bottom" title="Descargar Clientes" aria-label="add">
                                                                <button onClick={() => onDownload()}  className="btn btn-secondary waves-effect waves-light text-light mr-5">
                                                                    <i className="mdi mdi-file"></i>
                                                                </button>
                                                                </Tooltip>
                                                            </HasPermissions>
                                                            <HasPermissions permission={PERMISSIONS.CUSTOMER_CREATE}>
                                                                <Link to={"/customer"} className="btn btn-primary waves-effect waves-light text-light">
                                                                    <i className="mdi mdi-plus"></i> Nuevo Cliente
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

CustomersList.propTypes = {
    customers: PropTypes.array,
    onGetCustomers: PropTypes.func,
}

const mapStateToProps = state => {
    const {customers, loading, meta, refresh, custom, registereds} = state.Customer
    const {conditionType, conditions, offset} = state.Layout;
    return {customData: custom, customers, loading, meta, refresh, registereds, conditionType, conditions, offset}
}

const mapDispatchToProps = dispatch => ({
    onResetCustomers: () => {
        dispatch(resetCustomer());
    },
    onGetCustomerRegistereds: () => {
        dispatch(getCustomerRegistereds());
    },
    countCustomersByStatus,
    countMayoristas,
    onGetCustomers: (conditional = null, limit = DEFAULT_PAGE_LIMIT, page) => dispatch(getCustomers(conditional, limit, page)),
    onDeleteCustomer: (id) => dispatch(deleteCustomer(id)),
    onSaveTableConditions: (conditions, offset, conditionType) => dispatch(saveTableConditions(conditions, offset, conditionType)),
    onClearTableConditions: () => dispatch(clearTableConditions()),
    onGenerateReport: (data) => dispatch(generateReport(REPORT_TYPES.CUSTOMER, data)),
})

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(CustomersList)
