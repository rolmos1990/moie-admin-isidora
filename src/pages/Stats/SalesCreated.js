import React, {useEffect, useState} from "react"
import {CardBody, Col, Label, Row} from "reactstrap"
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
import {Card} from "@material-ui/core";

const hoy = new Date();
const defaultDates = [new Date(hoy.getTime() - 518400000), new Date()];
const initialState = {
    cargando: '',
    usuarios: [],
    ventasTotal: {
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
            yAxis: [{
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
                        text: 'Piezas'
                    },
                    opposite: true
                }],
            series: [{
                name: 'Venta ($)',
                data: []
            },
                {
                    name: 'Ganancia ($)',
                    data: []
                },
                {
                    name: 'Piezas',
                    yAxis: 1,
                    dashStyle: 'shortdot',
                    data: []
                }]
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

const Sales = ({users, onGetUsers, className}) => {

    const [stats, setStats] = useState(initialState);
    const [userList, setUserList] = useState([]);

    useEffect(() => {
        if (onGetUsers) {
            onGetUsers(null, 250);
        }
    }, [onGetUsers]);

    useEffect(() => {
        if (stats.ventasTotal) {
            cargarVentas()
        }
    }, [stats.ventasTotal.fecha]);

    useEffect(() => {
        if (stats.ventasTotal) {
            cargarVentas()
        }
    }, [stats.ventasTotal.opciones]);

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
        if (valida(stats.ventasTotal.fecha)) {
            stats.cargando = 'Cargando estadisticas de ventas...';
            //definir la url para la consulta a la API
            var url = '/stats/estadistica_ventas/created';
            url += '/' + parserServerDate(stats.ventasTotal.fecha.inicial);
            url += '/' + parserServerDate(stats.ventasTotal.fecha.final);
            url += '/' + stats.ventasTotal.opciones.grupo;
            url += '/' + stats.ventasTotal.opciones.usuario;
            //leer estadisticas de ventas
            statsApi(url).then((resp) => {
                var fechas = [];
                var datosVentas = [];
                var datosGanancias = [];
                var datosPiezas = [];

                var keys = Object.keys(resp);

                for (var i = 0; i < keys.length; i++) {
                    var data = resp[keys[i]];
                    fechas[i] = data.fecha;
                    datosVentas[i] = parseFloat(data.monto);
                    datosGanancias[i] = parseFloat(data.ganancia);
                    datosPiezas[i] = parseFloat(data.piezas);
                }
                const newStats = {...stats};
                newStats.ventasTotal.data.subtitle.text = getStatsLabel(newStats,'ventasTotal');
                newStats.ventasTotal.data.xAxis.categories = fechas;
                newStats.ventasTotal.data.series[0].data = datosVentas;
                newStats.ventasTotal.data.series[1].data = datosGanancias;
                newStats.ventasTotal.data.series[2].data = datosPiezas;
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
                    <Row id="ventasTotal">
                        <Col md={12}>
                            <h4 className="card-title text-info"> Total de ventas (Fecha de Creación)</h4>
                        </Col>
                        <Col md={4}>
                            <div className="mb-3">
                                <Label>Fecha</Label>
                                <FieldDate
                                    name="ventas_total_dates"
                                    mode={DATE_MODES.RANGE}
                                    defaultValue={defaultDates}
                                    onChange={(dates) => onChangeDate(dates, "ventasTotal")}
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
                                    onChange={(data) => onChangeGrupo(data, "ventasTotal")}
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
                                    onChange={(data) => onChangeUser(data, "ventasTotal")}
                                />
                            </div>
                        </Col>
                        <Col md={12}>
                            <HighChartsWrapper options={stats.ventasTotal.data}/>
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
    connect(mapStateToProps, mapDispatchToProps)(Sales)
)

Sales.propTypes = {
    error: PropTypes.any,
}

