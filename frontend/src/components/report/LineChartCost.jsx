import React from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, } from "recharts";

function LineChartComponent({ TotalCost, TotalSpare, TotalFee, carsWithOutEndDate }) {
    const dates = Object.keys(carsWithOutEndDate).sort(
        (dateA, dateB) => new Date(dateA) - new Date(dateB)
    );

    const data = dates.map((date) => ({
        date: date.split("-")[2],
        TotalCost: TotalCost[date] || 0,
        TotalSpare: TotalSpare[date] || 0,
        TotalFee: TotalFee[date] || 0,
    }));

    return (
        <div>
            <LineChart
                width={1100}
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
                    dataKey="TotalCost"
                    stroke="#688f4e"
                    strokeWidth={2}
                    name="รายได้ทั้งหมด"
                />
                <Line
                    type="monotone"
                    dataKey="TotalSpare"
                    stroke="#ac1c1b"
                    strokeWidth={2}


                    name="ค่าอะไหล่"
                />
                <Line
                    type="monotone"
                    dataKey="TotalFee"
                    stroke="#17395c"
                    strokeWidth={2}
                    name="ค่าบริการ"
                />
            </LineChart>
        </div>
    );
}

export default LineChartComponent;