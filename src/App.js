import PropTypes from 'prop-types'
import React from "react"

import {BrowserRouter as Router, Redirect, Switch} from "react-router-dom"
import {connect} from "react-redux"

// Import Routes all
import {authRoutes, userRoutes} from "./routes/allRoutes"

// Import all middleware
import Authmiddleware from "./routes/middleware/Authmiddleware"

// layouts Format
import VerticalLayout from "./components/VerticalLayout/"
import HorizontalLayout from "./components/HorizontalLayout/"
import NonAuthLayout from "./components/NonAuthLayout"

// Import scss
import "./assets/scss/theme.scss"
import "./assets/scss/custom/pages/_common.scss"
import ContainerToast from "./components/MessageToast/ShowToastMessages";
import {Spinner} from "reactstrap";
import Loader from "react-spinner-loader";

const App = props => {
  function getLayout() {
    let layoutCls = VerticalLayout

    switch (props.layout.layoutType) {
      case "horizontal":
        layoutCls = HorizontalLayout
        break
      default:
        layoutCls = VerticalLayout
        break
    }
    return layoutCls
  }

  const Layout = getLayout()
  return (
    <React.Fragment>
      <Router>
        <Switch>
        {authRoutes.map((route, idx) => (
            <Authmiddleware
              path={route.path}
              layout={NonAuthLayout}
              component={route.component}
              key={idx}
              isAuthProtected={false}
            />
          ))}

          {userRoutes.map((route, idx) => (
            <Authmiddleware
              path={route.path}
              layout={Layout}
              component={route.component}
              key={idx}
              isAuthProtected={true}
              exact
            />
          ))}
          <Redirect to={{pathname: "/dashboard", state: {from: props.location}}} />
        </Switch>
      </Router>
      <ContainerToast/>
      <Loader show={props.layout.isPreloader} type="body" message="Cargando..."></Loader>
    </React.Fragment>
  )
}

App.propTypes = {
  layout: PropTypes.any
}

const mapStateToProps = state => {
  return {
    layout: state.Layout,
  }
}

export default connect(mapStateToProps, null)(App)
