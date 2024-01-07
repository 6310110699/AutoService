import React from "react";
import { PieChart, Pie, Tooltip, Cell, Legend } from "recharts";


const DonutChartComponent = ({ data }) => {
    const COLORS = ["#688f4e", "#17395c", "#d7a421", "#FF8042", "#AF19FF"]; // เพิ่มสีตามที่ต้องการ


    return (
        <PieChart width={500} height={500}>
            <Pie
                data={data}
                cx={200}
                cy={200}
                innerRadius={50}
                outerRadius={170}
                fill="#8884d8"
                paddingAngle={2}
                dataKey="value"
                label={{
                    // fill: 'white',
                    fontSize: 20,
                    position: 'outside',
                    offset: -100, // ปรับตำแหน่ง label โดยใช้ offset
                    formatter: (value) => `${value}`, // กำหนดรูปแบบการแสดงค่า value
                }} // เพิ่ม label แสดงค่าในแต่ละช่วงของ pie chart
            >
                {data.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
            </Pie>
            <Tooltip />
            <Legend />
        </PieChart>
    );
};


export default DonutChartComponent;



