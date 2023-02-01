import {Toast } from 'react-bootstrap'
import React, { useEffect, useState } from 'react'
import'../general.css'

export default function ToastNotify({show, onClose, text}){

    useEffect(() => {
        if(show){
            setTimeout(() => {
                onClose()
            }, 2500) 
        }
    }, [show])

    return (
        <Toast show={show} onClose={onClose} animation={true} className={"toastNotify"}>
            <Toast.Header>
                <img src="holder.js/20x20?text=%20" className="rounded me-2" alt="" />
                <strong className="me-auto">GCMO</strong>
                <small>just now</small>
            </Toast.Header>
            <Toast.Body>{text}</Toast.Body>
        </Toast>
    )
}
