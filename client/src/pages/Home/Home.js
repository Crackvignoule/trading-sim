import React from 'react';
import Chart from '../../components/Chart/Chart';
import NavBar from '../../components/NavBar/NavBar';
import { MainDiv, TopDiv, BottomDiv} from './Home.styles';

function Home() {

    return (
        <>
        <NavBar />
        <MainDiv>
            <TopDiv>
              <Chart />
            </TopDiv>
            <BottomDiv>
            </BottomDiv>

        </MainDiv>
        </>
      );
}

export default Home;
