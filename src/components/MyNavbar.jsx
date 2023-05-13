import React from 'react'
import perso_icon from '../icons/user_main.svg'
import { Button } from "react-bootstrap";
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';

const MyNavbar = ({username, onLogOut}) => {
    return (
        <Navbar fixed="top" bg="dark" variant="dark">
            <Container>
                <Navbar.Brand>
                <div className='navbar__person'>
                    <img className="navbar__icon" src={perso_icon} alt="person" />
                    <div className="navbar__username">{username}</div>
                </div>
                </Navbar.Brand>
                <Nav className="d-flex">
                    <Button
                        variant="primary"
                        onClick={onLogOut}
                        >
                        Выйти
                    </Button>
                </Nav>
            </Container>
        </Navbar>
    )
}

export default MyNavbar
