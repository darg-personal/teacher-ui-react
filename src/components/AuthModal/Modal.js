import React from "react";
import "../../css/auth/modal.scss";

const Modal = ({ text, feedbackText, onClose, closable }) => {
    return <div className={'auth-modal'}>
        <div className={'modal-data'}>
               <h3>{ text }</h3>

            { feedbackText ? <p className={'feedback-text'}>{ feedbackText }</p> : null }

            { closable ? <button className={'feedback-button'}>Ok</button> : null}
        </div>
    </div>
}

export default Modal
