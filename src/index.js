import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import AuthProvider from './contexts/AuthContext';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
	//оборачиваем приложение в контекст, чтобы иметь доступ к содержимому контекста в любой точке приложения
	<AuthProvider>
		<App />
	</AuthProvider>
);


