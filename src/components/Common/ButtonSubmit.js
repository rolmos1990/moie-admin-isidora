import React from "react"
import imageNotFound from "../../assets/images/image-not-found.png"
import {Spinner} from "reactstrap";
import {Button} from "@material-ui/core";
import PropTypes from "prop-types";

const ButtonSubmit = props => {
  return (
      <Button color="primary" type="submit" disabled={props.loading || props.disabled}>
          {props.loading && <Spinner size="sm" className="m-1" color="primary"/>}
          {props.name? props.name:'Guardar'}
      </Button>
  )
}

ButtonSubmit.propTypes = {
    name: PropTypes.string,
    iconClass: PropTypes.string,
    loading: PropTypes.bool.isRequired,
    disabled: PropTypes.bool
}

export default ButtonSubmit
