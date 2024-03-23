import React, { useState, useEffect } from 'react';
import { Nav, NavBarContainer, Link, List, Line, RightSideDiv, Label, Button, LabelBalance, Underline } from "./NavBar.styles";
import { useNavigate } from 'react-router-dom';

function NavBar() {
  
  const [underlineStyle, setUnderlineStyle] = useState({});
  const navigate = useNavigate();
  const [pseudo,setPseudo] = useState('');
  const [logout,setLogout] = useState("Login");
  
  const handleClick = (event) => {
      const { offsetWidth, offsetLeft } = event.target;
      setUnderlineStyle({ width: offsetWidth, left: offsetLeft });
    };

  useEffect(() => {
      const activeLink = document.querySelector(".active");
      if (activeLink) {
        const { offsetWidth, offsetLeft } = activeLink;
        setUnderlineStyle({ width: offsetWidth, left: offsetLeft });
      }
  } , []);

    

  useEffect(() => {
      const token = localStorage.getItem('token');
      const storedPseudo = localStorage.getItem('pseudo');
        
      if(token) {
          setPseudo(storedPseudo);
          setLogout("Logout");
      } else {
          setLogout("Login");
      }
  }, []);

  const handleLogout = () => {
      localStorage.removeItem('token');
      localStorage.removeItem('pseudo');
      navigate('/login');
  };

    return (
        <NavBarContainer>
            <Nav>
                <List>
                    <Line><Link to="/" className={"title"} onClick={handleClick}>Trading Sim</Link></Line>
                    <Line><Link to="/portfolio" onClick={handleClick}>Portfolio</Link></Line>
                    <Line><Link to="/leaderboard" onClick={handleClick}>Leaderboard</Link></Line>
                </List>
                <Underline $width={underlineStyle.width} $left={underlineStyle.left} />
                <RightSideDiv>
                    <LabelBalance>Balance : 14524 USDT</LabelBalance>
                    <Label>{pseudo}</Label>
                    <Button onClick={() => handleLogout()}>{logout}</Button>
                </RightSideDiv>
            </Nav>
        </NavBarContainer>
    );
}

export default NavBar;