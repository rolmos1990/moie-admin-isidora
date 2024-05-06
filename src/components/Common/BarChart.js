import React from "react"
import ReactApexChart from "react-apexcharts";
import PropTypes from "prop-types";

const BarChart = props => {
    const colors = ['#0096FF', '#5F9EA0', '#0047AB', '#6495ED', '#00FFFF', '#00008B', '#6F8FAF', '#1434A4', '#00A36C', '#3F00FF', '#5D3FD3'];
    const barData = {
        series: props.data.fullseries ? props.data.fullseries : [{
            data: props.data.series
        }],
        options: {
            chart: {
                height: 350,
                type: 'bar',
                events: {
                    click: function(chart, w, e) {
                    }
                }
            },
            responsive: [{
                breakpoint: 480,
                options: {
                    chart: {
                        width: 200,
                    },
                }
            }],
            colors: colors,
            plotOptions: {
                bar: {
                    columnWidth: '35%',
                    distributed: true,
                }
            },
            dataLabels: {
                enabled: false
            },
            legend: {
                show: false
            },
            xaxis: {
                categories:
                    props.data.labels
                ,
                labels: {
                    style: {
                        colors: colors,
                        fontSize: '12px'
                    }
                }
            }
        }
    };

    if (props.data.colors) {
        barData.options.colors = props.data.colors;
    }

    if(props.tooltip){
        barData.options.tooltip = props.data.tooltip;
    }

    return (
        <>
            <ReactApexChart
                options={barData.options}
                series={barData.series}
                type={barData.options.chart.type}
            />
        </>
    );
}

BarChart.propTypes = {
    data: PropTypes.object.isRequired,
    colors: PropTypes.array
}

export default BarChart;
