import React from 'react';
import Chart from '../../components/Chart/Chart';
import NavBar from '../../components/NavBar/NavBar';
import { MainDiv } from './Home.styles';

function Home() {

    return (
        <>
        <NavBar />
        <MainDiv>
          <Chart />
        </MainDiv>
        </>
      );
}

export default Home;
