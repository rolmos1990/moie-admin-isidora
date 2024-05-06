import React, {useEffect, useState} from "react"
import PropTypes from "prop-types"
import {connect} from "react-redux"
import {Card, CardBody, Col, Row, Spinner} from "reactstrap"
import paginationFactory, {PaginationListStandalone, PaginationProvider,} from "react-bootstrap-table2-paginator"
import ToolkitProvider from "react-bootstrap-table2-toolkit"
import BootstrapTable from "react-bootstrap-table-next"
import {DEFAULT_PAGE_LIMIT} from "../../common/pagination";
import {TableFilter} from "../../components/TableFilter";
import {normalizeColumnsList} from "../../common/converters";
import NoDataIndication from "../../components/Common/NoDataIndication";
import postSaleColumns from "./postSaleColumn";
import {Button, Tooltip} from "@material-ui/core";
import {doPrintBatchRequest, getOrders} from "../../store/order/actions";
import Conditionals from "../../common/conditionals";
import {importFile} from "../../store/office/actions";
import CustomModal from "../../components/Modal/CommosModal";
import PostSaleImportFileForm from "./PostSaleImportFileForm";
import PostSaleReportForm from "../Reports/PostSaleReportForm";
import {refreshAllStatusDelivery} from "../../helpers/backend_helper";
import {showMessage} from "../../components/MessageToast/ShowToastMessages";
import {PERMISSIONS} from "../../helpers/security_rol";
import HasPermissions from "../../components/HasPermissions";
import {clearTableConditions, saveTableConditions} from "../../store/layout/actions";

const PostSaleList = props => {
    const {orders, meta, onGetOrders, loading, refresh, customActions, onSaveTableConditions, onClearTableConditions, conditionType, conditions, offset} = props;
    const [statesList, setStatesList] = useState([])
    const [filter, setFilter] = useState(false);
    const [conditional, setConditional] = useState(null);
    const [openImportFileModal, setOpenImportFileModal] = useState(false);
    const [currentPage, setCurrentPage] = useState(null);
    const [filterable, setFilterable] = useState(true);
    const [openReportModal, setOpenReportModal] = useState(false);
    const [syncing, setSyncing] = useState(false);
    const [defaultPage, setDefaultPage] = useState(1);

    const pageOptions = {
        sizePerPage: DEFAULT_PAGE_LIMIT,
        totalSize: meta?.totalRegisters,
        custom: true,
        page: defaultPage,
        onPageChange: (page, sizePerPage) => {
            setDefaultPage(page);
            const offset = (page - 1) * DEFAULT_PAGE_LIMIT;
            onSaveTableConditions(conditions, offset, 'postSale');
        },
    }

    useEffect(() => {
        if (null !== refresh) {
            if(conditionType !== 'postSale'){
                onClearTableConditions();
                onGetOrders(conditional, DEFAULT_PAGE_LIMIT, currentPage * DEFAULT_PAGE_LIMIT);
            } else {
                //reload the filter loaded
                onFilterAction(conditions, offset);
            }
        } else {
            if(conditionType === 'postSale') {
                onFilterAction(conditions, offset);
            } else {
                onGetOrders(conditional);
                onClearTableConditions();
                if (customActions) {
                    setFilterable(false);
                }
            }
        }
    }, [refresh, onGetOrders])

    useEffect(() => {
        setStatesList(orders)
    }, [orders])

    const handleTableChange = (type, {page, searchText}) => {
        const offset = (page - 1) * DEFAULT_PAGE_LIMIT;
        onGetOrders(conditional, DEFAULT_PAGE_LIMIT, offset);
        onSaveTableConditions(conditional, offset, 'postSale');
    }

    const onFilterAction = (condition, offset = 0) => {

        const page = Math.floor(offset / DEFAULT_PAGE_LIMIT);
        setConditional(condition);

        onGetOrders(condition, DEFAULT_PAGE_LIMIT, offset);
        setDefaultPage(page + 1);

        if(condition && condition.length > 0) {
            onSaveTableConditions(condition, offset, 'postSale');
        } else {
            onClearTableConditions();
        }
    }

    const handleImportFile = (reload) => {
        setOpenImportFileModal(false);
        if(reload) onGetOrders(conditional, DEFAULT_PAGE_LIMIT, currentPage * DEFAULT_PAGE_LIMIT);
    }
//
    const syncAllDeliveries = async () => {
        if(!syncing) {
            setSyncing(true);
            const response = await refreshAllStatusDelivery();
            showMessage.success('Se verificaron un total de ' + response.updates + ' pedidos');
            setSyncing(false);
            onGetOrders(conditional, DEFAULT_PAGE_LIMIT, currentPage * DEFAULT_PAGE_LIMIT);
        }
    }

    const columns = postSaleColumns();

    return (
        <Row>
            <TableFilter
                onPressDisabled={() => setFilter(false)}
                isActive={filter && filterable}
                fields={columns}
                onSubmit={onFilterAction.bind(this)}/>

            <Col lg={filter && filterable ? "8" : "12"}>
                <Card>
                    <CardBody>
                        <PaginationProvider pagination={paginationFactory(pageOptions)}>
                            {({paginationProps, paginationTableProps}) => (
                                <ToolkitProvider
                                    keyField="id"
                                    data={statesList || []}
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
                                                            <h4 className="text-info"><i className="uil-shopping-cart-alt me-2"></i> Post Venta {conditionType && <small className={'font-size-12 badge rounded-pill bg-grey'}>Filtrados</small>}</h4>
                                                        </div>
                                                    </div>
                                                </Col>
                                                <Col md={6}>
                                                    <div className="mb-3 float-md-end d-flex">
                                                        {columns.some(s => s.filter) && (
                                                            <Tooltip placement="bottom" title="Filtros Avanzados" aria-label="add">
                                                                <Button onClick={() => setFilter(!filter)}>
                                                                    <i className={"mdi mdi-filter"}> </i>
                                                                </Button>
                                                            </Tooltip>
                                                        )}
                                                        <HasPermissions permission={PERMISSIONS.POSTSALE_CREATE}>
                                                        <Tooltip placement="bottom" title="Importar archivo" aria-label="add">
                                                            <Button onClick={() => setOpenImportFileModal(true)}>
                                                                <i className={"mdi mdi-file-excel"}> </i>
                                                            </Button>
                                                        </Tooltip>
                                                        </HasPermissions>
                                                        <Tooltip placement="bottom" title="Generar reporte" aria-label="add">
                                                            <Button onClick={() => setOpenReportModal(true)}>
                                                                <i className={"mdi mdi-file"}> </i>
                                                            </Button>
                                                        </Tooltip>
                                                        <HasPermissions permission={PERMISSIONS.POSTSALE_SYNC}>
                                                        <Tooltip placement="bottom" title="Sincronizar todas" aria-label="add">
                                                            <Button onClick={() => syncAllDeliveries()}>
                                                                {syncing && <Spinner size="sm" className="m-1" color="primary"/>}
                                                                <i className={"mdi mdi-refresh"}> </i>
                                                            </Button>
                                                        </Tooltip>
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
            <CustomModal title={"Importar"} showFooter={false} isOpen={openImportFileModal} onClose={() => setOpenImportFileModal(false)}>
                <PostSaleImportFileForm onCloseModal={(reload) => handleImportFile(reload)}/>
            </CustomModal>
            <CustomModal title={"Generar reporte"} showFooter={false} isOpen={openReportModal} onClose={() => setOpenReportModal(false)}>
                <PostSaleReportForm onCloseModal={() => setOpenReportModal(false)}/>
            </CustomModal>
        </Row>
    )
}

PostSaleList.propTypes = {
    states: PropTypes.array,
    onGetStates: PropTypes.func,
    onDeleteStates: PropTypes.func,
}

const mapStateToProps = state => {
    const {orders, loading, meta, refresh} = state.Order
    const {conditionType, conditions, offset} = state.Layout;
    return {orders, loading, meta, refresh, conditionType, conditions, offset}
}

const mapDispatchToProps = dispatch => ({
    onImportFile: (data) => dispatch(importFile(data)),
    onGetOrders: (conditional = null, limit = DEFAULT_PAGE_LIMIT, page) => {
        if(!conditional) conditional = [];
        if(conditional && conditional.filter(_item => _item.field === 'postSaleDate').length > 0){

        } else {
            conditional.push({field: 'postSaleDate', value: '', operator: Conditionals.OPERATORS.NOT_NULL});
        }
        //conditional.push({field:'orderDelivery.deliveryMethod', value: [1,3,4,5].join("::"), operator: Conditionals.OPERATORS.IN})
        const orderFields = {field:'postSaleDate',type: 'DESC'};
        dispatch(getOrders(conditional, limit, page, orderFields));
    },
    onPrintBatchRequest: (conditional) => dispatch(doPrintBatchRequest(conditional)),
    onSaveTableConditions: (conditions, offset, conditionType) => dispatch(saveTableConditions(conditions, offset, conditionType)),
    onClearTableConditions: () => dispatch(clearTableConditions())
})

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(PostSaleList)
