import PropTypes from 'prop-types'
import React, {useEffect, useState} from "react"
import {Container,} from "reactstrap"

// Redux
import {connect} from "react-redux"
import {withRouter} from "react-router-dom"

//Import Breadcrumb
import Breadcrumb from "../../components/Common/Breadcrumb"
// actions
import {changeProfilePicture, resetChangeProfilePicture} from "../../store/actions"
import {getImagePath} from "../../common/utils";
import DropZoneIcon from "../../components/Common/DropZoneIcon";
import Images from "../../components/Common/Image";
import {Tooltip} from "@material-ui/core";

const UserProfile = props => {
    const {user, onChangeProfilePicture, loading, success} = props;

    const [photo, setPhoto] = useState(getImagePath(user?.photo));
    const [changePhoto, setChangePhoto] = useState(false);

    useEffect(() => {
        if (success) {
            setChangePhoto(false);
        }
    }, [success])

    const changeProfilePicture = () => {
        onChangeProfilePicture({photo: photo}, props.history)
    }

    return (
        <React.Fragment>
            <div className="page-content">
                <Container fluid>
                    <Breadcrumb title="Mi perfil" item={`${user.name} ${user.lastname}`}/>

                    <div className="row mb-4">
                        <div className="col-md-offset-4 col-md-4">
                            <div className="card h-100">
                                <div className="card-body">
                                    <div className="text-center">
                                        <div>
                                            <div>
                                                <Images className="avatar-lg rounded-circle img-thumbnail"
                                                        alt={'profile image'}
                                                        src={photo}
                                                />
                                            </div>
                                            <div className="p-2">
                                                <div className=" btn btn-primary btn-sm">
                                                    <DropZoneIcon
                                                        maxFiles={1}
                                                        mode="icon"
                                                        iconClass="fa fa-pencil-alt"
                                                        tooltip="Cambiar imagen"
                                                        onDrop={(file) => {
                                                            setPhoto(file.base64);
                                                            setChangePhoto(true);
                                                        }}
                                                    />
                                                </div>

                                                {changePhoto && (
                                                    <Tooltip placement="bottom" title="Guardar" aria-label="add">
                                                        <button type={"button"} className="btn btn-primary btn-sm" style={{marginLeft: '5px'}} onClick={() => {
                                                            changeProfilePicture()
                                                        }}>
                                                            <i className="fa fa-save"></i>
                                                        </button>
                                                    </Tooltip>
                                                )}
                                            </div>

                                        </div>
                                        <h5 className="mt-3 mb-1">{`${user.name} ${user.lastname}`}</h5>
                                        <p className="text-muted">{user.email}</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/*<div className="col-xl-8">
                            <div className="card mb-0">
                                <ul className="nav nav-tabs nav-tabs-custom nav-justified" role="tablist">
                                    <li className="nav-item">
                                        <a className="nav-link active" data-bs-toggle="tab" role="tab">
                                            <i className="uil-shopping-cart-alt me-2 font-size-20"> </i>
                                            <span className="d-none d-sm-block">Mis Pedidos</span>
                                        </a>
                                    </li>
                                    <li className="nav-item">
                                        <a className="nav-link" data-bs-toggle="tab" href="#tasks" role="tab">
                                            <i className="uil uil-clipboard-notes font-size-20"></i>
                                            <span className="d-none d-sm-block">Tasks</span>
                                        </a>
                                    </li>
                                    <li className="nav-item">
                                        <a className="nav-link" data-bs-toggle="tab" href="#messages" role="tab">
                                            <i className="uil uil-envelope-alt font-size-20"></i>
                                            <span className="d-none d-sm-block">Messages</span>
                                        </a>
                                    </li>
                                </ul>
                                <div className="tab-content p-4">
                                    <div className="tab-pane active" id="orders" role="tabpanel">
                                        Lista de pedidos
                                    </div>
                                    <div className="tab-pane" id="tasks" role="tabpanel">
                                        <div>
                                            task
                                        </div>
                                    </div>
                                    <div className="tab-pane" id="messages" role="tabpanel">
                                        messages
                                    </div>
                                </div>
                            </div>
                        </div>*/}
                    </div>

                </Container>
            </div>


        </React.Fragment>
    )
}

UserProfile.propTypes = {
    editProfile: PropTypes.func,
    error: PropTypes.any,
    success: PropTypes.any
}

const mapStateToProps = state => {

    const {profileImage} = state.Profile
    const {user} = state.Login
    return {user, profileResponse: profileImage.data, error: profileImage.error, success: profileImage.success, loading: profileImage.loading}
}

const mapDispatchToProps = dispatch => ({
    onChangeProfilePicture: (data) => dispatch(changeProfilePicture(data)),
    onResetChangeProfilePicture: () => dispatch(resetChangeProfilePicture()),
})

export default withRouter(
    connect(mapStateToProps, mapDispatchToProps)(UserProfile)
)
