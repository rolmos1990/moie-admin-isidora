import React, {useEffect, useState} from "react"
import PropTypes from "prop-types"
import {connect} from "react-redux"
import {Card, CardBody, Col, Row} from "reactstrap"
import paginationFactory, {PaginationListStandalone, PaginationProvider,} from "react-bootstrap-table2-paginator"
import ToolkitProvider from "react-bootstrap-table2-toolkit"
import BootstrapTable from "react-bootstrap-table-next"
import {Button, Tooltip} from "@material-ui/core";
import {DEFAULT_PAGE_LIMIT} from "../../../common/pagination";
import {ConfirmationModalAction} from "../../../components/Modal/ConfirmationModal";
import {getBills, registerBill, resetBill} from "../../../store/bill/actions";
import {TableFilter} from "../../../components/TableFilter";
import billColumns from "./billColumns";
import {normalizeColumnsList} from "../../../common/converters";
import Conditionals from "../../../common/conditionals";
import NoDataIndication from "../../../components/Common/NoDataIndication";
import CustomModal from "../../../components/Modal/CommosModal";
import OrderList from "../../Orders/orderList";
import BillGenerateReportForm from "../../Reports/BillsReportForm";
import HasPermissions from "../../../components/HasPermissions";
import {PERMISSIONS} from "../../../helpers/security_rol";
import {CHARGE_ON_DELIVERY, DELIVERY_METHODS_IDS, ORDERS_ENUM} from "../../../common/constants";
import {clearTableConditions, saveTableConditions} from "../../../store/layout/actions";

const BillList = props => {
    const {states, bills, meta, getStates, onGetBills, onResetBill, loading, refresh, onSaveTableConditions, onClearTableConditions, conditionType, conditions, offset} = props; //onDeleteBill,
    const [billList, setBillList] = useState([])
    const [filter, setFilter] = useState(false);
    const [conditional, setConditional] = useState(null);
    const [openOrdersModal, setOpenOrdersModal] = useState(false);
    const [orderListConditions, setOrderListConditions] = useState([]);
    const [openReportModal, setOpenReportModal] = useState(false);
    const [defaultPage, setDefaultPage] = useState(1);

    const pageOptions = {
        sizePerPage: DEFAULT_PAGE_LIMIT,
        custom: true,
        totalSize: meta?.totalRegisters,
        page: defaultPage,
        onPageChange: (page, sizePerPage) => {
            setDefaultPage(page);
            const offset = (page - 1) * DEFAULT_PAGE_LIMIT;
            onSaveTableConditions(conditions, offset, 'bill');
        },
    }
    useEffect(() => {
        if(refresh === null){
            onResetBill();
        }

        if(conditionType !== 'bill'){
            onClearTableConditions();
            onGetBills();
        } else {
            //reload the filter loaded
            onFilterAction(conditions, offset);
        }
    }, [refresh, onGetBills])

    useEffect(() => {
        setBillList(bills);
    }, [bills])

    // eslint-disable-next-line no-unused-vars
    const handleTableChange = (type, {page, searchText}) => {
        const offset = (page - 1) * DEFAULT_PAGE_LIMIT;
        onGetBills(conditional, DEFAULT_PAGE_LIMIT, offset);
        onSaveTableConditions(conditional, offset, 'bill');
    }

    const onFilterAction = (condition, offset = 0) => {
        const page = Math.floor(offset / DEFAULT_PAGE_LIMIT);

        let creditMemo = condition.find(c => c.field === 'creditMemo');

        if(creditMemo && creditMemo.value === 1){
            condition.push({field: 'creditMemo.id', value: '', operator: Conditionals.OPERATORS.NOT_NULL});
        } else if(creditMemo && creditMemo.value === 0){
            condition.push({field: 'creditMemo.id', value: '', operator: Conditionals.OPERATORS.NULL});
        } else {
            condition = condition.filter(c => c.field !== 'creditMemo.id');
        }

        condition = condition.filter(c => c.field !== 'creditMemo');

        setConditional(condition);
        onGetBills(condition, DEFAULT_PAGE_LIMIT, offset);
        setDefaultPage(page + 1);
        if(condition && condition.length > 0) {
            onSaveTableConditions(condition, offset, 'bill');
        } else {
            onClearTableConditions();
        }
    }

    const onConfirmDelete = (id) => {
        //onDeleteBill(id);
    };

    const onDelete = (id) => {
        ConfirmationModalAction({
            title: '¿Seguro desea eliminar el Municipio?',
            description: 'Usted está eliminado este Municipio, una vez eliminado no podrá ser recuperado.',
            id: '_clienteModal',
            onConfirm: () => onConfirmDelete(id)
        });
    };
    const columns = billColumns(onDelete);

    const addOrders = () => {
        const conditions = new Conditionals.Condition;
        conditions.add('bill.id', '', Conditionals.OPERATORS.NULL);
        conditions.add('office', '', Conditionals.OPERATORS.NOT_NULL);
        conditions.add('createdAt', '2022-01-01T00:00:00.000Z', Conditionals.OPERATORS.GREATER_THAN_OR_EQUAL);
        conditions.add('deliveryMethod', DELIVERY_METHODS_IDS.INTERRAPIDISIMO, Conditionals.OPERATORS.EQUAL);
        conditions.add('orderDelivery.deliveryType', CHARGE_ON_DELIVERY, Conditionals.OPERATORS.EQUAL);
        conditions.add('status', [ORDERS_ENUM.SENT, ORDERS_ENUM.FINISHED].join("::"), Conditionals.OPERATORS.IN);

        setOrderListConditions(conditions.condition);
        setOpenOrdersModal(true);
    };

    const addOrdersPayu = () => {
        const conditions = new Conditionals.Condition;
        conditions.add('bill.id', '', Conditionals.OPERATORS.NULL);
        conditions.add('office', '', Conditionals.OPERATORS.NOT_NULL);
        conditions.add('createdAt', '2022-01-01T00:00:00.000Z', Conditionals.OPERATORS.GREATER_THAN_OR_EQUAL);
        conditions.add('deliveryMethod', DELIVERY_METHODS_IDS.PAYU, Conditionals.OPERATORS.EQUAL);
        conditions.add('status', [ORDERS_ENUM.SENT, ORDERS_ENUM.FINISHED].join("::"), Conditionals.OPERATORS.IN);

        setOrderListConditions(conditions.condition);
        setOpenOrdersModal(true);
    };

    const addOrdersServiEntrega = () => {
        const conditions = new Conditionals.Condition;
        conditions.add('bill.id', '', Conditionals.OPERATORS.NULL);
        conditions.add('office', '', Conditionals.OPERATORS.NOT_NULL);
        conditions.add('createdAt', '2023-05-20T00:00:00.000Z', Conditionals.OPERATORS.GREATER_THAN_OR_EQUAL);
        conditions.add('deliveryMethod', DELIVERY_METHODS_IDS.SERVIENTREGA, Conditionals.OPERATORS.EQUAL);
        conditions.add('orderDelivery.deliveryType', CHARGE_ON_DELIVERY, Conditionals.OPERATORS.EQUAL);
        conditions.add('status', [ORDERS_ENUM.SENT, ORDERS_ENUM.FINISHED].join("::"), Conditionals.OPERATORS.IN);

        setOrderListConditions(conditions.condition);
        setOpenOrdersModal(true);
    };

    const onCloseModal = () => {
        setOpenOrdersModal(false);
    };
    const onAcceptModal = (conditionals) => {
        if (conditionals && conditionals.length > 0) {
            const value = conditionals[0].value;
            const ids = value.split ? value.split('::') : [value];
            props.onCreateBill({ids: ids});
        }
        setOpenOrdersModal(false);
    };

    return (
        <>
            <CustomModal title={"Agregar pedidos"} size="lg" showFooter={false} isOpen={openOrdersModal} onClose={onCloseModal}>
                <OrderList customActions={onAcceptModal} showAsModal={true} conditionals={orderListConditions} externalView/>
            </CustomModal>
            <CustomModal title={"Generar Reporte"} showFooter={false} isOpen={openReportModal} onClose={() => setOpenReportModal(false)}>
                <BillGenerateReportForm onCloseModal={(reload) => setOpenReportModal(false)}/>
            </CustomModal>
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
                                        data={billList || []}
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
                                                                <h4 className="text-info"><i className="uil-bill me-2"></i> Facturas {conditionType && <small className={'font-size-12 badge rounded-pill bg-grey'}>Filtrados</small>}</h4>
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
                                                            <Tooltip placement="bottom" title="Generar reporte" aria-label="add">
                                                                <Button onClick={() => setOpenReportModal(true)}>
                                                                    <i className="mdi mdi-file"> </i>
                                                                </Button>
                                                            </Tooltip>

                                                            <HasPermissions permission={PERMISSIONS.BILL_CREATE}>
                                                                <Tooltip placement="bottom" title="Generar Factura" aria-label="add">
                                                                <Button color="primary" className="btn btn-rounded waves-effect waves-light" onClick={addOrders}>
                                                                    <i className="uil-bill me-2"> </i>
                                                                </Button>
                                                                </Tooltip>
                                                            </HasPermissions>

                                                            <HasPermissions permission={PERMISSIONS.BILL_CREATE}>
                                                                <Tooltip placement="bottom" title="Generar Factura (Payu)" aria-label="add">
                                                                <Button color="primary" className="btn btn-rounded waves-effect waves-effect" onClick={addOrdersPayu}>
                                                                    <i className="uil-bill me-2"> </i>
                                                                </Button>
                                                                </Tooltip>
                                                            </HasPermissions>

                                                            <HasPermissions permission={PERMISSIONS.BILL_CREATE}>
                                                                <Tooltip placement="bottom" title="Generar Factura (Servientrega)" aria-label="add">
                                                                    <Button color="primary" className="btn btn-rounded waves-effect waves-effect" onClick={addOrdersServiEntrega}>
                                                                        <i className="uil-bill me-2"> </i>
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
            </Row>
        </>

    )
}

BillList.propTypes = {
    states: PropTypes.array,
    onGetBills: PropTypes.func,
    //onDeleteBill: PropTypes.func,
}

const mapStateToProps = state => {
    const {states, bills, loading, meta, refresh} = state.Bill
    const {conditionType, conditions, offset} = state.Layout;
    return {states, bills, loading, meta, refresh, conditionType, conditions, offset}
}

const mapDispatchToProps = dispatch => ({
    onResetBill: () => {
        dispatch(resetBill());
    },
    onGetBills: (conditional = null, limit = DEFAULT_PAGE_LIMIT, page) => dispatch(getBills(conditional, limit, page)),
    onCreateBill: (ids) => dispatch(registerBill(ids)),
    onSaveTableConditions: (conditions, offset, conditionType) => dispatch(saveTableConditions(conditions, offset, conditionType)),
    onClearTableConditions: () => dispatch(clearTableConditions())
})

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(BillList)
