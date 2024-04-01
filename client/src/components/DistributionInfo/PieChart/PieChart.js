import * as React from "react";
import { PieChart } from "@mui/x-charts/PieChart";

const data = [
  { id: 0, value: 10, label: "series A" },
  { id: 1, value: 15, label: "series B" },
  { id: 2, value: 20, label: "series C" },
];

export default function PieActiveArc() {
  return (
    <PieChart
      series={[
        {
          data,
          highlightScope: { faded: "global", highlighted: "item" },
          faded: { innerRadius: 30, additionalRadius: -30, color: "gray" },
          innerRadius: 120,
          outerRadius: 160,
          cornerRadius: 10,
          paddingAngle: 1,
        },
      ]}
      slotProps={{
        legend: {
          labelStyle: {
            fill: "white",
          },
        },
      }}
      height={310}
    />
  );
}
