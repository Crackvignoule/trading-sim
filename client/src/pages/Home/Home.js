
import React, {useState } from 'react';
import { BigChart, TradeMenu, UserOrders, AllOrders } from '../../components';
import { MainDiv, TopDiv, BottomDiv, HomeDiv} from './Home.styles';
import NotifyToast from '../../components/NotifyToast/NotifyToast';
function Home() {

    return (
          <HomeDiv>
            <NotifyToast/>
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
