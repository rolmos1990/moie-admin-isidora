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
import {getBillConfigs, registerBillConfig, resetBillConfig} from "../../../store/billConfig/actions";
import {TableFilter} from "../../../components/TableFilter";
import billConfigColumns from "./billConfigColumns";
import {normalizeColumnsList} from "../../../common/converters";
import NoDataIndication from "../../../components/Common/NoDataIndication";
import {Link} from "react-router-dom";
import {PERMISSIONS} from "../../../helpers/security_rol";
import HasPermissions from "../../../components/HasPermissions";

const BillConfigList = props => {
    const {billConfigs, onGetBillConfigs, onResetBillConfig, refresh} = props; //onDeleteBillConfig,
    const [billConfigList, setBillConfigList] = useState([])
    const [filter, setFilter] = useState(false);
    const [conditional, setConditional] = useState(null);
    const [defaultPage, setDefaultPage] = useState(1);


    const pageOptions = {
        sizePerPage: DEFAULT_PAGE_LIMIT,
        custom: true,
        page: defaultPage,
        onPageChange: (page, sizePerPage) => {
            setDefaultPage(page);
        },
    }
    useEffect(() => {
        if(refresh === null) {
            onResetBillConfig();
        }
        onGetBillConfigs();
    }, [refresh, onGetBillConfigs])

    useEffect(() => {
        setBillConfigList(billConfigs);
    }, [billConfigs])

    // eslint-disable-next-line no-unused-vars
    const handleTableChange = (type, {page, searchText}) => {
        onGetBillConfigs(conditional, DEFAULT_PAGE_LIMIT, (page - 1)*DEFAULT_PAGE_LIMIT);
    }

    const onFilterAction = (condition) => {
        setConditional(condition);
        onGetBillConfigs(condition, DEFAULT_PAGE_LIMIT, 0);
        setDefaultPage(1);
    }
    const onConfirmDelete = (id) => {
        //onDeleteBillConfig(id);
    };

    const onDelete = (id) => {
        ConfirmationModalAction({
            title: '¿Seguro desea eliminar el Municipio?',
            description: 'Usted está eliminado este Municipio, una vez eliminado no podrá ser recuperado.',
            id: '_clienteModal',
            onConfirm: () => onConfirmDelete(id)
        });
    };
    const columns = billConfigColumns(onDelete);

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
                                        data={billConfigList || []}
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
                                                                <h4 className="text-info"><i className="uil-billConfig me-2"></i> Resoluciones </h4>
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
                                                            <HasPermissions permission={PERMISSIONS.BILL_CREATE}>
                                                                <Link to={"/billConfig"} className="btn btn-primary waves-effect waves-light text-light">
                                                                    <i className="mdi mdi-plus"></i> Nueva resolución
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
        </>

    )
}

BillConfigList.propTypes = {
    states: PropTypes.array,
    onGetBillConfigs: PropTypes.func,
    //onDeleteBillConfig: PropTypes.func,
}

const mapStateToProps = state => {
    const {states, billConfigs, loading, meta, refresh} = state.BillConfig
    return {states, billConfigs, loading, meta, refresh}
}

const mapDispatchToProps = dispatch => ({
    onResetBillConfig: () => {
        dispatch(resetBillConfig());
    },
    onGetBillConfigs: (conditional = null, limit = DEFAULT_PAGE_LIMIT, page) => dispatch(getBillConfigs(conditional, limit, page)),
    onCreateBillConfig: (ids) => dispatch(registerBillConfig(ids)),
})

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(BillConfigList)
