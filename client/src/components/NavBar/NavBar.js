import { Nav, NavBarContainer, Link, List, Line, RightSideDiv, Label, Button, LabelBalance} from "./NavBar.styles";
import {useState, useEffect} from 'react';
import { useNavigate } from 'react-router-dom';

function NavBar() {

    const navigate = useNavigate();
    const [pseudo,setPseudo] = useState('');
    const [logout,setLogout] = useState("Login");

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
                    <Line><Link to="/" activeclassname="active" className={"title"}>Trading Sim</Link></Line>
                    <Line><Link to="/portfolio" activeclassname="active">Portfolio</Link></Line>
                    <Line><Link to="/leaderboard" activeclassname="active">Leaderboard</Link></Line>
                </List>

                    
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