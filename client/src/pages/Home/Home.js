import React from 'react';
import { BigChart } from '../../components';
import { MainDiv, TopDiv, BottomDiv, HomeDiv} from './Home.styles';

function Home() {

    return (
        <HomeDiv>
          <MainDiv>
              <TopDiv>
                <BigChart />
              </TopDiv>
              <BottomDiv>
              </BottomDiv>

          </MainDiv>
        </HomeDiv>
      );
}

export default Home;
