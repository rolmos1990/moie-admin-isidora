import React from "react"
import ReactApexChart from "react-apexcharts";
import PropTypes from "prop-types";

const PieChart = props => {

    const pieData = {
        series: props.data.series,
        options: {
            chart: {
                type: 'donut',
            },
            labels: props.data.labels,
            responsive: [{
                breakpoint: 480,
                options: {
                    chart: {
                        width: 200,
                    },
                }
            }],
            legend: {
                position: 'bottom',
                horizontalAlign: 'center',
                offsetY: 5,
                height: 80,
                fontSize: '0.8em',
            }
        },
    };

    if (props.data.colors) {
        pieData.options.colors = props.data.colors;
    }

    return (
        <>
            <ReactApexChart
                options={pieData.options}
                series={pieData.series}
                type={pieData.options.chart.type}
            />
        </>
    );
}

PieChart.propTypes = {
    data: PropTypes.object.isRequired
}

export default PieChart;
