
import React, {useState } from 'react';
import { BigChart, TradeMenu, UserOrders, AllOrders } from '../../components';
import { MainDiv, TopDiv, BottomDiv, HomeDiv} from './Home.styles';

function Home() {

    return (
          <HomeDiv>
            <MainDiv>
                <TopDiv>
                  <AllOrders/>
                  <BigChart/>
                  <TradeMenu/>
                </TopDiv>
                <BottomDiv>
                  <UserOrders/>
                </BottomDiv>
            </MainDiv>
          </HomeDiv>
      );
}

export default Home;
