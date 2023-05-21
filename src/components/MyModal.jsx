import React from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';

const MyModal = ({show, handleClose, title, body, action}) => {
    
    return (
        <>
            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>{title}</Modal.Title>
                </Modal.Header>
                <Modal.Body>{body}</Modal.Body>
                <Modal.Footer>
                <Button variant="secondary" onClick={handleClose}>
                    Закрыть
                </Button>
                <Button variant="primary" onClick={action}>
                    Сохранить
                </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
};

export default MyModal;
