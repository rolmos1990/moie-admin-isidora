import PropTypes from 'prop-types'
import React, {useEffect} from "react"

import {Alert, Card, CardBody, Col, Container, Row, Spinner} from "reactstrap"

// Redux
import {connect} from "react-redux"
import {Link, withRouter} from "react-router-dom"

// availity-reactstrap-validation
import {AvField, AvForm} from "availity-reactstrap-validation"

//Social Media Imports
// import TwitterLogin from "react-twitter-auth"

// actions
import {apiError, loginUser, socialLogin} from "../../store/actions"

// import images
import logo from "../../assets/images/logo-dark.png"
import logolight from "../../assets/images/logo-light.png"

//Import config
import {facebook, google} from "../../config"

const Login = (props) => {
   // handleValidSubmit
   const handleValidSubmit = (event, values) => {
    props.loginUser(values, props.history)
  }

  const signIn = (res, type) => {
    const { socialLogin } = props
    if (type === "google" && res) {
      const postData = {
        name: res.profileObj.name,
        email: res.profileObj.email,
        token: res.tokenObj.access_token,
        idToken: res.tokenId,
      }
      socialLogin(postData, props.history, type)
    } else if (type === "facebook" && res) {
      const postData = {
        name: res.name,
        email: res.email,
        token: res.accessToken,
        idToken: res.tokenId,
      }
      socialLogin(postData, props.history, type)
    }
  }

  //handleGoogleLoginResponse
  const googleResponse = response => {
    signIn(response, "google")
  }

  //handleTwitterLoginResponse
  // const twitterResponse = e => {}

  //handleFacebookLoginResponse
  const facebookResponse = response => {
    signIn(response, "facebook")
  }
  const removeAttr = attr => {
    if(document.body.hasAttribute(attr)){
      document.body.removeAttribute(attr)
    }
  }

  useEffect(() => {
    document.body.className = "authentication-bg";
    removeAttr('data-layout');
    removeAttr('data-layout-size');

    // remove classname when component will unmount
    return function cleanup() {
      document.body.className = "";
    };
  });

  return (
    <React.Fragment>
      <div className="home-btn d-none d-sm-block">
        <Link to="/" className="text-dark">
          <i className="mdi mdi-home-variant h2"></i>
        </Link>
      </div>
      <div className="account-pages my-5 pt-sm-5">
        <Container>
          <Row>
            <Col lg={12}>
              <div className="text-center">
                <Link to="/" className="mb-5 d-block auth-logo">
                  <img src={logo} alt="" height="80" className="logo logo-dark" />
                  <img src={logolight} alt="" height="80" className="logo logo-light" />
                </Link>
              </div>
            </Col>
          </Row>
          <Row className="align-items-center justify-content-center">
            <Col md={8} lg={6} xl={5}>
              <Card>

                <CardBody className="p-4">
                  <div className="text-center mt-2">
                    <h5 className="text-primary">Bienvenido!</h5>
                    <p className="text-muted">Inicia sesión con Lucy Moie.</p>
                  </div>
                  <div className="p-2 mt-4">
                    <AvForm
                      className="form-horizontal"
                      onValidSubmit={(e, v) => {
                        handleValidSubmit(e, v)
                      }}
                    >
                      {props.error && typeof props.error === "string" ? (
                        <Alert color="danger">{props.error}</Alert>
                      ) : null}

                      <div className="mb-3">
                        <AvField
                          name="username"
                          label="Nombre de Usuario"
                          value=""
                          className="form-control"
                          placeholder="Login"
                          type="text"
                          required
                        />
                      </div>

                      <div className="mb-3">
                        <AvField
                          name="password"
                          label="Contraseña"
                          value=""
                          type="password"
                          required
                          placeholder="*********"
                        />
                      </div>

                      <div className="mt-3">
                        <button
                          className="btn btn-primary w-100 waves-effect waves-light"
                          type="submit"
                        >
                          {props.loading && <Spinner size="sm" className="m-1" color="white"/>}
                          Log In
                        </button>
                      </div>

                    </AvForm>

                  </div>
                </CardBody>
              </Card>
              <div className="mt-5 text-center">
                <p>© {new Date().getFullYear()} Lucy Modas Web <i
                  className="mdi mdi-heart text-danger"></i> Moie V{process.env.REACT_APP_VERSION}
                        </p>
              </div>
            </Col>
          </Row>

        </Container>
      </div>
    </React.Fragment>
  )
}

const mapStateToProps = state => {
  const { error, loading } = state.Login
  return { error, loading }
}

export default withRouter(
  connect(mapStateToProps, { loginUser, apiError, socialLogin })(Login)
)

Login.propTypes = {
  error: PropTypes.any,
  history: PropTypes.object,
  loginUser: PropTypes.func,
  socialLogin: PropTypes.func
}
