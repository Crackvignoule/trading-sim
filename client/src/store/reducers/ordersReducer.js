// store/reducers/ordersReducer.js
const initialState = {
    value: [],
  };
  
  function ordersReducer(state = initialState, action) {
    switch (action.type) {
      case 'SET_ORDERS':
        return { ...state, value: action.value };
      default:
        return state;
    }
  }
  
  export default ordersReducer;
  