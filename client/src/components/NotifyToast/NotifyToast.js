import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Button } from '@mui/material';
import { useTransition, animated } from 'react-spring';
import { MyAlert, MyLinearProgress } from './NotifyToast.styles';
import { closeNotification, updateNotificationProgress } from '../../store/reducers/action';

function NotifyToast() {
    const dispatch = useDispatch();
    const notifications = useSelector(state => state.notifyToast.notifications);

    const transitions = useTransition(notifications, {
        from: { transform: 'translate3d(0,40px,0)', opacity: 1 },
        enter: { transform: 'translate3d(0,0px,0)', opacity: 1 },
        leave: { transform: 'translate3d(100%,0px,0)', opacity: 0 },
        keys: notification => notification.id,
    });

    const handleClose = (id) => {
        dispatch(closeNotification(id));
    };

    useEffect(() => {
        const interval = setInterval(() => {
            dispatch(updateNotificationProgress());
        }, 50);
    
        return () => clearInterval(interval);
    }, [dispatch]);

    return (
        <>
            <div style={{ position: 'fixed', top: 20, right: 20 }}>
            {transitions((style, item) => (
                <animated.div
                    key={item.id}
                    style={style}
                    className="my-notification-enter-active"
                >
                    <MyAlert
                        severity="success"
                        variant="filled"
                        onClose={() => handleClose(item.id)}
                    >
                        {item.text}
                    </MyAlert>
                    <MyLinearProgress variant="determinate" value={item.progress} />
                </animated.div>
            ))}
            </div>
        </>
    );
}

export default NotifyToast;