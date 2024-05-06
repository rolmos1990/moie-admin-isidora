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
import {TableFilter} from "../../../components/TableFilter";
import {normalizeColumnsList} from "../../../common/converters";
import {getTemplates, resetTemplate} from "../../../store/template/actions";
import templateColumns from "./templateColumn";
import NoDataIndication from "../../../components/Common/NoDataIndication";
import {PERMISSIONS} from "../../../helpers/security_rol";
import HasPermissions from "../../../components/HasPermissions";

const TemplateList = props => {
    const {templates, meta, onGetTemplates, onResetTemplate, onDeleteState, loading, refresh} = props;
    const [templatesList, setTemplatesList] = useState([])
    const [filter, setFilter] = useState(false);
    const [conditional, setConditional] = useState(null);
    const [defaultPage, setDefaultPage] = useState(1);


    const pageOptions = {
        sizePerPage: DEFAULT_PAGE_LIMIT,
        totalSize: meta.totalRegisters,
        custom: true,
        page: defaultPage,
        onPageChange: (page, sizePerPage) => {
            setDefaultPage(page);
        },
    }
    const {SearchBar} = Search

    useEffect(() => {
        if(refresh === null){
            onResetTemplate();
        }
        onGetTemplates();
    }, [refresh, onGetTemplates])

    useEffect(() => {
        setTemplatesList(templates)
    }, [templates])

    const handleTableChange = (type, {page}) => {
        onGetTemplates(conditional, DEFAULT_PAGE_LIMIT, (page - 1) * DEFAULT_PAGE_LIMIT);
    }

    const onFilterAction = (condition) => {
        setConditional(condition);
        onGetTemplates(condition, DEFAULT_PAGE_LIMIT, 0);
        setDefaultPage(1);
    }
    const onConfirmDelete = (id) => {
        onDeleteState(id);
    };

    const onDelete = (id) => {
        ConfirmationModalAction({
            title: '¿Seguro desea eliminar el Plantilla?',
            description: 'Usted está eliminado esta Plantilla, una vez eliminado no podrá ser recuperado.',
            id: '_clienteModal',
            onConfirm: () => onConfirmDelete(id)
        });
    };

    const columns = templateColumns(onDelete);

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
                                    data={templatesList || []}
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
                                                            <h4 className="text-info"><i className="uil-shopping-cart-alt me-2"></i> Plantillas</h4>
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
                                                        <HasPermissions permissions={[PERMISSIONS.TEMPLATE_CREATE]}>
                                                            <Link to={"/template"} className="btn btn-primary waves-effect waves-light text-light">
                                                                <i className="mdi mdi-plus"> </i> Nueva Plantilla
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
    )
}

TemplateList.propTypes = {
    templates: PropTypes.array,
    onGetTemplates: PropTypes.func,
    // onDeleteStates: PropTypes.func,
}

const mapStateToProps = state => {
    const {templates, loading, meta, refresh} = state.Template
    return {templates, loading, meta, refresh}
}

const mapDispatchToProps = dispatch => ({
    onResetTemplate: () => {
        dispatch(resetTemplate());
    },
    onGetTemplates: (conditional = null, limit = DEFAULT_PAGE_LIMIT, page) => dispatch(getTemplates(conditional, limit, page)),
})

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(TemplateList)
