import React from 'react'
import IsValidMessage from '../../IsValidMessage'

const AddingModalForm = ({
        _firstName, 
        _lastName, 
        _email, 
        add__firstName, 
        add_lastName, 
        add_email, 
        isValid
    }) => {
    return (
        <form className='modal__wrapper'>
            <div className='signIn__field'>
                <label className='modal__label'>Имя</label>
                <input 
                    type='text' 
                    className='signIn__input'
                    placeholder='Введите имя'
                    value={_firstName || ''} 
                    onChange={e => add__firstName(e.target.value)}
                />
            </div>

            <div className='signIn__field'>
                <label className='modal__label' htmlFor="lastName">Фамилия</label>
                <input 
                    type='text' 
                    className='signIn__input'
                    placeholder='Введите фамилию'
                    value={_lastName || ''} 
                    onChange={e => add_lastName(e.target.value)}
                />
            </div>
                
            <div className='signIn__field'>
                <label className='modal__label' htmlFor="email">Электронная почта</label>
                <input 
                    type='email' 
                    className='signIn__input'
                    placeholder='Введите электронную почту'
                    value={_email || ''} 
                    onChange={e => add_email(e.target.value)}
                />
            </div>
            <IsValidMessage message={'Заполните все поля'} isValid={isValid}/>
        </form> 
    )
}

export default AddingModalForm
