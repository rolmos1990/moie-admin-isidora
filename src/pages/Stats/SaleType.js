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
import {getEmptyOptions} from "../../common/converters";
import HighChartsWrapper from "../../components/Common/HishChartsWrapper";
import {AvForm} from "availity-reactstrap-validation";

const hoy = new Date();
const defaultDates = [new Date(hoy.getTime() - 518400000), new Date()];
const initialState = {
    cargando: '',
    usuarios: [],
    ventasTipo: {
        data: {
            title: {
                text: 'Ventas por tipo'
            },
            subtitle: {
                text: null
            },
            tooltip: {
                shared: true
            },
            xAxis: {
                crosshair: true,
                categories: []
            },
            yAxis: [{
                labels: {
                    format: '$ {value}'
                },
                title: {
                    text: 'Monto'
                }
            }, {
                labels: {
                    format: '{value}'
                },
                title: {
                    text: 'Pedidos'
                },
                opposite: true
            }],
            series: [
                {
                    name: 'Monto Previo Pago',
                    type: 'column',
                    color: '#aad0f3',
                    data: []
                },
                {
                    name: 'Monto Contra Entrega',
                    type: 'column',
                    color: '#5b5b62',
                    data: []
                },
                {
                    name: 'Pedidos Previo Pago',
                    yAxis: 1,
                    color: '#7CB5EC',
                    data: []
                },
                {
                    name: 'Pedidos Contra Entrega',
                    yAxis: 1,
                    color: '#434348',
                    data: []
                }]
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

const SaleType = ({className}) => {

    const [stats, setStats] = useState(initialState);

    useEffect(() => {
        if (stats.ventasTipo) {
            ventasTipoCargar()
        }
    }, [stats.ventasTipo.fecha]);

    useEffect(() => {
        if (stats.ventasTipo) {
            ventasTipoCargar()
        }
    }, [stats.ventasTipo.opciones]);

    const getStatsLabel = (stats, node) => {
        if(parserClientDate(stats[node].fecha.inicial) == parserClientDate(stats[node].fecha.final)){
            return parserClientDate(stats[node].fecha.inicial);
        }
        else {
            return parserClientDate(stats[node].fecha.inicial) + ' a ' + parserClientDate(stats[node].fecha.final)
        }
    }

    const ventasTipoCargar = () => {
        if (valida(stats.ventasTipo.fecha)) {
            stats.cargando = 'Cargando estadisticas de ventas...';
            //definir la url para la consulta a la API
            var url = '/stats/estadistica_ventas_tipo';
            url += '/' + parserServerDate(stats.ventasTipo.fecha.inicial);
            url += '/' + parserServerDate(stats.ventasTipo.fecha.final);
            url += '/' + stats.ventasTipo.opciones.grupo;
            //leer estadisticas de ventas
            statsApi(url).then(function (resp) {
                var fechas = [];
                var cantidadPrevioPago = [];
                var montoPrevioPago = [];
                var cantidadContraEntrega = [];
                var montoContraEntrega = [];
                var keys = Object.keys(resp);
                for (var i = 0; i < keys.length; i++) {
                    var data = resp[keys[i]];
                    fechas[i] = data.fecha;
                    cantidadPrevioPago[i] = parseFloat(data.cantidadPrevioPago);
                    montoPrevioPago[i] = parseFloat(data.montoPrevioPago);
                    cantidadContraEntrega[i] = parseFloat(data.cantidadContraEntrega);
                    montoContraEntrega[i] = parseFloat(data.montoContraEntrega);
                }
                const newStats = {...stats};
                newStats.ventasTipo.data.subtitle.text = getStatsLabel(newStats,'ventasTipo');
                newStats.ventasTipo.data.xAxis.categories = fechas;
                newStats.ventasTipo.data.series[0].data = montoPrevioPago;
                newStats.ventasTipo.data.series[1].data = montoContraEntrega;
                newStats.ventasTipo.data.series[2].data = cantidadPrevioPago;
                newStats.ventasTipo.data.series[3].data = cantidadContraEntrega;
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
                <Row id="ventasTipo">
                    <Col md={12}>
                        <h4 className="card-title text-info"> Ventas por tipo</h4>
                    </Col>
                    <Col md={4}>
                        <div className="mb-3">
                            <Label>Fecha</Label>
                            <FieldDate
                                name="ventasTipo_dates"
                                mode={DATE_MODES.RANGE}
                                defaultValue={defaultDates}
                                onChange={(dates) => onChangeDate(dates, "ventasTipo")}
                            />
                        </div>
                    </Col>
                    <Col md={4}>
                        <div className="mb-3">
                            <Label>Mostrar por</Label>
                            <FieldSelect
                                name="ventasTipo_grupo"
                                options={showByList}
                                defaultValue={showByList.length > 0 ? showByList[0] : null}
                                onChange={(data) => onChangeGrupo(data, "ventasTipo")}
                            />
                        </div>
                    </Col>
                    <Col md={12}>
                        <HighChartsWrapper options={stats.ventasTipo.data}/>
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
    onGenerateReport: (data) => dispatch(generateReport(REPORT_TYPES.CONCILIATION, data))
})

export default withRouter(
    connect(mapStateToProps, mapDispatchToProps)(SaleType)
)

SaleType.propTypes = {
    error: PropTypes.any,
}

