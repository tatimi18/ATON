import React, {useContext, useState} from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Form, FormField } from 'semantic-ui-react';
import { Button } from 'react-bootstrap';
import { authContext } from '../contexts/AuthContext';

const SignInPage = () => {
    const navigate = useNavigate();
    
    //достаем функцию изменения значения контекста с помощью хука
    const { setAuthData } = useContext(authContext);

    //создаем состояния для логина и пароля по умолчанию они пусты, при изменении значений они будут обновлены при помощи set...
    const [login, setLogin] = useState('');
    const [password, setPassword] = useState('');
    
    //создаем состояние для дальнейшей проверки правильности введения данных
    //если не совпадут, то меняем значение на false
    const [isDataCorrect, setIsDataCorrect] = useState('default');

    function onFormSubmit(e) {
        e.preventDefault(); //отменяем действия браузера по умолчанию
        //проверяем, совпадает ли введенный пароль с паролем в localStorage для введенного логина
        if (localStorage.getItem(login) === password) {
            //удаляем заполненные поля при успешной авторизации
            setLogin('');
            setPassword('');
            //добавляем логин пользователя в контекст
            setAuthData(login) ;
            //перенаправляем на страницу с контентом
            navigate("/content", { replace: true });
        } else {
            //меняем состояние проверки на false
            setIsDataCorrect(false) ;
        };
    };

    return (
        <section className="signIn">
            <div className='container'>
                <div className="signIn__wrapper">
                    <p className="title">Войти</p>
                    <Form onSubmit={onFormSubmit}>
                        <Form.Group>
                            
                            <FormField className='signIn__field'>
                                <label className="signIn__label">Логин</label>
                                <input
                                    required 
                                    className='signIn__input'
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
                            
                            <FormField className='signIn__field'>
                                <label className="signIn__label">Пароль</label>
                                <input  
                                    required 
                                    className='signIn__input'
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
                            {!isDataCorrect && 
                                <p className='signIn__error'>
                                    <span className='signIn__invalid'>x</span>
                                    Неверный логин или пароль
                                </p>
                            }

                            <Button 
                                type="submit" 
                                variant='dark'
                                className="signIn__btn"
                            >
                                Войти
                            </Button>
                                    
                        </Form.Group>
                    </Form>
                    <div className='signIn__question'>Еще нет аккаунта? Тогда нажмите <Link to='/sign-up' className='signIn__link'>Зарегистрироваться</Link></div>
                </div>
            </div>

        </section>
    );
};

export default SignInPage;
