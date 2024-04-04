import React from "react";
import { Header, PieChartContainer } from "./DistributionInfo.styles";
import PieChart from "./PieChart/PieChart";

function DistributionInfo() {
  return (
    <PieChartContainer>
      <Header>
        Asset Distribution
      </Header>
      <PieChart />
    </PieChartContainer>
  );
}

export default DistributionInfo;