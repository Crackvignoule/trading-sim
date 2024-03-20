import React, { useState, useEffect } from 'react';
import Chart from '../../components/Chart/Chart';
import NavBar from '../../components/NavBar/NavBar';

function Home() {

    return (
        <div>
          <NavBar />
          <Chart key="unique-chart-key" />
        </div>
      );
}

export default Home;
