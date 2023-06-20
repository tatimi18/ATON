import React, { useState, useEffect, useRef, useMemo} from 'react';
import Spinner from 'react-bootstrap/Spinner';
import { Button } from 'react-bootstrap';
import MyModal from '../components/MyModal';
import MyAlert from './MyAlert';
import UserService from '../services/UserService';
import { useFetching } from '../hooks/useFetching';
import useInput from '../hooks/useInput';
import MyInput from './UI/input/MyInput';
import IsValidMessage from './IsValidMessage';

import update_icon from '../icons/update_icon.svg';
import trash_icon from '../icons/trash_icon.svg';

import { AgGridReact } from 'ag-grid-react'; // the AG Grid React Component
import 'ag-grid-community/styles/ag-grid.css'; // Core grid CSS, always needed
import 'ag-grid-community/styles/ag-theme-alpine.css'; // Optional theme CSS


const APITable = () => {
    
    /* ======= СОСТОЯНИЯ ========================================================= */
    
    //состояния для работы со списком пользователей
    const [users, setUsers] = useState([]);
    /* const [firstUserInPage, setFirstUserInPage] = useState(0);
    const [lastUserInPage, setLastUserInPage] = useState(0); */
    const [perPage, setPerPage] = useState(12);
    const [paginationPageSize, setPaginationPageSize] = useState(6)
    
    //состояния для серверной пагинации
    const [page, setPage] = useState(1);

    const [fetchingUsers, isUsersLoading, usersError, start] = useFetching(async (page, perPage) => {
        const [response, end] = await UserService.getAll(page, perPage);
        setUsers(response.data.data);
        setPage(response.data.page);
        setPerPage(response.data.per_page);
        const time = (end - start) / 1000;
        addNewAlert(`_success_Данные получены за ${time} сек.`);
    });

    //cостояния для работы с модальным окном изменения пользователя
    const [showUpdatingModal, setShowUpdatingModal] = useState(false);
    const [currentUser, setCurrentUser] = useState([]);
    const current_firstName = useInput('');
    const current_lastName = useInput('');
    const current_email = useInput('');
    
    //cостояния для работы с модальным окном добавления пользователя
    const [showAddingModal, setShowAddingModal] = useState(false);
    const addedFirstName = useInput('');
    const addedLastName = useInput('');
    const addedEmail = useInput('');
 
    const [isValid, setIsValid] = useState('default');
    const [isValidEmail, setIsValidEmail] = useState('default');

    //состояние уведомлений
    const [alerts, setAlerts] = useState([]);

    /* ======= ЗАГРУЗКА ДАННЫХ С СЕРВЕРА ========================================================= */

    useEffect(() => {
        fetchingUsers(page, perPage);
    }, [page, perPage]);
    
    /* ======= ЛОГИКА ИЗМЕНЕНИЯ ДАННЫХ ПОЛЬЗОВАТЕЛЯ ========================================================= */
    
    //открывает модальное окно для внесения изменений, добавляет в инпуты значения текущего пользователя
    function showUpdateModal(userToUpdate) {
        setCurrentUser(userToUpdate);
        current_firstName.setVal(userToUpdate.first_name);
        current_lastName.setVal(userToUpdate.last_name);
        current_email.setVal(userToUpdate.email);
        setShowUpdatingModal(true);
    };
    
    // & обновляет выбранного пользователя
    function updateUser(data) {

        let currentItem = gridRef.current.api.getRowNode(data.id);
        
        if (!current_firstName.value || !current_lastName.value || !current_email.value) { //если поля не заполнены форма не отправляется и выскакивает уведомление
            setIsValid(false);
        } else { //если поля не изменились возвращаем исходник
            if (currentItem.data.first_name === current_firstName.value && 
                currentItem.data.last_name === current_lastName.value && 
                currentItem.data.email === current_email.value) {
                    
                    setShowUpdatingModal(false); //закрываем модальное окно
                    addNewAlert('_secondary_Данные остались прежними'); //добавляем новое уведомление 
                    
            } else if (!isEmailValid(current_email.value)) { //если почта не прошла валидацию выводим ошибку
                setIsValidEmail(false)
            } else { //если изменились, то меняем данные
                setIsValidEmail(true)
                setIsValid(true);
                    
                let newData = {
                    id: data.id,
                    first_name: current_firstName.value,
                    last_name: current_lastName.value,
                    email: current_email.value,
                    actions: `${update_icon},${trash_icon}`
                };
                    
                currentItem.setData(newData);
                
                setShowUpdatingModal(false); //закрываем модальное окно
                addNewAlert('_info_Пользователь изменен'); //добавляем новое уведомление 
            };
        };
    };
    
    /* ======= ФУНКЦИИ ПОИСКА ИНДЕКСА СТРОКИ ПЕРВОГО И ПОСЛЕДНЕГО ЭЛ НА СТР ========================================================= */
    
    function getFirstUserRowIndex() {
        let first = gridRef.current.api.getModel().beans.paginationProxy.topRowBounds.rowIndex + 1;
        return first 
    }
    
    function getLastUserRowIndex() {
        let last = gridRef.current.api.paginationProxy.bottomDisplayedRowIndex + 1;
        return last 
    }

    /* ======= ЛОГИКА УДАЛЕНИЯ ПОЛЬЗОВАТЕЛЯ ========================================================= */
    // & удаление пользователя из списка
    function removeUser(userToRemove) {

        let filteredUsers = users.filter(user => user.id !== userToRemove.id);
        setUsers(filteredUsers)

        //получаем индекс строки последнего эл-та
        let lastRowIndex = getLastUserRowIndex()
        
        //находим строку по индексу и узнаем ее айдишник
        let lastUserNode = gridRef.current.api.getDisplayedRowAtIndex(lastRowIndex)

        //если возвращает undefined и массив не пустой,перезаписываем строку последним значением отфильтрованного массива пользователей
        //переприсваиваем со значением айдишника
        if (!lastUserNode && filteredUsers.length) { 
            lastUserNode = filteredUsers[filteredUsers.length - 1].id
        } else if (!lastUserNode && !filteredUsers.length) { // -//- и если пустой массив, то присваиваем строке айдишник 1
            lastUserNode = 1
        } else { //если true, то извлекаем айдишник из внутреннего свойства строки
            lastUserNode = lastUserNode.data.id
        }
        //добавляем новое уведомление
        addNewAlert('_danger_Пользователь удален');
    };
    
    
    /* ======= ЛОГИКА ДОБАВЛЕНИЯ ПОЛЬЗОВАТЕЛЯ ========================================================= */
    
    // & добавляет нового пользователя
    function addNewUser(firstName, lastName, email) {

        if (!firstName || !lastName || !email) { //если поля не заполнены форма не отправляется
            setIsValid(false);
        } else if (firstName && lastName && !isEmailValid(email)) { //если почта невалидка не отправлется
            setIsValid('default')
            setIsValidEmail(false)
        }
        else {
            setIsValid(true);
            let newUser;
            let countOfEmptyRowsInPage;

            if(!users.length) { //если массив пустой, то новый юзер будет добавлен с айдишником 1
                newUser = {
                    id: 1,
                    first_name: firstName,
                    last_name: lastName,
                    email: email
                };
            } else { //если массив не пустой:

                //получаем индексы первой и последней строки на стр
                let firstRowIndex = getFirstUserRowIndex() 
                let lastRowIndex = getLastUserRowIndex()
    
                // считаем кол-во строк на стр
                let rowsInPage = lastRowIndex - firstRowIndex + 1

                //считаем кол-во незаполненных строк
                countOfEmptyRowsInPage = paginationPageSize - rowsInPage
    
                //получаем ноду строки по последнему индексу найденному выше
                let lastUserNode = gridRef.current.api.getDisplayedRowAtIndex(lastRowIndex)    
    
                if (!lastUserNode) { //если indefined, получаем ноду по предпоследней строке и записываем свойства новому юзеру
                    lastUserNode = gridRef.current.api.getDisplayedRowAtIndex(lastRowIndex - 1)
                    newUser = {
                        id: lastUserNode.data.id + 1,
                        first_name: firstName,
                        last_name: lastName,
                        email: email
                    };
                } else { //если нода true просто вытаскиваем айди и записываем в нового юзера
                    newUser = {
                        id: lastUserNode.data.id,
                        first_name: firstName,
                        last_name: lastName,
                        email: email
                    };
                }
                    
                for (let user of users) { //перезаписываем индексы 
                    if (user.id === newUser.id) {
                        for (let i = user.id; i <= users.length; i += 1) {
                            user.id += 1
                        }
                    }
                }
            }

            if (!countOfEmptyRowsInPage) { //если кол-во пустых строк 0, увеличиваем кол-во отображаемых строк на 1
                setPaginationPageSize(Number(paginationPageSize) + 1)
            }

            //добавляем нового юзера
            setUsers([...users, newUser].sort((a,b) => compareNumbers(a.id, b.id)));

            //стираем заполненные поля и закрываем форму
            handleClose();
            
            //добавляем новое уведомление
            addNewAlert('_primary_Пользователь добавлен');
        };
    };
    
    //сравнивает числа по их значеню
    function compareNumbers(n1, n2)
        {
        if (n1 === n2) return 0;
        
        if (n1 > n2)
            return 1;
        else 
            return -1;
        }

    /* 
        * функция при закрытии модального окна добавления пользователя, 
        * сбрасыват все изменения формы, если она не отправлена и при отправлении формы 
    */    
    function handleClose() {
        //стираем заполненные поля 
        addedFirstName.clear();
        addedLastName.clear();
        addedEmail.clear();
        
        //скрываем валидацию
        setIsValid('default');
        setIsValidEmail('default');
        
        // закрываем модальное окно
        setShowAddingModal(false);
    };
    
    /* ======= ЛОГИКА ВАЛИДАЦИИ ЕМАЙЛА ========================================================= */
    const EMAIL_REGEXP = /^(([^<>()[\].,;:\s@"]+(\.[^<>()[\].,;:\s@"]+)*)|(".+"))@(([^<>()[\].,;:\s@"]+\.)+[^<>()[\].,;:\s@"]{2,})$/iu;

    function isEmailValid(value) {
        return EMAIL_REGEXP.test(value);
    }

    /* ======= ЛОГИКА УВЕДОМЛЕНИЙ ========================================================= */

    //добавляем новое уведомление с уникальным ключом, удаляем его по прошествии 5 сек
    function addNewAlert(message) {
    alerts.push(Math.random() + message);
    setTimeout(() => alerts.pop(), 2500);
    };

    //удаление уведомления
    function removeAlert(alertToRemove) {
    const id = alertToRemove.split('_'[0]);
    alerts.filter(alert => alert.split('_'[0]) !== id);
    };

/* ======= ТАБЛИЦА ========================================================= */

    const gridRef = useRef(); // Optional - for accessing Grid's API

    const columnDefs = [ //колонки
        { field: 'id', filter: true, /* flex:70, */ width: 120,},
        { field: 'first_name', headerName: 'Имя', filter: true, minWidth: 100 },
        { field: 'last_name', headerName: 'Фамилия', filter: true, minWidth: 100 },
        { field: 'email', headerName: 'Эл. почта', filter: true, minWidth: 300, flex: 150 },
        { 
            field: 'actions',
            headerName: 'Действия', 
            flex: 100,
            minWidth: 160,
            maxWidth: 160,
            sortable: false, 
            cellRenderer: params => {
                return <div style={{display: 'flex', justifyContent: 'space-between'}}> 
                            <div
                                onClick={() => showUpdateModal(params.data)}
                                className='circle circle__update'
                                
                            >   
                                <img src={params.value.split(',')[0]} className='change_color' alt="update_icon" />
                            </div>
                            <div
                                onClick={() => removeUser(params.data)}
                                className='circle circle__delete'
                            >   
                                <img src={params.value.split(',')[1]} className='change_color' alt="trash_icon" />
                            </div>
                        </div>;
            }
        }
    ];

    // DefaultColDef sets props common to all Columns
    const defaultColDef = useMemo( ()=> ({
        sortable: true,
        cellClass: 'myCell'
    }));

    //поиск строки по айдишнику
    const getRowId = useMemo(() => {
        return (params) => {
            return params.data.id;
        };
    }, []);

    //добавляем новые свойства-путь к иконке в объект юзер
    for (let user of users) {
        user['actions'] = `${update_icon},${trash_icon}`
    }

    //замена отриц чисел на положительные
    function handleItemsCountOnPageChange(value) {
        if (value <= 0) {
            value = 1
        }
        setPaginationPageSize(value)
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
                                    <IsValidMessage message={'Некорректно введена почта'} isValid={isValidEmail}/>
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
                                    <IsValidMessage message={'Некорректно введена почта'} isValid={isValidEmail}/>
                                    <IsValidMessage message={'Заполните все поля'} isValid={isValid}/>
                                </form>
                            }
                            action={() => addNewUser(addedFirstName.value, addedLastName.value, addedEmail.value)}    
                        />
                    </div>

                    <div className='panel'>
                        <Button
                            onClick={() => setShowAddingModal(true)}
                            variant="primary"
                        >   
                            Добавить в список
                        </Button>

                        <div>
                            <label style={{}}>Кол-во строк на стр.</label>
                            <input
                                style={{width: '100px', paddingLeft: '5px', marginLeft: '15px'}}
                                type='number'
                                value={paginationPageSize}
                                onChange={(e) => handleItemsCountOnPageChange(e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="ag-theme-alpine" style={{width: '100%', height: 700, marginTop: '30px'}}>
                        <AgGridReact
                            ref={gridRef} // Ref for accessing Grid's API
                            //rowHeight={80}
                            rowData={users} // Row Data for Rows

                            columnDefs={columnDefs} // Column Defs for Columns
                            defaultColDef={defaultColDef} // Default Column Properties

                            animateRows={true} // Optional - set to 'true' to have rows animate when sorted
                            pagination={true}
                            paginationPageSize={paginationPageSize}
                            getRowId={getRowId}
                        />
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
    );
};

export default APITable;
