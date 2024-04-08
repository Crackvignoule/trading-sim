import { createGlobalStyle } from "styled-components";

export const COLORS = {
  text: "white",
  background: "radial-gradient(circle, #102E52, #141728);",
  glassBkg: "rgba(255, 255, 255, 0.1)",
  glassBorder: "0.1em solid rgba(255, 255, 255, 0.3)",
  navbar: "#202333",
  special: "#f5c631",
  red: "#f23645", // DA274D
  green: "#44998f", // 31C75A
};

export const FONT = {
  family: "EuclidCircularSemiBold, sans-serif",
};

const GlobalStyles = createGlobalStyle`
  body {
    margin: 0;
    padding: 0;
    font-family: ${FONT.family};
    background: ${COLORS.background};
  }

  h1, h2, h3, h4, h5, h6 {
    color: ${COLORS.text};
  }
  
  path {
    stroke: none !important;
  }
`;

export default GlobalStyles;
