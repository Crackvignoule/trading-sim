// store/reducers/notifyToastReducer.js

import { ADD_NOTIFICATION, CLOSE_NOTIFICATION, UPDATE_NOTIFICATION_PROGRESS } from './action';

const initialState = {
    notifications: [],
    // autres états...
};

const notifyToastReducer = (state = initialState, action) => {
    switch (action.type) {
        case ADD_NOTIFICATION:
            return {
                ...state,
                notifications: [...state.notifications, action.payload],
            };
        case CLOSE_NOTIFICATION:
            return {
                ...state,
                notifications: state.notifications.filter(notification => notification.id !== action.payload),
            };
        case UPDATE_NOTIFICATION_PROGRESS:
            return {
                ...state,
                notifications: state.notifications.map(notification => ({
                    ...notification,
                    progress: notification.progress + 1, // Mettez à jour la progression comme vous le souhaitez
                })),
            };
        // autres cas...
        default:
            return state;
    }
};

export default notifyToastReducer;