import styled from "styled-components";

export const NavBarContainer = styled.div`
    display: flex;
    background-color: #f5f5f5;
    box-shadow: 0px 0px 10px 0px rgba(0, 0, 0, 0.1);
    `;

export const Nav = styled.nav`
    display: flex;
    justify-content: center; // Center the links horizontally
    align-items: center; // Center the links vertically
    padding: 20px;
    background-color: #f5f5f5;
    margin-bottom: 20px;
    `;

export const Title = styled.a`
    font-family: EuclidCircularSemiBold, sans-serif;
    font-size: 1.5em;
    color: #333;
    `;
    
export const Link = styled.a`
color: #000;
text-decoration: none;
margin-left: 20px; // Add some margin to the left of each link

&:first-child {
  margin-left: 0; // Remove the margin from the first link
}
`;