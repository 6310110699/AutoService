import React, { useState, useEffect } from "react";
import axios from "axios";
import "./Report.scss";

function Report() {
    const [customers, setCustomers] = useState([]);
    const [services, setServices] = useState([]);
    const [mechanics, setMechanics] = useState([]);
    const [showServiceDetails, setShowServiceDetails] = useState({});

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
    };

    const toggleServiceDetails = (serviceName) => {
        setShowServiceDetails((prevDetails) => ({
            ...prevDetails,
            [serviceName]: !prevDetails[serviceName],
        }));
    };

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

    return (
        <div className="report">
            <div className="report-head-container">
                <div className="report-head">
                    รายงานสรุป
                </div>
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

            <div className="report-table-container">
                <table className="reportrepair-table">
                    <thead>
                        <tr>
                            <th>รายการซ่อม</th>
                            <th>จำนวน</th>
                        </tr>
                    </thead>
                    <tbody>
                        {Object.entries(countServicesByType()).map(([serviceName, serviceInfo]) => (
                            <React.Fragment key={serviceName}>
                                <tr>
                                    <td>
                                        {serviceName}
                                        <img onClick={() => toggleServiceDetails(serviceName)} src='./assets/image/down-arrow.png' />
                                    </td>
                                    <td>{serviceInfo.count}</td>
                                </tr>
                                {showServiceDetails[serviceName] && (
                                    <tr>
                                        <td colSpan="2">
                                            {Object.entries(getServiceCountsCarModel(serviceName)).map(
                                                ([carModel, carModelCount]) => (
                                                    <div key={carModel}>
                                                        <table className="reportrepair-subrow">
                                                            <tr>
                                                                <td>{carModel}</td>
                                                                <td>{carModelCount}</td>
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

            <h3>สรุปการซ่อมรถของแต่ละช่าง</h3>
            <table style={{width: "100%"}}>
                <thead>
                    <tr>
                        <th>ช่าง</th>
                        <th>รายการซ่อม</th>
                        <th>บริการที่ซ่อม</th>
                    </tr>
                </thead>
                <tbody>
                    {mechanics.map((mechanic) => (
                        <tr key={mechanic._id}>
                            <td>{mechanic.name}</td>
                            {/* <td>
                                {
                                    searchResults.filter((customer) =>
                                        customer.mechanics.includes(mechanic._id)
                                    ).length
                                }
                            </td> */}
                            
                                <ul>
                                    {Object.entries(countServicesByMechanic(mechanic._id)).map(
                                        ([serviceName, count]) => (
                                            <li key={serviceName}>
                                                <td>{serviceName}</td>
                                                <td>{count}</td>
                                                <button onClick={() => toggleServiceDetails(serviceName)}>
                                                    {showServiceDetails[serviceName] ? "ซ่อนรายละเอียด" : "แสดงรายละเอียด"}
                                                </button>
                                                {showServiceDetails[serviceName] && (
                                                    <ul>
                                                        {Object.entries(getServiceCountsByCarModel(mechanic._id, serviceName)).map(
                                                            ([carModel, carModelCount]) => (
                                                                <li key={carModel}>
                                                                    <td>{carModel}</td>
                                                                     <td>{carModelCount}</td> 
                                                                </li>
                                                            )
                                                        )}
                                                    </ul>
                                                )}
                                            </li>
                                        )
                                    )}
                                </ul>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default Report;

