import React, {useEffect, useState} from "react"
import imageNotFound from "../../assets/images/image-not-found.png"
import {Card, CardBody} from "reactstrap";
import ReactApexChart from "react-apexcharts";
import CountUp from "react-countup";
import PropTypes from "prop-types";
import WidgetCard from "./WidgetCard";

const series1 = [{
    data: [25, 66, 41, 89, 63, 25, 44, 20, 36, 40, 54]
}]
const options1 = {
    fill: {
        colors: ['#5b73e8']
    },
    chart: {
        width: 70,
        sparkline: {
            enabled: !0
        }
    },
    plotOptions: {
        bar: {
            columnWidth: '50%'
        }
    },
    labels: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11],
    xaxis: {
        crosshairs: {
            width: 1
        },
    },
    tooltip: {
        enabled: false,
        fixed: {
            enabled: !1
        },
        x: {
            show: !1
        },
        y: {
            title: {
                formatter: function (seriesName) {
                    return ''
                }
            }
        },
        marker: {
            show: !1
        }
    }
};

const WidgetCard1 = props => {
    const {statusGroup, title} = props;
    const [dataCard, setDataCard] = useState({});

    useEffect(() => {
        let active = 0;
        let inactive = 0;
        if(statusGroup ){
            if(statusGroup[1]) active = statusGroup[1];
            if(statusGroup[0]) inactive = statusGroup[0];
        }

        const total = active + inactive;
        const data = {
            id: 1,
            icon: "mdi mdi-clock-five-time",
            title: title,
            value: total,
            prefix: "",
            suffix: "",
            decimal: 0,
            charttype: "bar",
            chartheight: 40,
            chartwidth: 70,
            badgeValue: active,
            color: "success",
            desc: "activos",
            badgeValue2: inactive,
            color2: "danger",
            desc2: "inactivos",
            series: series1,
            options: options1,
        };
        setDataCard(data);
    }, [statusGroup])

    return (
        <WidgetCard report={dataCard} />
    )
}


WidgetCard1.propTypes = {
    statusGroup: PropTypes.object.isRequired,
    title: PropTypes.string.isRequired
}

export default WidgetCard1
