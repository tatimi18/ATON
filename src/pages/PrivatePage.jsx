import React, { useContext } from 'react'
import { authContext } from '../contexts/AuthContext'
import { Navigate, useNavigate } from 'react-router-dom';
import APITable from '../components/APITable';
import MyNavbar from '../components/MyNavbar';

const PrivatePage = () => {
    const navigate = useNavigate()
    //достаем значение контекста и функцию изменения контекста
    const { auth, setAuthData } = useContext(authContext)
    const { loading } = auth;

    //удаляем контекст
    function onLogOut() {
        setAuthData(null)
        navigate("/", { replace: true })
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
                ? <div style={{position: 'relative'}}>
                        <MyNavbar username={auth.data} onLogOut={onLogOut}/>
                        <APITable/>
                    </div>

                : <Navigate to="/" />
            }
        </div>
    )
}

export default PrivatePage
