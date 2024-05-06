import React, {useEffect, useState} from "react"
import {withRouter} from "react-router-dom"
import {connect} from "react-redux";
import PropTypes from "prop-types";
import {downloadFile, getMoment} from "../../common/utils";
import {printCatalogBatchRequest, refreshCategory, resetCatalogBatchRequest} from "../../store/category/actions";
import {BATCH_TYPES, FILE_NAMES} from "../../common/constants";

const CatalogPrintBatchRequest = (props) => {

    const {batch, conditionals, doRequest, onPrintBatchRequest, onResetBatchRequest, onRefreshCategory} = props;

    useEffect(() => {
        if (conditionals && doRequest) {
            onPrintBatchRequest(conditionals);
        }
    }, [conditionals, doRequest, onPrintBatchRequest]);


    useEffect(() => {
        if (batch && batch.body) {
            let html = batch.body;
            let name = FILE_NAMES.CATALOGO_SINGLE;
            if(batch.type === BATCH_TYPES.CATALOG_WITH_REFERENCES){
                name = FILE_NAMES.CATALOG_WITH_REFERENCES;
            }

            const filename = `${name}-${getMoment().format("YYYY-MM-DD")}.pdf`;

            downloadFile(html, filename).then(() =>{
                onResetBatchRequest();
                onRefreshCategory();
            });
        }
    }, [batch]);

    return (
        <React.Fragment>

        </React.Fragment>
    );
}

const mapStateToProps = state => {
    const {batchRequest} = state.Category
    const {batch, error, meta, conditionals, doRequest, loading} = batchRequest
    return {batch, error, meta, conditionals, doRequest, loading}
}

const mapDispatchToProps = dispatch => ({
    onPrintBatchRequest: (conditional) => dispatch(printCatalogBatchRequest(conditional)),
    onResetBatchRequest: (id = []) => dispatch(resetCatalogBatchRequest()),
    onRefreshCategory: () => dispatch(refreshCategory()),
})

export default withRouter(
    connect(mapStateToProps, mapDispatchToProps)(CatalogPrintBatchRequest)
)

CatalogPrintBatchRequest.propTypes = {
    conditionals: PropTypes.array,
}
