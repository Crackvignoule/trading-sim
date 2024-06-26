import React, { useState, useEffect } from 'react';
import {UserOrdersDiv, OrderContainer, MyTable, MyTableBody, MyTableCell, MyTableContainer, MyTableHead, MyTablePagination, MyTableRow, Label, HeaderDiv, IconTrash, AnimatedDiv } from './UserOrders.styles';
import { useSelector, useDispatch } from 'react-redux';
import { v4 as uuidv4 } from 'uuid';
import { addNotification } from '../../store/reducers/action';
import io from 'socket.io-client';


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
    const orders = useSelector(state => state.orders.value);
    const ordersHistory = useSelector(state => state.ordersHistory.value);

    const [activeMenu, setActiveMenu] = useState('opened-orders');
    const [underlineStyle, setUnderlineStyle] = useState({});
    const dispatch = useDispatch();

    const handleClick = (event, id) => {
  setActiveMenu(id);
  const { offsetWidth, offsetLeft } = event.target;
  setUnderlineStyle({ width: offsetWidth - 30, left: offsetLeft + 15 }); // subtract 10 from width and add 5 to left
};

useEffect(() => {
  const activeLink = document.querySelector(".active");
  if (activeLink) {
    const { offsetWidth, offsetLeft } = activeLink;
    setUnderlineStyle({ width: offsetWidth - 30, left: 15 }); // subtract 10 from width and set left to 5
  }
}, []);

    useEffect(() => {
        const getUserOpenedOrders = async () => {
            try{
                const userPseudo = localStorage.getItem('pseudo');
                const response = await fetch(`http://${process.env.REACT_APP_SERVER_URL}:5000/api/get-user-opened-orders`, {
                    method: 'POST',
                    headers: {
                    'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ pseudo: userPseudo}),
                });
                const results = await response.json();
                if (response.status === 200) {
                    dispatch({ type: 'SET_ORDERS', value: results.data });
                } else{
                    console.log("Échec récupération des ordres de l'utilisateur");
                }
            } catch (error) {
                    console.error('Erreur lors de la requête /get-user-opened-orders', error);
            }
        };
        getUserOpenedOrders();

        const getUserOrdersHistory = async () => {
            try{
                const userPseudo = localStorage.getItem('pseudo');
                const response = await fetch(`http://${process.env.REACT_APP_SERVER_URL}:5000/api/get-user-orders-history`, {
                    method: 'POST',
                    headers: {
                    'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ pseudo: userPseudo}),
                });
                const results = await response.json();
                if (response.status === 200) {
                    dispatch({ type: 'SET_ORDERS_HISTORY', value: results.data });
                } else{
                    console.log("Échec récupération des ordres de l'utilisateur");
                }
            } catch (error) {
                    console.error('Erreur lors de la requête /get-user-orders-history', error);
            }
        };
        getUserOrdersHistory();

    }, [dispatch]);


   useEffect(() => {
    const socket = io(`ws://${process.env.REACT_APP_SERVER_URL}:8888`);
    const userToken = localStorage.getItem('token');

    socket.on('connect', () => {
        console.log('Connexion établie');
        socket.emit('join', 'userOrders', userToken);
    });

    socket.on(`dataOrders-${userToken}`, (data) => {
        if(!Array.isArray(data) && (data.userToken === userToken)){
            // Trouver l'ordre à déplacer
            const orderToMove = orders.find(order => order.idTrans === data.idTrans);
            dispatch(addNotification({ id: uuidv4(), progress: 0, open: true, text: 'order successfully executed !' }));
            if (orderToMove) {
                const updatedOrder = { ...orderToMove, statut: "Executed" };

                // Ajouter l'ordre dans "Orders History"
                const updatedOrdersHistory = [...ordersHistory, updatedOrder];

                // Trier le nouveau tableau des ordres par date de manière décroissante
                updatedOrdersHistory.sort((a, b) => new Date(b.dateTrans) - new Date(a.dateTrans));

                // Mettre à jour l'état avec le tableau trié
                dispatch({ type: 'SET_ORDERS_HISTORY', value: updatedOrdersHistory });

                // Supprimer l'ordre de "Opened Orders"
                const newOrders = orders.filter(order => order.idTrans !== data.idTrans);

                dispatch({ type: 'SET_ORDERS', value: newOrders });
            }
        }
    });

    // Nettoyer en fermant la connexion WebSocket quand le composant se démonte
    return () => {
        socket.close();
    };
    }, [orders, ordersHistory, dispatch]);

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(+event.target.value);
        setPage(0);
    };


    const deleteTransaction = async (idTrans) => {
        try{
            const response = await fetch(`http://${process.env.REACT_APP_SERVER_URL}:5000/api/del-transaction`, {
                method: 'POST',
                headers: {
                'Content-Type': 'application/json',
                },
                body: JSON.stringify({ idTrans: idTrans}),
            });
            await response.json();
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
                    dispatch({ type: 'SET_ORDERS_HISTORY', value: updatedOrdersHistory });
    
                    // Supprimer l'ordre de "Opened Orders"
                    const newOrders = orders.filter(order => order.idTrans !== idTrans);
                    dispatch({ type: 'SET_ORDERS', value: newOrders });
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
            const response = await fetch(`http://${process.env.REACT_APP_SERVER_URL}:5000/api/del-all-user-transaction`, {
                method: 'POST',
                headers: {
                'Content-Type': 'application/json',
                },
                body: JSON.stringify({ userPseudo: userPseudo}),
            });
            await response.json();
            if (response.status === 200) {

                // Préparer les ordres actuels pour l'historique avec un statut "Cancelled"
                const newOrdersForHistory = orders.map(order => ({ ...order, statut: "Cancelled" }));

                // Créer une nouvelle liste pour l'historique qui combine les ordres existants et les nouveaux
                const updatedOrdersHistory = [...ordersHistory, ...newOrdersForHistory];

                // Trier la liste mise à jour par date de manière décroissante
                updatedOrdersHistory.sort((a, b) => new Date(b.dateTrans) - new Date(a.dateTrans));

                // Mettre à jour l'état avec le tableau trié
                dispatch({ type: 'SET_ORDERS_HISTORY', value: updatedOrdersHistory });

                // Supprimer visuellement tous les ordres dans "Opened Orders"
                dispatch({ type: 'SET_ORDERS', value: [] });

            } else{
                console.log("Échec de la suppresion");
            }
        } catch (error) {
                console.error('Erreur lors de la requête /del-transaction', error);
        }
    };


    return (
        <UserOrdersDiv>
            <HeaderDiv>
                <Label
                    active={activeMenu === 'opened-orders'}
                    className='title'
                    id='opened-orders'
                    onClick={(event) => handleClick(event, 'opened-orders')}>
                    Opened Orders
                </Label>
                <Label 
                    active={activeMenu === 'orders-history'} 
                    className='title' 
                    id='orders-history' 
                    onClick={(event) => handleClick(event, 'orders-history')}>
                    Orders History
                </Label>
                <AnimatedDiv active={activeMenu === 'orders-history'} $width={underlineStyle.width} $left={underlineStyle.left}></AnimatedDiv>
            </HeaderDiv>

            <OrderContainer>
            <MyTableContainer /*sx={{ maxHeight: 440 }}*/>
                <MyTable stickyHeader aria-label="sticky table">
                <MyTableHead>
                    <MyTableRow>
                    {activeMenu === 'opened-orders' ? 
                    ordersColumns.map((column) => (
                        <MyTableCell
                        key={column.id}
                        align={column.align}
                        style={{ minWidth: column.minWidth }}
                        >
                        <Label id={column.id === 'icon' ? 'trash': ''} {...(column.id === 'icon' ? { onClick: () => deleteAllUsersTransaction() } : {})}>
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
                    {activeMenu === 'opened-orders' ? 
                    orders
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((row) => {
                        return (
                        <MyTableRow hover role="checkbox" tabIndex={-1} key={row.code}>
                            {ordersColumns.map((column) => {
                            const value = row[column.id];
                            return (
                                <MyTableCell key={column.id} align={column.align}>
                                    {column.id === 'icon' ? <IconTrash onClick={ ()=> deleteTransaction(row["idTrans"])}/>: 
                                    
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
                count={activeMenu === 'opened-orders' ? orders.length : ordersHistory.length}
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