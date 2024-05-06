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
import {ConfirmationModalAction} from "../../../components/Modal/ConfirmationModal";
import {TableFilter} from "../../../components/TableFilter";
import {normalizeColumnsList} from "../../../common/converters";
import {doCatalogPrintBatchRequest, getCategories} from "../../../store/category/actions";
import categoryColumns from "./categoryColumn";
import Conditionals from "../../../common/conditionals";
import NoDataIndication from "../../../components/Common/NoDataIndication";
import {getCatalogBatchRequest} from "../../../helpers/service";
import {formatDate} from "../../../common/utils";
import {resetProduct} from "../../../store/product/actions";
import authHeader from "../../../helpers/jwt-token-access/auth-token-header";
import {PERMISSIONS} from "../../../helpers/security_rol";
import HasPermissions from "../../../components/HasPermissions";
import {showMessage} from "../../../components/MessageToast/ShowToastMessages";
import {syncCatalog} from "../../../helpers/backend_helper";

const CategoryList = props => {
    const {categories, onGetCategories, onResetCategories, onDeleteState, getCatalogBatchRequest, onCatalogPrintBatchRequest, refresh, meta} = props;
    const [categoriesList, setCategoriesList] = useState([])
    const [filter, setFilter] = useState(false);
    const [conditional, setConditional] = useState(null);
    const [currentPage, setCurrentPage] = useState(null);
    const [printCategoriesId, setPrintCategoriesId] = useState([]);
    const [catalogs, setCatalogs] = useState([]);
    const [selectAll, setSelectAll] = useState(false);
    const [defaultPage, setDefaultPage] = useState(1);
    const [syncing, setSyncing] = useState(false);

    const pageOptions = {
        sizePerPage: DEFAULT_PAGE_LIMIT,
        totalSize: meta?.totalRegisters || 0,
        custom: true,
        page: defaultPage,
        onPageChange: (page, sizePerPage) => {
            setDefaultPage(page);
        },
    }

    useEffect(() => {
        onResetCategories();
        if(!conditional){
            onGetCategories();
        } else {
            if (currentPage) onGetCategories(conditional, DEFAULT_PAGE_LIMIT, currentPage * DEFAULT_PAGE_LIMIT);
        }
        onGetCatalogBatchRequest();
    }, [refresh, onGetCategories])

    useEffect(() => {
        setCategoriesList(categories)
    }, [categories])

    const handleTableChange = (type, {page}) => {
        let p = page - 1;
        setCurrentPage(p);
        onGetCategories(conditional, DEFAULT_PAGE_LIMIT, p * DEFAULT_PAGE_LIMIT);
    }

    const onFilterAction = (condition) => {
        setConditional(condition);
        onGetCategories(condition, DEFAULT_PAGE_LIMIT, 0);
        setDefaultPage(1);
    }
    const onConfirmDelete = (id) => {
        onDeleteState(id);
    };
    const onGetCatalogBatchRequest = () => {
        getCatalogBatchRequest().then(resp => {
            if(resp && resp.data && resp.data.length > 0){
                let arr = [...resp.data];
                arr = arr.sort((a, b) => a.id === b.id ? 0 : (a.id > b.id) ? -1 : 1);
                if(arr.length > 4){
                    arr.splice(4);
                }
                setCatalogs(arr);
            }
        });
    };

    const onDelete = (id) => {
        ConfirmationModalAction({
            title: '¿Seguro desea eliminar el Estado?',
            description: 'Usted está eliminado este Estado, una vez eliminado no podrá ser recuperado.',
            id: '_clienteModal',
            onConfirm: () => onConfirmDelete(id)
        });
    };

    const syncCatalogs = async () => {
        setSyncing(true);
        const response = await syncCatalog();
        showMessage.success('Solicitud procesada, favor espere unos minutos');
        setSyncing(false);
    }

    const printCatalogs= (hasReferences) => {
        let conditionals = conditional || [];

        if(hasReferences){
            conditionals.push({field:'references', value: '', operator: Conditionals.OPERATORS.TRUE});
        }

        if(printCategoriesId && printCategoriesId.length === 1){
            conditionals.push({field:'category', value:printCategoriesId[0], operator: Conditionals.OPERATORS.EQUAL});
        }
        if(printCategoriesId && printCategoriesId.length > 1){
            conditionals.push({field:'category', value:printCategoriesId.join('::'), operator: Conditionals.OPERATORS.IN});
        }
        onCatalogPrintBatchRequest(conditionals);
    }

    const columns = categoryColumns(onDelete);

    var selectRowProp = {
        mode: "checkbox",
        clickToSelect: true,
        onSelect: (row, selected, b) => {
            let list = [...printCategoriesId]
            const index = list.indexOf(row.id);
            if (index >= 0) {
                list.splice(index, 1);
            } else {
                list.push(row.id);
            }
            setPrintCategoriesId(list);
        },
        onSelectAll: (selected) => {
            setPrintCategoriesId([]);
            setSelectAll(selected);
        }
    };

    const onOpenCatalog = (catalog) => {
            // Change this to use your HTTP client
            const headers = authHeader();
            fetch(process.env.REACT_APP_BASE_SERVICE + catalog.body.url, {headers: headers}) // FETCH BLOB FROM IT
                .then((response) => response.status == 200 && response.blob())
                .then((blob) => { // RETRIEVE THE BLOB AND CREATE LOCAL URL
                    var _url = window.URL.createObjectURL(blob);
                    window.open(_url, "_blank").focus(); // window.open + focus
                }).catch((err) => {
                showMessage.error("Preparando fichero, espere un momento");
            });
    }

    return (
        <>
            {!!(catalogs && catalogs.length > 0) && (
                <Row className="text-center">
                    {catalogs.map((catalog, k) => (
                        <Col sm={6} md={3} key={k}>
                            <Card>
                                <CardBody>
                                    <Row>
                                        <Col xs={8}>
                                            <h6 className="mb-1 mt-2"> Catálogo { catalog.type === 3 ? 'Ref' : ''}</h6>
                                            <p className="badge bg-info">{catalog.body.name}</p>
                                            <div className="text-muted mb-0 mt-1">
                                                <small>{formatDate(catalog.createdAt)}</small>
                                            </div>
                                        </Col>
                                        <Col xs={4}>
                                            <Tooltip placement="bottom" title="Descargar Catálogo" aria-label="add">
                                                <Button color="primary" onClick={() => onOpenCatalog(catalog)}>
                                                    <i className="mdi mdi-download font-size-24"> </i>
                                                </Button>
                                            </Tooltip>
                                        </Col>
                                    </Row>
                                </CardBody>
                            </Card>
                        </Col>
                    ))}

                </Row>
            )}
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
                                        data={categoriesList || []}
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
                                                            <h4 className="text-info"><i className="uil-box me-2 me-2"></i> Categorias</h4>
                                                        </div>
                                                    </div>
                                                    </Col>
                                                    <Col md={6}>
                                                        <div className="mb-3 float-md-end">
                                                            {columns.some(s => s.filter) && (
                                                                <Tooltip placement="bottom" title="Filtros Avanzados" aria-label="add" >
                                                                    <Button onClick={() => setFilter(!filter)}>
                                                                        <i className={"mdi mdi-filter"}> </i>
                                                                    </Button>
                                                                </Tooltip>
                                                            )}
                                                            <HasPermissions permission={PERMISSIONS.CATEGORY_DOWNLOAD}>
                                                                <Tooltip placement="bottom" title="Descargar Catalogo" aria-label="add">
                                                                    <Button color="primary" onClick={() => printCatalogs(false)}
                                                                            disabled={(printCategoriesId.length === 0 && !selectAll) && (!conditional || conditional.length === 0)}>
                                                                        <i className="mdi mdi-download"> </i>
                                                                    </Button>
                                                                </Tooltip>
                                                            </HasPermissions>
                                                            <HasPermissions permission={PERMISSIONS.CATEGORY_DOWNLOAD}>
                                                                <Tooltip placement="bottom" title="Descargar Catalogo con Referencias" aria-label="add">
                                                                    <Button color="primary" onClick={() => printCatalogs(true)}
                                                                            disabled={(printCategoriesId.length === 0 && !selectAll) && (!conditional || conditional.length === 0)}>
                                                                        <i className="mdi mdi-download-circle"> </i>
                                                                    </Button>
                                                                </Tooltip>
                                                            </HasPermissions>
                                                            <HasPermissions permission={PERMISSIONS.CATALOG_SYNC}>
                                                                <Tooltip placement="bottom" title="Sincronizar Catalogo" aria-label="add">
                                                                    <Button color="primary" onClick={() => syncCatalogs()}>
                                                                        <i className="mdi mdi-sync-circle"></i>
                                                                    </Button>
                                                                </Tooltip>
                                                            </HasPermissions>
                                                            <HasPermissions permission={PERMISSIONS.CATEGORY_CREATE}>
                                                                <Link to={"/category"} className="btn btn-primary waves-effect waves-light text-light">
                                                                    <i className="mdi mdi-plus"> </i> Nueva Categoria
                                                                </Link>
                                                            </HasPermissions>
                                                        </div>
                                                    </Col>

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

CategoryList.propTypes = {
    categories: PropTypes.array,
    onGetCategories: PropTypes.func,
}

const mapStateToProps = state => {
    const {categories, loading, meta, refresh} = state.Category
    return {categories, loading, meta, refresh}
}

const mapDispatchToProps = dispatch => ({
    onResetCategories: () => {
        dispatch(resetProduct());
    },
    onGetCategories: (conditional = null, limit = DEFAULT_PAGE_LIMIT, page) => dispatch(getCategories(conditional, limit, page)),
    onCatalogPrintBatchRequest: (conditional, catalog ) => dispatch(doCatalogPrintBatchRequest(conditional, catalog)),
    getCatalogBatchRequest,
})

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(CategoryList)
