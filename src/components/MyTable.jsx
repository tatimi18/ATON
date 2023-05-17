import React from 'react'
import trash_icon from '../icons/trash_icon.svg'
import update_icon from '../icons/update_icon.svg'
import Table from 'react-bootstrap/Table';
import { Button } from 'react-bootstrap';

const MyTable = ({parentToRender, showModal, remove}) => {
    return (
        <>
            {/* <Table responsive striped bordered hover style={{marginTop: '153px', position: 'fixed', width: '100%', maxWidth: 'inherit'}}>
                <thead>
                    <tr>
                        <th>id</th>
                        <th>Имя</th>
                        <th>Фамилия</th>
                        <th>Эл. почта</th>
                        <th></th>
                    </tr>
                </thead>
            </Table> */}
            <div className="scroll-table-body">
                <Table responsive striped bordered hover>
                    <tbody>
                        {parentToRender.map(user => 
                            <tr key={user.id}>
                                <td>{user.id}</td>
                                <td>{user.first_name}</td>
                                <td>{user.last_name}</td>
                                <td>{user.email}</td>
                                <td>
                                    <Button
                                        variant='info'
                                        style={{marginRight: '10px'}}
                                        onClick={() => showModal(user)}
                                    >
                                        <img src={update_icon} alt="update_icon" />
                                    </Button>
                                    <Button
                                        variant='danger'
                                        onClick={() => remove(user)}
                                    >
                                        <img src={trash_icon} alt="trash_icon" />
                                    </Button>
                                </td>
                            </tr>
                        )}
                        
                    </tbody>
                </Table>
            </div>
        </>
    )
}

export default MyTable
