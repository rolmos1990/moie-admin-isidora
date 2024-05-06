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
import {getWallets, resetWallet} from "../../../store/wallet/actions";
import walletsColumns from "./walletColumn";
import {TableFilter} from "../../../components/TableFilter";
import {normalizeColumnsList} from "../../../common/converters";
import NoDataIndication from "../../../components/Common/NoDataIndication";
import HasPermissions from "../../../components/HasPermissions";
import {PERMISSIONS} from "../../../helpers/security_rol";
import NoAccess from "../../../components/Common/NoAccess";
import {walletStatsApi} from "../../../helpers/backend_helper";
import CountUp from "react-countup";

const WalletList = props => {
    const {wallets, meta, onGetWallets, onResetwallet, loading, refresh} = props;
    const [walletsList, setWalletsList] = useState([])
    const [walletStats, setWalletStats] = useState({})
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
        },
    }
    const {SearchBar} = Search

    useEffect(() => {
        if(refresh === null){
            onResetwallet();
            onGetWallets()
        } else {
            onGetWallets();
        }
    }, [refresh, onGetWallets])

    useEffect(() => {
        setWalletsList(wallets)
        loadStats();
    }, [wallets])

    const loadStats = () => {
        walletStatsApi().then(function (resp) {
            setWalletStats(resp.wallet);
        });
    }

    // eslint-disable-next-line no-unused-vars
    const handleTableChange = (type, {page, searchText}) => {
        onGetWallets(conditional, DEFAULT_PAGE_LIMIT, (page - 1)*DEFAULT_PAGE_LIMIT);
    }

    const onFilterAction = (condition) => {
        setConditional(condition);
        onGetWallets(condition, DEFAULT_PAGE_LIMIT, 0);
        setDefaultPage(1);
    }

    const columns = walletsColumns();

    return (
        <Row>
            {walletStats.fechaUltimoMovimiento && (
                <Row>
                    <Col md={4}>
                        <Card>
                            <CardBody>
                                <div className="float-end mt-2">
                                    <Tooltip placement="bottom" title="Saldo inicio de mes" aria-label="add">
                                        <i className="mdi mdi-scale-balance font-size-24 mr-1 text-primary p-3"> </i>
                                    </Tooltip>
                                </div>
                                <div>
                                    <h4 className="mb-1 mt-2">
                                        <CountUp end={walletStats.inicioMes} separator="," decimals={0}/>
                                    </h4>
                                    <p className="text-muted mb-0">{"Saldo Inicio de Mes"}</p>
                                </div>
                                <p className="text-muted mb-0 mt-3">
                                </p>
                            </CardBody>
                        </Card>
                    </Col>
                    <Col md={4}>
                        <Card>
                            <CardBody>
                                <div className="float-end mt-2">
                                    <Tooltip placement="bottom" title="Fecha último movimiento" aria-label="add">
                                        <i className="mdi mdi-sort-calendar-ascending font-size-24 mr-1 text-muted p-3"> </i>
                                    </Tooltip>
                                </div>
                                <div>
                                    <h4 className="mb-1 mt-2">
                                        {walletStats.fechaUltimoMovimiento}
                                    </h4>
                                    <p className="text-muted mb-0">{"Fecha último movimiento"}</p>
                                </div>
                                <p className="text-muted mb-0 mt-3">
                                </p>
                            </CardBody>
                        </Card>
                    </Col>
                    <Col md={4}>
                        <Card>
                            <CardBody>
                                <div className="float-end mt-2">
                                    <Tooltip placement="bottom" title="Saldo" aria-label="add">
                                        <i className="mdi mdi-currency-usd font-size-24 mr-1 text-muted p-3"> </i>
                                    </Tooltip>
                                </div>
                                <div>
                                    <h4 className="mb-1 mt-2">
                                        <CountUp end={walletStats.saldo} separator="," decimals={0}/>
                                    </h4>
                                    <p className="text-muted mb-0">{"Saldo"}</p>
                                </div>
                                <p className="text-muted mb-0 mt-3">
                                </p>
                            </CardBody>
                        </Card>
                    </Col>
                </Row>
            )}
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
                                    data={walletsList || []}
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
                                                            <h4 className="text-info"><i className="uil-shopping-cart-alt me-2"></i> Billetera</h4>
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
                                                        <HasPermissions permissions={[PERMISSIONS.LOCALITY_CREATE]} renderNoAccess={() => <NoAccess/>}>
                                                            <Link to={"/wallet"} className="btn btn-primary waves-effect waves-light text-light">
                                                                <i className="mdi mdi-plus"></i> Nuevo registro
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

WalletList.propTypes = {
    wallets: PropTypes.array,
    onGetWallets: PropTypes.func,
    onDeleteWallets: PropTypes.func,
}

const mapWalletToProps = state => {
    const {wallets, loading, meta, refresh} = state.Wallet
    return {wallets, loading, meta, refresh}
}

const mapDispatchToProps = dispatch => ({
    onResetwallet: () => {
        dispatch(resetWallet());
    },
    onGetWallets: (conditional = null, limit = DEFAULT_PAGE_LIMIT, page) => dispatch(getWallets(conditional, limit, page))
})

export default connect(
    mapWalletToProps,
    mapDispatchToProps
)(WalletList)
