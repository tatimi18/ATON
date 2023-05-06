import React, { useState, useEffect } from 'react'
import Table from 'react-bootstrap/Table';
import Spinner from 'react-bootstrap/Spinner';
import MyPagination from './MyPagination';
import { Button } from 'react-bootstrap';
import MyModal from '../components/MyModal';
import MyAlert from './MyAlert';

const APITable = () => {

/* ======= СОСТОЯНИЯ ========================================================= */

    //состояния для работы со списком пользователей
    const [users, setUsers] = useState([])
    const [isLoading, setIsLoading] = useState(false);
    const [lastUserInPage, setLastUserInPage] = useState(0);

    //cостояния для работы с модальным окном изменения пользователя
    const [showUpdatingModal, setShowUpdatingModal] = useState(false);
    const [currentUser, setCurrentUser] = useState([])
    const [current_firstName, setCurrent_firstName] = useState('')
    const [current_lastName, setCurrent_lastName] = useState('')
    const [currentEmail, setCurrentEmail] = useState('')
    
    //cостояния для работы с модальным окном добавления пользователя
    const [showAddingModal, setShowAddingModal] = useState(false);
    const [addedFirstName, setAddedFirstName] = useState('')
    const [addedLastName, setAddedLastName] = useState('')
    const [addedEmail, setAddedEmail] = useState('')
    const [isValid, setIsValid] = useState('default')
    
    //состояния для серверной пагинации
    const [page, setPage] = useState(1)
    const [totalPages, setTotalPages] = useState(0)

    //состояние уведомлений
    const [alerts, setAlerts] = useState([])

    function changePage(page) {
        setPage(page)
    }

/* ======= ЛОГИКА ИЗМЕНЕНИЯ ДАННЫХ ПОЛЬЗОВАТЕЛЯ ========================================================= */

    //открывает модальное окно для внесения изменений, добавляет в инпуты значения текущего пользователя
    function showUpdateModal(userToUpdate) {
        setShowUpdatingModal(true)
        setCurrentUser(userToUpdate)
        setCurrent_firstName(userToUpdate.first_name)
        setCurrent_lastName(userToUpdate.last_name)
        setCurrentEmail(userToUpdate.email)
    }

    //обновляет выбранного пользователя
    function updateUser(item) {
        let currentItem = users.find(elem => elem.id === item.id) //ищем текущего пользователя в списке
        let updatedUser = {...currentItem} //делаем копию, чтобы заменить значения в ней и дальше по индексу поменять его с оригиналом в списке

        Object.defineProperty(updatedUser, 'first_name', {
            value: current_firstName,
        });

        Object.defineProperty(updatedUser, 'last_name', {
            value: current_lastName,
        });

        Object.defineProperty(updatedUser, 'email', {
            value: currentEmail,
        });

        let index = users.indexOf(currentItem); //ищем индекс найденного юзера, если существует, то меняем по этому индексу найденного юзера на измененный

        if (index !== -1) {
            users[index] = updatedUser;
        }
        setShowUpdatingModal(false) //закрываем модальное окно

        //добавляем новое уведомление с уникальным ключом, удаляем его по прошествии 5 сек
        alerts.push(`${Math.random()}_info_Пользователь изменен`)
        setTimeout(() => alerts.pop(), 5000)

        return users //возвращаем обновленный список юзеров
    }

/* ======= ЛОГИКА УДАЛЕНИЯ ПОЛЬЗОВАТЕЛЯ ========================================================= */

    //удаление пользователя из списка
    function removeUser(userToRemove) {
        let filteredUsers = users.filter(user => user.id !== userToRemove.id)
        let lastUserInList = filteredUsers[filteredUsers.length - 1]
        
        if (filteredUsers.length !== 0) {
            //обновляем список юзеров
            setUsers(filteredUsers)
    
            //перезаписываем id последнего пользователя в фильтрованном списке
            setLastUserInPage(lastUserInList.id)

            //добавляем новое уведомление с уникальным ключом, удаляем его по прошествии 5 сек
            alerts.push(`${Math.random()}_danger_Пользователь удален`)
            setTimeout(() => alerts.pop(), 5200)
            
        } else {
            if (page > 1) {
                setPage(page - 1)
            } else {
                setPage(1)
            }
        }

    }

/* ======= ЛОГИКА ДОБАВЛЕНИЯ ПОЛЬЗОВАТЕЛЯ ========================================================= */

    //добавляет нового пользователя
    function addNewUser(firstName, lastName, email) {
        if (!firstName || !lastName || !email) { //если поля не заполнены форма не отправляется
            setIsValid(false)
        } else {
            setIsValid(true)
            users.push({
                id: lastUserInPage + 1,
                first_name: firstName,
                last_name: lastName,
                email: email
            })

            //обновляем состояние индекса последнего пользователя на странице
            setLastUserInPage(lastUserInPage + 1)

            for (let user of users) {
                //переприсваиваем индексы начиная с lastUserInPage + 1
                if (user.id === lastUserInPage + 1) {
                    for (let i = lastUserInPage + 2; i <= users.length; i += 1) {
                        user.id += 1
                    }
                }
            }
            //стираем заполненные поля
            setAddedFirstName()
            setAddedLastName()
            setAddedEmail()
    
            // закрываем модальное окно
            setShowAddingModal(false)

            //добавляем новое уведомление с уникальным ключом, удаляем его по прошествии 5 сек
            alerts.push(`${Math.random()}_primary_Пользователь добавлен`)
            setTimeout(() => alerts.pop(), 5000)

        }
    }

    //функция при закрытии модального окна добавления пользователя, сбрасыват все изменения формы, если она не отправлена
    function handleClose() {
        //стираем заполненные поля 
        setAddedFirstName()
        setAddedLastName()
        setAddedEmail()

        //скрываем валидацию
        setIsValid('default')

        // закрываем модальное окно
        setShowAddingModal(false)
    }

    /* ======= УДАЛЕНИЕ АЛЕРТА ИЗ СПИСКА ========================================================= */

    function removeAlert(alertToRemove) {
        const id = alertToRemove.split('_'[0])
        alerts.filter(alert => alert.split('_'[0]) !== id)
        //setAlerts(filteredAlerts)
    }

    /* ======= ЗАГРУЗКА ДАННЫХ С СЕРВЕРА ========================================================= */

    useEffect(() => {
        let start;
        async function fetchingUsers() {
            try {
                start = Date.now() //начало отсчета времени загрузки данных
                setIsLoading(true)
                let response = await fetch(`https://reqres.in/api/users?page=${page}&per_page=6`)
                let json = await response.json();
                setUsers(json.data)
                setTotalPages(json.total_pages)
                setLastUserInPage(json.per_page * page)
                
            } catch (error) {
                console.log(error.message)
            } 
            const end = Date.now()
            const time = (end - start) / 1000
            setIsLoading(false)

            //добавляем новое уведомление с уникальным ключом, удаляем его по прошествии 5 сек
            alerts.unshift(`${Math.random()}_success_Данные получены за ${time} сек.`)
            setTimeout(() => alerts.shift(), 5000)
        }
        fetchingUsers();
    }, [alerts, page]);

    return (
        <div className='container'>
            {
                isLoading
                ? <Spinner animation="border" variant="primary" />
                : <>
                    <Button 
                        style={{marginTop: '70px'}}
                        onClick={() => setShowAddingModal(true)}
                        variant="primary"
                    >   
                        Добавить в список
                    </Button>
                    <Table responsive striped bordered hover>
                        <thead className='head-fixed'>
                            <tr className='table__tr table__tr__head'>
                                <th className='table__th table__th__id-head'>id</th>
                                <th className='table__th'>Имя</th>
                                <th className='table__th'>Фамилия</th>
                                <th className='table__th'>Электронная почта</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr className='table__tr'>
                                <th style={{height: '114px'}}></th>
                            </tr>
                            {users.map(user => 
                                <tr className='table__tr' key={user.id}>
                                    <td className='table__th table__th__id'>{user.id}</td>
                                    <td>{user.first_name}</td>
                                    <td>{user.last_name}</td>
                                    <td>{user.email}</td>
                                    <td>
                                        <Button
                                            variant='info'
                                            onClick={() => showUpdateModal(user)}
                                        >Редактировать</Button>
                                    </td>
                                    <td>
                                        <Button
                                            variant='danger'
                                            onClick={() => removeUser(user)}
                                        >x</Button>
                                    </td>
                                </tr>
                            )}
                            
                        </tbody>
                    </Table>
                    <MyPagination 
                        totalPages={totalPages} 
                        page={page}
                        changePage={changePage}
                    />
                    <MyModal
                        show={showUpdatingModal}
                        handleClose={() => setShowUpdatingModal(false)}
                        title={'Измените данные'}
                        body={
                            <form className='modal__wrapper'>
                                <label htmlFor="firstName">Имя</label>
                                <input 
                                    type='text' 
                                    name='firstName' 
                                    className='modal__input'
                                    value={current_firstName} 
                                    onChange={e => setCurrent_firstName(e.target.value)}
                                />

                                <label htmlFor="lastName">Фамилия</label>
                                <input 
                                    type='text' 
                                    name='lastName' 
                                    className='modal__input'
                                    value={current_lastName} 
                                    onChange={e => setCurrent_lastName(e.target.value)}
                                />

                                <label htmlFor="email">Электронная почта</label>
                                <input 
                                    type='text' 
                                    name='email' 
                                    value={currentEmail} 
                                    className='modal__input'
                                    onChange={e => setCurrentEmail(e.target.value)}
                                />
                            </form>
                        }
                        action={() => updateUser(currentUser)}
                    />
                    <MyModal
                        show={showAddingModal}
                        handleClose={handleClose}
                        title={'Добавьте пользователя в список'}
                        body={
                            <form className='modal__wrapper'>
                                
                                <label htmlFor="firstName">Имя</label>
                                <input 
                                    required
                                    type='text' 
                                    name='firstName' 
                                    className='modal__input'
                                    placeholder='Введите имя'
                                    value={addedFirstName || ''} 
                                    onChange={e => setAddedFirstName(e.target.value)}
                                />

                                <label htmlFor="lastName">Фамилия</label>
                                <input 
                                    required
                                    type='text' 
                                    name='lastName' 
                                    className='modal__input'
                                    placeholder='Введите фамилию'
                                    value={addedLastName || ''} 
                                    onChange={e => setAddedLastName(e.target.value)}
                                />
                                    
                                <label htmlFor="email">Электронная почта</label>
                                <input 
                                    required
                                    type='email' 
                                    name='email' 
                                    className='modal__input'
                                    placeholder='Введите электронную почту'
                                    value={addedEmail || ''} 
                                    onChange={e => setAddedEmail(e.target.value)}
                                />
                                <div 
                                    className={
                                        isValid === false
                                        ? "modal__error"
                                        : "modal__error__unvisible"
                                    }
                                >
                                    Заполните все поля
                                </div>
                            </form> 
                        }
                        action={() => addNewUser(addedFirstName, addedLastName, addedEmail)}    
                    />

                    <div className='alerts__wrapper'>

                        {alerts.reverse().map(alert => 
                            <MyAlert 
                                key={alert.split('_')[0]} 
                                text={alert.split('_')[2]}
                                variant={alert.split('_')[1]}
                                onClick={() => removeAlert(alert)}
                            />
                        )}
                    </div>
                    
                </>
            }
            
        </div>
    )
}

export default APITable
