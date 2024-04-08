// store/reducers/ordersHistoryReducer.js
const initialState = {
    value: [],
  };
  
  function ordersHistoryReducer(state = initialState, action) {
    switch (action.type) {
      case 'SET_ORDERS_HISTORY':
        return { ...state, value: action.value };
      default:
        return state;
    }
  }
  
  export default ordersHistoryReducer;
  