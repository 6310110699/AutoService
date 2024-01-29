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
        width={750}
        height={300}
        data={formattedData}
        margin={{ top: 20, right: 30, left: 0, bottom: 5 }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="date" tick={{ fontSize: 12 }} label={{ value: 'วันที่', position: 'insideBottom', offset: 0, fontSize: 14 }} />
        <YAxis tick={{ fontSize: 12 }} label={{ value: 'จำนวน', angle: -90, position: 'insideLeft', fontSize: 14 }} />
        <Tooltip />
        <Legend />
        <Bar dataKey="data1" name={data1.name} fill={data1.fill} barSize={40} />
        <Bar dataKey="data2" name={data2.name} fill={data2.fill} barSize={40} />
        <Bar dataKey="data3" name={data3.name} fill={data3.fill} barSize={40} />
      </RechartBarChart>
    </div>
  );
}

export default BarChartPerDay;