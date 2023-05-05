import React, { useState, useEffect } from 'react'
import Table from 'react-bootstrap/Table';
import Spinner from 'react-bootstrap/Spinner';
import MyPagination from './MyPagination';
import { Button } from 'react-bootstrap';
import MyModal from '../components/MyModal';


const APITable = () => {
    const [users, setUsers] = useState([])
    const [isLoading, setIsLoading] = useState(false);

    const [currentUser, setCurrentUser] = useState([])
    const [current_firstName, setCurrent_firstName] = useState('')
    const [current_lastName, setCurrent_lastName] = useState('')
    const [currentEmail, setCurrentEmail] = useState('')

    //открыто ли модальное окно и функция изменения этого значения 
    const [show, setShow] = useState(false);

    //состояние для серверной пагинации
    const [page, setPage] = useState(1)
    const [totalPages, setTotalPages] = useState(0)
    let [total, setTotal] = useState(0)

    function changePage(page) {
        setPage(page)
    }

    function showUpdateModal(userToUpdate) {
        setShow(true)
        setCurrentUser(userToUpdate)
        setCurrent_firstName(userToUpdate.first_name)
        setCurrent_lastName(userToUpdate.last_name)
        setCurrentEmail(userToUpdate.email)
    }

    function updateUser(item) {
        let newUser = users.find(elem => elem.first_name === item.first_name)
        let updatedUser = {...newUser}
        Object.defineProperty(updatedUser, 'first_name', {
            value: current_firstName,
        });

        Object.defineProperty(updatedUser, 'last_name', {
            value: current_lastName,
        });

        Object.defineProperty(updatedUser, 'email', {
            value: currentEmail,
        });

        let index = users.indexOf(newUser);

        if (index !== -1) {
            users[index] = updatedUser;
        }
        setShow(false)
        return users
    }


    function removeUser(userToRemove) {
        setUsers(users.filter(user => 
            user.email !== userToRemove.email
        ))
    }

    useEffect(() => {
        async function fetchingUsers() {
            try {
                setIsLoading(true)
                let response = await fetch(`https://reqres.in/api/users?page=${page}&per_page=6`)
                let json = await response.json();
                setUsers(json.data)
                setTotalPages(json.total_pages)
                setTotal(json.total)
                
            } catch (error) {
                console.log(error.message)
            } 
            setIsLoading(false)
        }
        fetchingUsers();
    }, [page]);
    return (
        <div className='container'>
            {
                isLoading
                ? <Spinner animation="border" variant="primary" />
                : <>
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
                        show={show}
                        handleClose={() => setShow(false)}
                        title={'Измените данные'}
                        body={
                            <div className='modal__wrapper'>
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
                            </div>
                        }
                        action={() => updateUser(currentUser)}
                    />
                    
                </>
            }
            
        </div>
    )
}

export default APITable
