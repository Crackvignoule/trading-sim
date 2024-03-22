import React from 'react';
import Chart from '../../components/Chart/Chart';
import NavBar from '../../components/NavBar/NavBar';
import { MainDiv, TopDiv, BottomDiv, HomeDiv} from './Home.styles';

function Home() {

    return (
        <HomeDiv>
        <NavBar />
        <MainDiv>
            <TopDiv>
              <Chart />
            </TopDiv>
            <BottomDiv>
            </BottomDiv>

        </MainDiv>
        </HomeDiv>
      );
}

export default Home;
