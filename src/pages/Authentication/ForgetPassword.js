import PropTypes from 'prop-types'
import React, { useEffect } from "react"
import { Row, Col, Alert, Container, CardBody ,Card} from "reactstrap"

// Redux
import { connect } from "react-redux"
import { withRouter, Link } from "react-router-dom"

// availity-reactstrap-validation
import { AvForm, AvField } from "availity-reactstrap-validation"

// action
import { userForgetPassword } from "../../store/actions"

// import images
import logo from "../../assets/images/logo-dark.png"
import logolight from "../../assets/images/logo-light.png"

const ForgetPasswordPage = props => {
  useEffect(() => {
    document.body.className = "authentication-bg";
    // remove classname when component will unmount
    return function cleanup() {
      document.body.className = "";
    };
  });

  function handleValidSubmit(event, values) {
    props.userForgetPassword(values, props.history)
  }

  return (
    <React.Fragment>
      <div className="home-btn d-none d-sm-block">
        <Link to="/" className="text-dark">
          <i className="mdi mdi-home-variant h2"></i>
        </Link>
      </div>

      <div className="account-pages my-5  pt-sm-5">
        <Container>
          <div className="row justify-content-center">

            <div className="col-md-8 col-lg-6 col-xl-5">
              <div>

                <a href="/" className="mb-5 d-block auth-logo">
                  <img src={logo} alt="" height="22" className="logo logo-dark" />
                  <img src={logolight} alt="" height="22" className="logo logo-light" />
                </a>
                <Card>

                  <CardBody className="p-4">

                    <div className="text-center mt-2">
                      <h5 className="text-primary">Recuperar contraseña</h5>
                    </div>
                    <div className="p-2 mt-4">
                      <div className="alert alert-success text-center mb-4" role="alert"> Ingrese su correo electronico!</div>
                      {props.forgetError && props.forgetError ? (
                        <Alert color="danger" className="text-center mb-4" style={{ marginTop: "13px" }}>
                          {props.forgetError}
                        </Alert>
                      ) : null}
                      {props.forgetSuccessMsg ? (
                        <Alert color="success" className="text-center mb-4" style={{ marginTop: "13px" }}>
                          {props.forgetSuccessMsg}
                        </Alert>
                      ) : null}

                      <AvForm
                        className="form-horizontal"
                        onValidSubmit={(e, v) => handleValidSubmit(e, v)}
                      >
                        <div className="mb-3">
                          <AvField
                            name="email"
                            label="Email"
                            className="form-control"
                            placeholder="Enter email"
                            type="email"
                            required
                          />
                        </div>
                        <Row className="row mb-0">
                          <Col className="col-12 text-end">
                            <button
                              className="btn btn-primary w-md waves-effect waves-light"
                              type="submit"
                            >
                              Reset
                          </button>
                          </Col>
                        </Row>
                        <div className="mt-4 text-center">
                          <p className="mb-0">Recuerda su contraseña ? <Link to="/login" className="fw-medium text-primary"> Iniciar sesión </Link></p>
                        </div>
                      </AvForm>
                    </div>

                  </CardBody>
                </Card>
                <div className="mt-5 text-center">
                <p>
                  © {new Date().getFullYear()} Lucy Modas {" "}
                  <i className="mdi mdi-heart text-danger" /> Moie v2.0
                </p>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </div>
    </React.Fragment>
  )
}

ForgetPasswordPage.propTypes = {
  forgetError: PropTypes.any,
  forgetSuccessMsg: PropTypes.any,
  history: PropTypes.object,
  userForgetPassword: PropTypes.func
}

const mapStatetoProps = state => {
  const { forgetError, forgetSuccessMsg } = state.ForgetPassword
  return { forgetError, forgetSuccessMsg }
}

export default withRouter(
  connect(mapStatetoProps, { userForgetPassword })(ForgetPasswordPage)
)
