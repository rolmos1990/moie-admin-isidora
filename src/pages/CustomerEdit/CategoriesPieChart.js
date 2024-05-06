import React, {useEffect, useState} from "react"
import PropTypes from "prop-types";
import {customerCategoryStats, customerOrdersStats} from "../../helpers/service";
import moment from "moment";
import {ORDER_STATUS, ORDERS_ENUM} from "../../common/constants";
import PieChart from "../../components/Common/PieChart";
import BarChart from "../../components/Common/BarChart";
import {priceFormat} from "../../common/utils";

const CategoriesPieChart = ({customerId}) => {

    const [categoryChart, setCategoryChart] = useState({series: [], labels:[]});

    useEffect(() => {
        if (customerId) {
            customerCategoryStats(customerId, moment()).then(resp => {

                const chartData = {
                    series: [],
                    labels:[],
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

                //const chartData = {series: [], labels:[]};
                if(resp){

                    chartData.fullseries[0] = {data: [], name: 'Monto'};

                    resp.forEach(pc => {

                        let name = pc.name !== null ? pc.name : "SIN CATEGORIA";
                        name = pc.name !== "" ? name : "SIN NOMBRE";

                        chartData.fullseries[0].data.push({x: name, y: pc.sumPrices, z: parseInt(pc.qty)});
                        chartData.labels.push(name);
                        //chartData.colors.push(ORDER_STATUS[pc.status].colorCss);
                    })
                }

                setCategoryChart(chartData);
            });
        }
    }, [customerId]);

    return (
        <>
            <h4 className="card-title text-info">Categorias</h4>
            <div style={{background: '#f6f6f6', height: '100%'}}>
                <BarChart data={categoryChart}  tooltip={categoryChart.tooltip}/>
            </div>
        </>
    );
}

CategoriesPieChart.propTypes = {
    customerId: PropTypes.number.isRequired
}

export default CategoriesPieChart;
