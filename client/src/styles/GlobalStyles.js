import { createGlobalStyle } from 'styled-components';

const GlobalStyles = createGlobalStyle`
  body {
    margin: 0;
    padding: 0;
    font-family: Arial, sans-serif;
    background: radial-gradient(circle, #102E52, #141728);
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