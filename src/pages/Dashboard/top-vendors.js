import React from "react";
import {Card, CardBody, Table} from "reactstrap"

//Simple bar
import SimpleBar from "simplebar-react"

//Import Image
import avatar4 from "../../assets/images/users/avatar-4.jpg"
import avatar5 from "../../assets/images/users/avatar-5.jpg"
import avatar6 from "../../assets/images/users/avatar-6.jpg"
import avatar7 from "../../assets/images/users/avatar-7.jpg"
import avatar8 from "../../assets/images/users/avatar-8.jpg"

const TopVendors = () => {
    return (
        <React.Fragment>
            <Card>
                <CardBody>
                    <div className="float-end">
                    </div>
                    <h4 className="card-title mb-4">Top 5 Vendedores (Diario)</h4>
                    <SimpleBar style={{maxHeight: "336px"}}>
                        <div className="table-responsive">
                            <Table className="table-borderless table-centered table-nowrap">
                                <tbody>
                                <tr>
                                    <td style={{width: "20px"}}><img src={avatar4} className="avatar-xs rounded-circle " alt="..."/></td>
                                    <td>
                                        <h6 className="font-size-15 mb-1 fw-normal">Carla Diaz</h6>
                                        <p className="text-muted font-size-13 mb-0">
                                            <i className="mdi mdi-map-marker"></i> Bogota</p>
                                    </td>
                                    <td className="text-muted fw-semibold text-end">
                                        $25,000.00
                                    </td>
                                </tr>
                                <tr>
                                    <td><img src={avatar5} className="avatar-xs rounded-circle " alt="..."/></td>
                                    <td>
                                        <h6 className="font-size-15 mb-1 fw-normal">Maria Marcano</h6>
                                        <p className="text-muted font-size-13 mb-0"><i className="mdi mdi-map-marker"></i> Bogota</p>
                                    </td>
                                    <td className="text-muted fw-semibold text-end">
                                        $23,000.00
                                    </td>
                                </tr>
                                <tr>
                                    <td><img src={avatar6} className="avatar-xs rounded-circle " alt="..."/></td>
                                    <td>
                                        <h6 className="font-size-15 mb-1 fw-normal">Robert Vera</h6>
                                        <p className="text-muted font-size-13 mb-0"><i className="mdi mdi-map-marker"></i> Bogota</p>
                                    </td>
                                    <td className="text-muted fw-semibold text-end">
                                        $20,000.00
                                    </td>
                                </tr>
                                <tr>
                                    <td><img src={avatar7} className="avatar-xs rounded-circle " alt="..."/></td>
                                    <td>
                                        <h6 className="font-size-15 mb-1 fw-normal">Manuel Espinoza</h6>
                                        <p className="text-muted font-size-13 mb-0"><i className="mdi mdi-map-marker"></i> Bogota</p>
                                    </td>
                                    <td className="text-muted fw-semibold text-end">
                                        $12,000.00
                                    </td>
                                </tr>
                                <tr>
                                    <td><img src={avatar8} className="avatar-xs rounded-circle " alt="..."/></td>
                                    <td>
                                        <h6 className="font-size-15 mb-1 fw-normal">Sandro Colmenares</h6>
                                        <p className="text-muted font-size-13 mb-0"><i className="mdi mdi-map-marker"></i> Bogota</p>
                                    </td>
                                    <td className="text-muted fw-semibold text-end">
                                        $10,000.00
                                    </td>
                                </tr>
                                </tbody>
                            </Table>
                        </div>
                    </SimpleBar>
                </CardBody>
            </Card>
        </React.Fragment>
    )
}

export default TopVendors
