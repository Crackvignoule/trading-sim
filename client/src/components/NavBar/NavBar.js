import { Nav, NavBarContainer, Link, List, Line, RightSideDiv, Label, Button} from "./NavBar.styles";

function NavBar() {
    return (
        <NavBarContainer>
            <Nav>
                <List>
                <Line><Link to="/" activeclassname="active">Trading Sim</Link></Line>
                <Line><Link to="/portfolio" activeclassname="active">Portfolio</Link></Line>
                <Line><Link to="/leaderboard" activeclassname="active">Leaderboard</Link></Line>
                </List>
                <Label></Label>
                <RightSideDiv>
                    <Label>User9148</Label>
                    <Button>Logout</Button>
                </RightSideDiv>
                
            </Nav>
        </NavBarContainer>
    );
}

export default NavBar;