// store/reducers/index.js
import { combineReducers } from 'redux';
import tradedPairReducer from './tradedPairReducer';
import ordersReducer from './ordersReducer';
import ordersHistoryReducer from './ordersHistoryReducer';
import notifyToastReducer from './notifyToastReducer';
import isLoggedInReducer from './isLoggedInReducer';

const rootReducer = combineReducers({
  tradedPair: tradedPairReducer,
  orders: ordersReducer,
  ordersHistory: ordersHistoryReducer,
  notifyToast: notifyToastReducer,
  isLoggedIn:isLoggedInReducer,
});

export default rootReducer;
