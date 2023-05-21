import React from 'react';

const IsValidMessage = ({message, isValid}) => {
    return (
        <div 
            className={
                isValid === false
                ? "signIn__error"
                : "signIn__error__unvisible"
            }
        >
            <span className='signIn__invalid signIn__invalid__border'>x</span>
            {message}
        </div>
    );
};

export default IsValidMessage;
