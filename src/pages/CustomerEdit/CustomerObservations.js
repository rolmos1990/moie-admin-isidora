import React, {useEffect, useState} from "react"
import {Col, Container, Row} from "reactstrap"
import {Card, Tooltip} from "@material-ui/core";
import {Link, withRouter} from "react-router-dom"
import {connect} from "react-redux";
import PropTypes from "prop-types";
import Breadcrumb from "../../components/Common/Breadcrumb";
import {formatDate} from "../../common/utils";
import NoDataIndication from "../../components/Common/NoDataIndication";
import {getCustomer} from "../../store/customer/actions";
import OrderCardList from "../Orders/OrderCardList";
import {STATUS_COLORS, StatusField} from "../../components/StatusField";
import {ConverterCustomerStatus} from "../Customer/customer_status";
import Observations from "../../components/Common/Observations";
import {deleteFieldOption, getFieldOptionByGroup, registerFieldOption, updateFieldOption} from "../../store/fieldOptions/actions";
import {COMMENT_ENTITIES, GROUPS} from "../../common/constants";
import {deleteComment, getCommentsByEntity, registerComment} from "../../store/comment/actions";

const CustomerObservations = (props) => {

    const {onGetObservations, onCreateObservations, onDeleteObservations, onGetByGroup, customerId, fieldOptions} = props;
    const [observationsSuggested, setObservationsSuggested] = useState([]);

    useEffect(() => {
        onGetObservations(customerId);
        onGetByGroup(GROUPS.CUSTOMER_OBSERVATIONS);
    }, [onGetObservations]);

    useEffect(() => {
        if (fieldOptions && fieldOptions.length > 0) {
            setObservationsSuggested(fieldOptions.filter(item => item.groups === GROUPS.CUSTOMER_OBSERVATIONS).map(item => item.value))
        }
    }, [fieldOptions])

    const onDeleteObservation = (observation) => {
        onDeleteObservations(observation.id);
    }

    const onAddObservation = (observation) => {
        onCreateObservations(observation);
    }

    return (
        <React.Fragment>

        </React.Fragment>
    ) ;
}

const mapStateToProps = state => {
    const {error, customer, loading} = state.Customer
    const {fieldOptions} = state.FieldOption
    return {error, customer,fieldOptions, loading}
}

const mapDispatchToProps = dispatch => ({
    onGetObservations: (idRelated) => dispatch(getCommentsByEntity(COMMENT_ENTITIES.CUSTOMER, idRelated)),
    onCreateObservations: (comment) => dispatch(registerComment(comment)),
    onDeleteObservations: (commentId) => dispatch(deleteComment(commentId)),
    onGetCommentSuggested: (group) => dispatch(getFieldOptionByGroup(group, 500, 0)),
})

export default withRouter(
    connect(mapStateToProps, mapDispatchToProps)(CustomerObservations)
)

CustomerObservations.propTypes = {
    customerId: PropTypes.number.isRequired,
    error: PropTypes.any,
    history: PropTypes.object
}