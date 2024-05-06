import React from "react"
import imageNotFound from "../../assets/images/image-not-found.png"
import {Spinner} from "reactstrap";
import {Button} from "@material-ui/core";
import PropTypes from "prop-types";

const ButtonLoading = props => {
    return (
        <button type="button" color={props.color} disabled={props.loading || props.disabled} className={props.className} onClick={props.onClick}>
            {props.loading && <Spinner size="sm" className="m-1" color="primary"/>}
            {props.children}
        </button>
    )
}

ButtonLoading.propTypes = {
    color: PropTypes.string,
    loading: PropTypes.bool.isRequired,
    className: PropTypes.string,
    onClick: PropTypes.func,
    name: PropTypes.string,
    disabled: PropTypes.bool
}

export default ButtonLoading
