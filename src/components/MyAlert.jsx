import React, { useState } from 'react';
import { Alert } from 'react-bootstrap';

const MyAlert = ({text, variant, onClick}) => {
    const [show, setShow] = useState(true);
    setTimeout(() => setShow(false), 2500);
    return (
        <Alert 
            onClose={() => setShow(false)}
            dismissible
            show={show} 
            variant={variant}
            onClick={onClick}
        >
            {text}
        </Alert>
    );
};

export default MyAlert;
