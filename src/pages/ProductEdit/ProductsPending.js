import React, {useEffect} from "react";
import {Col, Row} from "reactstrap";
import {Link, withRouter} from "react-router-dom";
import {connect} from "react-redux";
import PropTypes from "prop-types";
import {Card} from "@material-ui/core";
import {map} from "lodash";
import {pendingProducts} from "../../store/product/actions";
import {StatusField} from "../../components/StatusField";
import {ORDER_STATUS} from "../../common/constants";
import {formatDate} from "../../common/utils";

const ProductsPendingList = ({onGetProductsPending, product, pendingProducts}) => {

    useEffect(() => {
        if(product && product.id) {
            onGetProductsPending(product.id);
        }
    }, [product]);

    return (
        <React.Fragment>
            <Card className="p-3">
                <Row>
                    <Col md={12}>
                        <h4 className="card-title text-info">Ordenes</h4>
                    </Col>
                </Row>
                <Row>
                   <Col md={12}>
                       <table className="table table-sm table-striped table-bordered table-centered table-nowrap font-size-11">
                           <thead>
                           <tr>
                               <th style={{width: '25%'}} className="text-center">Pedido #</th>
                               <th style={{width: '25%'}} className="text-center">Fecha</th>
                               <th style={{width: '25%'}} className="text-center">Talla</th>
                               <th style={{width: '25%'}} className="text-center">Cantidad</th>
                               <th style={{width: '25%'}} className="text-center">Cliente</th>
                               <th style={{width: '25%'}} className="text-center">Estado del pedido</th>
                           </tr>
                           </thead>
                           <tbody>
                           {map(pendingProducts, (prod, key) => (
                               <tr key={key}>
                                   <td className="text-center">
                                       <Link to={`/order/${prod.order.id}`} className="text-primary">
                                           <small className="font-weight-600 text-info">{prod.order.id}</small>
                                       </Link>
                                   </td>
                                   <td className="text-center">{prod.order.modifiedDate ? formatDate(prod.order.modifiedDate) : formatDate(prod.order.createdAt)}</td>
                                   <td className="text-center">{prod.size}</td>
                                   <td className="text-center">{prod.quantity}</td>
                                   <td className="text-center">{prod.customer.name}</td>
                                   <td className="text-center">
                                       <StatusField color={ORDER_STATUS[prod.order.status]?.color} className={"font-size-16"}>
                                           {ORDER_STATUS[prod.order.status].name}
                                       </StatusField>
                                   </td>
                               </tr>
                           ))}
                           {pendingProducts.length === 0 && (
                               <tr>
                                   <td colSpan={8} className="text-center text-muted">No hay ordenes pendientes</td>
                               </tr>
                           )}
                           </tbody>
                       </table>
                   </Col>
                </Row>
            </Card>
        </React.Fragment>
    ) ;
}

const mapStateToProps = state => {
    const {error, product, custom, loading} = state.Product
    const pendingProducts = custom.data && custom.data.pendingProducts ? custom.data.pendingProducts:[];
    return {error, product, pendingProducts: pendingProducts, loading}
}

const mapDispatchToProps = dispatch => ({
    onGetProductsPending: (id) => dispatch(pendingProducts(id)),
})

export default withRouter(
    connect(mapStateToProps, mapDispatchToProps)(ProductsPendingList)
)

ProductsPendingList.propTypes = {
    error: PropTypes.any,
    history: PropTypes.object,
    product: PropTypes.object,
}
