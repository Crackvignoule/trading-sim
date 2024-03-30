
import React, {useState } from 'react';
import { BigChart, TradeMenu, UserOrders } from '../../components';
import { MainDiv, TopDiv, BottomDiv, HomeDiv} from './Home.styles';
import { TradedPairProvider } from '../../context/Context';

function Home() {

    return (
      // Seul les composants à l'intérieur de TradedPairProvider on accès au context de TradedPairProvider
      <TradedPairProvider>
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
        </TradedPairProvider>
      );
}

export default Home;
