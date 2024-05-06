import React, {useEffect, useState} from "react"
import PropTypes from 'prop-types'
import {Button, Dropdown, DropdownMenu, DropdownToggle,} from "reactstrap"

//i18n
import {withTranslation} from "react-i18next"
// Redux
import {connect} from "react-redux"
import {Link, withRouter} from "react-router-dom"

// users
import {getImagePath} from "../../../common/utils";

const ProfileMenu = props => {
  // Declare a new state variable, which we'll call "menu"
  const [menu, setMenu] = useState(false)

  const [username, setusername] = useState("Admin")

  useEffect(() => {
    if (localStorage.getItem("authUserV2")) {
      if (process.env.REACT_APP_DEFAULTAUTH === "firebase") {
        const obj = JSON.parse(localStorage.getItem("authUserV2"))
        setusername(obj.displayName)
      } else if (
        process.env.REACT_APP_DEFAULTAUTH === "fake" ||
        process.env.REACT_APP_DEFAULTAUTH === "jwt"
      ) {
        const obj = JSON.parse(localStorage.getItem("authUserV2"))
        setusername(obj.username)
      }
    }
  }, [props.success]);

  const logOut = () => {
    try {
      localStorage.removeItem("authUserV2");
      props.history.push("/login");
    }catch(e){

    }
  }

  return (
    <React.Fragment>
      <Dropdown
        isOpen={menu}
        toggle={() => setMenu(!menu)}
        className="d-inline-block"
      >
        <DropdownToggle
          className="btn header-item waves-effect"
          id="page-header-user-dropdown"
          tag="button"
        >
          <img
              className="rounded-circle header-profile-user"
              src={getImagePath(props.user?.photo)}
              alt="Header Avatar"
          />
          <span className="d-none d-xl-inline-block ms-1 fw-medium font-size-15">{username}</span>{" "}
          <i className="uil-angle-down d-none d-xl-inline-block font-size-15"></i>
        </DropdownToggle>
        <DropdownMenu className="dropdown-menu-end">
          <Link to="/profile" className="dropdown-item">
            <i className="uil uil-user-circle font-size-18 align-middle text-muted me-1"></i>
            <span>{props.t("Mi perfil")}</span>
          </Link>
          <div className="dropdown-divider" />
          <Button onClick={() => logOut()} className="dropdown-item">
            <i className="uil uil-sign-out-alt font-size-18 align-middle me-1 text-muted"></i>
            <span className="text-muted">{props.t("Logout")}</span>
          </Button>
        </DropdownMenu>
      </Dropdown>
    </React.Fragment>
  )
}

ProfileMenu.propTypes = {
  success: PropTypes.any,
  t: PropTypes.any
}

const mapStatetoProps = state => {
  const {error, success} = state.Profile
  const {user} = state.Login
  return {error, success, user}
}

export default withRouter(
  connect(mapStatetoProps, {})(withTranslation()(withRouter(ProfileMenu)))
)
