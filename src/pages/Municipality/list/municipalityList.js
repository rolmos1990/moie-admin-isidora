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
import {deleteMunicipality, getMunicipalities, getStates, resetLocation} from "../../../store/location/actions";
import {TableFilter} from "../../../components/TableFilter";
import municipalityColumns from "./municipalityColumns";
import {normalizeColumnsList} from "../../../common/converters";
import NoDataIndication from "../../../components/Common/NoDataIndication";
import {PERMISSIONS} from "../../../helpers/security_rol";
import NoAccess from "../../../components/Common/NoAccess";
import HasPermissions from "../../../components/HasPermissions";

const MunicipalityList = props => {
    const {states, municipalities, meta, getStates, onGetMunicipalities, onResetLocation, onDeleteMunicipality, loading, refresh} = props;
    const [municipalityList, setMunicipalityList] = useState([])
    const [filter, setFilter] = useState(false);
    const [conditional, setConditional] = useState(null);
    const [defaultPage, setDefaultPage] = useState(1);

    const pageOptions = {
        sizePerPage: DEFAULT_PAGE_LIMIT,
        //totalSize: meta?.totalRegisters, // replace later with size(users),
        custom: true,
        page: defaultPage,
        onPageChange: (page, sizePerPage) => {
            setDefaultPage(page);
        },
    }
    const {SearchBar} = Search

    useEffect(() => {
        if(refresh === null) {
            onResetLocation();
            getStates();
        }
        onGetMunicipalities();
    }, [refresh, onGetMunicipalities])

    useEffect(() => {
        setMunicipalityList(municipalities.map(m => {
            m.state = m.state.name;
            return m;
        }))
    }, [municipalities])

    const handleTableChange = (type, {page}) => {
        onGetMunicipalities(conditional, DEFAULT_PAGE_LIMIT, (page - 1) * DEFAULT_PAGE_LIMIT);
    }

    const onFilterAction = (condition) => {
        setConditional(condition);
        onGetMunicipalities(condition, DEFAULT_PAGE_LIMIT, 0);
        setDefaultPage(1);
    }
    const onConfirmDelete = (id) => {
        onDeleteMunicipality(id);
    };

    const onDelete = (id) => {
        ConfirmationModalAction({
            title: '¿Seguro desea eliminar el Municipio?',
            description: 'Usted está eliminado este Municipio, una vez eliminado no podrá ser recuperado.',
            id: '_clienteModal',
            onConfirm: () => onConfirmDelete(id)
        });
    };
    const columns = municipalityColumns(onDelete);

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
                                    data={municipalityList || []}
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
                                                            <h4 className="text-info"><i className="uil-shopping-cart-alt me-2"></i> Municipios</h4>
                                                            {/*{!filter && (
                                                                <div className="position-relative">
                                                                    <SearchBar {...toolkitProps.searchProps}/>
                                                                    <i className="mdi mdi-magnify search-icon"> </i>
                                                                </div>
                                                            )}*/}
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
                                                        <HasPermissions permissions={[PERMISSIONS.LOCALITY_CREATE]} renderNoAccess={() => <NoAccess/>}>
                                                            <Link to={"/municipality"} className="btn btn-primary waves-effect waves-light text-light">
                                                                <i className="mdi mdi-plus"> </i> Nuevo Municipio
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
    )
}

MunicipalityList.propTypes = {
    states: PropTypes.array,
    onGetMunicipalities: PropTypes.func,
    onDeleteMunicipality: PropTypes.func,
}

const mapStateToProps = state => {
    const {states, municipalities, loading, meta, refresh} = state.Location
    return {states, municipalities, loading, meta, refresh}
}

const mapDispatchToProps = dispatch => ({
    getStates,
    onResetLocation: () => {
        dispatch(resetLocation());
    },
    onGetMunicipalities: (conditional = null, limit = DEFAULT_PAGE_LIMIT, page) => dispatch(getMunicipalities(conditional, limit, page)),
    onDeleteMunicipality: (id) => dispatch(deleteMunicipality(id))
})

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(MunicipalityList)
