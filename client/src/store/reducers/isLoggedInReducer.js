// store/reducers/isLoggedInReducer.js
const initialState = {
    value: false,
  };
  
  function isLoggedInReducer(state = initialState, action) {
    switch (action.type) {
      case 'SET_ISLOGGEDIN':
        return { ...state, value: action.value };
      default:
        return state;
    }
  }
  
  export default isLoggedInReducer;
  