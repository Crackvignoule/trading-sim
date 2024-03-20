import styled from "styled-components";
import { NavLink } from "react-router-dom";

export const NavBarContainer = styled.div`
    display: flex;
    background-color: #202333;
    box-shadow: 0px 0px 10px 0px rgba(0, 0, 0, 0.1);
    `;

export const Nav = styled.nav`
    display: flex;
    justify-content: center; // Center the links horizontally
    align-items: center; // Center the links vertically
    padding: 20px;
    margin-bottom: 20px;
    `;

export const Title = styled(NavLink)`
    font-family: EuclidCircularSemiBold, sans-serif;
    font-size: 1.5em;
    color: #FFF;

    &:hover {
        text-decoration: none;
        color: #f5c631;
      }

    &.active {
      color: #f5c631; // Change to the color you want for the active link
    }
    `;
    
export const Link = styled(Title)`
    font-size: 1em;
    margin-left: 20px;
    `;