import React, {useEffect, useState} from "react"
import {Col, Container, Row} from "reactstrap"
import {Breadcrumbs} from "@material-ui/core";
import MiniWidget from "./mini-widget";
import TopVendors from "./top-vendors";
import LatestTransaction from "./latest-transaction";
import Inventory from "./inventory";
import {getOrders} from "../../store/order/actions";
import {connect} from "react-redux";
import {getReportDashbord} from "../../store/reports/actions";
import OrderStatusStats from "./order-status-stats";
import EventItems from "./eventItems";

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
        enabled: false
    }
};

const series2 = [70]

const options2 = {
    fill: {
        colors: ['#34c38f']
    },
    chart: {
        sparkline: {
            enabled: !0
        }
    },
    dataLabels: {
        enabled: !1
    },
    plotOptions: {
        radialBar: {
            hollow: {
                margin: 0,
                size: '60%'
            },
            track: {
                margin: 0
            },
            dataLabels: {
                show: !1
            }
        }
    }
};

const series3 = [55]

const options3 = {
    fill: {
        colors: ['#5b73e8']
    },
    chart: {
        sparkline: {
            enabled: !0
        }
    },
    dataLabels: {
        enabled: !1
    },
    plotOptions: {
        radialBar: {
            hollow: {
                margin: 0,
                size: '60%'
            },
            track: {
                margin: 0
            },
            dataLabels: {
                show: !1
            }
        }
    }
};

const options4 = {

    fill: {
        colors: ['#f1b44c']
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
    labels: ["Ayer", "Hoy"],
    xaxis: {
        crosshairs: {
            width: 1
        },
    },
    tooltip: {
        enabled: false,
        fixed: {
            enabled: 0
        },
        x: {
            show: 0
        },
        y: {
            title: {
                formatter: function (seriesName) {
                    return ''
                }
            }
        },
        marker: {
            show: 0
        }
    }
};

const Dashboard = (props) => {

    const {dashboard, onGetDashboard, loading} = props;

    const [reports, setReports] = useState([]);

    useEffect(() => {
        onGetDashboard()
    }, [onGetDashboard])

    useEffect(() => {

        if(dashboard && dashboard.products) {

            //Productos
            const products = {
                id: 1,
                icon: "mdi mdi-clock-five-time",
                title: "Productos",
                value: parseInt(dashboard.products.reserved || 0) + parseInt(dashboard.products.available || 0),
                prefix: "",
                suffix: "",
                decimal: 0,
                charttype: "bar",
                chartheight: 40,
                chartwidth: 70,
                badgeValue: parseInt(dashboard.products.available || 0), //disponibles
                color: "success",
                desc: "disponibles",
                badgeValue2: parseInt(dashboard.products.reserved || 0), //reservados
                color2: "danger",
                desc2: "reservado",
                series: series1,
                options: options1,

            };

            //Ventas diarias
            let secondaryDaily = parseFloat(dashboard.orders.statDailySecond || 0) || 0;
            const primaryDaily = parseFloat(dashboard.orders.statDailyFirst || 0) || 0;
            let rate = 0;
            if(secondaryDaily > 0) {
                rate = (((primaryDaily - secondaryDaily) * 100) / secondaryDaily);
            }

            const ventasDiarias = {
                id: 2,
                icon: rate >= 0 ? "mdi mdi-arrow-up-bold" : "mdi mdi-arrow-down-bold",
                title: "Ventas diarias",
                value: dashboard.orders.statDailyFirst,
                decimal: 2,
                charttype: "text",
                chartheight: 45,
                chartwidth: 45,
                prefix: "$",
                suffix: "",
                badgeValue: rate.toFixed(2) + "%",
                color: rate >= 0 ? "success" : "danger",
                desc: "desde ayer",
                series: dashboard.orders.statDailyQtyFirst,
                options: options2,
            };

            //Ventas semanales
            let secondaryWeekly = parseFloat(dashboard.orders.statWeeklySecond || 0) || 0;
            const primaryWeekly = parseFloat(dashboard.orders.statWeeklyFirst || 0) || 0;
            let rateWeek = 0;
            if(secondaryWeekly > 0) {
                rateWeek = (((primaryWeekly - secondaryWeekly) * 100) / secondaryWeekly);
            }

            const ventasSemanales = {
                id: 3,
                icon: rateWeek >= 0 ? "mdi mdi-arrow-up-bold" : "mdi mdi-arrow-down-bold",
                title: "Ventas semana",
                value: dashboard.orders.statWeeklyFirst,
                decimal: 2,
                charttype: "text",
                chartheight: 45,
                chartwidth: 45,
                prefix: "$",
                suffix: "",
                badgeValue: rateWeek.toFixed(2) + "%",
                color: rateWeek >= 0 ? "success" : "danger",
                desc: "semana pasada",
                series: dashboard.orders.statWeeklyQtyFirst,
                options: options2,
            };

            const customers = {
                id: 4,
                icon: "uil-users-alt",
                title: "Clientes",
                value: dashboard.customers.registers,
                decimal: 0,
                charttype: "line",
                chartheight: 40,
                chartwidth: 70,
                badgeValue: dashboard.customers.registersToday,
                color: dashboard.customers.registersToday > 0 ? "success" : "danger",
                desc: "registrados hoy",
                series: [{
                    data: [25, 66, 200]
                }],
                options: options4,
            };

            setReports([
                {...products},
                {...ventasDiarias},
                {...ventasSemanales},
                {...customers}
            ]);
        }

    }, [dashboard]);

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
            <Breadcrumbs title="Lucy Moie" item="Dashboard" />
            <Row>
                {reports && reports.length > 0 && (
                    <MiniWidget reports={reports} />
                )}
            </Row>
            <Row>
                <Col xl={4}>
                <Inventory/>
                <OrderStatusStats/>
                <EventItems/>
                </Col>
                <Col xl={8}>
                    <LatestTransaction />
                </Col>
            </Row>
        </Container>
      </div>
    </React.Fragment>
  )
}

const mapStateToProps = state => {
    const {dashboard, loading} = state.Report;
    return {dashboard, loading};
}
const mapDispatchToProps = dispatch => ({
    onGetDashboard: () => dispatch(getReportDashbord()),
})

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Dashboard);
