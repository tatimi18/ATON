import React from 'react';
import Table from 'react-bootstrap/Table';

const TableHead = () => {
    return (
        <Table responsive striped bordered hover>
            <thead>
                <tr>
                    <th>id</th>
                    <th>Имя</th>
                    <th>Фамилия</th>
                    <th>Эл. почта</th>
                    <th></th>
                </tr>
            </thead>
        </Table>
    );
};

export default TableHead;
