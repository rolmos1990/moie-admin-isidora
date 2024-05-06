import React, {useState, useEffect} from "react";
import PropTypes from "prop-types";
import {Col, Input, Modal, Row} from "reactstrap";
import ReactDOM from 'react-dom';

export const ConfirmationModal = (props) => {
    const [openmodal, setOpenmodal] = useState(true);
    const [text, setText] = useState(true);

    useEffect(() => {
        if(!openmodal) {
            ReactDOM.render("", document.getElementById('modal'));
        }
    }, [openmodal]);

    const confirmAction = () => {
        if(props.input){
            const _copy = text;
            props.onConfirm(_copy);
            setText("");
            setOpenmodal(false);
        } else {
            props.onConfirm();
            setOpenmodal(false);
        }
    }
    return (
    <Modal
    isOpen={openmodal}
    scrollable={props.scrollable}
    id={props.id || "staticModalUnique"}
>
    <div className="modal-header">
        <h5 className="modal-title" id="staticBackdropLabel">{props.title}</h5>
        <button type="button" className="btn-close"
                onClick={() => setOpenmodal(false)} aria-label="Close"></button>
    </div>
    <div className="modal-body">
        <p>{props.description}</p>
    </div>
    {props.input && (
        <Row>
            <Col md={11}>
                <Input type="text" className="form-control m-3" placeholder="Ingrese valor aqui..." aria-label="Add text" onChange={(e) => setText(e.target.value)} />
            </Col>
        </Row>
    )}
    <div className="modal-footer">
        <button type="button" className="btn btn-light" onClick={() => setOpenmodal(false)}>Cerrar</button>
        <button type="button" className="btn btn-primary" onClick={() => confirmAction()}>Confirmar</button>
    </div>
</Modal>
)};

export const ConfirmationModalAction = (props) => {
    return ReactDOM.render(<ConfirmationModal {...props} />, document.getElementById('modal') )
}

ConfirmationModal.propTypes = {
    title: PropTypes.string,
    description: PropTypes.string,
    isOpen: PropTypes.bool,
    scrollable: PropTypes.bool,
    id: PropTypes.string,
    onClose: PropTypes.func,
    onConfirm: PropTypes.func
}
