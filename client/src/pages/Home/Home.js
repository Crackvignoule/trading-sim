import React from 'react';
import Chart from '../../components/Chart/Chart';
import { MainDiv, TopDiv, BottomDiv} from './Home.styles';

function Home() {

    return (
        <>
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
