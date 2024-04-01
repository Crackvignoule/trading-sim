
import React, {useState } from 'react';
import { BigChart, TradeMenu, UserOrders } from '../../components';
import { MainDiv, TopDiv, BottomDiv, HomeDiv} from './Home.styles';
import { HomeProvider } from '../../context/Context';

function Home() {

    return (
      // Seul les composants à l'intérieur de TradedPairProvider on accès au context de TradedPairProvider
      <HomeProvider>
          <HomeDiv>
            <MainDiv>
                <TopDiv>
                  <BigChart/>
                  <TradeMenu/>
                </TopDiv>
                <BottomDiv>
                  <UserOrders/>
                </BottomDiv>
            </MainDiv>
          </HomeDiv>
        </HomeProvider>
      );
}

export default Home;
