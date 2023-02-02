import React, { useEffect } from 'react'
import { Toast } from 'react-bootstrap'
import'../general.css'
import { Modal } from 'react-bootstrap'



export default function ToastNotify({showToast, onClose, toastText}){

    useEffect(() => {
        if(showToast){
            setTimeout(() => {
                onClose();
            }, 3000) 
        }
    }, [showToast])

    return (
        <Toast show={showToast} onClose={onClose} animation={true} className="toastNotifyPosition">
            <Toast.Header>
                <strong className="me-auto">GCMO</strong>
                <small>just now</small>
            </Toast.Header>
            <Toast.Body>{toastText}</Toast.Body>
        </Toast>
    )
}
