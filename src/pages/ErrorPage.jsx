import React from 'react'
import Alert from 'react-bootstrap/Alert';

const ErrorPage = () => {
    return (
        <div className="container" style={{marginTop: '200px'}}>
            <Alert variant='danger'>
                <span style={{fontSize: '70px'}}>404</span>
                <br></br>
                Такой страницы не существует
                <br></br>
                Перейдите на <Alert.Link href="/content">основную страницу</Alert.Link>
            </Alert>
        </div>
    )
}

export default ErrorPage
