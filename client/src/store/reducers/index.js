// store/reducers/index.js
import { combineReducers } from 'redux';
import tradedPairReducer from './tradedPairReducer';
import ordersReducer from './ordersReducer';
import ordersHistoryReducer from './ordersHistoryReducer';
import notifyToastReducer from './notifyToastReducer';

const rootReducer = combineReducers({
  tradedPair: tradedPairReducer,
  orders: ordersReducer,
  ordersHistory: ordersHistoryReducer,
  notifyToast: notifyToastReducer,
});

export default rootReducer;
