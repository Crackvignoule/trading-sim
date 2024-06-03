import React, { useState, useEffect} from "react";
import io from 'socket.io-client';
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
import { useSelector, useDispatch} from 'react-redux';

function NavBar() {
  const [underlineStyle, setUnderlineStyle] = useState({});
  const navigate = useNavigate();
  const [pseudo, setPseudo] = useState("");
  const [logout, setLogout] = useState("Login");
  const [balance, setBalance] = useState(0);
  const isLoggedIn = useSelector(state => state.isLoggedIn.value);
  const dispatch = useDispatch();

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
    const userToken = localStorage.getItem('token');
    if (isLoggedIn || userToken) {
        const socket = io(`ws://${process.env.REACT_APP_SERVER_URL}:8888`);
        
        socket.on('connect', () => {
        console.log('Connexion établie');
        socket.emit('join', 'userSolde', userToken);
        });

        socket.on('dataSolde', (data) => {
          try {
            
            setBalance(data.userSolde);
          } catch (error) {
            console.error('Erreur de parsing des données reçues:', error);
          }
        });

        // Nettoyer en fermant la connexion WebSocket quand le composant se démonte
        return () => {
            socket.close();
        };
    }
  }, [isLoggedIn]);


  useEffect(() => {
    const userToken = localStorage.getItem('token');
    if (isLoggedIn || userToken) {
      getUserSolde().then((result) => {
        if (result.result) {
          setBalance(result.value);
        } else {
          console.log('error');
        }
    });
  }
  }, []);


const getUserSolde = async () => {
  // get user soldes
  const userToken = localStorage.getItem('token');
  try {
    const response = await fetch(`https://${process.env.REACT_APP_SERVER_URL}:5000/api/get-user-solde`, {
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


  useEffect(() => {
    const token = localStorage.getItem('token');
    if(isLoggedIn || token) {
      
      const storedPseudo = localStorage.getItem('pseudo');
        
      if(token !== "") {
          setPseudo(storedPseudo);
          setLogout("Logout");
      } else {
          setLogout("Login");
      }
    }
  }, [isLoggedIn]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("pseudo");
    setPseudo("");
    setLogout("Login");
    dispatch({ type: "SET_ISLOGGEDIN", value: false });
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
