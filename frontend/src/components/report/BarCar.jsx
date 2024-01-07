import React from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, } from "recharts";


function LineChartComponent({ carsWithStartDate, carsWithEndDate, carsWithOutEndDate, }) {
    const dates = Object.keys(carsWithOutEndDate).sort(
        (dateA, dateB) => new Date(dateA) - new Date(dateB)
    );


    const data = dates.map((date) => ({
        date: date.split("-")[2],
        carsWithStartDate: carsWithStartDate[date] || 0,
        carsWithEndDate: carsWithEndDate[date] || 0,
        carsWithOutEndDate: carsWithOutEndDate[date] || 0,
    }));


    // const maxCount = Math.max(
    //   ...data.map((item) =>
    //     Math.max(
    //       item.carsWithStartDate,
    //       item.carsWithEndDate,
    //       item.carsWithOutEndDate
    //     )
    //   )
    // );


    // const yAxisDomain = [0, Math.ceil(maxCount / 5) * 5]; // Set domain to be multiple of 5


    // const yAxisTicks = [];
    // for (let i = 0; i <= yAxisDomain[1]; i += 1) {
    //   yAxisTicks.push(i);
    // }


    return (
        <div>
            <h2>กราฟแสดงยอด</h2>
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
                    dataKey="carsWithStartDate"
                    stroke="#688f4e"
                    name="รถที่รับเข้ามา"
                />
                <Line
                    type="monotone"
                    dataKey="carsWithEndDate"
                    stroke="#17395c"
                    name="รถที่ส่งออก"
                />
                <Line
                    type="monotone"
                    dataKey="carsWithOutEndDate"
                    stroke="#d7a421"
                    name="รถที่ยังอยู่ในอู่"
                />
            </LineChart>
        </div>
    );
}


export default LineChartComponent;


// import React from "react";
// import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from "recharts";


// function BarMonthPerDay({ carsWithStartDate, carsWithEndDate, carsWithOutEndDate }) {
//   // Extracting dates from the provided data
//   const dates = Object.keys(carsWithOutEndDate).sort((dateA, dateB) => new Date(dateA) - new Date(dateB));


//   // Creating an array of objects containing date and corresponding values
//   const data = dates.map(date => ({
//     date,
//     carsWithStartDate: carsWithStartDate[date] || 0,
//     carsWithEndDate: carsWithEndDate[date] || 0,
//     carsWithOutEndDate: carsWithOutEndDate[date] || 0,
//   }));


//   return (
//     <div>
//       <h2>กราฟแสดงยอด</h2>
//       <BarChart
//         width={1100}
//         height={500}
//         data={data}
//         margin={{ top: 20, right: 30, left: 0, bottom: 5 }}
//       >
//         <CartesianGrid strokeDasharray="3 3" />
//         <XAxis dataKey="date" />
//         <YAxis />
//         <Tooltip />
//         <Legend />
//         <Bar dataKey="carsWithStartDate" fill="#688f4e" name="รถที่รับเข้ามา" />
//         <Bar dataKey="carsWithEndDate" fill="#17395c" name="รถที่ส่งออก" />
//         <Bar dataKey="carsWithOutEndDate" fill="#d7a421" name="รถที่ยังอยู่ในอู่" />
//       </BarChart>
//     </div>
//   );
// }


// export default BarMonthPerDay;



