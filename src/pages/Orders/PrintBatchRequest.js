import React, {useEffect, useState} from "react"
import {Col, Row} from "reactstrap"
import {Button} from "@material-ui/core";
import {withRouter} from "react-router-dom"
import {connect} from "react-redux";
import PropTypes from "prop-types";
import {printPartOfPage} from "../../common/utils";
import {nextStatusOrder, printBatchRequest, resetBatchRequest, resetOrder} from "../../store/order/actions";
import CustomModal from "../../components/Modal/CommosModal";
import {changePreloader} from "../../store/layout/actions";

const PrintBatchRequest = (props) => {

    const {batch, conditionals, doRequest, refresh, error} = props;
    const [openPrintConfirmModal, setOpenPrintConfirmModal] = useState(false);

    useEffect(() => {
        if (conditionals && doRequest) {
            props.onPrintBatchRequest(conditionals);
        }
    }, [conditionals, doRequest]);

    useEffect(() => {
        props.onResetBatchRequest();
    }, [refresh]);

    useEffect(() => {
        if (batch && batch.body) {
            let html = null;
            batch.body.forEach((body) => {
                if (html) {
                    html += '<br/>';
                } else {
                    html = '';
                }
                html += body.html;
            })
            printOrder(html)
        }
    }, [batch]);

    useEffect(() => {
        if (error) {
            setOpenPrintConfirmModal(false);
            props.onChangePreloader(false);
        }
    }, [error]);

    const printOrder = (text) => {
        setOpenPrintConfirmModal(true)
        printPartOfPage(text);
        props.onChangePreloader(false);
    }

    const onConfirmPrintOrder = () => {
        setOpenPrintConfirmModal(false);
        //props.onResetOrder();
        props.onNextStatusOrder(batch.id);
    }

    const onCancelPrintOrder = () => {
        setOpenPrintConfirmModal(false);
        props.onResetBatchRequest();
    }

    return (
        <React.Fragment>
            <CustomModal title={"Confirmar impresión de la(s) orden(s)"} showFooter={false} isOpen={openPrintConfirmModal} onClose={() => onCancelPrintOrder()}>
                <Row>
                    <Col md={12}>
                        ¿Logró imprimir lo(s) pedidos(s)?
                    </Col>
                </Row>
                <hr/>
                <Row>
                    <Col md={12} className="text-right">
                        <button type="button" className="btn btn-light" onClick={() => onCancelPrintOrder()}>NO</button>
                        <Button color="primary" type="button" onClick={onConfirmPrintOrder}>SI</Button>
                    </Col>
                </Row>
            </CustomModal>
        </React.Fragment>
    );
}

const mapStateToProps = state => {
    const {batchRequest, refresh} = state.Order
    const {batch, error, meta, conditionals, doRequest, loading} = batchRequest
    return {batch, error, meta, conditionals, doRequest, loading, refresh}
}

const mapDispatchToProps = dispatch => ({
    onResetOrder: () => dispatch(resetOrder()),
    onChangePreloader: (preloader) => dispatch(changePreloader(preloader)),
    onPrintBatchRequest: (conditional) => dispatch(printBatchRequest(conditional)),
    onNextStatusOrder: (id = []) => dispatch(nextStatusOrder({batch: id})),
    onResetBatchRequest: (id = []) => dispatch(resetBatchRequest()),
})

export default withRouter(
    connect(mapStateToProps, mapDispatchToProps)(PrintBatchRequest)
)

PrintBatchRequest.propTypes = {
    conditionals: PropTypes.array,
}
