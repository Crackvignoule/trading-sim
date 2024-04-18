import React, { useState, useEffect } from "react";
import {
  Nav,
  NavBarContainer,
  Link,
  List,
  Line,
  RightSideDiv,
  Label,
  Button,
  LabelBalance,
  Underline,
} from "./NavBar.styles";
import { useNavigate } from "react-router-dom";

function NavBar() {
  const [underlineStyle, setUnderlineStyle] = useState({});
  const navigate = useNavigate();
  const [pseudo, setPseudo] = useState("");
  const [logout, setLogout] = useState("Login");
  const [balance, setBalance] = useState(0);

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
  }, []);

  useEffect(() => {
    const ws4 = new WebSocket(`ws://${process.env.REACT_APP_SERVER_URL}:8787`);
    const userToken = localStorage.getItem('token');
    ws4.onopen = () => {
        console.log('Connexion WebSocket4 établie');
        // Envoyer le token de l'utilisateur juste après l'établissement de la connexion
        ws4.send(JSON.stringify({ type: 'registration', token: userToken }));
    };

    // Écouter les messages entrants
    ws4.onmessage = (event) => {
      setBalance(JSON.parse(event.data).userSolde);
    
      };

      // Nettoyer en fermant la connexion WebSocket quand le composant se démonte
      return () => {
          ws4.close();
      };
    }, []);


  useEffect(() => {
  const getUserSolde = async () => {
    // get user soldes
    const userToken = localStorage.getItem('token');
    try {
      const response = await fetch(`http://${process.env.REACT_APP_SERVER_URL}:5000/api/get-user-solde`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userToken: userToken }),
      });
      const data = await response.json();
      if (response.status === 200) {
        return { result: true, value: data.amount };
      } else {
        console.log('Échec de la connexion');
        return { result: false };
      }
    } catch (error) {
      console.error('Erreur lors de la connexion', error);
      return { result: false };
    }
  };

  getUserSolde().then((result) => {
    if (result.result) {
      setBalance(result.value);
    } else {
      console.log('error');
    }
  });
}, []);



  useEffect(() => {
      const token = localStorage.getItem('token');
      const storedPseudo = localStorage.getItem('pseudo');
        
      if(token !== "") {
          setPseudo(storedPseudo);
          setLogout("Logout");
      } else {
          setLogout("Login");
      }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("pseudo");
    navigate("/login");
  };

  return (
    <NavBarContainer>
      <Nav>
        <List>
          <Line>
            <Link to="/" className={"title"} onClick={handleClick}>
              Trading Sim
            </Link>
          </Line>
          <Line>
            <Link to="/portfolio" onClick={handleClick}>
              Portfolio
            </Link>
          </Line>
          <Line>
            <Link to="/leaderboard" onClick={handleClick}>
              Leaderboard
            </Link>
          </Line>
        </List>
        <Underline $width={underlineStyle.width} $left={underlineStyle.left} />
        <RightSideDiv>
          <LabelBalance>Balance : {balance} USDT</LabelBalance>
          <Label>{pseudo}</Label>
          <Button onClick={() => handleLogout()}>{logout}</Button>
        </RightSideDiv>
      </Nav>
    </NavBarContainer>
  );
}

export default NavBar;
