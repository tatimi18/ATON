import React, {useContext, useState} from 'react'
import { Link, useNavigate } from 'react-router-dom';
import { Form, Button, FormField } from 'semantic-ui-react';
import { authContext } from '../contexts/AuthContext';

const SignInPage = () => {
    const navigate = useNavigate()

    //достаем функцию изменения значения контекста с помощью хука
    const { setAuthData } = useContext(authContext)

    //создаем состояния для логина и пароля по умолчанию они пусты, при изменении значений они будут обновлены при помощи set...
    const [login, setLogin] = useState('');
    const [password, setPassword] = useState('');
    
    //создаем состояние для дальнейшей проверки правильности введения данных
    //если не совпадут, то меняем значение на false
    //
    const [isDataCorrect, setIsDataCorrect] = useState('default')

    function onFormSubmit(e) {
        e.preventDefault(); //отменяем действия браузера по умолчанию
        //проверяем, совпадает ли введенный пароль с паролем в localStorage для введенного логина
        if (localStorage.getItem(login) === password) {
            //удаляем заполненные поля при успешной авторизации
            setLogin('')
            setPassword('')
            //добавляем логин пользователя в контекст
            setAuthData(login) 
            //перенаправляем на страницу с контентом
            navigate("/content", { replace: true })
        } else {
            //меняем состояние проверки на false
            setIsDataCorrect(false) 
        }
    };

    return (
        <div>
            <h1 className="">Войти</h1>
            <div>Еще нет аккаунта? Тогда нажмите <Link to='/sign-up'>Зарегистрироваться</Link></div>
            <Form onSubmit={onFormSubmit}>
                <Form.Group>
                    
                    <FormField>
                        <label>Логин</label>
                        <input
                            required 
                            type="text" 
                            placeholder="Введите Ваш логин" 
                            value={login}
                            onChange={e => {
                                setLogin(e.target.value);
                            }}
                            onFocus={(e) => {if (e.target.placeholder === 'Введите Ваш логин') {e.target.placeholder = ''}}} 
                            onBlur={(e) => {if (e.target.placeholder === '') {e.target.placeholder = 'Введите Ваш логин'}}}
                        />
                    </FormField>
                    
                    <FormField>
                        <label className="form__subtitle__grey">Пароль</label>
                        <input 
                            required 
                            type="password" 
                            value={password}
                            onChange={e => {
                                setPassword(e.target.value);
                            }}
                            placeholder="Введите пароль" 
                            onFocus={(e) => {if (e.target.placeholder === 'Введите пароль') {e.target.placeholder = ''}}} 
                            onBlur={(e) => {if (e.target.placeholder === '') {e.target.placeholder = 'Введите пароль'}}}
                        />
                    </FormField>

                    {/* выводим сообщение, если данные неверны */}
                    {!isDataCorrect && <div>попробуйте другой логин/пароль</div>}

                    <Button 
                        type="submit" 
                        className="button__form"
                    >
                        Войти
                    </Button>
                            
                </Form.Group>
			</Form>
        </div>
    )
        
};

export default SignInPage
