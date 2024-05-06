import React from "react"
import {Container} from "reactstrap"
import Breadcrumb from "../../components/Common/Breadcrumb";
import ConfigsList from "./configsList";

const Configs = () => {
    return (
        <React.Fragment>
            <div className="page-content">
                <Container fluid>
                    <Breadcrumb path="/configs" title={null} item="Configuraciones"/>
                    <ConfigsList/>
                </Container>
            </div>
        </React.Fragment>
    )
}

export default Configs;
