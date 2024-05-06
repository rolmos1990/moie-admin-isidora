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
import HighChartsWrapper from "../../components/Common/HishChartsWrapper";
import {AvForm} from "availity-reactstrap-validation";

const hoy = new Date();
const defaultDates = [new Date(hoy.getTime() - 518400000), new Date()];
const initialState = {
    cargando: '',
    usuarios: [],
    masVendidos: {
        data: {
            chart: {
                type: 'column'
            },
            title: {
                text: 'Productos más vendidos'
            },
            subtitle: {
                text: null
            },
            xAxis: {
                categories: []
            },
            yAxis: [{
                labels: {
                    format: '{value}'
                },
                title: {
                    text: 'Piezas'
                }
            }],
            series: [{
                name: 'Cantidad',
                data: []
            },
                {
                    name: 'Existencia',
                    data: []
                }]
        },
        fecha: {
            inicial: new Date(hoy.getTime() - 518400000),
            final: new Date(hoy.getTime()),
        },
    },
}

const Bests = ({className}) => {

    const [stats, setStats] = useState(initialState);

    useEffect(() => {
        if (stats.masVendidos) {
            masVendidosCargar()
        }
    }, [stats.masVendidos.fecha]);

    const getStatsLabel = (stats, node) => {
        if(parserClientDate(stats[node].fecha.inicial) == parserClientDate(stats[node].fecha.final)){
            return parserClientDate(stats[node].fecha.inicial);
        }
        else {
            return parserClientDate(stats[node].fecha.inicial) + ' a ' + parserClientDate(stats[node].fecha.final)
        }
    }

    const masVendidosCargar = () => {
        if (valida(stats.masVendidos.fecha)) {
            stats.cargando = 'Cargando estadisticas de ventas...';
            //definir la url para la consulta a la API
            var url = '/stats/estadistica_mas_vendidos';
            url += '/' + parserServerDate(stats.masVendidos.fecha.inicial);
            url += '/' + parserServerDate(stats.masVendidos.fecha.final);
            //leer estadisticas de ventas
            statsApi(url).then(function (resp) {
                var ids = [];
                var cantidad = [];
                var existencia = [];
                var keys = Object.keys(resp);
                for (var i = 0; i < keys.length; i++) {
                    var data = resp[keys[i]];
                    ids[i] = data.id;
                    cantidad[i] = parseFloat(data.cantidad);
                    existencia[i] = parseFloat(data.existencia);
                }
                const newStats = {...stats};
                newStats.masVendidos.data.subtitle.text = getStatsLabel(newStats,'masVendidos');
                newStats.masVendidos.data.xAxis.categories = ids;
                newStats.masVendidos.data.series[0].data = cantidad;
                newStats.masVendidos.data.series[1].data = existencia;
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
                <Row id="masVendidos">
                    <Col md={12}>
                        <h4 className="card-title text-info"> Productos más vendidos</h4>
                    </Col>
                    <Col md={4}>
                        <div className="mb-3">
                            <Label>Fecha</Label>
                            <FieldDate
                                name="masVendidos_dates"
                                mode={DATE_MODES.RANGE}
                                defaultValue={defaultDates}
                                onChange={(dates) => onChangeDate(dates, "masVendidos")}
                            />
                        </div>
                    </Col>
                    <Col md={12}>
                        <HighChartsWrapper options={stats.masVendidos.data}/>
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
    connect(mapStateToProps, mapDispatchToProps)(Bests)
)

Bests.propTypes = {
    error: PropTypes.any,
}

