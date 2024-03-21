import React, { useState, useEffect } from 'react';
import Chart from '../../components/Chart/Chart';
import ChartOptions from '../../components/Chart/ToolBarChart/ToolBarOptions';
import NavBar from '../../components/NavBar/NavBar';

function Home() {

    return (
        <div>
          <NavBar />
          <Chart/>
          <ChartOptions/>
        </div>
      );
}

export default Home;
