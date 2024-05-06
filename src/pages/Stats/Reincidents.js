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
import {getUsers} from "../../store/user/actions";
import HighChartsWrapper from "../../components/Common/HishChartsWrapper";
import {AvForm} from "availity-reactstrap-validation";

const hoy = new Date();
const defaultDates = [new Date(hoy.getTime() - 518400000), new Date()];
const initialState = {
    cargando: '',
    usuarios: [],
    reincidencias: {
        data: {
            chart: {
                type: 'column'
            },
            title: {
                text: 'Reincidencias'
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
            series: [{
                name: 'Clientes',
                data: []
            },
                {
                    name: 'Reincidentes',
                    data: []
                }]
        },
        fecha: {
            inicial: new Date(hoy.getTime() - 518400000),
            final: new Date(hoy.getTime())
        }
    },
}

const Reincidents = ({className}) => {

    const [stats, setStats] = useState(initialState);

    useEffect(() => {
        if (stats.reincidencias) {
            reincidenciasCargar()
        }
    }, [stats.reincidencias.fecha]);

    const getStatsLabel = (stats, node) => {
        if(parserClientDate(stats[node].fecha.inicial) == parserClientDate(stats[node].fecha.final)){
            return parserClientDate(stats[node].fecha.inicial);
        }
        else {
            return parserClientDate(stats[node].fecha.inicial) + ' a ' + parserClientDate(stats[node].fecha.final)
        }
    }

    const reincidenciasCargar = () => {
        if (valida(stats.reincidencias.fecha)) {
            stats.cargando = 'Cargando estadisticas de ventas...';
            //definir la url para la consulta a la API
            var url = '/stats/estadistica_reincidencias';
            url += '/' + parserServerDate(stats.reincidencias.fecha.inicial);
            url += '/' + parserServerDate(stats.reincidencias.fecha.final);
            //leer estadisticas de ventas
            statsApi(url).then(function (data) {
                var fechas = [];
                var datosClientes = data.clientes;
                var datosReincidentes = data.reincidentes;

                const newStats = {...stats};
                newStats.reincidencias.data.subtitle.text = getStatsLabel(newStats,'reincidencias');
                newStats.reincidencias.data.xAxis.categories = ['Total'];
                newStats.reincidencias.data.series[0].data = datosClientes;
                newStats.reincidencias.data.series[1].data = datosReincidentes;
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

    return (
        <AvForm className="needs-validation" autoComplete="off">
        <Card className={className}>
            <CardBody>
                <Row id="reincidencias">
                    <Col md={12}>
                        <h4 className="card-title text-info"> Reincidencias</h4>
                    </Col>
                    <Col md={4}>
                        <div className="mb-3">
                            <Label>Fecha</Label>
                            <FieldDate
                                name="reincidencias_dates"
                                mode={DATE_MODES.RANGE}
                                defaultValue={defaultDates}
                                onChange={(dates) => onChangeDate(dates, "reincidencias")}
                            />
                        </div>
                    </Col>
                    <Col md={12}>
                        <HighChartsWrapper options={stats.reincidencias.data}/>
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
    connect(mapStateToProps, mapDispatchToProps)(Reincidents)
)

Reincidents.propTypes = {
    error: PropTypes.any,
}

