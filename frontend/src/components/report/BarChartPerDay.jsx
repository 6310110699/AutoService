import React from "react";
import { BarChart as RechartBarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from "recharts";


function BarChartPerDay({ data1, data2, data3, data4 }) {


  const formattedData = Object.keys(data4).map(date => ({
    date: date.split("-")[2],
    data1: data1[date] || 0,
    data2: data2[date] || 0,
    data3: data3[date] || 0,
  }));


  return (
    <div>
      <RechartBarChart
        width={1100}
        height={500}
        data={formattedData}
        margin={{ top: 20, right: 30, left: 0, bottom: 5 }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="date" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Bar dataKey="data1" name={data1.name} fill={data1.fill} barSize={50}/>
        <Bar dataKey="data2" name={data2.name} fill={data2.fill} barSize={50}/>
        <Bar dataKey="data3" name={data3.name} fill={data3.fill} barSize={50}/>
      </RechartBarChart>
    </div>
  );
}


export default BarChartPerDay;



