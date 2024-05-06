import React from "react"
import {withRouter} from "react-router-dom"
import {connect} from "react-redux";
import PropTypes from "prop-types";
import {getCustomer} from "../../store/customer/actions";
import {makeStyles} from '@material-ui/core/styles';
import Timeline from '@material-ui/lab/Timeline';
import TimelineItem from '@material-ui/lab/TimelineItem';
import TimelineSeparator from '@material-ui/lab/TimelineSeparator';
import TimelineConnector from '@material-ui/lab/TimelineConnector';
import TimelineContent from '@material-ui/lab/TimelineContent';
import TimelineOppositeContent from '@material-ui/lab/TimelineOppositeContent';
import TimelineDot from '@material-ui/lab/TimelineDot';
import Paper from '@material-ui/core/Paper';
import {map} from "lodash";
import {formatDate} from "../../common/utils";
import {Col, Row} from "reactstrap";

const useStyles = makeStyles((theme) => ({
    paper: {
        padding: '6px 12px',
    },
    secondaryTail: {
        backgroundColor: theme.palette.secondary.main,
    },
}));

const CustomizedTimeline = ({data, onDelete}) => {

    const classes = useStyles();

    return (
        <Timeline align="alternate">
            {map(data, (tl, key) => (
                <TimelineItem key={key}>
                    <TimelineOppositeContent>
                        <p className="text-muted">{formatDate(tl.createdAt)}</p>
                    </TimelineOppositeContent>
                    <TimelineSeparator>
                        <TimelineDot>
                            <i className="fa fa-telegram-plane"> </i>
                        </TimelineDot>
                        <TimelineConnector />
                    </TimelineSeparator>
                    <TimelineContent>
                        <Paper elevation={3} className={classes.paper}>
                            <Row>
                                <Col md={12} style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                                    <h5>{tl.user ? tl.user.name: ''}</h5>
                                    {onDelete && (
                                        <button size="small" className="btn btn-sm text-danger" onClick={() => onDelete(tl.id)}>
                                            <i className="uil uil-trash-alt font-size-18"> </i>
                                        </button>
                                    )}
                                </Col>
                            </Row>
                            <p className="text-muted m-0">{tl.comment}</p>
                        </Paper>
                    </TimelineContent>
                </TimelineItem>
            ))}
        </Timeline>
    );
}

const mapStateToProps = state => {
    const {error, customer, loading} = state.Customer
    return {error, customer, loading}
}

export default withRouter(
    connect(mapStateToProps, {getCustomer})(CustomizedTimeline)
)

CustomizedTimeline.propTypes = {
    error: PropTypes.any,
    data: PropTypes.array.isRequired,
    onDelete: PropTypes.func,
    history: PropTypes.object
}