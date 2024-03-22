import React, { useState, useRef, useEffect } from 'react';
import { Nav, NavBarContainer, Link, List, Line, RightSideDiv, Label, Button, LabelBalance, Underline } from "./NavBar.styles";

function NavBar() {
    const [underlineStyle, setUnderlineStyle] = useState({});

    const handleClick = (event) => {
        const { offsetWidth, offsetLeft } = event.target;
        setUnderlineStyle({ width: offsetWidth, left: offsetLeft });
    };

    // with this we can see why it's not working, it's just because setUnderlineStyle needs 2 clicks on the same navlink to get updated instead of 1
    // useEffect(() => {
    //     const title = document.querySelector(".title");
    //     if (title) {
    //         const { offsetWidth, offsetLeft } = title;
    //         setUnderlineStyle({ width: offsetWidth, left: offsetLeft });
    //     }
    // } , []);
    

    return (
        <NavBarContainer>
            <Nav>
                <List>
                    <Line><Link to="/" activeClassName="active" className={"title"} onClick={handleClick}>Trading Sim</Link></Line>
                    <Line><Link to="/portfolio" activeClassName="active" onClick={handleClick}>Portfolio</Link></Line>
                    <Line><Link to="/leaderboard" activeClassName="active" onClick={handleClick}>Leaderboard</Link></Line>
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