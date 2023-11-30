import React from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from "recharts";

function ReportGraph({ dailyTotalCost, dailyServiceFee }) {
  const data = Object.entries(dailyTotalCost)
    .sort(([dateA], [dateB]) => new Date(dateA) - new Date(dateB))
    .map(([date, totalCost]) => ({
      date,
      totalCost: totalCost,
      serviceFee: dailyServiceFee[date] || 0,
    }));


  return (
    <div>
      <h2>กราฟแสดงยอด Total Cost และ Service Fee</h2>
      <BarChart
        width={800}
        height={400}
        data={data}
        margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="date" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Bar dataKey="totalCost" fill="#8884d8" name="Total Cost" />
        <Bar dataKey="serviceFee" fill="#82ca9d" name="Service Fee" />
      </BarChart>
    </div>
  );
}

export default ReportGraph;