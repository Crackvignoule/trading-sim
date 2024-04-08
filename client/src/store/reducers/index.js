// store/reducers/index.js
import { combineReducers } from 'redux';
import tradedPairReducer from './tradedPairReducer';
import ordersReducer from './ordersReducer';
import ordersHistoryReducer from './ordersHistoryReducer';

const rootReducer = combineReducers({
  tradedPair: tradedPairReducer,
  orders: ordersReducer,
  ordersHistory: ordersHistoryReducer,
});

export default rootReducer;
