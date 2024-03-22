import { createGlobalStyle } from 'styled-components';

export const COLORS = {
  text: 'white',
  background: 'radial-gradient(circle, #102E52, #141728);',
  navbar: '#202333',
  special: '#f5c631',
  red: '#f23645',  // DA274D
  green: '#44998f',  // 31C75A
};

const GlobalStyles = createGlobalStyle`
  body {
    margin: 0;
    padding: 0;
    font-family: Arial, sans-serif;
    background: ${COLORS.background};
  }

  h1, h2, h3, h4, h5, h6 {
    color: #333;
  }

  a {
    color: #1a0dab;
    text-decoration: none;
  }

  a:hover {
    text-decoration: underline;
  }

  /* Add more global styles as needed */
`;

export default GlobalStyles;