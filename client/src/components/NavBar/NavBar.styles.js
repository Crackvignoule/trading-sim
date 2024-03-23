import styled from "styled-components";
import { NavLink } from "react-router-dom";
import { COLORS } from "../../styles/GlobalStyles";

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
  color: ${COLORS.text};
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

  &.active {
    color: ${COLORS.special};
  }
`;

export const List = styled.ul`
  position: relative;
  margin: 0px;
  padding: 0px;
  text-align: center;
`;
export const Line = styled.li`
  display: inline-block;
`;

export const NavBarContainer = styled.div`
  width: 100%;
  background: ${COLORS.navbar};
  box-shadow: 0px 0px 10px 0px rgba(0, 0, 0, 0.5);
  margin: 0px;
`;

export const Label = styled.label`
  margin-right: 10px;
  font-size: 0.9em;
  color: ${COLORS.text};
`;

export const LabelBalance = styled(Label)`
  font-size: 1em;
  margin-right: 15vw;
`;

export const Underline = styled.div`
  position: absolute;
  height: 2px;
  top: 4em;
  width: ${props => props.$width}px;
  left: ${props => props.$left}px;
  background: ${COLORS.special}; // Change color as needed
  transition: left 0.3s ease, width 0.3s ease;
`;

export const Button = styled.button`
  background-color: ${COLORS.special};
  font-weight: Bold;
  font-size: 0.9em;
  border-radius: 5px;
  width: 5em;
  height: 2em;
  border: 0px;
`;

export const RightSideDiv = styled.div`
  margin-right: 10px;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;
