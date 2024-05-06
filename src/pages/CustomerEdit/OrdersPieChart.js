import React, {useEffect, useState} from "react"
import PropTypes from "prop-types";
import {customerOrdersStats} from "../../helpers/service";
import moment from "moment";
import {ORDER_COLORS, ORDER_STATUS, ORDERS_ENUM} from "../../common/constants";
import PieChart from "../../components/Common/PieChart";
import BarChart from "../../components/Common/BarChart";
import {priceFormat} from "../../common/utils";

const OrdersPieChart = ({customerId}) => {

    const [orderChart, setOrderChart] = useState({series: [], labels:[]});

    useEffect(() => {
        if (customerId) {
            customerOrdersStats(customerId, moment()).then(resp => {
                const chartData = {
                    series: [],
                    labels:[],
                    colors: [],
                    fullseries: [],
                    tooltip: {
                        z: {
                            formatter: function(val) {
                                return val
                            },
                            title: 'Cantidad'
                        },
                        y: {
                            formatter: function(val) {
                                return priceFormat(val) + ' COP'
                            },
                            title: 'Monto'
                        },
                    }
                };
                if(resp){
                    //CONCILIADAS Y ANULADAS

                    chartData.fullseries[0] = {data: [], name: 'Monto'};

                    resp.filter(pc => pc.status >= ORDERS_ENUM.CONFIRMED).forEach(pc => {

                        chartData.fullseries[0].data.push({x: ORDER_STATUS[pc.status].name, y: pc.sumPrices, z: pc.qty});
                        chartData.labels.push(ORDER_STATUS[pc.status].name);
                        chartData.colors.push(ORDER_STATUS[pc.status].colorCss);
                    })
                }
                setOrderChart(chartData);
            });
        }
    }, [customerId]);

    return (
        <>
            <h4 className="card-title text-info">Pedidos</h4>
            <div style={{background: '#f6f6f6', height: '100%'}}>
                <BarChart data={orderChart} colors={orderChart.colors} tooltip={orderChart.tooltip} />
            </div>
        </>
    );
}

OrdersPieChart.propTypes = {
    customerId: PropTypes.number.isRequired
}

export default OrdersPieChart;
