import { Nav, NavBarContainer, Title, Link } from "./NavBar.styles";

function NavBar() {
    return (
        <NavBarContainer>
            <Nav>
                <Title to="/" activeclassname="active">Trading Sim</Title>
                <Link to="/portfolio" activeclassname="active">Portfolio</Link>
                <Link to="/leaderboard" activeclassname="active">Leaderboard</Link>
            </Nav>
        </NavBarContainer>
    );
}

export default NavBar;