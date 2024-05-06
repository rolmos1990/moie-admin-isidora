import React, {useEffect, useState} from "react"
import {CardBody, Col, Label, Row} from "reactstrap"
import {Card} from "@material-ui/core";
import {withRouter} from "react-router-dom"
import {connect} from "react-redux";
import PropTypes from "prop-types";
import {DATE_FORMAT, formatDate} from "../../common/utils";
import {REPORT_TYPES, showByList} from "../../common/constants";
import {generateReport} from "../../store/reports/actions";
import {statsApi} from "../../helpers/backend_helper";

import Highcharts from 'highcharts'
import {FieldDate, FieldSelect} from "../../components/Fields";
import {DATE_MODES} from "../../components/Fields/InputDate";
import {DEFAULT_PAGE_LIMIT} from "../../common/pagination";
import {getUsers} from "../../store/user/actions";
import {getEmptyOptions} from "../../common/converters";
import HighChartsWrapper from "../../components/Common/HishChartsWrapper";
import {AvForm} from "availity-reactstrap-validation";

const hoy = new Date();
const defaultDates = [new Date(hoy.getTime() - 518400000), new Date()];
const initialState = {
    cargando: '',
    usuarios: [],
    ventasOrigen: {
        data: {
            chart: {
                type: 'column'
            },
            title: {
                text: 'Ventas por origen'
            },
            subtitle: {
                text: null
            },
            xAxis: {
                categories: []
            },
            yAxis: [{
                labels: {
                    format: '$ {value}'
                },
                title: {
                    text: 'Monto'
                }
            }],
            series: [
                {
                    name: 'Página Web',
                    data: []
                },
                {
                    name: 'Facebook',
                    data: []
                },
                {
                    name: 'Whatsapp',
                    data: []
                },
                {
                    name: 'Otros',
                    data: []
                }
            ]
        },
        opciones: {
            grupo: 'dia'
        },
        fecha: {
            inicial: new Date(hoy.getTime() - 518400000),
            final: new Date(hoy.getTime()),
        }
    },
}

const Origens = ({className}) => {

    const [stats, setStats] = useState(initialState);
    const [ventasOrigenReload, setVentasOrigenReload] = useState(false);

    useEffect(() => {
        if (ventasOrigenReload) {
            setVentasOrigenReload(false);
        }
    }, [ventasOrigenReload]);

    useEffect(() => {
        if (stats.ventasOrigen) {
            ventasOrigenCargar()
        }
    }, [stats.ventasOrigen.fecha]);

    useEffect(() => {
        if (stats.ventasOrigen) {
            ventasOrigenCargar()
        }
    }, [stats.ventasOrigen.opciones]);

    const getStatsLabel = (stats, node) => {
        if(parserClientDate(stats[node].fecha.inicial) == parserClientDate(stats[node].fecha.final)){
            return parserClientDate(stats[node].fecha.inicial);
        }
        else {
            return parserClientDate(stats[node].fecha.inicial) + ' a ' + parserClientDate(stats[node].fecha.final)
        }
    }

    const ventasOrigenCargar = () => {
        if (valida(stats.ventasOrigen.fecha)) {
            stats.cargando = 'Cargando estadisticas de ventas...';
            //definir la url para la consulta a la API
            var url = '/stats/estadistica_ventas_origen';
            url += '/' + parserServerDate(stats.ventasOrigen.fecha.inicial);
            url += '/' + parserServerDate(stats.ventasOrigen.fecha.final);
            url += '/' + stats.ventasOrigen.opciones.grupo;
            //leer estadisticas de ventas
            statsApi(url).then(function (resp) {
                var fechas = [];
                var series = [];

                var seriesList = [];
                for (var i = 0; i < resp.length; i++) {
                    var r = resp[i];
                    Object.keys(r).filter(k => k !== 'fecha').forEach(k => {
                        if (!seriesList.includes(k)) {
                            seriesList.push(k);
                        }
                    });
                }

                var seriesMap = {};

                for (var i = 0; i < resp.length; i++) {
                    var data = resp[i];
                    fechas[i] = data.fecha;

                    seriesList.forEach(serieName => {
                        if (!seriesMap[serieName]) {
                            seriesMap[serieName] = {name: serieName, data: []};
                        }
                        if (!data[serieName]) {
                            seriesMap[serieName].data.push(parseFloat(0));
                        } else {
                            seriesMap[serieName].data.push(parseFloat(data[serieName]));
                        }
                    })
                }
                Object.keys(seriesMap).filter(k => k !== 'fecha').forEach(k => {
                    series.push(seriesMap[k]);
                });

                if (series.length === 0) {
                    series = initialState.ventasOrigen.data.series;
                }

                const newStats = {...stats};
                newStats.ventasOrigen.data.subtitle.text = getStatsLabel(newStats,'ventasOrigen');
                newStats.ventasOrigen.data.xAxis.categories = fechas;
                newStats.ventasOrigen.data.series = series;
                newStats.cargando = '';
                setStats(newStats);
                setVentasOrigenReload(true);
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

    const onChangeGrupo = (grupo, node) => {
        if (grupo && grupo.value) {
            const s = {...stats}
            s[node] = {...stats[node], opciones: {...stats[node].opciones, grupo: grupo.value}}
            setStats(s);
        }
    }

    return (
        <AvForm className="needs-validation" autoComplete="off">
        <Card className={className}>
            <CardBody>
                <Row id="ventasOrigen">
                    <Col md={12}>
                        <h4 className="card-title text-info"> Ventas por origen</h4>
                    </Col>
                    <Col md={4}>
                        <div className="mb-3">
                            <Label>Fecha</Label>
                            <FieldDate
                                name="ventasOrigen_dates"
                                mode={DATE_MODES.RANGE}
                                defaultValue={defaultDates}
                                onChange={(dates) => onChangeDate(dates, "ventasOrigen")}
                            />
                        </div>
                    </Col>
                    <Col md={4}>
                        <div className="mb-3">
                            <Label>Mostrar por</Label>
                            <FieldSelect
                                name="ventasOrigen_grupo"
                                options={showByList}
                                defaultValue={showByList.length > 0 ? showByList[0] : null}
                                onChange={(data) => onChangeGrupo(data, "ventasOrigen")}
                            />
                        </div>
                    </Col>
                    <Col md={12}>
                        {!ventasOrigenReload && (
                            <HighChartsWrapper options={stats.ventasOrigen.data}/>
                        )}
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
    onGetUsers: (conditional = null, limit = DEFAULT_PAGE_LIMIT, page) => dispatch(getUsers(conditional, limit, page)),
})

export default withRouter(
    connect(mapStateToProps, mapDispatchToProps)(Origens)
)

Origens.propTypes = {
    error: PropTypes.any,
}

