import React from "react";
import {
  BarChart as RechartBarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";
import moment from 'moment';


function BarChartPerMonth({ data1, data2, data3, allMonths }) {


  const data = allMonths.map((date) => ({
    month: moment(date).format("MMM"),
    data1: data1.data[date] || 0,
    data2: data2.data[date] || 0,
    data3: data3.data[date] || 0,
  }));


  return (
    <div>
      <RechartBarChart
        width={1120}
        height={500}
        data={data}
        margin={{ top: 20, right: 30, left: 0, bottom: 5 }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="month" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Bar dataKey="data1" name={data1.name} fill={data1.fill} barSize={30}/>
        <Bar dataKey="data2" name={data2.name} fill={data2.fill} barSize={30}/>
        <Bar dataKey="data3" name={data3.name} fill={data3.fill} barSize={30}/>
      </RechartBarChart>
    </div>
  );
}


export default BarChartPerMonth;