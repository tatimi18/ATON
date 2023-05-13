import React, { useState, useEffect } from 'react'
import Spinner from 'react-bootstrap/Spinner';
import MyPagination from './MyPagination';
import { Button } from 'react-bootstrap';
import MyModal from '../components/MyModal';
import MyAlert from './MyAlert';
import MyTable from './MyTable';
import AddingModalForm from './UI/modalForms/AddingModalForm';
import UpdatingModalForm from './UI/modalForms/UpdatingModalForm';


const APITable = () => {

/* ======= СОСТОЯНИЯ ========================================================= */

    //состояния для работы со списком пользователей
    const [users, setUsers] = useState([])
    const [isLoading, setIsLoading] = useState(false);
    const [lastUserInPage, setLastUserInPage] = useState(0);
    const [perPage, setPerPage] = useState(0)

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

      /* ======= ЗАГРУЗКА ДАННЫХ С СЕРВЕРА ========================================================= */

    useEffect(() => {
        let start;
        async function fetchingUsers() {
            try {
                start = Date.now() //начало отсчета времени загрузки данных
                setIsLoading(true)
                let response = await fetch(`https://reqres.in/api/users?page=${page}&per_page=${perPage}`)
                let json = await response.json();
                setUsers(json.data)
                setTotalPages(json.total_pages)
                setPerPage(json.per_page)
                setLastUserInPage(json.per_page * page)
                
            } catch (error) {
                console.log(error.message)
            } 
            const end = Date.now()
            const time = (end - start) / 1000
            setIsLoading(false)

            addNewAlert(`_success_Данные получены за ${time} сек.`) //добавляем новое уведомление 
        }
        fetchingUsers();
    }, [alerts, page]);

/* ======= ЛОГИКА УВЕДОМЛЕНИЙ ========================================================= */

//добавляем новое уведомление с уникальным ключом, удаляем его по прошествии 5 сек
function addNewAlert(message) {
    alerts.push(Math.random() + message)
    setTimeout(() => alerts.pop(), 5000)
}

//удаление уведомления
function removeAlert(alertToRemove) {
    const id = alertToRemove.split('_'[0])
    alerts.filter(alert => alert.split('_'[0]) !== id)
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

        if (!current_firstName || !current_lastName || !currentEmail) { //если поля не заполнены форма не отправляется и выскакивает уведомление
            setIsValid(false)
        } else { //если поля не изменились возвращаем исходник
            if (currentItem.first_name === current_firstName && 
                currentItem.last_name === current_lastName && 
                currentItem.email === currentEmail) {

                    setShowUpdatingModal(false) //закрываем модальное окно
                    addNewAlert('_secondary_Данные остались прежними') //добавляем новое уведомление 
                    return users //возвращаем исходник

            } else { //если изменились, то меняем данные

                setIsValid(true)
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
                addNewAlert('_info_Пользователь изменен') //добавляем новое уведомление 

                return users //возвращаем обновленный список юзеров
            }
        }
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

        } else if (!filteredUsers.length && page === 1) {
            setUsers([])
            setLastUserInPage(0)
        } else if (!filteredUsers.length && page !== 1) {
            setUsers([])
            setLastUserInPage((page - 1) * perPage)
        }
        //добавляем новое уведомление
        addNewAlert('_danger_Пользователь удален')
    }

/* ======= ЛОГИКА ДОБАВЛЕНИЯ ПОЛЬЗОВАТЕЛЯ ========================================================= */

    //добавляет нового пользователя
    function addNewUser(firstName, lastName, email) {
        if (!firstName || !lastName || !email) { //если поля не заполнены форма не отправляется
            setIsValid(false)
        } else {
            setIsValid(true)
            const newUser = {
                id: lastUserInPage + 1,
                first_name: firstName,
                last_name: lastName,
                email: email
            }
            setUsers([...users, newUser])

            //обновляем состояние индекса последнего пользователя на странице
            setLastUserInPage(lastUserInPage + 1)

            //стираем заполненные поля и закрываем форму
            handleClose()

            //добавляем новое уведомление
            addNewAlert('_primary_Пользователь добавлен')
        }
    }

    //функция при закрытии модального окна добавления пользователя, сбрасыват все изменения формы, если она не отправлена и при отправлении формы
    function handleClose() {
        //стираем заполненные поля 
        setAddedFirstName('')
        setAddedLastName('')
        setAddedEmail('')

        //скрываем валидацию
        setIsValid('default')

        // закрываем модальное окно
        setShowAddingModal(false)
    }

    return (
        <div className='container'>
            {
                isLoading
                ? <Spinner className='spinner' animation="border" variant="primary" />
                : <>
                    <MyModal
                        show={showUpdatingModal}
                        handleClose={() => setShowUpdatingModal(false)}
                        title={'Измените данные'}
                        body={
                            <UpdatingModalForm
                                current_firstName={current_firstName}
                                updateCurrent__firstName={setCurrent_firstName}
                                current_lastName={current_lastName}
                                updateCurrent_lastName={setCurrent_lastName}
                                current_email={currentEmail}
                                updateCurrent_email={setCurrentEmail}
                                isValid={isValid}
                            />
                        }
                        action={() => updateUser(currentUser)}
                    />
                    <MyModal
                        show={showAddingModal}
                        handleClose={handleClose}
                        title={'Добавьте пользователя в список'}
                        body={
                            <AddingModalForm
                                _firstName={addedFirstName}
                                add__firstName={setAddedFirstName}
                                _lastName={addedLastName}
                                add_lastName={setAddedLastName}
                                _email={addedEmail}
                                add_email={setAddedEmail}
                                isValid={isValid}
                            />
                        }
                        action={() => addNewUser(addedFirstName, addedLastName, addedEmail)}    
                    />
                    <Button 
                        style={{marginTop: '70px'}}
                        onClick={() => setShowAddingModal(true)}
                        variant="primary"
                    >   
                        Добавить в список
                    </Button>

                    <MyPagination 
                        totalPages={totalPages} 
                        page={page}
                        changePage={changePage}
                    />

                    <div className="scroll-table">
                        {!users.length
                            ? <div className='table__empty'>На странице {page} пусто</div>
                            : <MyTable
                                parentToRender={users}
                                showModal={showUpdateModal}
                                remove={removeUser}
                            />
                        }
                    </div>

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
