import React from "react"
import {Container} from "reactstrap"
import Breadcrumb from "../../components/Common/Breadcrumb";

import BatchQueriesForm from "./BatchQueriesForm";

const BatchQueries = () => {
    return (
        <React.Fragment>
            <div className="page-content">
                <Container fluid>
                    <Breadcrumb hasBack path="/products" title={null} item="Consultas Masivas"/>
                    <BatchQueriesForm/>
                </Container>
            </div>
        </React.Fragment>
    )
}
export default BatchQueries;
