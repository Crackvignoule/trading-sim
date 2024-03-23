import React, { useState, useEffect } from 'react';
import { Nav, NavBarContainer, Link, List, Line, RightSideDiv, Label, Button, LabelBalance, Underline } from "./NavBar.styles";

function NavBar() {
    const [underlineStyle, setUnderlineStyle] = useState({});

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
                    <Label>User9148</Label>
                    <Button>Logout</Button>
                </RightSideDiv>
            </Nav>
        </NavBarContainer>
    );
}

export default NavBar;