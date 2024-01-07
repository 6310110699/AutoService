import React, { useState, useEffect } from "react";
import axios from "axios";
import "./Report.scss";
import moment from "moment";
import BarCar from "./BarCar";
import DonutChart from "./DonutChart";
import BarCost from "./BarCost";

function Report() {
  const [customers, setCustomers] = useState([]);
  const [services, setServices] = useState([]);
  const [mechanics, setMechanics] = useState([]);
  const [dayOn, setDayOn] = useState([]);
  const [weekOn, setWeekOn] = useState([]);
  const [monthOn, setMonthOn] = useState([]);
  const [yearOn, setYearOn] = useState([]);
  const [date, setDate] = useState([]);
  const [week, setWeek] = useState(moment().format("YYYY-MM-DD"));
  const [month, setMonth] = useState([]);
  const [year, setYear] = useState([]);
  const [showServiceDetails, setShowServiceDetails] = useState({});
  const [showServiceDetailsByMechanic, setShowServiceDetailsByMechanic] =
    useState({});
  const [
    showServiceDetailsByMechanicDate,
    setShowServiceDetailsByMechanicDate,
  ] = useState({});

  useEffect(() => {
    loadCustomers();
    loadServices();
    loadMechanics();
    handleWeekClick();
  }, []);

  const loadCustomers = async () => {
    try {
      const response = await axios.get("http://localhost:3001/repairs");
      setCustomers(response.data);
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

  const handleDayClick = () => {
    const currentDate = moment().format("YYYY-MM-DD");
    setDate(currentDate);
    setDayOn(true);
    setWeekOn(false);
    setMonthOn(false);
    setYearOn(false);
  };

  const handleWeekClick = () => {
    const currentWeek = moment().startOf("week").format("YYYY-MM-DD");
    setWeek("Week: " + currentWeek);

    setDayOn(false);
    setWeekOn(true);
    setMonthOn(false);
    setYearOn(false);
  };

  const handleMonthClick = () => {
    const currentMonth = moment().format("YYYY-MM");
    setMonth(currentMonth);
    setDayOn(false);
    setWeekOn(false);
    setMonthOn(true);
    setYearOn(false);
  };

  const handleYearClick = () => {
    setDayOn(false);
    setWeekOn(false);
    setMonthOn(false);
    setYearOn(true);
  };
  //********************-----------DAY-----------********************//
  //CAR-DAY
  const handlePreviousDateClick = () => {
    const previousDate = moment(date).subtract(1, "day").format("YYYY-MM-DD");
    setDate(previousDate);
    setShowServiceDetails(false);
  };

  const handleNextDateClick = () => {
    const nextDate = moment(date).add(1, "day").format("YYYY-MM-DD");
    setDate(nextDate);
    setShowServiceDetails(false);
  };

  const countCarsWithStartDateDate = () => {
    const start = moment(`${date}T00:00:00`);
    const end = moment(`${date}T23:59:59`);

    const carsWithStartDatePerDay = {};
    customers.forEach((customer) => {
      const customerStartDate = moment(customer.startdate);
      if (customerStartDate >= start && customerStartDate <= end) {
        const dateString = customerStartDate;
        if (carsWithStartDatePerDay[dateString]) {
          carsWithStartDatePerDay[dateString]++;
        } else {
          carsWithStartDatePerDay[dateString] = 1;
        }
      }
    });

    return carsWithStartDatePerDay;
  };

  const carsWithStartDateDate = countCarsWithStartDateDate();
  const sumCarsWithStartDateDate = Object.values(carsWithStartDateDate).reduce(
    (sum, count) => sum + count,
    0
  );

  console.log("ลองงง start", carsWithStartDateDate);
  console.log("ลอง start", sumCarsWithStartDateDate);

  const countCarsWithOutEndDateDate = () => {
    const start = moment(`${date}T00:00:00`);
    const end = moment(`${date}T23:59:59`);

    const carsWithOutEndDate = {};

    let currentDate = moment(start);
    while (currentDate <= end) {
      const dateString = currentDate.format("YYYY-MM-DD");

      const count = customers.reduce((accumulator, customer) => {
        const customerStartDate = moment(customer.startdate).startOf("day");
        const customerEndDate = customer.enddate
          ? moment(customer.enddate).startOf("day")
          : null;

        if (
          customerStartDate.isSameOrBefore(currentDate, "day") &&
          (!customerEndDate || customerEndDate.isAfter(currentDate, "day"))
        ) {
          return accumulator + 1;
        }
        return accumulator;
      }, 0);

      carsWithOutEndDate[dateString] = count;

      currentDate.add(1, "day"); // เพิ่มวันที่ 1 วัน

      if (currentDate.isAfter(moment(), "day") || currentDate > end) {
        break;
      }
    }

    return carsWithOutEndDate;
  };

  const carsWithOutEndDateDate = countCarsWithOutEndDateDate();

  const lastDateDate = Object.keys(carsWithOutEndDateDate).pop();
  const lastValueDate = carsWithOutEndDateDate[lastDateDate];

  console.log("ลองงง WithOut", carsWithOutEndDateDate);
  console.log("ลอง WithOut", lastValueDate);

  const countCarsWithEndDateDate = () => {
    const start = moment(`${date}T00:00:00`);
    const end = moment(`${date}T23:59:59`);

    const carsWithEndDatePerDay = {};
    customers.forEach((customer) => {
      const customerEndDate = moment(customer.enddate);
      if (customerEndDate >= start && customerEndDate <= end) {
        const dateString = customerEndDate;
        if (carsWithEndDatePerDay[dateString]) {
          carsWithEndDatePerDay[dateString]++;
        } else {
          carsWithEndDatePerDay[dateString] = 1;
        }
      }
    });

    return carsWithEndDatePerDay;
  };

  const carsWithEndDateDate = countCarsWithEndDateDate();
  const sumCarsWithEndDateDate = Object.values(carsWithEndDateDate).reduce(
    (sum, count) => sum + count,
    0
  );
  console.log("ลองงง End", carsWithEndDateDate);
  console.log("ลอง End", sumCarsWithEndDateDate);

  //COST-DAY

  const countTotalCostDate = () => {
    const start = moment(`${date}T00:00:00`);
    const end = moment(`${date}T23:59:59`);

    const filteredCustomers = customers.filter((customer) => {
      const customerEndDate = new Date(customer.enddate);
      return (
        customerEndDate >= start &&
        customerEndDate <= end &&
        customer.status.state5
      );
    });

    const totalCostPerDay = {};

    filteredCustomers.forEach((customer) => {
      const customerEndDate = moment(customer.enddate);

      const dateString = customerEndDate.format("YYYY-MM-DD");

      if (totalCostPerDay[dateString]) {
        totalCostPerDay[dateString] += customer.totalCost;
      } else {
        totalCostPerDay[dateString] = customer.totalCost;
      }
    });

    return totalCostPerDay;
  };

  const totalCostPerDayDate = countTotalCostDate();
  console.log("totalCostPerDayDated", totalCostPerDayDate);

  const countTotalFeeDate = () => {
    const start = moment(`${date}T00:00:00`);
    const end = moment(`${date}T23:59:59`);

    const filterCustomers = customers.filter((customer) => {
      const customerEndDate = new Date(customer.enddate);
      return (
        customerEndDate >= start &&
        customerEndDate <= end &&
        customer.status.state5
      );
    });

    const totalFeePerDay = {};

    filterCustomers.forEach((customer) => {
      const customerEndDate = moment(customer.enddate);

      const dateString = customerEndDate.format("YYYY-MM-DD");

      if (totalFeePerDay[dateString]) {
        totalFeePerDay[dateString] += customer.serviceFee;
      } else {
        totalFeePerDay[dateString] = customer.serviceFee;
      }
    });

    return totalFeePerDay;
  };

  const totalFeePerDayDate = countTotalFeeDate();
  console.log("totalFeePerDayDate", totalFeePerDayDate);

  const countTotalSpareDate = () => {
    const totalSparePerDay = {};

    Object.keys(totalCostPerDayDate).forEach((date) => {
      if (totalFeePerDayDate[date]) {
        totalSparePerDay[date] =
          totalCostPerDayDate[date] - totalFeePerDayDate[date];
      }
    });

    return totalSparePerDay;
  };

  const totalSparePerDayDate = countTotalSpareDate();
  console.log("totalSparePerDayDate", totalSparePerDayDate);

  const sumTotalCostDate = Object.values(totalCostPerDayDate).reduce(
    (accumulator, currentValue) => accumulator + currentValue,
    0
  );

  const sumTotalSpareDate = Object.values(totalSparePerDayDate).reduce(
    (accumulator, currentValue) => accumulator + currentValue,
    0
  );

  const sumTotalFeeDate = Object.values(totalFeePerDayDate).reduce(
    (accumulator, currentValue) => accumulator + currentValue,
    0
  );

  const countServiceDate = () => {
    const start = moment(`${date}T00:00:00`);
    const end = moment(`${date}T23:59:59`);

    const servicesUsed = {};

    customers.forEach((customer) => {
      const customerEndDate = moment(customer.enddate);
      if (
        customerEndDate >= start &&
        customerEndDate <= end &&
        customer.status.state5
      ) {
        customer.services.forEach((service) => {
          const serviceName = service.serviceName;
          if (!servicesUsed[serviceName]) {
            servicesUsed[serviceName] = [];
          }
          servicesUsed[serviceName].push({
            carBrand: customer.car.brand,
            selectedModel: customer.car.selectedModel,
          });
        });
      }
    });

    return servicesUsed;
  };

  const servicesUsedDate = countServiceDate();
  console.log(servicesUsedDate);

  const toggleServiceDetailsDate = (serviceName) => {
    setShowServiceDetails({
      ...showServiceDetails,
      [serviceName]: !showServiceDetails[serviceName],
    });
  };

  const getServiceDate = (serviceName) => {
    const start = moment(`${date}T00:00:00`);
    const end = moment(`${date}T23:59:59`);

    const carModelCounts = {};
    const filterCustomers = customers.filter((customer) => {
      const customerEndDate = moment(customer.enddate);
      return (
        customerEndDate >= start &&
        customerEndDate <= end &&
        customer.status.state5
      );
    });

    filterCustomers.forEach((customer) => {
      customer.services.forEach((service) => {
        const serviceInfo = service.serviceName;
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

  // //MECHANIC-DAY

  const countServicesByMechanicDate = (mechanicId) => {
    const start = moment(`${date}T00:00:00`);
    const end = moment(`${date}T23:59:59`);

    const filterCustomers = customers.filter((customer) => {
      const customerEndDate = new Date(customer.enddate);
      return (
        customerEndDate >= start &&
        customerEndDate <= end &&
        customer.status.state5
      );
    });

    const mechanicCustomers = filterCustomers.filter((customer) =>
      customer.mechanics.includes(mechanicId)
    );
    const serviceCounts = {};

    mechanicCustomers.forEach((customer) => {
      customer.services.forEach((service) => {
        const serviceName = service.serviceName;
        if (serviceCounts[serviceName]) {
          serviceCounts[serviceName]++;
        } else {
          serviceCounts[serviceName] = 1;
        }
      });
    });

    return serviceCounts;
  };

  const getServiceCountsByCarModelDate = (mechanicId, serviceName) => {
    const start = moment(`${date}T00:00:00`);
    const end = moment(`${date}T23:59:59`);

    const filterCustomers = customers.filter((customer) => {
      const customerEndDate = new Date(customer.enddate);
      return (
        customerEndDate >= start &&
        customerEndDate <= end &&
        customer.status.state5
      );
    });
    const mechanicCustomers = filterCustomers.filter((customer) =>
      customer.mechanics.includes(mechanicId)
    );
    const carModelCounts = {};

    mechanicCustomers.forEach((customer) => {
      customer.services.forEach((service) => {
        const serviceInfo = service.serviceName;
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

  const toggleServiceDetailsByMechanicDate = (mechanicId, serviceName) => {
    setShowServiceDetailsByMechanicDate((prevDetails) => ({
      ...prevDetails,
      [mechanicId]: {
        ...prevDetails[mechanicId],
        [serviceName]: !prevDetails[mechanicId]?.[serviceName],
      },
    }));
  };

  //********************-----------WEEK-----------********************//
  //CAR-WEEK
  const handlePreviousWeekClick = () => {
    const previousWeek = moment(week).subtract(1, "week").startOf("week");
    setWeek(previousWeek.format("YYYY-MM-DD"));
    setShowServiceDetails(false);
  };

  const handleNextWeekClick = () => {
    const nextWeek = moment(week).add(1, "week").startOf("week");
    setWeek(nextWeek.format("YYYY-MM-DD"));
    setShowServiceDetails(false);
  };


  const countCarsWithStartDateWeek = () => {
    const start = moment(week).startOf("week").toDate();
    const end = moment(week).endOf("week").toDate();

    const carsWithStartDatePerDay = {};
    customers.forEach((customer) => {
      const customerStartDate = moment(customer.startdate);
      if (customerStartDate >= start && customerStartDate <= end) {
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

  const carsWithStartDateWeek = countCarsWithStartDateWeek();
  const sumCarsWithStartDateWeek = Object.values(carsWithStartDateWeek).reduce(
    (sum, count) => sum + count,
    0
  );

  const countCarsWithOutEndDateWeek = () => {
    const start = moment(week).startOf("week").toDate();
    const end = moment(week).endOf("week").toDate();

    const carsWithOutEndDate = {};

    let currentDate = moment(start);
    while (currentDate <= end) {
      const dateString = currentDate.format("YYYY-MM-DD");

      const count = customers.reduce((accumulator, customer) => {
        const customerStartDate = moment(customer.startdate).startOf("day");
        const customerEndDate = customer.enddate
          ? moment(customer.enddate).startOf("day")
          : null;

        if (
          customerStartDate.isSameOrBefore(currentDate, "day") &&
          (!customerEndDate || customerEndDate.isAfter(currentDate, "day"))
        ) {
          return accumulator + 1;
        }
        return accumulator;
      }, 0);

      carsWithOutEndDate[dateString] = count;

      currentDate.add(1, "day"); // เพิ่มวันที่ 1 วัน

      if (currentDate.isAfter(moment(), "day") || currentDate > end) {
        break;
      }
    }

    return carsWithOutEndDate;
  };

  const carsWithOutEndDateWeek = countCarsWithOutEndDateWeek();

  const countCarsWithEndDateWeek = () => {
    const start = moment(week).startOf("week").toDate();
    const end = moment(week).endOf("week").toDate();

    const carsWithEndDatePerDay = {};
    customers.forEach((customer) => {
      const customerEndDate = moment(customer.enddate);
      if (customerEndDate >= start && customerEndDate <= end) {
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

  const carsWithEndDateWeek = countCarsWithEndDateWeek();
  const sumCarsWithEndDateWeek = Object.values(carsWithEndDateWeek).reduce(
    (sum, count) => sum + count,
    0
  );

  const lastDateWeek = Object.keys(carsWithOutEndDateWeek).pop();
  const lastValueWeek = carsWithOutEndDateWeek[lastDateWeek];

  //COST-WEEk

  const countTotalCostWeek = () => {
    const start = moment(week).startOf("week").toDate();
    const end = moment(week).endOf("week").toDate();

    const filteredCustomers = customers.filter((customer) => {
      const customerEndDate = new Date(customer.enddate);
      return (
        customerEndDate >= start &&
        customerEndDate <= end &&
        customer.status.state5
      );
    });

    const totalCostPerDay = {};

    filteredCustomers.forEach((customer) => {
      const customerEndDate = moment(customer.enddate);

      const dateString = customerEndDate.format("YYYY-MM-DD");

      if (totalCostPerDay[dateString]) {
        totalCostPerDay[dateString] += customer.totalCost;
      } else {
        totalCostPerDay[dateString] = customer.totalCost;
      }
    });

    return totalCostPerDay;
  };

  const totalCostPerDayWeek = countTotalCostWeek();

  const countTotalFeeWeek = () => {
    const start = moment(week).startOf("week").toDate();
    const end = moment(week).endOf("week").toDate();

    const filterCustomers = customers.filter((customer) => {
      const customerEndDate = new Date(customer.enddate);
      return (
        customerEndDate >= start &&
        customerEndDate <= end &&
        customer.status.state5
      );
    });

    const totalFeePerDay = {};

    filterCustomers.forEach((customer) => {
      const customerEndDate = moment(customer.enddate);

      const dateString = customerEndDate.format("YYYY-MM-DD");

      if (totalFeePerDay[dateString]) {
        totalFeePerDay[dateString] += customer.serviceFee;
      } else {
        totalFeePerDay[dateString] = customer.serviceFee;
      }
    });

    return totalFeePerDay;
  };

  const totalFeePerDayWeek = countTotalFeeWeek();

  const countTotalSpareWeek = () => {
    const totalSparePerDay = {};

    Object.keys(totalCostPerDayWeek).forEach((date) => {
      if (totalFeePerDayWeek[date]) {
        totalSparePerDay[date] =
          totalCostPerDayWeek[date] - totalFeePerDayWeek[date];
      }
    });

    return totalSparePerDay;
  };

  const totalSparePerDayWeek = countTotalSpareWeek();

  const sumTotalCostWeek = Object.values(totalCostPerDayWeek).reduce(
    (accumulator, currentValue) => accumulator + currentValue,
    0
  );

  const sumTotalSpareWeek = Object.values(totalSparePerDayWeek).reduce(
    (accumulator, currentValue) => accumulator + currentValue,
    0
  );

  const sumTotalFeeWeek = Object.values(totalFeePerDayWeek).reduce(
    (accumulator, currentValue) => accumulator + currentValue,
    0
  );

  const countServiceWeek = () => {
    const start = moment(week).startOf("week").toDate();
    const end = moment(week).endOf("week").toDate();

    const servicesUsed = {};

    customers.forEach((customer) => {
      const customerEndDate = moment(customer.enddate);
      if (
        customerEndDate >= start &&
        customerEndDate <= end &&
        customer.status.state5
      ) {
        customer.services.forEach((service) => {
          const serviceName = service.serviceName;
          if (!servicesUsed[serviceName]) {
            servicesUsed[serviceName] = [];
          }
          servicesUsed[serviceName].push({
            carBrand: customer.car.brand,
            selectedModel: customer.car.selectedModel,
          });
        });
      }
    });

    return servicesUsed;
  };

  const servicesUsedWeek = countServiceWeek();
  // console.log(servicesUsed);

  const toggleServiceDetailsWeek = (serviceName) => {
    setShowServiceDetails({
      ...showServiceDetails,
      [serviceName]: !showServiceDetails[serviceName],
    });
  };

  const getServiceWeek = (serviceName) => {
    const start = moment(week).startOf("week").toDate();
    const end = moment(week).endOf("week").toDate();

    const carModelCounts = {};

    const filterCustomers = customers.filter((customer) => {
      const customerEndDate = new Date(customer.enddate);
      return (
        customerEndDate >= start &&
        customerEndDate <= end &&
        customer.status.state5
      );
    });

    const totalFeePerDay = {};

    filterCustomers.forEach((customer) => {
      customer.services.forEach((service) => {
        const serviceInfo = service.serviceName;
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

  //MECHANIC-WEEK
  const countServicesByMechanicWeek = (mechanicId) => {
    const start = moment(week).startOf("week").toDate();
    const end = moment(week).endOf("week").toDate();

    const filterCustomers = customers.filter((customer) => {
      const customerEndDate = new Date(customer.enddate);
      return (
        customerEndDate >= start &&
        customerEndDate <= end &&
        customer.status.state5
      );
    });

    const mechanicCustomers = filterCustomers.filter((customer) =>
      customer.mechanics.includes(mechanicId)
    );
    const serviceCounts = {};

    mechanicCustomers.forEach((customer) => {
      customer.services.forEach((service) => {
        const serviceName = service.serviceName;
        if (serviceCounts[serviceName]) {
          serviceCounts[serviceName]++;
        } else {
          serviceCounts[serviceName] = 1;
        }
      });
    });

    return serviceCounts;
  };

  const getServiceCountsByCarModelWeek = (mechanicId, serviceName) => {
    const start = moment(week).startOf("week").toDate();
    const end = moment(week).endOf("week").toDate();

    const filterCustomers = customers.filter((customer) => {
      const customerEndDate = new Date(customer.enddate);
      return (
        customerEndDate >= start &&
        customerEndDate <= end &&
        customer.status.state5
      );
    });
    const mechanicCustomers = filterCustomers.filter((customer) =>
      customer.mechanics.includes(mechanicId)
    );
    const carModelCounts = {};

    mechanicCustomers.forEach((customer) => {
      customer.services.forEach((service) => {
        const serviceInfo = service.serviceName;
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

  const toggleServiceDetailsByMechanicWeek = (mechanicId, serviceName) => {
    setShowServiceDetailsByMechanic((prevDetails) => ({
      ...prevDetails,
      [mechanicId]: {
        ...prevDetails[mechanicId],
        [serviceName]: !prevDetails[mechanicId]?.[serviceName],
      },
    }));
  };

  //********************-----------MONTH-----------********************//
  //CAR-MONTH
  const previousMonth = moment(month).subtract(1, "month").format("YYYY-MM");
  const handlePreviousMonthClick = () => {
    setMonth(previousMonth);
    setShowServiceDetails(false);
  };

  const nextMonth = moment(month).add(1, "month").format("YYYY-MM");
  const handleNextMonthClick = () => {
    setMonth(nextMonth);
    setShowServiceDetails(false);
  };

  const countCarsWithStartDate = () => {
    const start = moment(`${month}-01T00:00:00`);
    const end = start
      .clone()
      .endOf("month")
      .set({ hour: 23, minute: 59, second: 59 });

    const carsWithStartDatePerDay = {};
    customers.forEach((customer) => {
      const customerStartDate = moment(customer.startdate);
      if (customerStartDate >= start && customerStartDate <= end) {
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

  const carsWithStartDate = countCarsWithStartDate();
  const sumCarsWithStartDate = Object.values(carsWithStartDate).reduce(
    (sum, count) => sum + count,
    0
  );

  const countCarsWithOutEndDate = () => {
    const start = moment(`${month}-01T00:00:00`);
    const end = moment(start).endOf("month");

    const carsWithOutEndDate = {};

    let currentDate = moment(start);
    while (currentDate <= end) {
      const dateString = currentDate.format("YYYY-MM-DD");

      const count = customers.reduce((accumulator, customer) => {
        const customerStartDate = moment(customer.startdate).startOf("day");
        const customerEndDate = customer.enddate
          ? moment(customer.enddate).startOf("day")
          : null;

        if (
          customerStartDate.isSameOrBefore(currentDate, "day") &&
          (!customerEndDate || customerEndDate.isAfter(currentDate, "day"))
        ) {
          return accumulator + 1;
        }
        return accumulator;
      }, 0);

      carsWithOutEndDate[dateString] = count;

      currentDate.add(1, "day"); // เพิ่มวันที่ 1 วัน

      if (currentDate.isAfter(moment(), "day") || currentDate > end) {
        break;
      }
    }

    return carsWithOutEndDate;
  };

  const carsWithOutEndDate = countCarsWithOutEndDate();

  const countCarsWithEndDate = () => {
    const start = moment(`${month}-01T00:00:00`);
    const end = start
      .clone()
      .endOf("month")
      .set({ hour: 23, minute: 59, second: 59 });

    const carsWithEndDatePerDay = {};
    customers.forEach((customer) => {
      const customerEndDate = moment(customer.enddate);
      if (customerEndDate >= start && customerEndDate <= end) {
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

  const carsWithEndDate = countCarsWithEndDate();
  const sumCarsWithEndDate = Object.values(carsWithEndDate).reduce(
    (sum, count) => sum + count,
    0
  );

  const lastDate = Object.keys(carsWithOutEndDate).pop();
  const lastValue = carsWithOutEndDate[lastDate];

  //COST-MONTH

  const countTotalCost = () => {
    const start = moment(`${month}-01T00:00:00`);
    const end = start
      .clone()
      .endOf("month")
      .set({ hour: 23, minute: 59, second: 59 });

    const filteredCustomers = customers.filter((customer) => {
      const customerEndDate = new Date(customer.enddate);
      return (
        customerEndDate >= start &&
        customerEndDate <= end &&
        customer.status.state5
      );
    });

    const totalCostPerDay = {};

    filteredCustomers.forEach((customer) => {
      const customerEndDate = moment(customer.enddate);

      const dateString = customerEndDate.format("YYYY-MM-DD");

      if (totalCostPerDay[dateString]) {
        totalCostPerDay[dateString] += customer.totalCost;
      } else {
        totalCostPerDay[dateString] = customer.totalCost;
      }
    });

    return totalCostPerDay;
  };

  const totalCostPerDay = countTotalCost();

  const countTotalFee = () => {
    const start = moment(`${month}-01T00:00:00`);
    const end = start
      .clone()
      .endOf("month")
      .set({ hour: 23, minute: 59, second: 59 });

    const filterCustomers = customers.filter((customer) => {
      const customerEndDate = new Date(customer.enddate);
      return (
        customerEndDate >= start &&
        customerEndDate <= end &&
        customer.status.state5
      );
    });

    const totalFeePerDay = {};

    filterCustomers.forEach((customer) => {
      const customerEndDate = moment(customer.enddate);

      const dateString = customerEndDate.format("YYYY-MM-DD");

      if (totalFeePerDay[dateString]) {
        totalFeePerDay[dateString] += customer.serviceFee;
      } else {
        totalFeePerDay[dateString] = customer.serviceFee;
      }
    });

    return totalFeePerDay;
  };

  const totalFeePerDay = countTotalFee();

  const countTotalSpare = () => {
    const totalSparePerDay = {};

    Object.keys(totalCostPerDay).forEach((date) => {
      if (totalFeePerDay[date]) {
        totalSparePerDay[date] = totalCostPerDay[date] - totalFeePerDay[date];
      }
    });

    return totalSparePerDay;
  };

  const totalSparePerDay = countTotalSpare();

  const sumTotalCost = Object.values(totalCostPerDay).reduce(
    (accumulator, currentValue) => accumulator + currentValue,
    0
  );

  const sumTotalSpare = Object.values(totalSparePerDay).reduce(
    (accumulator, currentValue) => accumulator + currentValue,
    0
  );

  const sumTotalFee = Object.values(totalFeePerDay).reduce(
    (accumulator, currentValue) => accumulator + currentValue,
    0
  );

  const countService = () => {
    const start = moment(`${month}-01T00:00:00`);
    const end = start.clone().endOf("month");

    const servicesUsed = {};

    customers.forEach((customer) => {
      const customerEndDate = moment(customer.enddate);
      if (
        customerEndDate >= start &&
        customerEndDate <= end &&
        customer.status.state5
      ) {
        customer.services.forEach((service) => {
          const serviceName = service.serviceName;
          if (!servicesUsed[serviceName]) {
            servicesUsed[serviceName] = [];
          }
          servicesUsed[serviceName].push({
            carBrand: customer.car.brand,
            selectedModel: customer.car.selectedModel,
          });
        });
      }
    });

    return servicesUsed;
  };

  const servicesUsed = countService();
  // console.log(servicesUsed);

  const toggleServiceDetails = (serviceName) => {
    setShowServiceDetails({
      ...showServiceDetails,
      [serviceName]: !showServiceDetails[serviceName],
    });
  };

  const getService = (serviceName) => {
    const carModelCounts = {};

    const start = moment(`${month}-01T00:00:00`);
    const end = start
      .clone()
      .endOf("month")
      .set({ hour: 23, minute: 59, second: 59 });

    const filterCustomers = customers.filter((customer) => {
      const customerEndDate = new Date(customer.enddate);
      return (
        customerEndDate >= start &&
        customerEndDate <= end &&
        customer.status.state5
      );
    });

    const totalFeePerDay = {};

    filterCustomers.forEach((customer) => {
      customer.services.forEach((service) => {
        const serviceInfo = service.serviceName;
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

  //MECHANIC-MONTH
  const countServicesByMechanic = (mechanicId) => {
    const start = moment(`${month}-01T00:00:00`);
    const end = start
      .clone()
      .endOf("month")
      .set({ hour: 23, minute: 59, second: 59 });

    const filterCustomers = customers.filter((customer) => {
      const customerEndDate = new Date(customer.enddate);
      return (
        customerEndDate >= start &&
        customerEndDate <= end &&
        customer.status.state5
      );
    });

    const mechanicCustomers = filterCustomers.filter((customer) =>
      customer.mechanics.includes(mechanicId)
    );
    const serviceCounts = {};

    mechanicCustomers.forEach((customer) => {
      customer.services.forEach((service) => {
        const serviceName = service.serviceName;
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
    const start = moment(`${month}-01T00:00:00`);
    const end = start
      .clone()
      .endOf("month")
      .set({ hour: 23, minute: 59, second: 59 });

    const filterCustomers = customers.filter((customer) => {
      const customerEndDate = new Date(customer.enddate);
      return (
        customerEndDate >= start &&
        customerEndDate <= end &&
        customer.status.state5
      );
    });
    const mechanicCustomers = filterCustomers.filter((customer) =>
      customer.mechanics.includes(mechanicId)
    );
    const carModelCounts = {};

    mechanicCustomers.forEach((customer) => {
      customer.services.forEach((service) => {
        const serviceInfo = service.serviceName;
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

  const toggleServiceDetailsByMechanic = (mechanicId, serviceName) => {
    setShowServiceDetailsByMechanic((prevDetails) => ({
      ...prevDetails,
      [mechanicId]: {
        ...prevDetails[mechanicId],
        [serviceName]: !prevDetails[mechanicId]?.[serviceName],
      },
    }));
  };

  return (
    <div className="report">
      <div className="report-head-container">
        <div className="report-head">รายงานสรุป</div>
      </div>

      <div className="report-filter">
        <div
          className={`report-daily ${dayOn ? "active" : ""}`}
          onClick={handleDayClick}
        >
          วัน
        </div>
        <div
          className={`report-weekly ${weekOn ? "active" : ""}`}
          onClick={handleWeekClick}
        >
          สัปดาห์
        </div>
        <div
          className={`report-monthly ${monthOn ? "active" : ""}`}
          onClick={handleMonthClick}
        >
          เดือน
        </div>
        <div
          className={`report-yearly ${yearOn ? "active" : ""}`}
          onClick={handleYearClick}
        >
          ปี
        </div>
      </div>

      <div className="daily-filter">
        {dayOn ? (
          <div>
            <div>
              <button onClick={handlePreviousDateClick}>ย้อนหลัง 1 วัน</button>
              <input
                type="date"
                id="dateSelect"
                value={date}
                onChange={(e) => {
                  setDate(e.target.value);
                }}
              />
              <button onClick={handleNextDateClick}>ไปข้างหน้า 1 วัน</button>
            </div>

            <div>
              <input
                type="date"
                id="dateSelect"
                value={date}
                onChange={(e) => {
                  setDate(e.target.value);
                }}
              />
            </div>

            <h1>รายงานสรุป {moment(date).format("DD MMMM YYYY ")}</h1>

            <div style={{ display: "flex" }}>
              <div style={{ flex: 1 }}>
                <DonutChart
                  data={[
                    {
                      name: `รถที่รับเข้ามา : ${sumCarsWithStartDateDate}`,
                      value: sumCarsWithStartDateDate,
                    },
                    {
                      name: `รถที่ส่งออก : ${sumCarsWithEndDateDate}`,
                      value: sumCarsWithEndDateDate,
                    },
                    {
                      name: `รถที่ยังอยู่ในอู่ : ${lastValueDate}`,
                      value: lastValueDate,
                    },
                  ]}
                />

                <div>
                  <h5>รถที่รับเข้ามา: {sumCarsWithStartDateDate}</h5>
                  <h5>รถที่ส่งออก: {sumCarsWithEndDateDate}</h5>
                  <h5>รถที่ยังอยู่ในอู่: {lastValueDate}</h5>
                </div>
              </div>
              <div style={{ flex: 2 }}></div>
            </div>
            <div style={{ display: "flex" }}>
              <div style={{ flex: 1 }}>
                <DonutChart
                  data={[
                    {
                      name: `TotalSpareDatet : ${sumTotalSpareDate}`,
                      value: sumCarsWithEndDateDate,
                    },
                    {
                      name: `TotalFeeDate : ${sumTotalFeeDate}`,
                      value: sumTotalFeeDate,
                    },
                  ]}
                />
                <div>
                  <h5>TotalCost={sumTotalCostDate}</h5>
                  <h5>TotalSpare={sumTotalSpareDate}</h5>
                  <h5>TotalFee={sumTotalFeeDate}</h5>
                </div>
              </div>
              <div style={{ flex: 2 }}>
                <div />
              </div>
            </div>
            <div className="reportmechanic-head">สรุปรายการซ่อม</div>

            <div className="reportrepair-table-container">
              <table className="reportrepair-table">
                <thead>
                  <tr>
                    <th>รายการซ่อม</th>
                    <th>จำนวน</th>
                  </tr>
                </thead>
                <tbody>
                  {Object.entries(servicesUsedDate).map(
                    ([serviceName, index]) => (
                      <React.Fragment key={serviceName}>
                        <tr>
                          <td style={{ paddingLeft: "15px" }}>
                            {serviceName}
                            <img
                              onClick={() => toggleServiceDetails(serviceName)}
                              src="./assets/image/down-arrow.png"
                            />
                          </td>
                          <td>{servicesUsedDate[serviceName].length}</td>
                        </tr>
                        {showServiceDetails[serviceName] && (
                          <tr>
                            <td colSpan={2}>
                              {Object.entries(getServiceDate(serviceName)).map(
                                ([carModel, carModelCount]) => (
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
                                )
                              )}
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
                    const services = countServicesByMechanicDate(mechanic.name);

                    return (
                      <React.Fragment key={mechanic._id}>
                        {Object.keys(services).map((serviceName, index) => {
                          const carModelCounts = Object.entries(
                            getServiceCountsByCarModelDate(
                              mechanic.name,
                              serviceName
                            )
                          );
                          const serviceTotal = carModelCounts.reduce(
                            (acc, [carModel, carModelCount]) =>
                              acc + carModelCount,
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
                                    toggleServiceDetailsByMechanicDate(
                                      mechanic.name,
                                      serviceName
                                    )
                                  }
                                  src="./assets/image/down-arrow.png"
                                />
                                {showServiceDetailsByMechanicDate[
                                  mechanic.name
                                ]?.[serviceName] && (
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
        ) : (
          <></>
        )}
      </div>

      <div className="monthly-filter">
        {weekOn ? (
          <div>
            <div>
              <button onClick={handlePreviousWeekClick}>
                ย้อนหลัง 1 สัปดาห์
              </button>
              <input
                type="week"
                id="weekSelect"
                value={week}
                onChange={(e) => {
                  setWeek(e.target.value);
                }}
              />
              <button onClick={handleNextWeekClick}>
                ไปข้างหน้า 1 สัปดาห์
              </button>
            </div>

            <h1>รายงานสรุปสัปดาห์ที่ {moment(week).format("w")}</h1>
            <div style={{ display: "flex" }}>
              <div style={{ flex: 1 }}>
                <DonutChart
                  data={[
                    {
                      name: `รถที่รับเข้ามา : ${sumCarsWithStartDateWeek}`,
                      value: sumCarsWithStartDateWeek,
                    },
                    {
                      name: `รถที่ส่งออก : ${sumCarsWithEndDateWeek}`,
                      value: sumCarsWithEndDateWeek,
                    },
                    {
                      name: `รถที่ยังอยู่ในอู่ : ${lastValueWeek}`,
                      value: lastValueWeek,
                    },
                  ]}
                />

                <div>
                  {/* <h5>รถที่รับเข้ามา: {sumCarsWithStartDate}</h5>
                  <h5>รถที่ส่งออก: {sumCarsWithEndDate}</h5>
                  <h5>รถที่ยังอยู่ในอู่: {lastValue}</h5> */}
                </div>
              </div>
              <div style={{ flex: 2 }}>
                {/* <BarCar
                  carsWithStartDate={carsWithStartDate}
                  carsWithEndDate={carsWithEndDate}
                  carsWithOutEndDate={carsWithOutEndDate}
                /> */}
              </div>
            </div>
            <div style={{ display: "flex" }}>
              <div style={{ flex: 1 }}>
                {/* <DonutChart
                  data={[
                    {
                      name: `ค่าอะไหล่ทั้งหมด`,
                      value: sumTotalSpare,
                    },
                    {
                      name: `ค่าบริการทั้งหมด`,
                      value: sumTotalFee,
                    },
                  ]}
                /> */}
              </div>
              <div style={{ flex: 2 }}>
                {/* <BarCost
                  TotalCost={totalCostPerDay}
                  TotalFee={totalFeePerDay}
                  TotalSpare={totalSparePerDay}
                  carsWithOutEndDate={carsWithOutEndDate}
                /> */}
              </div>
            </div>
            <div>
              {/* <h5>รายได้ทั้งหมด : {sumTotalCost}</h5>
              <h5>ค่าอะไหล่ทั้งหมด : {sumTotalSpare}</h5>
              <h5>ค่าบริการทั้งหมด : {sumTotalFee}</h5> */}
            </div>
            <div className="reportrepair-table-container">
              <table className="reportrepair-table">
                <thead>
                  <tr>
                    <th>รายการซ่อม</th>
                    <th>จำนวน</th>
                  </tr>
                </thead>
                <tbody>
                  {/* {Object.entries(servicesUsed).map(([serviceName, index]) => (
                    <React.Fragment key={serviceName}>
                      <tr>
                        <td style={{ paddingLeft: "15px" }}>
                          {serviceName}
                          <img
                            onClick={() => toggleServiceDetails(serviceName)}
                            src="./assets/image/down-arrow.png"
                          />
                        </td>
                        <td>{servicesUsed[serviceName].length}</td>
                      </tr>
                      {showServiceDetails[serviceName] && (
                        <tr>
                          <td colSpan={2}>
                            {Object.entries(getService(serviceName)).map(
                              ([carModel, carModelCount]) => (
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
                              )
                            )}
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  ))} */}
                </tbody>
              </table>
            </div>
            <div className="reportmechanic-head">สรุปการทำงานของช่าง</div>

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
                  {/* {mechanics.map((mechanic) => {
                    const services = countServicesByMechanic(mechanic.name);

                    return (
                      <React.Fragment key={mechanic._id}>
                        {Object.keys(services).map((serviceName, index) => {
                          const carModelCounts = Object.entries(
                            getServiceCountsByCarModel(
                              mechanic.name,
                              serviceName
                            )
                          );
                          const serviceTotal = carModelCounts.reduce(
                            (acc, [carModel, carModelCount]) =>
                              acc + carModelCount,
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
                  })} */}
                </tbody>
              </table>
              ;
            </div>
          </div>
        ) : (
          <></>
        )}
      </div>

      <div className="monthly-filter">
        {monthOn ? (
          <div>
            <div>
              <button onClick={handlePreviousMonthClick}>
                ย้อนหลัง 1 เดือน
              </button>
              <input
                type="month"
                id="monthSelect"
                value={month}
                onChange={(e) => {
                  setMonth(e.target.value);
                }}
              />
              <button onClick={handleNextMonthClick}>ไปข้างหน้า 1 เดือน</button>
            </div>

            <h1>รายงานสรุป {moment(month).format("MMMM YYYY")}</h1>

            <div style={{ display: "flex" }}>
              <div style={{ flex: 1 }}>
                <DonutChart
                  data={[
                    {
                      name: `รถที่รับเข้ามา : ${sumCarsWithStartDate}`,
                      value: sumCarsWithStartDate,
                    },
                    {
                      name: `รถที่ส่งออก : ${sumCarsWithEndDate}`,
                      value: sumCarsWithEndDate,
                    },
                    {
                      name: `รถที่ยังอยู่ในอู่ : ${lastValue}`,
                      value: lastValue,
                    },
                  ]}
                />

                <div>
                  <h5>รถที่รับเข้ามา: {sumCarsWithStartDate}</h5>
                  <h5>รถที่ส่งออก: {sumCarsWithEndDate}</h5>
                  <h5>รถที่ยังอยู่ในอู่: {lastValue}</h5>
                </div>
              </div>
              <div style={{ flex: 2 }}>
                <BarCar
                  carsWithStartDate={carsWithStartDate}
                  carsWithEndDate={carsWithEndDate}
                  carsWithOutEndDate={carsWithOutEndDate}
                />
              </div>
            </div>
            <div style={{ display: "flex" }}>
              <div style={{ flex: 1 }}>
                <DonutChart
                  data={[
                    {
                      name: `ค่าอะไหล่ทั้งหมด`,
                      value: sumTotalSpare,
                    },
                    {
                      name: `ค่าบริการทั้งหมด`,
                      value: sumTotalFee,
                    },
                  ]}
                />
              </div>
              <div style={{ flex: 2 }}>
                <BarCost
                  TotalCost={totalCostPerDay}
                  TotalFee={totalFeePerDay}
                  TotalSpare={totalSparePerDay}
                  carsWithOutEndDate={carsWithOutEndDate}
                />
              </div>
            </div>
            <div>
              <h5>รายได้ทั้งหมด : {sumTotalCost}</h5>
              <h5>ค่าอะไหล่ทั้งหมด : {sumTotalSpare}</h5>
              <h5>ค่าบริการทั้งหมด : {sumTotalFee}</h5>
            </div>
            <div></div>
            <div className="reportmechanic-head">สรุปรายการซ่อม</div>

            <div className="reportrepair-table-container">
              <table className="reportrepair-table">
                <thead>
                  <tr>
                    <th>รายการซ่อม</th>
                    <th>จำนวน</th>
                  </tr>
                </thead>
                <tbody>
                  {Object.entries(servicesUsed).map(([serviceName, index]) => (
                    <React.Fragment key={serviceName}>
                      <tr>
                        <td style={{ paddingLeft: "15px" }}>
                          {serviceName}
                          <img
                            onClick={() => toggleServiceDetails(serviceName)}
                            src="./assets/image/down-arrow.png"
                          />
                        </td>
                        <td>{servicesUsed[serviceName].length}</td>
                      </tr>
                      {showServiceDetails[serviceName] && (
                        <tr>
                          <td colSpan={2}>
                            {Object.entries(getService(serviceName)).map(
                              ([carModel, carModelCount]) => (
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
                              )
                            )}
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  ))}
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
                            getServiceCountsByCarModel(
                              mechanic.name,
                              serviceName
                            )
                          );
                          const serviceTotal = carModelCounts.reduce(
                            (acc, [carModel, carModelCount]) =>
                              acc + carModelCount,
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
        ) : (
          <></>
        )}
      </div>
    </div>
  );
}

export default Report;

