import styled from "styled-components";
import { NavLink } from "react-router-dom";

const specialColor = `#f5c631`;

export const Nav = styled.nav`
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0px;
    margin-bottom: 0px;
    height: 4em;
    `;

  export const Link = styled(NavLink)`
    font-family: EuclidCircularSemiBold, sans-serif;
    font-size: 1em;
    margin-left: 20px;
    color: #FFF;
    text-decoration: none;
    width: 7em;
    display: inline-block;
    text-align: center;
    padding: 20px 0;
    font-weight: 500;
    position: relative;

    &.title {
      font-size: 1.3em;
    }

    &:hover {
      text-decoration: none;
      color:${specialColor};
    }

    &.active {
      color:${specialColor};
    }
    &::before {
      background: ${specialColor} none repeat scroll 0 0;
      bottom: -2px;
      content: "";
      height: 2px;
      left: 0;
      position: absolute;
      width: 0%;
      transition: 0.5s;
    }
    &:hover::before {
      width: 100%;
    }
    &.active::before {
      width: 100%;
    }
    `;

export const List = styled.ul`
margin: 0px;
padding: 0px;
text-align: center;
`;
export const Line = styled.li`
display: inline-block;
`;

export const NavBarContainer = styled.div`
    width: 100%;
    background: #202333;
    box-shadow: 0px 0px 10px 0px rgba(0, 0, 0, 0.5);
    margin: 0px;

`;

export const Label = styled.label`
    margin-right:10px;
    font-size: 0.9em;
    color:#FFFFFF;

`;
export const LabelBalance = styled(Label)`
    font-size:1em;
    margin-right:15em;

`;
export const Button = styled.button`
    Background-color:${specialColor};
    font-weight: Bold;
    font-size: 0.9em;
    border-radius:5px;
    width: 5em;
    height:2em;
    border:0px;
`;
export const RightSideDiv = styled.div`
    margin-right:10px;
    display:flex;
    justify-content: space-between;
    align-items: center;
`;

    
