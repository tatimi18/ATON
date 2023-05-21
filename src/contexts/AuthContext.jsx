import React, { createContext, useState, useEffect } from 'react';

export const authContext = createContext({});


const AuthProvider = ({ children }) => {
    const [auth, setAuth] = useState({ loading: true, data: null });

    //функця добавления юзера
    const setAuthData = (data) => {
        setAuth({data: data});
    };

    //выполняется при каждом обновлении браузера
    useEffect(() => {
        setAuth({ loading: false, data: JSON.parse(window.localStorage.getItem('authData'))});
    }, []);

    //выполняется каждый раз, когда меняется юзер. Устанавливаем новое значение юзера в localStorage
    useEffect(() => {
        window.localStorage.setItem('authData', JSON.stringify(auth.data));
    }, [auth.data]);

    return (
        <authContext.Provider value={{ auth, setAuthData }}>
            {children}
        </authContext.Provider>
    );
};
  
export default AuthProvider;