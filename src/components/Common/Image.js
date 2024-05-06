import React from "react"
import imageNotFound from "../../assets/images/image-not-found.png"

const Images = props => {
  let styles = props.styles || {};
  if(props.height) styles.height = props.height;
  if(props.width) styles.width = props.width;

  return (
      <img
          {...props}
          data-dz-thumbnail=""
          className={props.className  || "avatar-sm rounded bg-light"}
          alt={props.alt}
          src={props.src || imageNotFound}
          onError={(e)=>{
            e.target.src = imageNotFound;
          }}
          style={styles}
      />
  )
}

export default Images
