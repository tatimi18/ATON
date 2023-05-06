import React from 'react'
import { Form, FormField } from 'semantic-ui-react';
import { useForm } from "react-hook-form";
import { Link, useNavigate } from 'react-router-dom';
import { Button } from 'react-bootstrap';


const SignUpPage = () => {
    const navigate = useNavigate()
    
    const { register, handleSubmit, reset, formState: { errors } } = useForm();

	const onSubmit = (data) => {
        //заносим данные в localStorage
        localStorage.setItem(data.login, data.password)
        //обновляем поля
		reset()
        //переносим пользователя на страницу входа
        navigate("/", { replace: true })
	}
    return (
        <section className="signIn">
            <div className="container">
                <div className="signIn__wrapper">
                    <p className="title">Регистрация</p>
                    <Form className='main-form' onSubmit={handleSubmit(onSubmit)}>
                        <Form.Group>
                            
                            <FormField className='signIn__field'>
                                <label className="signIn__label">Логин</label>
                                <input
                                    required 
                                    className='signIn__input'
                                    {...register("login", { required: true, minLength: 2 })}
                                    type="text" 
                                    placeholder="Придумайте логин" 
                                    onFocus={(e) => {if (e.target.placeholder === 'Придумайте логин') {e.target.placeholder = ''}}} 
                                    onBlur={(e) => {if (e.target.placeholder === '') {e.target.placeholder = 'Придумайте логин'}}}
                                />
                            </FormField>

                            {errors.login && 
                                <p className='signIn__error'>
                                    <span className='signIn__invalid'>x</span>
                                    Логин слишком короткий
                                </p>
                            }
                            
                            <FormField className='signIn__field'>
                                <label className="signIn__label">Пароль</label>
                                <input 
                                    required 
                                    className='signIn__input'
                                    {...register("password", { required: true, minLength: 8 })}
                                    type="password" 
                                    placeholder="Придумайте пароль" 
                                    onFocus={(e) => {if (e.target.placeholder === 'Придумайте пароль') {e.target.placeholder = ''}}} 
                                    onBlur={(e) => {if (e.target.placeholder === '') {e.target.placeholder = 'Придумайте пароль'}}}
                                />
                            </FormField>

                            {errors.password && 
                                <p className='signIn__error'>
                                    <span className='signIn__invalid'>x</span>
                                    Минимальная длина 8 символов
                                </p>
                            }

                            <Button 
                                type="submit" 
                                variant='dark'
                                className="signIn__btn"
                            >
                                Зарегистрироваться
                            </Button>
            
                        </Form.Group>
                    </Form>
                    <div className='signIn__question'>Уже есть аккаунт? <Link to='/' className='signIn__link'>Войти</Link></div>
            
                </div>
            </div>
        </section>
    )
}

export default SignUpPage

