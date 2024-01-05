import React, { useState, useEffect } from "react";
import axios from "axios";
import "./Report.scss";
import ReportGraph from "./ReportGraph";
import ReportCarGraph from "./ReportCarGraph";

function Report() {
  const [customers, setCustomers] = useState([]);
  const [services, setServices] = useState([]);
  const [mechanics, setMechanics] = useState([]);
  const [showServiceDetailsByType, setShowServiceDetailsByType] = useState({});
  const [showServiceDetailsByMechanic, setShowServiceDetailsByMechanic] =
    useState({});
  const [dailyTotalCost, setDailyTotalCost] = useState({});
  const [dailyServiceFee, setDailyServiceFee] = useState({});
  const [startPerDay, setStartPerDay] = useState({});

  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [searchServiceResults, setSearchServiceResults] = useState([]);
  const [allCustomersFiltered, setAllCustomersFiltered] = useState([]);
  const [carsWithoutEndDatePerDay, setCarsWithoutEndDatePerDay] = useState({});
  const [allCustomers, setAllCustomers] = useState([]);
  const [searchResultAll, setSearchResultAll] = useState([]);

  useEffect(() => {
    loadCustomers();
    loadServices();
    loadMechanics();
  }, []);
  useEffect(() => {
    toggleShowAll();
  }, [customers]);

  const loadCustomers = async () => {
    try {
      const response = await axios.get("http://localhost:3001/repairs");
      setCustomers(response.data);
      setAllCustomersFiltered(
        response.data.filter((customer) => customer.status.state5)
      );
      setAllCustomers(
        response.data.filter((customer) => customer.status.state1)
      );
    } catch (error) {
      console.error("Error loading customer data:", error);
    }
  };

  const loadServices = async () => {
    try {
      const response = await axios.get("http://localhost:3001/services");
      setServices(response.data);
    } catch (error) {
      console.error("Error loading services:", error);
    }
  };

  const loadMechanics = async () => {
    try {
      const response = await axios.get("http://localhost:3001/employees");
      setMechanics(response.data);
    } catch (error) {
      console.error("Error loading mechanics:", error);
    }
  };
  const handleDailyClick = () => {
    const today = new Date();

    setStartDate(
      `${today.getFullYear()}-${(today.getMonth() + 1)
        .toString()
        .padStart(2, "0")}-${today.getDate().toString().padStart(2, "0")}`
    );

    setEndDate(
      `${today.getFullYear()}-${(today.getMonth() + 1)
        .toString()
        .padStart(2, "0")}-${today.getDate().toString().padStart(2, "0")}`
    );
  };

  const handleWeeklyClick = () => {
    const today = new Date();
    const saturday = new Date(today);
    saturday.setDate(today.getDate() - ((today.getDay() + 1) % 7));

    const thursday = new Date(saturday);
    thursday.setDate(saturday.getDate() + ((today.getDay() + 1) % 7));

    setStartDate(
      `${saturday.getFullYear()}-${(saturday.getMonth() + 1)
        .toString()
        .padStart(2, "0")}-${saturday.getDate().toString().padStart(2, "0")}`
    );

    setEndDate(
      `${thursday.getFullYear()}-${(thursday.getMonth() + 1)
        .toString()
        .padStart(2, "0")}-${thursday.getDate().toString().padStart(2, "0")}`
    );
  };

  const handleMonthlyClick = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = today.getMonth();
    const firstDayOfMonth = new Date(year, month, 1);
    const lastDayOfMonth = new Date(year, month + 1, 0);

    setStartDate(
      `${firstDayOfMonth.getFullYear()}-${(firstDayOfMonth.getMonth() + 1)
        .toString()
        .padStart(2, "0")}-${firstDayOfMonth
        .getDate()
        .toString()
        .padStart(2, "0")}`
    );

    setEndDate(
      `${lastDayOfMonth.getFullYear()}-${(lastDayOfMonth.getMonth() + 1)
        .toString()
        .padStart(2, "0")}-${lastDayOfMonth
        .getDate()
        .toString()
        .padStart(2, "0")}`
    );
  };

  const handleYearlyClick = () => {
    const today = new Date();
    const year = today.getFullYear();
    const firstDayOfYear = new Date(year, 0, 1);
    const lastDayOfYear = new Date(year, 11, 31);

    setStartDate(
      `${firstDayOfYear.getFullYear()}-${(firstDayOfYear.getMonth() + 1)
        .toString()
        .padStart(2, "0")}-${firstDayOfYear
        .getDate()
        .toString()
        .padStart(2, "0")}`
    );

    setEndDate(
      `${lastDayOfYear.getFullYear()}-${(lastDayOfYear.getMonth() + 1)
        .toString()
        .padStart(2, "0")}-${lastDayOfYear
        .getDate()
        .toString()
        .padStart(2, "0")}`
    );
  };

  const countCarsWithStartDatePerDay = () => {
    const startDateObject = new Date(`${startDate}T00:00:00`);
    const endDateObject = new Date(`${endDate}T23:59:59`);

    const carsWithStartDatePerDay = {};
    searchResultAll.forEach((customer) => {
      const customerStartDate = new Date(customer.startdate);
      if (
        customerStartDate >= startDateObject &&
        customerStartDate <= endDateObject
      ) {
        const dateString = customerStartDate.toISOString().split("T")[0];
        if (carsWithStartDatePerDay[dateString]) {
          carsWithStartDatePerDay[dateString]++;
        } else {
          carsWithStartDatePerDay[dateString] = 1;
        }
      }
    });

    return carsWithStartDatePerDay;
  };

  const carsWithStartDatePerDay = countCarsWithStartDatePerDay();
  const sumCarsWithStartDatePerDay = Object.values(
    carsWithStartDatePerDay
  ).reduce((sum, count) => sum + count, 0);

  console.log("carsWithStartDatePerDay:", carsWithStartDatePerDay);
  console.log("sumCarsWithStartDatePerDay:", sumCarsWithStartDatePerDay);

  const countCarsWithOutEndDatePerDay = () => {
    const startDateObject = new Date(`${startDate}T00:00:00`);
    const endDateObject = new Date(`${endDate}T23:59:59`);

    startDateObject.setDate(startDateObject.getDate() + 1);

    endDateObject.setDate(endDateObject.getDate() + 1);

    const carsWithOutEndDatePerDay = {};

    let currentDate = new Date(startDateObject);
    while (currentDate <= endDateObject) {
      const dateString = currentDate.toISOString().split("T")[0];

      const count = searchResultAll.reduce((accumulator, customer) => {
        const customerStartDate = new Date(customer.startdate);
        const customerEndDate = customer.enddate
          ? new Date(customer.enddate)
          : null;

        if (
          customerStartDate.getTime() <= currentDate.getTime() &&
          (!customerEndDate ||
            customerEndDate.getTime() > currentDate.getTime())
        ) {
          return accumulator + 1;
        }
        return accumulator;
      }, 0);

      carsWithOutEndDatePerDay[dateString] = count;

      currentDate.setDate(currentDate.getDate() + 1);

      if (currentDate > endDateObject) {
        break;
      }
    }

    return carsWithOutEndDatePerDay;
  };

  const carsWithOutEndDatePerDay = countCarsWithOutEndDatePerDay();
  console.log(
    "Cars with start date but no end date per day:",
    carsWithOutEndDatePerDay
  );
  const countCarsWithoutEndDate = () => {
    const endDateObject = new Date(`${endDate}T23:59:59`);

    const filteredCars = customers.filter((customer) => {
      const customerEndDate = new Date(customer.enddate);
      return !customer.enddate || customerEndDate >= endDateObject;
    });

    return filteredCars.length;
  };
  const countCarsWithoutEndDateAtEndDate = countCarsWithoutEndDate();

  console.log(
    "จำนวนรถที่ไม่มีข้อมูล enddate ในวันที่ endDateSelect:",
    countCarsWithoutEndDateAtEndDate
  );

  const countCarsWithEndDatePerDay = () => {
    const startDateObject = new Date(`${startDate}T00:00:00`);
    const endDateObject = new Date(`${endDate}T23:59:59`);

    const carsWithEndDatePerDay = {};
    searchResults.forEach((customer) => {
      const customerEndDate = new Date(customer.enddate);
      if (
        customerEndDate >= startDateObject &&
        customerEndDate <= endDateObject
      ) {
        const dateString = customerEndDate.toISOString().split("T")[0];
        if (carsWithEndDatePerDay[dateString]) {
          carsWithEndDatePerDay[dateString]++;
        } else {
          carsWithEndDatePerDay[dateString] = 1;
        }
      }
    });

    return carsWithEndDatePerDay;
  };

  const carsWithEndDatePerDay = countCarsWithEndDatePerDay();
  const sumCarsWithEndDatePerDay = Object.values(carsWithEndDatePerDay).reduce(
    (sum, count) => sum + count,
    0
  );

  console.log("carsWithEndDatePerDay:", carsWithEndDatePerDay);
  console.log("sumCarsWithEndDatePerDay:", sumCarsWithEndDatePerDay);

  const getServiceNameById = (serviceId) => {
    const matchedService = services.find(
      (service) => service.serviceName === serviceId
    );
    return matchedService ? matchedService.serviceName : "ไม่พบบริการ";
  };

  const countServicesByMechanic = (mechanicId) => {
    const mechanicCustomers = searchResults.filter((customer) =>
      customer.mechanics.includes(mechanicId)
    );
    const serviceCounts = {};

    mechanicCustomers.forEach((customer) => {
      customer.services.forEach((service) => {
        const serviceName = getServiceNameById(service.serviceName);
        if (serviceCounts[serviceName]) {
          serviceCounts[serviceName]++;
        } else {
          serviceCounts[serviceName] = 1;
        }
      });
    });

    return serviceCounts;
  };

  const getServiceCountsByCarModel = (mechanicId, serviceName) => {
    const mechanicCustomers = searchResults.filter((customer) =>
      customer.mechanics.includes(mechanicId)
    );
    const carModelCounts = {};

    mechanicCustomers.forEach((customer) => {
      customer.services.forEach((service) => {
        const serviceInfo = getServiceNameById(service.serviceName);
        const carInfo = `${customer.car.brand} ${customer.car.selectedModel}`;
        if (serviceInfo === serviceName) {
          if (carModelCounts[carInfo]) {
            carModelCounts[carInfo]++;
          } else {
            carModelCounts[carInfo] = 1;
          }
        }
      });
    });

    return carModelCounts;
  };

  const getServiceCountsCarModel = (serviceName) => {
    const carModelCounts = {};

    searchServiceResults.forEach((customer) => {
      customer.services.forEach((service) => {
        const serviceInfo = getServiceNameById(service.serviceName);
        const carInfo = `${customer.car.brand} ${customer.car.selectedModel}`;
        if (serviceInfo === serviceName) {
          if (carModelCounts[carInfo]) {
            carModelCounts[carInfo]++;
          } else {
            carModelCounts[carInfo] = 1;
          }
        }
      });
    });

    return carModelCounts;
  };
  
  const countServicesByType = () => {
    const serviceCounts = {};

    searchServiceResults.forEach((customer) => {
      customer.services.forEach((service) => {
        const serviceName = getServiceNameById(service.serviceName);
        if (serviceCounts[serviceName]) {
          serviceCounts[serviceName].count++;
          const carModel = `${customer.car.brand} ${customer.car.selectedModel}`;
          if (!serviceCounts[serviceName].carModels.includes(carModel)) {
            serviceCounts[serviceName].carModels.push(carModel);
          }
        } else {
          serviceCounts[serviceName] = {
            count: 1,
            carModels: [`${customer.car.brand} ${customer.car.selectedModel}`],
          };
        }
      });
    });

    return serviceCounts;
  };

  const toggleServiceDetailsByType = (serviceName) => {
    setShowServiceDetailsByType((prevDetails) => ({
      ...prevDetails,
      [serviceName]: !prevDetails[serviceName],
    }));
  };

  const toggleServiceDetailsByMechanic = (mechanicId, serviceName) => {
    setShowServiceDetailsByMechanic((prevDetails) => ({
      ...prevDetails,
      [mechanicId]: {
        ...prevDetails[mechanicId],
        [serviceName]: !prevDetails[mechanicId]?.[serviceName],
      },
    }));
  };


  const filterAndSortCustomers = () => {
    const startDateObject = new Date(`${startDate}T00:00:00`);
    const endDateObject = new Date(`${endDate}T23:59:59`);

    const filteredAndSortedCustomers = customers.filter((customer) => {
      const customerEndDate = new Date(customer.enddate);
      return (
        customerEndDate >= startDateObject &&
        customerEndDate <= endDateObject &&
        customer.status.state5
      );
    });

    // setSearchResults(filteredAndSortedCustomers);
    // setSearchServiceResults(filteredAndSortedCustomers);

    const dailyTotalCost = filteredAndSortedCustomers.reduce(
      (accumulator, customer) => {
        const customerEndDate = new Date(customer.enddate);
        const dateKey = customerEndDate.toISOString().split("T")[0]; // ใช้วันที่เป็น key ในการรวมยอด totalCost

        if (!accumulator[dateKey]) {
          accumulator[dateKey] = 0;
        }

        if (customer.totalCost) {
          accumulator[dateKey] += customer.totalCost;
        }

        return accumulator;
      },
      {}
    );

    setDailyTotalCost(dailyTotalCost);

    const dailyServiceFee = filteredAndSortedCustomers.reduce(
      (accumulator, customer) => {
        const customerEndDate = new Date(customer.enddate);
        const dateKey = customerEndDate.toISOString().split("T")[0]; // ใช้วันที่เป็น key ในการรวบรวมยอด servicefee

        if (!accumulator[dateKey]) {
          accumulator[dateKey] = 0;
        }

        if (customer.serviceFee) {
          accumulator[dateKey] += customer.serviceFee;
        }

        return accumulator;
      },
      {}
    );

    setDailyServiceFee(dailyServiceFee);
  };


  const sumTotalCost = Object.values(dailyTotalCost).reduce(
    (accumulator, currentValue) => accumulator + currentValue,
    0
  );
  const sumServiceFee = Object.values(dailyServiceFee).reduce(
    (accumulator, currentValue) => accumulator + currentValue,
    0
  );

  const toggleShowAll = () => {
    setStartDate("");
    setEndDate("");
    setSearchResults(allCustomersFiltered);
    setSearchResultAll(allCustomers);

    setSearchServiceResults(allCustomersFiltered);
  };



  return (
    <div className="report">
      <div className="report-head-container">
        <div className="report-head">รายงานสรุป</div>
      </div>
      <div className="report-filter">
        <div className="report-daily" onClick={handleDailyClick}>
          DAILY
        </div>
        <div className="report-weekly" onClick={handleWeeklyClick}>
          WEEKLY
        </div>
        <div className="report-monthly" onClick={handleMonthlyClick}>
          MONTHLY
        </div>
        <div className="report-yearly" onClick={handleYearlyClick}>
          YEARLY
        </div>
      </div>

      <div className="report-filter1">
        <label htmlFor="startDateSelect">เลือกวันเริ่มต้น: </label>
        <input
          type="date"
          id="startDateSelect"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
        />
        <label htmlFor="endDateSelect">เลือกวันสิ้นสุด: </label>
        <input
          type="date"
          id="endDateSelect"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
        />
        <div className="report-filterbutton" onClick={filterAndSortCustomers}>
          ยืนยัน
        </div>
        <div className="report-filterbutton" onClick={toggleShowAll}>
          แสดงทั้งหมด
        </div>
      </div>

      <div>
        <ReportCarGraph
          carsWithStartDatePerDay={carsWithStartDatePerDay}
          carsWithoutEndDatePerDay={carsWithOutEndDatePerDay}
          carsWithEndDatePerDay={carsWithEndDatePerDay}
        />
      </div>

      <div className="reportsumtotalcost">
        ยอดรวมรถที่รับเข้ามา: {sumCarsWithStartDatePerDay}
      </div>
      <div className="reportsumservicefee">
        รถที่ยังอยู่ในอู่: {countCarsWithoutEndDateAtEndDate}
      </div>
      <div className="reportsumtotalcost">
        ยอดรวมรถที่รับเข้ามา: {sumCarsWithEndDatePerDay}
      </div>

      <div className="reportrepair-head">สรุปรายได้</div>

      <div className="daily-total-cost">
        <ReportGraph
          dailyTotalCost={dailyTotalCost}
          dailyServiceFee={dailyServiceFee}
        />
      </div>

      <div className="reportsumtotalcost">Sum Total Cost: {sumTotalCost}</div>
      <div className="reportsumservicefee">Sum ServiceFee: {sumServiceFee}</div>

      <div className="reportrepair-head">สรุปรายการซ่อม</div>

      <div className="reportrepair-table-container">
        <table className="reportrepair-table">
          <thead>
            <tr>
              <th>รายการซ่อม</th>
              <th>จำนวน</th>
            </tr>
          </thead>
          <tbody>
            {Object.entries(countServicesByType()).map(
              ([serviceName, serviceInfo]) => (
                <React.Fragment key={serviceName}>
                  <tr>
                    <td style={{ paddingLeft: "15px" }}>
                      {serviceName}
                      <img
                        onClick={() => toggleServiceDetailsByType(serviceName)}
                        src="./assets/image/down-arrow.png"
                      />
                    </td>
                    <td>{serviceInfo.count}</td>
                  </tr>
                  {showServiceDetailsByType[serviceName] && (
                    <tr>
                      <td colSpan={2}>
                        {Object.entries(
                          getServiceCountsCarModel(serviceName)
                        ).map(([carModel, carModelCount]) => (
                          <div key={carModel}>
                            <table className="reportrepair-subrow">
                              <tr>
                                <td>{carModel}</td>
                                <td style={{ width: "20%" }}>
                                  {carModelCount}
                                </td>
                                <td></td>
                              </tr>
                            </table>
                          </div>
                        ))}
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              )
            )}
          </tbody>
        </table>
      </div>

      <div className="reportmechanic-head">สรุปการทำงานของช่าง</div>

      <div className="reportmechanic-table-container">
        <table className="reportmechanic-table">
          <thead>
            <tr>
              <th>ช่าง</th>
              <th>รายการซ่อม</th>
              <th>จำนวน</th>
            </tr>
          </thead>
          <tbody>
            {mechanics.map((mechanic) => {
              const services = countServicesByMechanic(mechanic.name);

              return (
                <React.Fragment key={mechanic._id}>
                  {Object.keys(services).map((serviceName, index) => {
                    const carModelCounts = Object.entries(
                      getServiceCountsByCarModel(mechanic.name, serviceName)
                    );
                    const serviceTotal = carModelCounts.reduce(
                      (acc, [carModel, carModelCount]) => acc + carModelCount,
                      0
                    );

                    return (
                      <tr key={`${mechanic._id}-${serviceName}`}>
                        {index === 0 && (
                          <td rowSpan={Object.keys(services).length}>
                            {mechanic.name}
                          </td>
                        )}
                        <td style={{ textAlign: "left" }}>
                          {serviceName}
                          <img
                            onClick={() =>
                              toggleServiceDetailsByMechanic(
                                mechanic.name,
                                serviceName
                              )
                            }
                            src="./assets/image/down-arrow.png"
                          />
                          {showServiceDetailsByMechanic[mechanic.name]?.[
                            serviceName
                          ] && (
                            <div>
                              {carModelCounts.map(
                                ([carModel, carModelCount]) => (
                                  <table className="reportmechanic-subrow">
                                    <tr key={carModel}>
                                      <td style={{ paddingLeft: "20px" }}>
                                        {carModel}
                                      </td>
                                      <td style={{ width: "10%" }}>
                                        {carModelCount}
                                      </td>
                                    </tr>
                                  </table>
                                )
                              )}
                            </div>
                          )}
                        </td>
                        <td>{serviceTotal}</td>
                      </tr>
                    );
                  })}
                </React.Fragment>
              );
            })}
          </tbody>
        </table>
        ;
      </div>
    </div>
  );
}

export default Report;