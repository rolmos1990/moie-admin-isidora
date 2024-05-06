import React, {useEffect} from "react"
import {CardBody, Container} from "reactstrap"
import {withRouter} from "react-router-dom"
import {connect} from "react-redux";
import {apiError} from "../../store/auth/login/actions";
import PropTypes from "prop-types";
import {getCustomer} from "../../store/customer/actions";
import Breadcrumb from "../../components/Common/Breadcrumb";
import CustomerForm from "./CustomerForm";
import {Card} from "@material-ui/core";
import {PERMISSIONS} from "../../helpers/security_rol";
import NoAccess from "../../components/Common/NoAccess";
import HasPermissions from "../../components/HasPermissions";

const CustomerEdit = (props) => {
    const {getCustomer, customer} = props;
    const isEdit = props.match.params.id;

    //carga inicial
    useEffect(() => {
        if (isEdit && getCustomer) {
            getCustomer(props.match.params.id);
        }
    }, [getCustomer]);

    return (
        <React.Fragment>
            <div className="page-content">
                <Container fluid>
                    <Breadcrumb hasBack path="/customers" title={customer.name} item={"Cliente"}/>
                    <HasPermissions permissions={[PERMISSIONS.CUSTOMER_CREATE, PERMISSIONS.CUSTOMER_EDIT]} renderNoAccess={() => <NoAccess/>}>
                        <Card>
                            <CardBody>
                                <CustomerForm customer={customer}/>
                            </CardBody>
                        </Card>
                    </HasPermissions>
                </Container>
            </div>
        </React.Fragment>
    )
}

const mapStateToProps = state => {
    const {error, customer, loading} = state.Customer
    return {error, customer, loading}
}

export default withRouter(
    connect(mapStateToProps, {apiError, getCustomer})(CustomerEdit)
)

CustomerEdit.propTypes = {
    error: PropTypes.any,
    history: PropTypes.object
}

