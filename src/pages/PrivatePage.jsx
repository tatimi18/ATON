import React, { useContext, useState } from 'react'
import { authContext } from '../contexts/AuthContext'
import { Navigate, useNavigate } from 'react-router-dom';
import APITable from '../components/APITable';
import MyModal from '../components/MyModal';
import perso_icon from '../icons/user_main.svg'
import { Button } from "react-bootstrap";
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';


const PrivatePage = () => {
    const navigate = useNavigate()
    //достаем значение контекста и функцию изменения контекста
    const { auth, setAuthData } = useContext(authContext)
    const { loading } = auth;

    //открыто ли модальное окно и функция изменения этого значения 
    const [show, setShow] = useState(false);

    //удаляем контекст
    function onLogOut() {
        setAuthData(null)
        navigate("/", { replace: true })
    }
    
    function addToList() {
        setShow(true)
    }


    if (loading) {
        return (
          <p>Loading</p>
        );
    }

    return (
        <div>

            {
                auth.data
                ? <div>
                        <Navbar fixed="top" bg="dark" variant="dark">
                            <Container>
                                <Navbar.Brand>
                                <div className='navbar__person'>
                                    <img className="navbar__icon" src={perso_icon} alt="person" />
                                    <div className="navbar__username">{auth.data}</div>
                                </div>
                                </Navbar.Brand>
                                <Nav className="d-flex">
                                    <Button
                                        variant="primary"
                                        onClick={onLogOut}
                                        >
                                        Выйти
                                    </Button>

                                    <Button 
                                        onClick={addToList}
                                        variant="light"
                                    >   
                                        Добавить в список
                                    </Button>
                                </Nav>
                            </Container>
                        </Navbar>
                        <MyModal
                            show={show}
                            handleClose={() => setShow(false)}
                            title={'Добавьте пользователя в список'}
                            body={'здесь будет форма с полями'}
                            
                        />
                        <APITable/>
                    </div>

                : <Navigate to="/" />
            }
        </div>
    )
}

export default PrivatePage
