import React, {useEffect, useState} from "react"
import {CardBody, Col, Label, Row} from "reactstrap"
import {withRouter} from "react-router-dom"
import {connect} from "react-redux";
import PropTypes from "prop-types";
import {DATE_FORMAT, formatDate, priceFormat} from "../../common/utils";
import {ORDER_STATUS, ORDER_STATUS_LIST, ORDERS_ENUM, REPORT_TYPES, showByList} from "../../common/constants";
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
import {Card} from "@material-ui/core";

const hoy = new Date();
const defaultDates = [new Date(hoy.getTime() - 518400000), new Date()];

const SalesByShipments = ({users, onGetUsers, className}) => {

    const initialState = {
        cargando: '',
        usuarios: [],
        ventasEnvios: {
            data: {
                title: {
                    text: 'Ventas envios Total'
                },
                subtitle: {
                    text: null
                },
                tooltip: {
                    formatter: function() {

                        var color = this.color;
                        var name = this.series.name;


                        var xPosition = this.point.x;
                        const montoEnvio = this.series.chart.series[2]['yData'][xPosition];

                        var hasCosto = name.includes('Con Costo');
                        var monto = hasCosto ? this.y + ' ('+priceFormat(montoEnvio)+' COP)' : this.y + ' (0 COP)';

                        let html = '<div><div><small>'+ this.point.category +'</small><br/><p><i style="color: '+color+'" class="uil-money-bill me-2"></i> '+this.series.name+' : <b>' + monto + '</b></p></div><br /></div>';

                        return html;
                    },
                    shared: false
                },
                xAxis: {
                    crosshair: true,
                    categories: []
                },
                yAxis: [{
                    labels: {
                        format: '$ {value}'
                    },
                    formatter: function(val) {
                        console.log('value test: ', val);
                        return val
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
                        name: 'Con Costo de Envio (Cantidad)',
                        yAxis: 1,
                        color: '#434348',
                        data: []
                    },
                    {
                        name: 'Sin Costo de Envio (Cantidad)',
                        yAxis: 1,
                        color: '#7CB5EC',
                        data: []
                    },
                    {
                        name: 'Monto de Envio',
                        yAxis: 1,
                        color: '#7CB5EC',
                        data: [],
                        visible: false
                    }
                ],
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

    const [stats, setStats] = useState(initialState);
    const [userList, setUserList] = useState([]);
    const [result, setResult] = useState([]);

    useEffect(() => {
        if (onGetUsers) {
            onGetUsers(null, 250);
        }
    }, [onGetUsers]);

    useEffect(() => {
        if (stats.ventasEnvios) {
            ventasEnviosCargar()
        }
    }, [stats.ventasEnvios.fecha]);

    useEffect(() => {
        if (stats.ventasEnvios) {
            ventasEnviosCargar()
        }
    }, [stats.ventasEnvios.opciones]);

    const getStatsLabel = (stats, node) => {
        if(parserClientDate(stats[node].fecha.inicial) == parserClientDate(stats[node].fecha.final)){
            return parserClientDate(stats[node].fecha.inicial);
        }
        else {
            return parserClientDate(stats[node].fecha.inicial) + ' a ' + parserClientDate(stats[node].fecha.final)
        }
    }

    const ventasEnviosCargar = () => {
        if (valida(stats.ventasEnvios.fecha)) {
            stats.cargando = 'Cargando estadisticas de ventas...';
            //definir la url para la consulta a la API
            var url = '/stats/estadistica_envios';
            url += '/' + parserServerDate(stats.ventasEnvios.fecha.inicial);
            url += '/' + parserServerDate(stats.ventasEnvios.fecha.final);
            url += '/' + stats.ventasEnvios.opciones.grupo;
            //leer estadisticas de ventas
            statsApi(url).then(function (resp) {
                setResult(resp);
                var fechas = [];
                var cantidadEnvios = [];
                var cantidadNoEnvios = [];
                var montoEnvios = [];
                var keys = Object.keys(resp);
                for (var i = 0; i < keys.length; i++) {
                    var data = resp[keys[i]];
                    fechas[i] = data.fecha;
                    cantidadEnvios[i] = parseFloat(data.deliveryQty);
                    cantidadNoEnvios[i] = parseFloat(data.deliveryZeroQty);
                    montoEnvios[i] = parseFloat(data.deliveryCosts);
                }
                const newStats = {...stats};
                newStats.ventasEnvios.data.subtitle.text = getStatsLabel(newStats,'ventasEnvios');
                newStats.ventasEnvios.data.xAxis.categories = fechas;
                newStats.ventasEnvios.data.series[0].data = cantidadEnvios;
                newStats.ventasEnvios.data.series[1].data = cantidadNoEnvios;
                newStats.ventasEnvios.data.series[2].data = montoEnvios;
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
                    <Row id="ventasEnvios">
                        <Col md={12}>
                            <h4 className="card-title text-info"> Ventas por tipo</h4>
                        </Col>
                        <Col md={4}>
                            <div className="mb-3">
                                <Label>Fecha</Label>
                                <FieldDate
                                    name="ventasEnvios_dates"
                                    mode={DATE_MODES.RANGE}
                                    defaultValue={defaultDates}
                                    onChange={(dates) => onChangeDate(dates, "ventasEnvios")}
                                />
                            </div>
                        </Col>
                        <Col md={4}>
                            <div className="mb-3">
                                <Label>Mostrar por</Label>
                                <FieldSelect
                                    name="ventasEnvios_grupo"
                                    options={showByList}
                                    defaultValue={showByList.length > 0 ? showByList[0] : null}
                                    onChange={(data) => onChangeGrupo(data, "ventasEnvios")}
                                />
                            </div>
                        </Col>
                        <Col md={12}>
                            <HighChartsWrapper options={stats.ventasEnvios.data}/>
                        </Col>
                    </Row>
                </CardBody>
            </Card>
        </AvForm>
    )
}

const mapStateToProps = state => {
    const {users} = state.User
    return {users}
}

const mapDispatchToProps = dispatch => ({
    onGenerateReport: (data) => dispatch(generateReport(REPORT_TYPES.CONCILIATION, data)),
    onGetUsers: (conditional = null, limit = DEFAULT_PAGE_LIMIT, page) => dispatch(getUsers(conditional, limit, page)),
})

export default withRouter(
    connect(mapStateToProps, mapDispatchToProps)(SalesByShipments)
)

SalesByShipments.propTypes = {
    error: PropTypes.any,
}

