import React from "react";
import { PieChart, Pie, Tooltip, Cell, Legend } from "recharts";


const DonutChartComponent = ({ data }) => {
  return (
    <PieChart width={450} height={400}>
      <Pie
        data={data}
        cx={200}
        cy={200}
        innerRadius={40}
        outerRadius={160}
        fill="#8884d8"
        paddingAngle={2}
        dataKey="value"
        label={{
          fontSize: 20,
          position: "outside",
          offset: -100,
          formatter: (value) => `${value}`,
        }}
      >
        {data.map((entry, index) => (
          <Cell key={`cell-${index}`} fill={entry.color} />
        ))}
      </Pie>
      <Tooltip />
    </PieChart>
  );
};


export default DonutChartComponent;



