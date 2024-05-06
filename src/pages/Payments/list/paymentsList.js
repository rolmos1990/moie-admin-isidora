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
import {getPayments} from "../../../store/payments/actions";
import paymentsColumns from "./paymentsColumn";
import {TableFilter} from "../../../components/TableFilter";
import {normalizeColumnsList} from "../../../common/converters";
import NoDataIndication from "../../../components/Common/NoDataIndication";
import PaymentOverlay from "../paymentOverlay";
import {PERMISSIONS} from "../../../helpers/security_rol";
import HasPermissions from "../../../components/HasPermissions";
import OutsideClickHandler from "../../../components/OutsideClickHandler";
import {clearTableConditions, saveTableConditions} from "../../../store/layout/actions";


const PaymentsList = props => {
    const {payments, meta, onGetPayments, onDeletePayment, loading, refresh, onSaveTableConditions, onClearTableConditions, conditionType, conditions, offset} = props;
    const [paymentsList, setPaymentsList] = useState([])
    const [paymentSelected, setPaymentSelected] = useState(null);
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
            onSaveTableConditions(conditions, offset, 'payments');
        },
    }

    useEffect(() => {
        if(conditionType !== 'payments'){
        onClearTableConditions();
        onGetPayments();
        } else {
            onFilterAction(conditions, offset);
        }
    }, [refresh, onGetPayments])

    useEffect(() => {
        setPaymentsList(payments)
    }, [payments])

    const handleTableChange = (type, {page}) => {
        onGetPayments(conditional, DEFAULT_PAGE_LIMIT, (page - 1) * DEFAULT_PAGE_LIMIT);
    }

    const onFilterAction = (condition) => {
        const page = Math.floor(offset / DEFAULT_PAGE_LIMIT);
        setConditional(condition);
        onGetPayments(condition, DEFAULT_PAGE_LIMIT, offset);
        setDefaultPage(page + 1);
        if(condition && condition.length > 0) {
            onSaveTableConditions(condition, offset, 'payments');
        } else {
            onClearTableConditions();
        }
    }

    const columns = paymentsColumns(setPaymentSelected);

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
                                        data={paymentsList || []}
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
                                                                <h4 className="text-info"><i className="uil-shopping-cart-alt me-2"></i> Pagos {conditionType && <small className={'font-size-12 badge rounded-pill bg-grey'}>Filtrados</small>}</h4>
                                                            </div>
                                                        </div>
                                                    </Col>
                                                    <Col md={6}>
                                                        <div className="mb-3 float-md-end">
                                                            {columns.some(s => s.filter) && (
                                                                <Tooltip placement="bottom" title="Filtros Avanzados" aria-label="add">
                                                                    <Button onClick={() => setFilter(!filter)}>
                                                                        <i className={"mdi mdi-filter"}></i>
                                                                    </Button>
                                                                </Tooltip>
                                                            )}
                                                            <HasPermissions permissions={[PERMISSIONS.PAYMENT_CREATE]}>
                                                                <Link to={"/payment"} className="btn btn-primary waves-effect waves-light text-light">
                                                                    <i className="mdi mdi-plus"></i> Nuevo pago
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
            <OutsideClickHandler
                onOutsideClick={() => {
                    if(paymentSelected){
                        setPaymentSelected(null)
                    }
                }}
            >
            {paymentSelected && (<PaymentOverlay paymentSelected={paymentSelected} showOverlay={true} onCloseOverlay={() => setPaymentSelected(null)}/>)}
            </OutsideClickHandler>
        </>
    )
}

PaymentsList.propTypes = {
    payments: PropTypes.array,
    onGetPayments: PropTypes.func,
    onDeletePayments: PropTypes.func,
}

const mapPaymentToProps = state => {
    const {payments, loading, meta, refresh} = state.Payments
    const {conditionType, conditions, offset} = state.Layout;

    return {payments, loading, meta, refresh, conditionType, conditions, offset}
}

const mapDispatchToProps = dispatch => ({
    onGetPayments: (conditional = null, limit = DEFAULT_PAGE_LIMIT, page) => dispatch(getPayments(conditional, limit, page)),
    onSaveTableConditions: (conditions, offset, conditionType) => dispatch(saveTableConditions(conditions, offset, conditionType)),
    onClearTableConditions: () => dispatch(clearTableConditions())
})

export default connect(
    mapPaymentToProps,
    mapDispatchToProps
)(PaymentsList)
