import React, { useState } from 'react';
import { Nav, NavBarContainer, Link, List, Line, RightSideDiv, Label, Button, LabelBalance, Underline } from "./NavBar.styles";

function NavBar() {
    const [underlineStyle, setUnderlineStyle] = useState({});

    const handleClick = (event) => {
        const link = event.currentTarget;
        setUnderlineStyle({
            width: link.offsetWidth,
            left: link.offsetLeft,
        });
        console.log(link.offsetWidth);
        console.log(link.offsetLeft);
        console.log(underlineStyle);
    };

    return (
        <NavBarContainer>
            <Nav>
                <List>
                    <Line><Link to="/" activeclassname="active" className={"title"} onClick={handleClick}>Trading Sim</Link></Line>
                    <Line><Link to="/portfolio" activeclassname="active" onClick={handleClick}>Portfolio</Link></Line>
                    <Line><Link to="/leaderboard" activeclassname="active" onClick={handleClick}>Leaderboard</Link></Line>
                    <Underline width={underlineStyle.width} left={underlineStyle.left} />
                </List>

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