import React, {useEffect, useState} from "react"
import PropTypes from "prop-types"
import {connect} from "react-redux"
import {Card, CardBody, Col, Row} from "reactstrap"
import paginationFactory, {PaginationListStandalone, PaginationProvider,} from "react-bootstrap-table2-paginator"
import ToolkitProvider from "react-bootstrap-table2-toolkit"
import BootstrapTable from "react-bootstrap-table-next"

import {Link} from "react-router-dom"
import {DEFAULT_PAGE_LIMIT} from "../../common/pagination";
import {TableFilter} from "../../components/TableFilter";
import {normalizeColumnsList} from "../../common/converters";
import NoDataIndication from "../../components/Common/NoDataIndication";
import orderColumns from "./orderColumn";
import {Button, Tooltip} from "@material-ui/core";
import {
    doConciliation,
    doPrintBatchRequest,
    getOrders,
    resetOrder
} from "../../store/order/actions";
import OrderEdit from "./orderEdit";
import Conditionals from "../../common/conditionals";
import CustomModal from "../../components/Modal/CommosModal";
import OrderConciliationForm from "./orderConciliationsForm";
import ConciliationReportForm from "../Reports/ConciliationReportForm";
import {PERMISSIONS} from "../../helpers/security_rol";
import HasPermissions from "../../components/HasPermissions";
import OutsideClickHandler from "../../components/OutsideClickHandler";
import {changePreloader} from "../../store/layout/actions";
import {showMessage} from "../../components/MessageToast/ShowToastMessages";

const OrderList = props => {
    const {orders, meta, onGetOrders, onResetOrders, refresh, customActions, conditionals, showAsModal, conciliation, onChangePreloader, externalView, reset, orderLimit} = props;
    const [statesList, setStatesList] = useState([])
    const [filter, setFilter] = useState(false);
    const [conditional, setConditional] = useState(null);
    const [orderSelected, setOrderSelected] = useState(null);
    const [ordersSelected, setOrdersSelected] = useState([]);
    const [currentPage, setCurrentPage] = useState(null);
    const [filterable, setFilterable] = useState(true);
    const [conciliationView, setConciliationView] = useState(null);
    const [openConfirmConciliationModal, setOpenConfirmConciliationModal] = useState(false);
    const [openReportConciliationModal, setOpenReportConciliationModal] = useState(false);
    const [columns, setColumns] = useState(orderColumns(setOrderSelected, showAsModal, false));
    const [selectAll, setSelectAll] = useState(false);
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
        setConditional([]);
    },[reset]);

    useEffect(() => {

        if (null !== refresh) {
                onGetOrders(getConditionals(), DEFAULT_PAGE_LIMIT, currentPage * DEFAULT_PAGE_LIMIT);
        } else {
            onResetOrders();
            if (customActions) {
                setFilterable(false);
            }

            onGetOrders(getConditionals());
        }

    }, [refresh, onGetOrders])

    useEffect(() => {
        if (null !== conciliationView) {
            onFilterAction(conditional);
        }
        setColumns(orderColumns(setOrderSelected, showAsModal, conciliationView));
    }, [conciliationView]);

    useEffect(() => {
        if (conciliationView && !conciliation.loading && conciliation.success) {
            setConciliationView(false);
        }
    }, [conciliation])

    useEffect(() => {
        setColumns(orderColumns(setOrderSelected, showAsModal, conciliationView));
    }, [statesList]);

    useEffect(() => {
        setStatesList(orders);
    }, [orders])

    // eslint-disable-next-line no-unused-vars
    const handleTableChange = (type, {page, searchText}) => {
        let p = page - 1;
        setCurrentPage(p);
        onGetOrders(getConditionals(), DEFAULT_PAGE_LIMIT, p * DEFAULT_PAGE_LIMIT);
    }

    const onFilterAction = (condition) => {
        let conditionals = condition || [];
        handleConciliateStatus(conditionals);
        setConditional(conditionals);
        onGetOrders(conditionals, DEFAULT_PAGE_LIMIT, 0);
        setDefaultPage(1);
    }

    const printOrders = () => {
        let conditionals = conditional ? [...conditional] : [];
        const totalPrintsAvailables = 1000;

        if(conditionals.length >= 0 && (meta?.totalRegisters <= totalPrintsAvailables)) {

            onChangePreloader(true);

            if (ordersSelected && ordersSelected.length === 1) {
                conditionals.push({field: 'id', value: ordersSelected[0], operator: Conditionals.OPERATORS.EQUAL});
            }
            if (ordersSelected && ordersSelected.length > 1) {
                conditionals.push({field: 'id', value: ordersSelected.join('::'), operator: Conditionals.OPERATORS.IN});
            }

            props.onPrintBatchRequest(conditionals);

        } else if(meta?.totalRegisters > totalPrintsAvailables){
            showMessage.error('Total de impresiones excede la capacidad a imprimir de '+totalPrintsAvailables +' elementos');

        }
        else{
            showMessage.error('Debe realizar algun filtro para poder realizar una impresión');

        }
    }

    const handleConciliateStatus = (conditionals) => {
        let statusFiltered = conditionals.find(c => c.field === 'status');
        let statusToConciliate = 4;//Enviada --> 4
        if (conciliationView) {
            if (statusFiltered) {
                statusFiltered.value = statusToConciliate;
            } else {
                conditionals.push({field: 'status', value: statusToConciliate, operator: Conditionals.OPERATORS.EQUAL});
            }
        } else if (statusFiltered && statusFiltered.value === statusToConciliate) {
            conditionals.splice(conditionals.indexOf(statusFiltered), 1);
        }
    }

    const showConciliationView = () => {
        setOrdersSelected([]);
        setConciliationView(true);
    }
    const hideConciliationView = () => {
        setOrdersSelected([]);
        setConciliationView(false);
    }

    const sendToConciliation = () => {
        props.onConciliation(ordersSelected, props.history);
    }

    const getConditionals = () => {
        const cond = conditional || [];
        const extConditions = conditionals || [];
        return [...cond, ...extConditions];
    }

    var selectRowProp = {
        mode: "checkbox",
        clickToSelect: true,
        onSelect: (row) => {
            let list = [...ordersSelected]

            const index = list.indexOf(row.id);
            if (index >= 0) {
                list.splice(index, 1);
            } else {
                list.push(row.id);
            }
            setOrdersSelected(list);
        },
        onSelectAll: (selected, rows) => {
            if (selected) {
                setOrdersSelected(rows.map(r => r.id));
            } else {
                setOrdersSelected([]);
            }
            setSelectAll(selected);
        }
    };

    const onPressAction = () => {
        let conditionals = conditional || [];

        if (ordersSelected && ordersSelected.length === 1) {
            conditionals.push({field: 'id', value: ordersSelected[0], operator: Conditionals.OPERATORS.EQUAL});
        }
        if (ordersSelected && ordersSelected.length > 1) {
            conditionals.push({field: 'id', value: ordersSelected.join('::'), operator: Conditionals.OPERATORS.IN});
        }

        /** TODO -- envio la condicion para procesar en orden superior */
        props.customActions(conditionals);
    };

    return (
        <Row>
            <CustomModal title={"Confirmar Conciliados"} size="lg" showFooter={false} isOpen={openConfirmConciliationModal} onClose={() => setOpenConfirmConciliationModal(false)}>
                <OrderConciliationForm onCloseModal={() => setOpenConfirmConciliationModal(false)}/>
            </CustomModal>
            <CustomModal title={"Generar reporte conciliados"} showFooter={false} isOpen={openReportConciliationModal} onClose={() => setOpenReportConciliationModal(false)}>
                <ConciliationReportForm onCloseModal={() => setOpenReportConciliationModal(false)}/>
            </CustomModal>

            <TableFilter
                onPressDisabled={() => setFilter(false)}
                isActive={filter && filterable}
                fields={columns}
                onSubmit={onFilterAction.bind(this)}/>

            <Col lg={filter && filterable ? "8" : "12"}>

                <Card>
                    {statesList && statesList.length > 0 ? (    <CardBody>
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
                                                    <Col md={4}>
                                                        <div className="form-inline mb-3">
                                                            <div className="search-box ms-2">
                                                                <h4 className="text-info">
                                                                    <i className="uil-shopping-cart-alt me-2"></i>
                                                                    {externalView ? 'Seleccionar un Pedido' : (
                                                                        conciliationView ? `Conciliar pedidos (${ordersSelected.length})` : 'Pedidos'
                                                                    )}
                                                                </h4>
                                                            </div>
                                                        </div>
                                                    </Col>
                                                    {customActions ? <Col md={8}>
                                                        <div className="mb-3 float-md-end">
                                                            <Tooltip placement="bottom" title="Aceptar" aria-label="add">
                                                                <Button onClick={() => onPressAction()} color="success" disabled={((ordersSelected.length === 0 && !selectAll) && (!conditional || conditional.length === 0)) || (orderLimit && orderLimit > 0 && ordersSelected.length > orderLimit)}>
                                                                    <i className={"mdi mdi-check"}> </i> &nbsp; Aceptar
                                                                </Button>
                                                            </Tooltip>
                                                        </div>
                                                    </Col> : (
                                                        <Col md={8}>
                                                            <div className="mb-3 float-md-end">
                                                                {columns.some(s => s.filter) && (
                                                                    <Tooltip placement="bottom" title="Filtros Avanzados" aria-label="add">
                                                                        <Button onClick={() => setFilter(!filter)}>
                                                                            <i className={"mdi mdi-filter"}> </i>
                                                                        </Button>
                                                                    </Tooltip>
                                                                )}
                                                                {!conciliationView && !externalView && (
                                                                    <>
                                                                        <Tooltip placement="bottom" title="Impresión multiple" aria-label="add">
                                                                            <Button color="primary" onClick={() => printOrders()}
                                                                                    disabled={(ordersSelected.length === 0 && !selectAll) && (!conditional || conditional.length === 0)}>
                                                                                <i className="mdi mdi-printer"> </i>
                                                                            </Button>
                                                                        </Tooltip>
                                                                        <Tooltip placement="bottom" title="Confirmar Conciliados" aria-label="add">
                                                                            <Button color="primary" onClick={() => setOpenConfirmConciliationModal(true)}>
                                                                                <i className="mdi mdi-check"> </i>
                                                                            </Button>
                                                                        </Tooltip>
                                                                        <Tooltip placement="bottom" title="Generar reporte conciliados" aria-label="add">
                                                                            <Button onClick={() => setOpenReportConciliationModal(true)}>
                                                                                <i className={"mdi mdi-file"}> </i>
                                                                            </Button>
                                                                        </Tooltip>
                                                                        <HasPermissions permission={PERMISSIONS.ORDER_CREATE}>
                                                                            <Link to={"/orders/create"} className="btn btn-primary waves-effect waves-light text-light">
                                                                                <i className="mdi mdi-plus"> </i> Crear pedido
                                                                            </Link>
                                                                        </HasPermissions>
                                                                    </>
                                                                )}

                                                                {conciliationView && (
                                                                    <>
                                                                        <Tooltip placement="bottom" title="Aceptar" aria-label="add">
                                                                            <Button color="primary" onClick={() => sendToConciliation()} disabled={ordersSelected.length === 0}>
                                                                                {!conciliation.loading && <i className="mdi mdi-check"> </i>}
                                                                                {conciliation.loading && <i className="fa fa-spinner fa-spin"> </i>}
                                                                                Aceptar
                                                                            </Button>
                                                                        </Tooltip>
                                                                        <Tooltip placement="bottom" title="Cancelar" aria-label="add">
                                                                            <Button color="default" onClick={() => hideConciliationView(false)}>
                                                                                Cancelar
                                                                            </Button>
                                                                        </Tooltip>
                                                                    </>
                                                                )}
                                                            </div>
                                                        </Col>
                                                    )}
                                                </Row>
                                                <Row>
                                                    <Col xl="12">
                                                        <div className="table-responsive mb-4">
                                                            <BootstrapTable
                                                                selectRow={selectRowProp}
                                                                remote
                                                                responsive
                                                                loading={true}
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
                    ): (
                        <div className="container">
                            <div style={{"margin": "50px 30px"}}>
                            <h6><i className="text-info uil-shopping-cart-alt me-2"></i>No se han encontrado pedidos asociados</h6>
                                {!conciliationView && !externalView && (
                                    <div>
                                    <Tooltip placement="bottom" title="Filtros Avanzados" aria-label="add">
                                        <Button onClick={() => setFilter(!filter)}>
                                            <i className={"mdi mdi-filter"}> </i>
                                        </Button>
                                    </Tooltip>
                                    </div>
                                )}
                                {!conciliationView && !externalView && (
                                    <div className="text-center mt-2 mb-2">
                                        <HasPermissions permission={PERMISSIONS.ORDER_CREATE}>
                                            <Link to={"/orders/create"} className="btn btn-primary waves-effect waves-light text-light">
                                                <i className="mdi mdi-plus"> </i> Crear pedido
                                            </Link>
                                        </HasPermissions>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </Card>
            </Col>
            <OutsideClickHandler
                onOutsideClick={() => {
                    if(orderSelected){
                        setOrderSelected(null)
                    }
                }}
            >
            {orderSelected && (<OrderEdit orderId={orderSelected} showOrderOverlay={true} onCloseOverlay={() => setOrderSelected(null)}/>)}
            </OutsideClickHandler>
        </Row>
    )
}

OrderList.propTypes = {
    states: PropTypes.array,
    onGetStates: PropTypes.func,
    onDeleteStates: PropTypes.func,
}

const mapStateToProps = state => {
    const {orders, loading, meta, refresh, conciliation, reset} = state.Order
    const {isPreloader} = state.Layout;
    return {
        orders,
        loading,
        meta,
        refresh,
        conciliation,
        isPreloader,
        reset
    }
}

const mapDispatchToProps = dispatch => ({
    onResetOrders: () => {
        dispatch(resetOrder());
    },
    onChangePreloader: (preloader) => dispatch(changePreloader(preloader)),
    onGetOrders: (conditional = null, limit = DEFAULT_PAGE_LIMIT, page) => dispatch(getOrders(conditional, limit, page, false, true)),
    onPrintBatchRequest: (conditional) => dispatch(doPrintBatchRequest(conditional)),
    onConciliation: (ordersSelected) => dispatch(doConciliation(ordersSelected)),
})

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(OrderList)
