import React, { useState, useEffect } from "react";
import axios from "axios";
import "./Report.scss";
import ReportGraph from "./ReportGraph";

function Report() {
  const [customers, setCustomers] = useState([]);
  const [services, setServices] = useState([]);
  const [mechanics, setMechanics] = useState([]);
  const [showServiceDetailsByType, setShowServiceDetailsByType] = useState({});
  const [showServiceDetailsByMechanic, setShowServiceDetailsByMechanic] =
    useState({});
  const [dailyTotalCost, setDailyTotalCost] = useState({});
  const [dailyServiceFee, setDailyServiceFee] = useState({});

  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [searchServiceResults, setSearchServiceResults] = useState([]);
  const [allCustomersFiltered, setAllCustomersFiltered] = useState([]);

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

  const getServiceNameById = (serviceId) => {
    const matchedService = services.find(
      (service) => service._id === serviceId
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
        const carInfo = `${customer.car.brand}` `${customer.car.selectedModel}`;
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

    setSearchResults(filteredAndSortedCustomers);
    setSearchServiceResults(filteredAndSortedCustomers);

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

    // อัปเดต state เพื่อเก็บผลลัพธ์ของ servicefee แต่ละวัน
    setDailyServiceFee(dailyServiceFee);

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
    setSearchServiceResults(allCustomersFiltered);
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

const countCustomersByStartDate = (targetDate) => {
  const filteredCustomers = customers.filter(
    (customer) => customer.startdate === targetDate
  );
  return filteredCustomers.length;
};

  

  return (
    <div className="report">
      <div className="report-head-container">
        <div className="report-head">รายงานสรุป</div>
      </div>

      <div className="report-filter">
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
              const services = countServicesByMechanic(mechanic._id);

              return (
                <React.Fragment key={mechanic._id}>
                  {Object.keys(services).map((serviceName, index) => {
                    const carModelCounts = Object.entries(
                      getServiceCountsByCarModel(mechanic._id, serviceName)
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
                                mechanic._id,
                                serviceName
                              )
                            }
                            src="./assets/image/down-arrow.png"
                          />
                          {showServiceDetailsByMechanic[mechanic._id]?.[
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