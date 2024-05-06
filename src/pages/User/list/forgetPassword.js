import PropTypes from 'prop-types'
import React, {useEffect, useState} from "react"

// Redux
import {connect} from "react-redux"
import {withRouter} from "react-router-dom"
import {AvField, AvForm} from "availity-reactstrap-validation"
import {changePassword, resetPasswordState} from "../../../store/user/actions";
import CustomModal from "../../../components/Modal/CommosModal";

const ForgetPassword = ({user, changePassword, resetPasswordState, passwordChanged}) => {

    const [userSelected, setUserSelected] = useState(null);
    const [newPassword, setNewPassword] = useState(null);
    const [openChangePasswordModal, setOpenChangePasswordModal] = useState(false);
    const [isValidPassword, setIsValidPassword] = useState(false);

    useEffect(() => {
        return function cleanup() {
            resetPasswordState();
        };
    });

    useEffect(() => {
        resetPasswordState();

        if (user) {
            setUserSelected(user);
            toggleChangePasswordModal();
        }
    }, [user])

    useEffect(() => {
        if (passwordChanged) {
            onCloseChangePasswordModal();
        }
    }, [passwordChanged])

    const toggleChangePasswordModal = () => {
        setOpenChangePasswordModal(!openChangePasswordModal);
    }

    const onCloseChangePasswordModal = () => {
        toggleChangePasswordModal();
        setUserSelected(null);
        resetPasswordState();
    }

    const onAcceptChangePasswordModal = () => {
        if(!isValidPassword){
            return;
        }
        const payload = {
            username: user.username,
            password: newPassword
        };
        changePassword(payload);
    }

    const validatePasswords = (cPassword) => {
        let isValid = newPassword === cPassword;
        setIsValidPassword(isValid);
        if (!isValid) {
            return 'Las contraseñas no son iguales';
        }
        return true;
    }

    return (
        <React.Fragment>
            <CustomModal title={`Cambio de contraseña`}
                         isOpen={openChangePasswordModal}
                         onClose={onCloseChangePasswordModal}
                         onAccept={onAcceptChangePasswordModal}>
                <div className="p-2">
                    <div className="alert alert-success text-center mb-4" role="alert"> Ingrese la nueva contraseña para el usuario <b>{`${userSelected?.name} ${userSelected?.lastname}`}</b></div>

                    <AvForm className="form-horizontal"  autoComplete="off" >
                        <div className="mb-1">
                                <AvField
                                    name="password"
                                    label="Contraseña"
                                    defaultValue={newPassword}
                                    type="password"
                                    autoComplete="off"
                                    required
                                    placeholder="*********"
                                    onChange={(e) => {
                                        setNewPassword(e.target.value);
                                    }}
                                />
                        </div>
                        <div className="mb-1">
                            <AvField
                                name="confirmPassword"
                                label="Confirmar Contraseña"
                                type="password"
                                autoComplete="off"
                                required
                                placeholder="*********"
                                validate={{myValidation: validatePasswords}}
                            />
                        </div>
                    </AvForm>
                </div>
            </CustomModal>
        </React.Fragment>
    )
}

ForgetPassword.propTypes = {
    loading: PropTypes.bool,
    user: PropTypes.object,
}

const mapStateProps = state => {
    const {changePassword} = state.User
    return {loading: changePassword.loading, user: changePassword.user, passwordChanged: changePassword.success}
}

export default withRouter(
    connect(mapStateProps, {changePassword, resetPasswordState})(ForgetPassword)
)
