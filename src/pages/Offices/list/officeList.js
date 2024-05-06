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
import {ConfirmationModalAction} from "../../../components/Modal/ConfirmationModal";
import {getOffices, resetOffice} from "../../../store/office/actions";
import {TableFilter} from "../../../components/TableFilter";
import officeColumns from "./officeColumns";
import {normalizeColumnsList} from "../../../common/converters";
import CustomModal from "../../../components/Modal/CommosModal";
import OfficeReportForm from "../../Reports/OfficeReportForm";
import NoDataIndication from "../../../components/Common/NoDataIndication";
import {PERMISSIONS} from "../../../helpers/security_rol";
import HasPermissions from "../../../components/HasPermissions";
import {clearTableConditions, saveTableConditions} from "../../../store/layout/actions";


const OfficeList = props => {
    const {offices, onGetOffices, onResetOffices, refresh, meta, onSaveTableConditions, onClearTableConditions, conditionType, conditions, offset} = props; //onDeleteOffice,
    const [officeList, setOfficeList] = useState([])
    const [filter, setFilter] = useState(false);
    const [conditional, setConditional] = useState(null);
    const [openReportModal, setOpenReportModal] = useState(null);
    const [defaultPage, setDefaultPage] = useState(1);

    const pageOptions = {
        sizePerPage: DEFAULT_PAGE_LIMIT,
        custom: true,
        totalSize: meta?.totalRegisters,
        page: defaultPage,
        onPageChange: (page, sizePerPage) => {
            setDefaultPage(page);
            const offset = (page - 1) * DEFAULT_PAGE_LIMIT;
            onSaveTableConditions(conditions, offset, 'office');
        },
    }
    const {SearchBar} = Search

    useEffect(() => {
        if(refresh === null){
            onResetOffices();
        }

        if(conditionType !== 'office'){
            onClearTableConditions();
            onGetOffices();
        } else {
            //reload the filter loaded
            onFilterAction(conditions, offset);
        }

    }, [refresh, onGetOffices])

    useEffect(() => {
        setOfficeList(offices);
    }, [offices])

    const handleTableChange = (type, {page}) => {
        const offset = (page - 1) * DEFAULT_PAGE_LIMIT;
        onGetOffices(conditional, DEFAULT_PAGE_LIMIT, offset);
        onSaveTableConditions(conditional, offset, 'office');
    }

    const onFilterAction = (condition, offset = 0) => {
        const page = Math.floor(offset / DEFAULT_PAGE_LIMIT);
        setConditional(condition);
        onGetOffices(condition, DEFAULT_PAGE_LIMIT, offset);
        setDefaultPage(page + 1);
        if(condition && condition.length > 0) {
            onSaveTableConditions(condition, offset, 'office');
        } else {
            onClearTableConditions();
        }
    }

    const onConfirmDelete = (id) => {
        //onDeleteOffice(id);
    };

    const onDelete = (id) => {
        ConfirmationModalAction({
            title: '¿Seguro desea eliminar el Municipio?',
            description: 'Usted está eliminado este Municipio, una vez eliminado no podrá ser recuperado.',
            id: '_clienteModal',
            onConfirm: () => onConfirmDelete(id)
        });
    };
    const columns = officeColumns(onDelete);

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
                        <PaginationProvider pagination={paginationFactory(pageOptions)}>
                            {({paginationProps, paginationTableProps}) => (
                                <ToolkitProvider
                                    keyField="id"
                                    data={officeList || []}
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
                                                            <h4 className="text-info"><i className="uil-truck me-2"></i> Despachos {conditionType && <small className={'font-size-12 badge rounded-pill bg-grey'}>Filtrados</small>}</h4>
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
                                                                <i className={"mdi mdi-file"}> </i>
                                                            </Button>
                                                        </Tooltip>

                                                        <HasPermissions permissions={[PERMISSIONS.OFFICE_CREATE]}>
                                                            <Link to={"/office"} className="btn btn-primary waves-effect waves-light text-light">
                                                                <i className="mdi mdi-plus"> </i> Generar Despacho
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


            <CustomModal title={"Generar reporte"} showFooter={false} isOpen={openReportModal} onClose={() => setOpenReportModal(false)}>
                <OfficeReportForm onCloseModal={() => setOpenReportModal(false)}/>
            </CustomModal>
        </Row>
    )
}

OfficeList.propTypes = {
    states: PropTypes.array,
    onGetOffices: PropTypes.func,
    //onDeleteOffice: PropTypes.func,
}

const mapStateToProps = state => {
    const {states, offices, loading, meta, refresh} = state.Office
    const {conditionType, conditions, offset} = state.Layout;
    return {states, offices, loading, meta, refresh,conditionType, conditions, offset}
}

const mapDispatchToProps = dispatch => ({
    //getStates,
    onGetOffices: (conditional = null, limit = DEFAULT_PAGE_LIMIT, page) => dispatch(getOffices(conditional, limit, page)),
    onResetOffices: () => {
        dispatch(resetOffice());
    },
    onSaveTableConditions: (conditions, offset, conditionType) => dispatch(saveTableConditions(conditions, offset, conditionType)),
    onClearTableConditions: () => dispatch(clearTableConditions())
    //onDeleteOffice: (id) => dispatch(deleteOffice(id))
})

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(OfficeList)
