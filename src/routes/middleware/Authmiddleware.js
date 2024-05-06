import React from "react"
import PropTypes from "prop-types"
import {Route, Redirect} from "react-router-dom"
import {connect} from "react-redux";
import {loginSuccess} from "../../store/auth/login/actions";

const Authmiddleware = ({component: Component, layout: Layout, isAuthProtected, loginSuccess,user, ...rest}) => {
    const authUser = localStorage.getItem("authUserV2");
    if(authUser && (!user || !user.id)){
        try {
            let usr = JSON.parse(authUser);
            loginSuccess(usr);
        }catch (e) {
            console.error(e)
        }
    }

    return (
        <Route
            {...rest}
            render={props => {

                if (isAuthProtected && !authUser) {
                    return <Redirect to={{pathname: "/login", state: {from: props.location}}} />
                }

                return (
                    <Layout>
                        <Component {...props} />
                    </Layout>
                )
            }}
        />
    )
}

Authmiddleware.propTypes = {
    isAuthProtected: PropTypes.bool,
    component: PropTypes.any,
    location: PropTypes.object,
    layout: PropTypes.any,
}

const mapStateToProps = state => {
    const {user} = state.Login
    return {user}
}

export default connect(mapStateToProps,{loginSuccess})(Authmiddleware)

