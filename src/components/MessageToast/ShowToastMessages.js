import React from "react";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export const showMessage = {
    info: (message) => {
        toast.info(message);
    },
    success: (message) => {
        toast.success(message);
    },
    warning: (message) => {
        toast.warn(message);
    },
    error: (message) => {
        toast.error(message);
    }
}

const ContainerToast = (props) => {
    return (
        <>
            <ToastContainer
                position={toast.POSITION.TOP_RIGHT}
                autoClose={1200}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
            />
        </>
    );
};

export default ContainerToast;

