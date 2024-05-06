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
const initialState = {
    cargando: '',
    usuarios: [],
    ventasStatusTotal: {
        data: {
            title: {
                text: 'Ventas'
            },
            subtitle: {
                text: null
            },
            xAxis: {
                categories: []
            },
            yAxis: [
                {
                    labels: {
                        format: '$ {value}'
                    },
                    title: {
                        text: 'Monto'
                    }
                },
                {
                    labels: {
                        format: '{value} Pz.'
                    },
                    title: {
                        text: ''
                    },
                    opposite: false
                }],
            series: [
                {
                    name: 'Pendiente ($)',
                    data: []
                },
                {
                    name: 'Cofirmado ($)',
                    data: []
                },
                {
                    name: 'Enviado ($)',
                    data: []
                },
                {
                    name: 'Finalizado ($)',
                    data: []
                },
                {
                    name: 'Cancelado ($)',
                    data: []
                }
            ],
            tooltip: {
                formatter: function() {
                    var dataSum = 0;
                    const each = Highcharts.each;

                    var xPosition = this.point.x;
                    each(this.series.chart.series, function(item, i){
                        dataSum+= item['processedYData'][xPosition]
                    })

                    var pcnt = (this.y / dataSum) * 100;

                    let html = '<div><div><p><b>-- '+this.series.name+'</b><br/><b>Porcentaje: </b>' + Highcharts.numberFormat(pcnt) + '%' + '</p></div><br />';
                    html += '<div><p><b>Monto: </b> ' + priceFormat(this.y) + ' COP</p></div></div>';

                    return html;
                },
                shared: false
            }
        },
        opciones: {
            usuario: '',
            grupo: 'dia'
        },
        fecha: {
            inicial: new Date(hoy.getTime() - 518400000),
            final: new Date(hoy.getTime())
        },
    }
}

const SalesByStatus = ({users, onGetUsers, className}) => {

    const [stats, setStats] = useState(initialState);
    const [userList, setUserList] = useState([]);

    useEffect(() => {
        if (onGetUsers) {
            onGetUsers(null, 250);
        }
    }, [onGetUsers]);

    useEffect(() => {
        if (stats.ventasStatusTotal) {
            cargarVentas()
        }
    }, [stats.ventasStatusTotal.fecha]);

    useEffect(() => {
        if (stats.ventasStatusTotal) {
            cargarVentas()
        }
    }, [stats.ventasStatusTotal.opciones]);

    useEffect(() => {
        if (users) {
            const options = users.map((user) => ({label: user.name, value: user.id}))
            setStats({...stats, usuarios: [getEmptyOptions(), ...options]});
            const addedUsers = users.filter(user => !!user.status).map(user => ({label: user.username, value: user.id}));
            addedUsers.unshift({value: null, label: "Todos"});
            setUserList(addedUsers);
        }
    }, [users]);

    const getStatsLabel = (stats, node) => {
        if(parserClientDate(stats[node].fecha.inicial) == parserClientDate(stats[node].fecha.final)){
            return parserClientDate(stats[node].fecha.inicial);
        }
        else {
            return parserClientDate(stats[node].fecha.inicial) + ' a ' + parserClientDate(stats[node].fecha.final)
        }
    }

    const cargarVentas = () => {
        if (valida(stats.ventasStatusTotal.fecha)) {
            stats.cargando = 'Cargando estadisticas de ventas...';
            //definir la url para la consulta a la API
            var url = '/stats/estadistica_ventas/states';
            url += '/' + parserServerDate(stats.ventasStatusTotal.fecha.inicial);
            url += '/' + parserServerDate(stats.ventasStatusTotal.fecha.final);
            url += '/' + stats.ventasStatusTotal.opciones.grupo;
            url += '/' + stats.ventasStatusTotal.opciones.usuario;
            //leer estadisticas de ventas
            statsApi(url).then((resp) => {
                console.log('response: ', resp);
                var fechas = [];


                var datosPendientes = [];
                var datosConfirmadas = [];
                var datosEnviadas = [];
                var datosFinalizadas = [];
                var datosCanceladas = [];

                var keys = Object.keys(resp);

                for (var i = 0; i < keys.length; i++) {
                    var data = resp[keys[i]];
                    fechas[i] = data.fecha;
                    datosPendientes[i] = parseFloat(data[ORDERS_ENUM.PENDING]);
                    datosConfirmadas[i] = parseFloat(data[ORDERS_ENUM.CONFIRMED]);
                    datosEnviadas[i] = parseFloat(data[ORDERS_ENUM.SENT]);
                    datosFinalizadas[i] = parseFloat(data[ORDERS_ENUM.FINISHED]);
                    datosCanceladas[i] = parseFloat(data[ORDERS_ENUM.ANULED]);

                }
                const newStats = {...stats};
                newStats.ventasStatusTotal.data.subtitle.text = getStatsLabel(newStats,'ventasStatusTotal');
                newStats.ventasStatusTotal.data.xAxis.categories = fechas;
                newStats.ventasStatusTotal.data.series[0].data = datosPendientes;
                newStats.ventasStatusTotal.data.series[1].data = datosConfirmadas;
                newStats.ventasStatusTotal.data.series[2].data = datosEnviadas;
                newStats.ventasStatusTotal.data.series[3].data = datosFinalizadas;
                newStats.ventasStatusTotal.data.series[4].data = datosCanceladas;
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
        }
    }

    const onChangeUser = (user, node) => {
        const s = {...stats}
        s[node] = {...stats[node], opciones: {...stats[node].opciones, usuario: user.value || null}}
        setStats(s);
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
            <Row id="ventasStatusTotal">
                <Col md={12}>
                    <h4 className="card-title text-info"> Total de ventas por Estado</h4>
                </Col>
                <Col md={4}>
                    <div className="mb-3">
                        <Label>Fecha</Label>
                        <FieldDate
                            name="ventas_total_dates"
                            mode={DATE_MODES.RANGE}
                            defaultValue={defaultDates}
                            onChange={(dates) => onChangeDate(dates, "ventasStatusTotal")}
                        />
                    </div>
                </Col>
                <Col md={4}>
                    <div className="mb-3">
                        <Label>Mostrar por</Label>
                        <FieldSelect
                            name="ventas_total_grupo"
                            options={showByList}
                            defaultValue={showByList.length > 0 ? showByList[0] : null}
                            onChange={(data) => onChangeGrupo(data, "ventasStatusTotal")}
                        />
                    </div>
                </Col>
                <Col md={4}>
                    <div className="mb-3">
                        <Label>Usuarios</Label>
                        <FieldSelect
                            name="ventas_total_users"
                            options={userList}
                            defaultValue={stats.usuarios.length > 0 ? stats.usuarios[0] : null}
                            onChange={(data) => onChangeUser(data, "ventasStatusTotal")}
                        />
                    </div>
                </Col>
                <Col md={12}>
                    <HighChartsWrapper options={stats.ventasStatusTotal.data}/>
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
    connect(mapStateToProps, mapDispatchToProps)(SalesByStatus)
)

SalesByStatus.propTypes = {
    error: PropTypes.any,
}

