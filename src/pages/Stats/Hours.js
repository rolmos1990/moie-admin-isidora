import React, {useEffect, useState} from "react"
import {CardBody, Col, Label, Row} from "reactstrap"
import {Card} from "@material-ui/core";
import {withRouter} from "react-router-dom"
import {connect} from "react-redux";
import PropTypes from "prop-types";
import {DATE_FORMAT, formatDate} from "../../common/utils";
import {REPORT_TYPES} from "../../common/constants";
import {generateReport} from "../../store/reports/actions";
import {statsApi} from "../../helpers/backend_helper";

import Highcharts from 'highcharts'
import {FieldDate} from "../../components/Fields";
import {DATE_MODES} from "../../components/Fields/InputDate";
import {DEFAULT_PAGE_LIMIT} from "../../common/pagination";
import HighChartsWrapper from "../../components/Common/HishChartsWrapper";
import {AvForm} from "availity-reactstrap-validation";

const hoy = new Date();
const defaultDates = [new Date(hoy.getTime() - 518400000), new Date()];
const initialState = {
    cargando: '',
    usuarios: [],
    horas: {
        data: {
            chart: {
                zoomType: 'xy'
            },
            title: {
                text: 'Pedidos por hora'
            },
            subtitle: {
                text: "sub"
            },
            xAxis: {
                categories: [],
                crosshair: true
            },
            yAxis: [
                {
                    labels: {
                        format: '$ {value}',
                        style: {
                            color: Highcharts.getOptions().colors[1]
                        }
                    },
                    title: {
                        text: 'Monto',
                        style: {
                            color: Highcharts.getOptions().colors[1]
                        }
                    }
                },
                // Secondary yAxis
                {
                    labels: {
                        format: '{value}',
                        style: {
                            color: Highcharts.getOptions().colors[0]
                        }
                    },
                    title: {
                        text: 'Pedidos',
                        style: {
                            color: Highcharts.getOptions().colors[0]
                        }
                    },
                    opposite: true
                }],
            series: [
                {
                    name: 'Monto',
                    type: 'column',
                    yAxis: 1,
                    data: []
                },
                {
                    name: 'Cantidad',
                    type: 'spline',
                    data: []
                }
            ]
        },
        fecha: {
            inicial: new Date(hoy.getTime() - 518400000),
            final: new Date(hoy.getTime()),
        }
    }
}

const Hours = ({className}) => {

    const [stats, setStats] = useState(initialState);

    useEffect(() => {
        if (stats.horas) {
            horasCargar()
        }
    }, [stats.horas.fecha]);;

    const getStatsLabel = (stats, node) => {
        if(parserClientDate(stats[node].fecha.inicial) == parserClientDate(stats[node].fecha.final)){
            return parserClientDate(stats[node].fecha.inicial);
        }
        else {
            return parserClientDate(stats[node].fecha.inicial) + ' a ' + parserClientDate(stats[node].fecha.final)
        }
    }

    const horasCargar = () => {
        if (valida(stats.horas.fecha)) {
            stats.cargando = 'Cargando estadisticas de ventas...';
            //definir la url para la consulta a la API
            var url = '/stats/estadistica_horas';
            url += '/' + parserServerDate(stats.horas.fecha.inicial);
            url += '/' + parserServerDate(stats.horas.fecha.final);
            //leer estadisticas de ventas
            statsApi(url).then(function (resp) {
                var horas = [];
                var cantidad = [];
                var monto = [];
                var keys = Object.keys(resp);
                for (var i = 0; i < keys.length; i++) {
                    var data = resp[keys[i]];
                    horas[i] = data.hora;
                    cantidad[i] = parseInt(data.cantidad);
                    monto[i] = parseFloat(data.monto);
                }
                const newStats = {...stats};
                newStats.horas.data.subtitle.text = getStatsLabel(newStats,'horas');
                newStats.horas.data.xAxis.categories = horas;
                newStats.horas.data.series[0].data = monto;
                newStats.horas.data.series[1].data = cantidad;
                newStats.cargando = '';
                setStats(newStats);
            })
        }
    }

    const parserServerDate = (date) => {
        return formatDate(date, DATE_FORMAT.ONLY_DATE);
    }

    const valida = (node) => {
        if (!node) return;
        let v = false;
        if (node.inicial && node.final && (node.inicial <= node.final)) {
            v = true;
        } else if (node.inicial || node.final){
            v = true;
        }
        return v;
    }

    const parserClientDate = (date) => {
        return formatDate(date, DATE_FORMAT.DD_MM_YYYY);
    }

    const onChangeDate = (dates, node) => {
        if (dates.length > 0) {
            const s = {...stats}
            if ((dates.length === 1) || (dates[0].toString() == dates[1].toString())) {
                s[node] = {...stats[node], fecha: {...stats[node].fecha, inicial: dates[0], final: dates[0]}};
            } else {
                s[node] = {...stats[node], fecha: {...stats[node].fecha, inicial: dates[0], final: dates[1]}};
            }
            setStats(s);
            console.log(s);
        }
    }

    return (
        <AvForm className="needs-validation" autoComplete="off">
        <Card className={className}>
            <CardBody>
                <Row id="horas">
                    <Col md={12}>
                        <h4 className="card-title text-info"> Pedidos por hora</h4>
                    </Col>
                    <Col md={4}>
                        <div className="mb-3">
                            <Label>Fecha</Label>
                            <FieldDate
                                name="horas_dates"
                                mode={DATE_MODES.RANGE}
                                defaultValue={defaultDates}
                                onChange={(dates) => onChangeDate(dates, "horas")}
                            />
                        </div>
                    </Col>
                    <Col md={12}>
                        <HighChartsWrapper options={stats.horas.data}/>
                    </Col>
                </Row>
            </CardBody>
        </Card>
        </AvForm>
    )
}

const mapStateToProps = state => {
    return {}
}

const mapDispatchToProps = dispatch => ({
    onGenerateReport: (data) => dispatch(generateReport(REPORT_TYPES.CONCILIATION, data)),
})

export default withRouter(
    connect(mapStateToProps, mapDispatchToProps)(Hours)
)

Hours.propTypes = {
    error: PropTypes.any,
}

