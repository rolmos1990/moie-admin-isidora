import PropTypes from 'prop-types'
import React from "react"
import { Col, Card, CardBody } from "reactstrap"
import CountUp from 'react-countup';
import ReactApexChart from "react-apexcharts"
import WidgetCard from "../../components/Common/WidgetCard";

const MiniWidget = props => {
    return (
        <React.Fragment>
            {props.reports.map((report, key) => (
                <Col md={6} xl={3} key={key}>
                    <WidgetCard report={report}/>
                </Col>
            ))}
        </React.Fragment>
    )
}

export default MiniWidget

MiniWidget.propTypes = {
    reports: PropTypes.array
}
