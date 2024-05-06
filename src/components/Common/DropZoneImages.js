import React from "react"
import Dropzone from "react-dropzone";

const DropZoneImages = props => {
  return (
      <Dropzone
          onDrop={props.onDrop}
          maxFiles={props.maxFiles}>
          {({getRootProps, getInputProps}) => (
              <div className="dropzone">
                  <div
                      className="dz-message needsclick"
                      {...getRootProps()}
                  >
                      <input {...getInputProps()} />
                      <div className="dz-message needsclick">
                          <div className="mb-3">
                              <i className="display-4 text-muted uil uil-cloud-upload"></i>
                          </div>
                          <h4>Suelta los archivos aquí para subirlos.</h4>
                      </div>
                  </div>
              </div>
          )}
      </Dropzone>
  )
}

export default DropZoneImages
