import React, { useState, useEffect } from 'react';
import {UserOrdersDiv, OrderContainer, MyTable, MyTableBody, MyTableCell, MyTableContainer, MyTableHead, MyTablePagination, MyTableRow, Label, HeaderDiv, IconTrash } from './UserOrders.styles';


const columns = [
    { id: 'date', label: 'Date', minWidth: 150 },
    { id: 'pair', label: 'Pair', minWidth: 80 },
    { id: 'type', label: 'Type', minWidth: 100 },
    { id: 'direction', label: 'Direction', minWidth: 100 },
    { id: 'price', label: 'Price', minWidth: 100},
    { id: 'amount', label: 'Amount', minWidth: 100},
    { id: 'total', label: 'Total', minWidth: 100},
    { id: 'icon', label: 'Cancel All', minWidth: 100},
  ];
  
  const rows = [
    {date: '2024-03-09 20:37:35', pair: 'BTC/USDT', type: 'Limit', direction: 'Buy', price: '64000.45', amount: '0.02564789', total: '100.23', icon:'trash'},
    {date: '2024-03-09 20:37:35', pair: 'BTC/USDT', type: 'Limit', direction: 'Buy', price: '64000.45', amount: '0.02564789', total: '100.23', icon:'trash'},
    {date: '2024-03-09 20:37:35', pair: 'BTC/USDT', type: 'Limit', direction: 'Sell', price: '64000.45', amount: '0.02564789', total: '100.23', icon:'trash'},
    {date: '2024-03-09 20:37:35', pair: 'BTC/USDT', type: 'Limit', direction: 'Sell', price: '64000.45', amount: '0.02564789', total: '100.23', icon:'trash'},
    {date: '2024-03-09 20:37:35', pair: 'BTC/USDT', type: 'Limit', direction: 'Buy', price: '64000.45', amount: '0.02564789', total: '100.23', icon:'trash'},
    {date: '2024-03-09 20:37:35', pair: 'BTC/USDT', type: 'Limit', direction: 'Buy', price: '64000.45', amount: '0.02564789', total: '100.23', icon:'trash'},
    {date: '2024-03-09 20:37:35', pair: 'BTC/USDT', type: 'Limit', direction: 'Buy', price: '64000.45', amount: '0.02564789', total: '100.23', icon:'trash'},
    {date: '2024-03-09 20:37:35', pair: 'BTC/USDT', type: 'Limit', direction: 'Buy', price: '64000.45', amount: '0.02564789', total: '100.23', icon:'trash'},
    {date: '2024-03-09 20:37:35', pair: 'BTC/USDT', type: 'Limit', direction: 'Buy', price: '64000.45', amount: '0.02564789', total: '100.23', icon:'trash'},
    {date: '2024-03-09 20:37:35', pair: 'BTC/USDT', type: 'Limit', direction: 'Buy', price: '64000.45', amount: '0.02564789', total: '100.23', icon:'trash'},
  ];

function UserOrders() {

    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);

    const [activeMenu, setActiveMenu] = useState('open-orders');

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(+event.target.value);
        setPage(0);
    };

    return (
        <UserOrdersDiv>
            <HeaderDiv>
                <Label active={activeMenu === 'open-orders'} className='title' id='open-orders' onClick={() => setActiveMenu('open-orders')}>Open Orders</Label>
                <Label active={activeMenu === 'orders-history'} className='title' id='orders-history' onClick={() => setActiveMenu('orders-history')}>Orders History</Label>
            </HeaderDiv>

            <OrderContainer>
            <MyTableContainer /*sx={{ maxHeight: 440 }}*/>
                <MyTable stickyHeader aria-label="sticky table">
                <MyTableHead>
                    <MyTableRow>
                    {columns.map((column) => (
                        <MyTableCell
                        key={column.id}
                        align={column.align}
                        style={{ minWidth: column.minWidth }}
                        >
                        <Label id={column.id == 'icon' ? 'trash': ''}>
                            {column.label}
                        </Label>
                        </MyTableCell>
                    ))}
                    </MyTableRow>
                </MyTableHead>
                <MyTableBody>
                    {rows
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((row) => {
                        return (
                        <MyTableRow hover role="checkbox" tabIndex={-1} key={row.code}>
                            {columns.map((column) => {
                            const value = row[column.id];
                            return (
                                <MyTableCell key={column.id} align={column.align}>
                                    {column.id == 'icon' ? <IconTrash/>: 
                                    
                                    <Label className={value === 'Buy' ? 'buy' : value === 'Sell' ? 'sell' : ''}>
                                        {column.format && typeof value === 'number'
                                            ? column.format(value)
                                            : value}
                                    </Label> }
                                    
                                </MyTableCell>
                            );
                            })}
                        </MyTableRow>
                        );
                    })}
                </MyTableBody>
                </MyTable>
            </MyTableContainer>
                <MyTablePagination
                    rowsPerPageOptions={[5, 10, 15]}
                    component="div"
                    count={rows.length}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onPageChange={handleChangePage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                />
        </OrderContainer>
    </UserOrdersDiv>
    );
}

export default UserOrders;