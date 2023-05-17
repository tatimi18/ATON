import React from 'react'

const MyInput = ({label, params, placeholder}) => {
    return (
        <div className='signIn__field'>
            <label className='modal__label' htmlFor="lastName">{label}</label>
            <input 
                type='text'  
                className='signIn__input'
                {...params}
                placeholder={placeholder}
            />
        </div>
    )
}

export default MyInput
