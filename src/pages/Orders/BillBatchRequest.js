import React, {useEffect, useState} from "react"
import {withRouter} from "react-router-dom"
import {connect} from "react-redux";
import PropTypes from "prop-types";
import {printBatchRequest, refreshOrders, resetBatchRequest} from "../../store/order/actions";

const BillBatchRequest = (props) => {

    const {batch, conditionals, batchType, doRequest, onBatchRequest, onResetBatchRequest, onRefreshOrder} = props;

    useEffect(() => {
        if (conditionals && doRequest && batchType == 'bill') {
            onBatchRequest(conditionals,'bill');
        }
    }, [conditionals, doRequest, onBatchRequest]);


    useEffect(() => {
        if (batch && batch.body && batchType == 'bill') {
            console.log('batch.body..', batch);
            //Notificar exitoso...
        }
    }, [batch]);

    return (
        <React.Fragment>

        </React.Fragment>
    );
}

const isBill = () => {

}

const mapStateToProps = state => {
    const {batchRequest} = state.Category
    const {batch, error, meta, conditionals, batchType, doRequest, loading} = batchRequest
    return {batch, error, meta, conditionals, doRequest, loading, batchType}
}

const mapDispatchToProps = dispatch => ({
    onBatchRequest: (conditional,type) => dispatch(printBatchRequest(conditional,type)),
    onResetBatchRequest: (id = []) => dispatch(resetBatchRequest()),
    onRefreshOrder: () => dispatch(refreshOrders()),
})

export default withRouter(
    connect(mapStateToProps, mapDispatchToProps)(BillBatchRequest)
)

BillBatchRequest.propTypes = {
    conditionals: PropTypes.array,
}
