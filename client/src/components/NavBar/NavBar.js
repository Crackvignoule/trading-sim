import { Nav, NavBarContainer, Link, Title } from "./NavBar.styles";

function NavBar() {
    return (
        <NavBarContainer>
            <Nav>
                <Title href="/">Trading Sim</Title>
                <Link href="/portfolio">Portfolio</Link>
                <Link href="/leaderboard">Leaderboard</Link>
            </Nav>
        </NavBarContainer>
    );
}

export default NavBar;