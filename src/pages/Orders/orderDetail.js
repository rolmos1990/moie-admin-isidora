import React from "react"
import {Container} from "reactstrap"
import {withRouter} from "react-router-dom"
import {connect} from "react-redux";
import PropTypes from "prop-types";
import Breadcrumb from "../../components/Common/Breadcrumb";
import OrderEdit from "./orderEdit";

const OrderDetail = (props) => {
    if(!props.match.params.id) props.history('/404');

    return(
        <React.Fragment>
            <div className="page-content">
                <Container fluid>
                    <Breadcrumb hasBack path="/orders" title={`Pedido ${props.match.params.id}`} item={"Pedidos"}/>
                    <OrderEdit orderId={props.match.params.id}/>
                </Container>
            </div>
        </React.Fragment>
    );
}

const mapStateToProps = state => {
    return {}
}

const mapDispatchToProps = dispatch => ({
})

export default withRouter(
    connect(mapStateToProps, mapDispatchToProps)(OrderDetail)
)

OrderDetail.propTypes = {
    error: PropTypes.any,
    history: PropTypes.object
}
