import React, { useState, useEffect } from 'react'
import Spinner from 'react-bootstrap/Spinner';
import MyPagination from './MyPagination';
import { Button } from 'react-bootstrap';
import MyModal from '../components/MyModal';
import MyAlert from './MyAlert';
import MyTable from './MyTable';
import UserService from '../services/UserService';
import { useFetching } from '../hooks/useFetching';
import useInput from '../hooks/useInput';
import MyInput from './UI/input/MyInput';
import IsValidMessage from './IsValidMessage';
import TableHead from './TableHead';

const APITable = () => {
    
    /* ======= СОСТОЯНИЯ ========================================================= */
    //состояния для работы со списком пользователей
    const [users, setUsers] = useState([])
    const [lastUserInPage, setLastUserInPage] = useState(0);
    const [perPage, setPerPage] = useState(6)
    
    //состояния для серверной пагинации
    const [page, setPage] = useState(1)
    const [totalPages, setTotalPages] = useState(0)

    const [fetchingUsers, isUsersLoading, usersError, start] = useFetching(async (page, perPage) => {
        const [response, end] = await UserService.getAll(page, perPage);
        setUsers(response.data.data)
        setTotalPages(response.data.total_pages)
        setPage(response.data.page)
        setPerPage(response.data.per_page)
        setLastUserInPage(response.data.per_page * page)
        const time = (end - start) / 1000
        addNewAlert(`_success_Данные получены за ${time} сек.`)
    })

    //cостояния для работы с модальным окном изменения пользователя
    const [showUpdatingModal, setShowUpdatingModal] = useState(false);
    const [currentUser, setCurrentUser] = useState([])
    const current_firstName = useInput('')
    const current_lastName = useInput('')
    const current_email = useInput('')
    
    //cостояния для работы с модальным окном добавления пользователя
    const [showAddingModal, setShowAddingModal] = useState(false);
    const addedFirstName = useInput('')
    const addedLastName = useInput('')
    const addedEmail = useInput('')
 
    const [isValid, setIsValid] = useState('default')

    //состояние уведомлений
    const [alerts, setAlerts] = useState([])

    function changePage(page) {
        setPage(page)
    }

    /* ======= ЗАГРУЗКА ДАННЫХ С СЕРВЕРА ========================================================= */

    useEffect(() => {
        fetchingUsers(page, perPage)
    }, [page, perPage])
    
    /* ======= ЛОГИКА ИЗМЕНЕНИЯ ДАННЫХ ПОЛЬЗОВАТЕЛЯ ========================================================= */
    
    //открывает модальное окно для внесения изменений, добавляет в инпуты значения текущего пользователя
    function showUpdateModal(userToUpdate) {
        setCurrentUser(userToUpdate)
        current_firstName.setVal(userToUpdate.first_name)
        current_lastName.setVal(userToUpdate.last_name)
        current_email.setVal(userToUpdate.email)
        setShowUpdatingModal(true)
    }
    
    //обновляет выбранного пользователя
    function updateUser(item) {
        let currentItem = users.find(elem => elem.id === item.id) //ищем текущего пользователя в списке
        let updatedUser = {...currentItem} //делаем копию, чтобы заменить значения в ней и дальше по индексу поменять его с оригиналом в списке
        
        if (!current_firstName.value || !current_lastName.value || !current_email.value) { //если поля не заполнены форма не отправляется и выскакивает уведомление
            setIsValid(false)
        } else { //если поля не изменились возвращаем исходник
            if (currentItem.first_name === current_firstName.value && 
                currentItem.last_name === current_lastName.value && 
                currentItem.email === current_email.value) {
                    
                    setShowUpdatingModal(false) //закрываем модальное окно
                    addNewAlert('_secondary_Данные остались прежними') //добавляем новое уведомление 
                    return users //возвращаем исходник
                    
                } else { //если изменились, то меняем данные
                    
                    setIsValid(true)
                    Object.defineProperty(updatedUser, 'first_name', {
                        value: current_firstName.value,
                    });
                    
                    Object.defineProperty(updatedUser, 'last_name', {
                        value: current_lastName.value,
                    });
                    
                    Object.defineProperty(updatedUser, 'email', {
                        value: current_email.value,
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
        addedFirstName.clear()
        addedLastName.clear()
        addedEmail.clear()
        
        //скрываем валидацию
        setIsValid('default')
        
        // закрываем модальное окно
        setShowAddingModal(false)
    }
    
/* ======= ЛОГИКА УВЕДОМЛЕНИЙ ========================================================= */
    
        //добавляем новое уведомление с уникальным ключом, удаляем его по прошествии 5 сек
        function addNewAlert(message) {
            alerts.push(Math.random() + message)
            setTimeout(() => alerts.pop(), 2500)
        }
    
        //удаление уведомления
        function removeAlert(alertToRemove) {
            const id = alertToRemove.split('_'[0])
            alerts.filter(alert => alert.split('_'[0]) !== id)
        }

    return (
        <div className='container'>
            {isUsersLoading && <Spinner className='spinner' animation="border" variant="primary"/>}
            {users && !isUsersLoading &&
                <>
                    <div className='fixed-block'>
                        <MyModal
                            show={showUpdatingModal}
                            handleClose={() => setShowUpdatingModal(false)}
                            title={'Измените данные'}
                            body={
                                <form className='modal__wrapper'>
                                    <MyInput 
                                        label={'Имя'} 
                                        params={{value: current_firstName.value, onChange: current_firstName.onChange}}
                                        />
                                    <MyInput 
                                        label={'Фамилия'} 
                                        params={{value: current_lastName.value, onChange: current_lastName.onChange}}
                                        />
                                    <MyInput 
                                        label={'Электронная почта'} 
                                        params={{value: current_email.value, onChange: current_email.onChange}}
                                    />
                                    <IsValidMessage message={'Заполните все поля'} isValid={isValid}/>
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
                                    <MyInput 
                                        label={'Имя'} 
                                        placeholder={'Введите имя'} 
                                        params={{value: addedFirstName.value, onChange: addedFirstName.onChange}}
                                    />
                                    <MyInput 
                                        label={'Фамилия'} 
                                        placeholder={'Введите фамилию'} 
                                        params={{value: addedLastName.value, onChange: addedLastName.onChange}}
                                    />
                                    <MyInput 
                                        label={'Электронная почта'} 
                                        placeholder={'Введите электронную почту'} 
                                        params={{value: addedEmail.value, onChange: addedEmail.onChange}}
                                    />
                                    <IsValidMessage message={'Заполните все поля'} isValid={isValid}/>
                                </form>
                            }
                            action={() => addNewUser(addedFirstName.value, addedLastName.value, addedEmail.value)}    
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
                                ? <></>
                                : <TableHead/>
                            }
                        </div>
                    </div>
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
                                variant={alert.split('_')[1]}
                                text={alert.split('_')[2]}
                                onClick={() => removeAlert(alert)}
                            />
                        )}
                    </div>
                </>
            }
            {usersError && <h3>Ошибка: {usersError}</h3>}
        </div>
    )
}

export default APITable
