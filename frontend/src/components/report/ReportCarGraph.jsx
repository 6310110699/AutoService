import React from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from "recharts";

function ReportCarGraph({ carsWithStartDatePerDay, carsWithoutEndDatePerDay, carsWithEndDatePerDay }) {
  // Extracting dates from the provided data
  const dates = Object.keys(carsWithoutEndDatePerDay).sort((dateA, dateB) => new Date(dateA) - new Date(dateB));

  // Creating an array of objects containing date and corresponding values
  const data = dates.map(date => ({
    date,
    carsWithoutEndDatePerDay: carsWithoutEndDatePerDay[date] || 0,
    carsWithStartDatePerDay: carsWithStartDatePerDay[date] || 0,
    carsWithEndDatePerDay: carsWithEndDatePerDay[date] || 0,
  }));

  return (
    <div>
      <h2>กราฟแสดงยอด</h2>
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
        <Bar dataKey="carsWithStartDatePerDay" fill="#82ca9d" name="carsWithStartDatePerDay" />
        <Bar dataKey="carsWithoutEndDatePerDay" fill="#8884d8" name="carsWithoutEndDatePerDay" />
        <Bar dataKey="carsWithEndDatePerDay" fill="#000000" name="carsWithEndDatePerDay" />
      </BarChart>
    </div>
  );
}

export default ReportCarGraph;