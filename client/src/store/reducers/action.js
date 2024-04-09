// action.js
export const ADD_NOTIFICATION = 'ADD_NOTIFICATION';

export const addNotification = notification => ({
    type: ADD_NOTIFICATION,
    payload: notification,
});


export const CLOSE_NOTIFICATION = 'CLOSE_NOTIFICATION';

export const closeNotification = id => ({
    type: CLOSE_NOTIFICATION,
    payload: id,
});


export const UPDATE_NOTIFICATION_PROGRESS = 'UPDATE_NOTIFICATION_PROGRESS';

export const updateNotificationProgress = () => (dispatch, getState) => {
    const { notifyToast: { notifications } } = getState();

    notifications.forEach(notification => {
        if (notification.progress >= 100) {
            dispatch(closeNotification(notification.id));
        }
    });

    dispatch({
        type: UPDATE_NOTIFICATION_PROGRESS,
    });
};