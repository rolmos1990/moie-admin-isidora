import {Card, CardBody, Col, Row} from "reactstrap";
import {Link} from "react-router-dom";
import PropTypes from "prop-types";
import {connect} from "react-redux";
import {getProducts, resetProduct, updateProduct} from "../../../store/product/actions";
import React, {useEffect, useState} from "react";
import {TableFilter} from "../../../components/TableFilter";
import paginationFactory, {PaginationListStandalone, PaginationProvider} from "react-bootstrap-table2-paginator";
import ToolkitProvider from "react-bootstrap-table2-toolkit";
import {normalizeColumnsList} from "../../../common/converters";
import {Button, Tooltip} from "@material-ui/core";
import BootstrapTable from "react-bootstrap-table-next";
import NoDataIndication from "../../../components/Common/NoDataIndication";
import productColumns from "./productColumn";
import StatsStatusCard from "../../../components/Common/StatsStatusCard";
import {countProductsByStatus} from "../../../helpers/service";
import HasPermissions from "../../../components/HasPermissions";
import {PERMISSIONS} from "../../../helpers/security_rol";
import {clearTableConditions, saveTableConditions} from "../../../store/layout/actions";

const DEFAULT_PAGE_LIMIT = 30;


const series2 = [70]

const options2 = {
    fill: {
        colors: ['#34c38f']
    },
    chart: {
        sparkline: {
            enabled: !0
        }
    },
    dataLabels: {
        enabled: !1
    },
    plotOptions: {
        radialBar: {
            hollow: {
                margin: 0,
                size: '60%'
            },
            track: {
                margin: 0
            },
            dataLabels: {
                show: !1
            }
        }
    }
};

const series3 = [55]

const options3 = {
    fill: {
        colors: ['#5b73e8']
    },
    chart: {
        sparkline: {
            enabled: !0
        }
    },
    dataLabels: {
        enabled: !1
    },
    plotOptions: {
        radialBar: {
            hollow: {
                margin: 0,
                size: '60%'
            },
            track: {
                margin: 0
            },
            dataLabels: {
                show: !1
            }
        }
    }
};


const ProductList = props => {

    const {refresh, onGetProducts, onResetProducts, countProductsByStatus, products, meta, onUpdateProduct, onSaveTableConditions, onClearTableConditions, conditionType, conditions, offset} = props;
    const [productList, setProductList] = useState([]);
    const [filter, setFilter] = useState(false);
    const [conditional, setConditional] = useState(null);
    const [defaultPage, setDefaultPage] = useState(1);

    const pageOptions = {
        sizePerPage: DEFAULT_PAGE_LIMIT,
        totalSize: meta?.totalRegisters || 0,
        custom: true,
        showTotal: true,
        page: defaultPage,
        onPageChange: (page, sizePerPage) => {
            setDefaultPage(page);
            const offset = (page - 1) * DEFAULT_PAGE_LIMIT;
            onSaveTableConditions(conditions, offset, 'product');
        },
    };

    useEffect(() => {
        if (null !== refresh) {
            onResetProducts();
        }


        if(conditionType !== 'product'){
            onClearTableConditions();
            onGetProducts();
        } else {
            //reload the filter loaded
            onFilterAction(conditions, offset);
        }
    }, [refresh, onGetProducts])

    useEffect(() => {
        setProductList(products)
    }, [products])

    const onFilterAction = (condition, offset = 0) => {
        const page = Math.floor(offset / DEFAULT_PAGE_LIMIT);
        setConditional(condition);
        onGetProducts(condition, DEFAULT_PAGE_LIMIT, offset);
        setDefaultPage(page + 1);
        if(condition && condition.length > 0) {
            onSaveTableConditions(condition, offset, 'product');
        } else {
            onClearTableConditions();
        }
    }

    const handleTableChange = (type, {page, searchText}) => {
        const offset = (page - 1) * DEFAULT_PAGE_LIMIT;
        onGetProducts(conditional, DEFAULT_PAGE_LIMIT, offset);
        onSaveTableConditions(conditional, offset, 'product');
    }

    const onUpdateStatusProduct = (id, _status) => {

        const product = {
            id: id,
            published: _status
        };

        onUpdateProduct(id, product);
    }

    const columns = productColumns(false, onUpdateStatusProduct);

    return (
        <>
            <Row className="text-center">
                <Col md={4}>
                    <StatsStatusCard title="Productos" getData={countProductsByStatus}/>
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
                            <PaginationProvider pagination={paginationFactory(pageOptions)}>
                                {({paginationProps, paginationTableProps}) => (
                                    <ToolkitProvider
                                        keyField="id"
                                        data={productList || []}
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
                                                                <h4 className="text-info"><i className="uil-box me-2 me-2"></i> Productos {conditionType && <small className={'font-size-12 badge rounded-pill bg-grey'}>Filtrados</small>}</h4>
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
                                                            <Tooltip placement="bottom" title="Busqueda masiva" aria-label="add">
                                                                <Link to={"/bq"} className="btn">
                                                                    <i className="mdi mdi-text-box-search-outline"> </i>
                                                                </Link>
                                                            </Tooltip>
                                                            <HasPermissions permission={PERMISSIONS.PRODUCT_CREATE}>
                                                                <Link to={"/product"} className="btn btn-primary waves-effect waves-light text-light">
                                                                    <i className="mdi mdi-plus"> </i> Nuevo Producto
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
                                                                onTableChange={handleTableChange}
                                                                {...toolkitProps.baseProps}
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

ProductList.propTypes = {
    onGetProducts: PropTypes.func,
    products: PropTypes.array,
    meta: PropTypes.object,
    loading: PropTypes.bool,
    refresh: PropTypes.bool,
}

const mapStateToProps = state => {
    const {products, loading, meta, refresh, custom} = state.Product
    const {conditionType, conditions, offset} = state.Layout;
    return {customData: custom, products, loading, meta, refresh, conditionType, conditions, offset}
}

const mapDispatchToProps = dispatch => ({
    onResetProducts: () => {
        dispatch(resetProduct());
    },
    onUpdateProduct: (id, data, history) => dispatch(updateProduct(id, data, history)),
    onGetProducts: (conditional = null, limit = DEFAULT_PAGE_LIMIT, page) => dispatch(getProducts(conditional, limit, page)),
    countProductsByStatus,
    onSaveTableConditions: (conditions, offset, conditionType) => dispatch(saveTableConditions(conditions, offset, conditionType)),
    onClearTableConditions: () => dispatch(clearTableConditions())
})

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(ProductList);
