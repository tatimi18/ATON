import React from 'react'
import IsValidMessage from '../../IsValidMessage'

const UpdatingModalForm = ({
        current_firstName, 
        updateCurrent__firstName, 
        current_lastName, 
        updateCurrent_lastName, 
        current_email, 
        updateCurrent_email, 
        isValid
    }) => {
    return (
        <div>
            <form className='modal__wrapper'>
                <div className='signIn__field'>
                    <label className='modal__label' htmlFor="firstName">Имя</label>
                    <input 
                        type='text'  
                        className='signIn__input'
                        value={current_firstName} 
                        onChange={e => updateCurrent__firstName(e.target.value)}
                    />
                </div>

                <div className='signIn__field'>
                    <label className='modal__label' htmlFor="lastName">Фамилия</label>
                    <input 
                        type='text'  
                        className='signIn__input'
                        value={current_lastName} 
                        onChange={e => updateCurrent_lastName(e.target.value)}
                    />
                </div>

                <div className='signIn__field'>
                    <label className='modal__label' htmlFor="email">Электронная почта</label>
                    <input 
                        type='text'  
                        value={current_email} 
                        className='signIn__input'
                        onChange={e => updateCurrent_email(e.target.value)}
                    />
                </div>
                <IsValidMessage message={'Заполните все поля'} isValid={isValid}/>
            </form>
        </div>
    )
}

export default UpdatingModalForm
