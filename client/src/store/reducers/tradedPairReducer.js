// store/reducers/tradedPairReducer.js
const initialState = {
    value: "SOL/USDT",
  };
  
  function tradedPairReducer(state = initialState, action) {
    switch (action.type) {
      case 'SET_TRADED_PAIR':
        return { ...state, value: action.value };
      default:
        return state;
    }
  }
  
  export default tradedPairReducer;
  