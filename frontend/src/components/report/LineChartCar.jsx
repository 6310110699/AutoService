import React from "react";
import {  LineChart,  Line,  XAxis,  YAxis,  CartesianGrid,  Tooltip,  Legend,} from "recharts";


function LineChartComponent({  carsWithStartDate,  carsWithEndDate,  carsWithOutEndDate,}) {
  const dates = Object.keys(carsWithOutEndDate).sort(
    (dateA, dateB) => new Date(dateA) - new Date(dateB)
  );


  const data = dates.map((date) => ({
    date: date.split("-")[2],
    carsWithStartDate: carsWithStartDate[date] || 0,
    carsWithEndDate: carsWithEndDate[date] || 0,
    carsWithOutEndDate: carsWithOutEndDate[date] || 0,
  }));


 
  return (
    <div>
      <LineChart
        width={1120}
        height={500}
        data={data}
        margin={{ top: 20, right: 30, left: 0, bottom: 5 }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="date" />
        <YAxis />


        <Tooltip />
        <Legend />
        <Line
          type="monotone"
          dataKey="carsWithStartDate"
          stroke="#ec407a"
          strokeWidth={2}
          name="รถที่รับเข้ามา"
        />
        <Line
          type="monotone"
          dataKey="carsWithEndDate"
          stroke="#29b6f6"
          strokeWidth={2}
          name="รถที่ส่งออก"
        />
        <Line
          type="monotone"
          dataKey="carsWithOutEndDate"
          stroke="#d7a421"
          strokeWidth={2}
          name="รถที่ยังอยู่ในอู่"
        />
      </LineChart>
    </div>
  );
}


export default LineChartComponent;

