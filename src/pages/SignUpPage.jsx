import React from 'react'
import { Form, Button, FormField } from 'semantic-ui-react';
import { useForm } from "react-hook-form";
import { useNavigate } from 'react-router-dom';


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
        <div>
            <h1 className="">Регистрация</h1>
            <Form className='main-form' onSubmit={handleSubmit(onSubmit)}>
                <Form.Group>
                    
                    <FormField>
                        <label>Логин</label>
                        <input
                            required 
                            {...register("login", { required: true, minLength: 2 })}
                            type="text" 
                            placeholder="Придумайте логин" 
                            onFocus={(e) => {if (e.target.placeholder === 'Придумайте логин') {e.target.placeholder = ''}}} 
                            onBlur={(e) => {if (e.target.placeholder === '') {e.target.placeholder = 'Придумайте логин'}}}
                        />
                    </FormField>

                    {errors.login && <p className='error'>Логин слишком короткий</p>}
                    
                    <FormField>
                        <label className="form__subtitle__grey">Пароль</label>
                        <input 
                            required 
                            {...register("password", { required: true, minLength: 8 })}
                            type="password" 
                            placeholder="Придумайте пароль" 
                            onFocus={(e) => {if (e.target.placeholder === 'Придумайте пароль') {e.target.placeholder = ''}}} 
                            onBlur={(e) => {if (e.target.placeholder === '') {e.target.placeholder = 'Придумайте пароль'}}}
                        />
                    </FormField>

                    {errors.passwordFirst && <p className='error'>Пароль слишком короткий</p>}

                    <Button 
                        type="submit" 
                        className="button__form"
                    >
                        Зарегистрироваться
                    </Button>
    
                </Form.Group>
			</Form>
    
        </div>
    )
}

export default SignUpPage

