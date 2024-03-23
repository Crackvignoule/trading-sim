import React from 'react';
import Chart from '../../components/Chart/Chart';
import { MainDiv, TopDiv, BottomDiv, HomeDiv} from './Home.styles';

function Home() {

    return (
        <HomeDiv>
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
