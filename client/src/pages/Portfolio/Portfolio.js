import { SmallChart, DistributionInfo } from "../../components";
import { Div, Main } from "./Portfolio.styles";
import { OwnedCryptos } from "../../components";

function Portfolio() {
    return (
      <Main>
        <Div>
          <SmallChart />
          <DistributionInfo />
        </Div>
        <OwnedCryptos />
      </Main>
    );
  }
  
  export default Portfolio;