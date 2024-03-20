import { Nav, NavBarContainer, Title, Link } from "./NavBar.styles";

function NavBar() {
    return (
        <NavBarContainer>
            <Nav>
                <Title to="/" activeClassName="active">Trading Sim</Title>
                <Link to="/portfolio" activeClassName="active">Portfolio</Link>
                <Link to="/leaderboard" activeClassName="active">Leaderboard</Link>
            </Nav>
        </NavBarContainer>
    );
}

export default NavBar;