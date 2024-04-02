import React, { useState, useEffect } from 'react';
import {UserOrdersDiv, OrderContainer, MyTable, MyTableBody, MyTableCell, MyTableContainer, MyTableHead, MyTablePagination, MyTableRow, Label, HeaderDiv, IconTrash, AnimatedDiv } from './UserOrders.styles';
import { useOrders, useOrdersHistory } from '../../context/Context';

const ordersColumns = [
    { id: 'dateTrans', label: 'Date', minWidth: 150 },
    { id: 'pair', label: 'Pair', minWidth: 80 },
    { id: 'type', label: 'Type', minWidth: 100 },
    { id: 'direction', label: 'Direction', minWidth: 100 },
    { id: 'price', label: 'Price', minWidth: 100},
    { id: 'amount', label: 'Amount', minWidth: 100},
    { id: 'total', label: 'Total', minWidth: 100},
    { id: 'icon', label: 'Cancel All', minWidth: 100},
  ];


const ordersHistoryColumns = [
    { id: 'dateTrans', label: 'Date', minWidth: 150 },
    { id: 'pair', label: 'Pair', minWidth: 80 },
    { id: 'type', label: 'Type', minWidth: 100 },
    { id: 'direction', label: 'Direction', minWidth: 100 },
    { id: 'price', label: 'Price', minWidth: 100},
    { id: 'amount', label: 'Amount', minWidth: 100},
    { id: 'total', label: 'Total', minWidth: 100},
    { id: 'statut', label: 'Statut', minWidth: 100},
  ];

function UserOrders() {

    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const { orders, setOrders } = useOrders();
    const { ordersHistory, setOrdersHistory } = useOrdersHistory();
    const [activeMenu, setActiveMenu] = useState('open-orders');


    useEffect(() => {
        const getUserOpenOrders = async () => {
            try{
                const userPseudo = localStorage.getItem('pseudo');
                const response = await fetch('http://localhost:5000/api/get-user-open-orders', {
                    method: 'POST',
                    headers: {
                    'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ pseudo: userPseudo}),
                });
                const results = await response.json();
                if (response.status === 200) {
                    setOrders(results.data);
                } else{
                    console.log("Échec récupération des ordres de l'utilisateur");
                }
            } catch (error) {
                    console.error('Erreur lors de la requête /get-user-open-orders', error);
            }
        };
        getUserOpenOrders();

        const getUserOrdersHistory = async () => {
            try{
                const userPseudo = localStorage.getItem('pseudo');
                const response = await fetch('http://localhost:5000/api/get-user-orders-history', {
                    method: 'POST',
                    headers: {
                    'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ pseudo: userPseudo}),
                });
                const results = await response.json();
                if (response.status === 200) {
                    setOrdersHistory(results.data);
                } else{
                    console.log("Échec récupération des ordres de l'utilisateur");
                }
            } catch (error) {
                    console.error('Erreur lors de la requête /get-user-orders-history', error);
            }
        };
        getUserOrdersHistory();

    }, []);

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(+event.target.value);
        setPage(0);
    };

    const addOrder = (newOrder) => {
        setOrders([...orders, newOrder]);
      };

    const deleteTransaction = async (idTrans) => {
        try{
            const response = await fetch('http://localhost:5000/api/del-transaction', {
                method: 'POST',
                headers: {
                'Content-Type': 'application/json',
                },
                body: JSON.stringify({ idTrans: idTrans}),
            });
            const results = await response.json();
            if (response.status === 200) {

                // Trouver l'ordre à déplacer
                const orderToMove = orders.find(order => order.idTrans === idTrans);
                if (orderToMove) {
                    const updatedOrder = { ...orderToMove, statut: "Cancelled" };
    
                    // Ajouter l'ordre dans "Orders History"
                    const updatedOrdersHistory = [...ordersHistory, updatedOrder];
    
                    // Trier le nouveau tableau des ordres par date de manière décroissante
                    updatedOrdersHistory.sort((a, b) => new Date(b.dateTrans) - new Date(a.dateTrans));
    
                    // Mettre à jour l'état avec le tableau trié
                    setOrdersHistory(updatedOrdersHistory);
    
                    // Supprimer l'ordre de "Open Orders"
                    const newOrders = orders.filter(order => order.idTrans !== idTrans);
                    setOrders(newOrders);
                }
            } else{
                console.log("Échec de la suppresion");
            }
        } catch (error) {
                console.error('Erreur lors de la requête /del-transaction', error);
        }
    };

    const deleteAllUsersTransaction = async () => {
        try{
            const userPseudo = localStorage.getItem('pseudo');
            const response = await fetch('http://localhost:5000/api/del-all-user-transaction', {
                method: 'POST',
                headers: {
                'Content-Type': 'application/json',
                },
                body: JSON.stringify({ userPseudo: userPseudo}),
            });
            const results = await response.json();
            if (response.status === 200) {

                // Préparer les ordres actuels pour l'historique avec un statut "Cancelled"
                const newOrdersForHistory = orders.map(order => ({ ...order, statut: "Cancelled" }));

                // Créer une nouvelle liste pour l'historique qui combine les ordres existants et les nouveaux
                const updatedOrdersHistory = [...ordersHistory, ...newOrdersForHistory];

                // Trier la liste mise à jour par date de manière décroissante
                updatedOrdersHistory.sort((a, b) => new Date(b.dateTrans) - new Date(a.dateTrans));

                // Mettre à jour l'état avec le tableau trié
                setOrdersHistory(updatedOrdersHistory);

                // Supprimer visuellement tous les ordres dans "Open Orders"
                setOrders([]);

            } else{
                console.log("Échec de la suppresion");
            }
        } catch (error) {
                console.error('Erreur lors de la requête /del-transaction', error);
        }
    };
    

    const addOrderHistory = (newOrder) => {
        setOrdersHistory([newOrder, ...ordersHistory]);
        };


    return (
        <UserOrdersDiv>
            <HeaderDiv>
                <Label active={activeMenu === 'open-orders'} className='title' id='open-orders' onClick={() => setActiveMenu('open-orders')}>Open Orders</Label>
                <Label active={activeMenu === 'orders-history'} className='title' id='orders-history' onClick={() => setActiveMenu('orders-history')}>Orders History</Label>
                <AnimatedDiv active={activeMenu === 'orders-history'}></AnimatedDiv>
            </HeaderDiv>

            <OrderContainer>
            <MyTableContainer /*sx={{ maxHeight: 440 }}*/>
                <MyTable stickyHeader aria-label="sticky table">
                <MyTableHead>
                    <MyTableRow>
                    {activeMenu === 'open-orders' ? 
                    ordersColumns.map((column) => (
                        <MyTableCell
                        key={column.id}
                        align={column.align}
                        style={{ minWidth: column.minWidth }}
                        >
                        <Label id={column.id == 'icon' ? 'trash': ''} onClick={column.id == 'icon' ?  () =>deleteAllUsersTransaction() : ''}>
                            {column.label}
                        </Label>
                        </MyTableCell>
                    )) : 
                    ordersHistoryColumns.map((column) => (
                        <MyTableCell
                        key={column.id}
                        align={column.align}
                        style={{ minWidth: column.minWidth }}
                        >
                        <Label>
                            {column.label}
                        </Label>
                        </MyTableCell>
                    ))}
                    </MyTableRow>
                </MyTableHead>
                <MyTableBody>
                    {activeMenu === 'open-orders' ? 
                    orders
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((row) => {
                        return (
                        <MyTableRow hover role="checkbox" tabIndex={-1} key={row.code}>
                            {ordersColumns.map((column) => {
                            const value = row[column.id];
                            return (
                                <MyTableCell key={column.id} align={column.align}>
                                    {column.id == 'icon' ? <IconTrash onClick={ ()=> deleteTransaction(row["idTrans"])}/>: 
                                    
                                    <Label className={value === 'buy' ? 'buy' : value === 'sell' ? 'sell' : ''}>
                                        {column.format && typeof value === 'number'
                                            ? column.format(value)
                                            : value}
                                    </Label> }
                                    
                                </MyTableCell>
                            );
                            })}
                        </MyTableRow>
                        );
                    }) :
                    ordersHistory
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((row) => {
                        return (
                        <MyTableRow hover role="checkbox" tabIndex={-1} key={row.code}>
                            {ordersHistoryColumns.map((column) => {
                            const value = row[column.id];
                            return (
                                <MyTableCell key={column.id} align={column.align}>
                                    <Label className={value === 'buy' ? 'buy' : value === 'sell' ? 'sell' : ''}>
                                        {column.format && typeof value === 'number'
                                            ? column.format(value)
                                            : value}
                                    </Label>
                                    
                                </MyTableCell>
                            );
                            })}
                        </MyTableRow>
                        );
                    })
                    
                    }
                </MyTableBody>
                </MyTable>
            </MyTableContainer>
            <MyTablePagination
                rowsPerPageOptions={[5, 10, 15]}
                component="div"
                count={activeMenu === 'open-orders' ? orders.length : ordersHistory.length}
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