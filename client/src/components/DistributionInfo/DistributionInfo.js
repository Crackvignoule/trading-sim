import React, { useEffect, useRef, useState } from "react";
import { Header, PieChartContainer } from "./DistributionInfo.styles";


function DistributionInfo() {
  return (
    <PieChartContainer>
      <Header>
        <h3>Asset Distribution</h3>
      </Header>
    </PieChartContainer>
  );
}

export default DistributionInfo;