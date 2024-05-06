import React from "react"
import PropTypes from 'prop-types'
import { Link } from "react-router-dom"
import { Row, Col, BreadcrumbItem } from "reactstrap"

const Breadcrumb = props => {
  return (
    <Row>
      <Col className="col-12">
        <div className="page-title-box d-flex align-items-center justify-content-between">
          <h3 className="mb-0">
            {props.hasBack && (<Link to={props.path || "#"}><i className={"bx bx-chevron-left"}> </i> {props.item}</Link>)}
          </h3>
          <div className="page-title-right">
            <ol className="breadcrumb m-0">
              <BreadcrumbItem active>
                <Link to={props.path || "#"}>{props.item}</Link>
              </BreadcrumbItem>
              {props.title && (
                  <BreadcrumbItem>
                    <Link to="#">{props.title}</Link>
                  </BreadcrumbItem>
              )}
            </ol>
          </div>
        </div>
      </Col>
    </Row>
  )
}

Breadcrumb.propTypes = {
  item: PropTypes.string,
  title: PropTypes.string,
  hasBack: PropTypes.bool
}

export default Breadcrumb
