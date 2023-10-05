import React, { useState, useEffect } from "react";
import axios from "axios";
import "./History.scss";

function History() {
    const [customers, setCustomers] = useState([]);
    const [services, setServices] = useState([]);
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [searchResults, setSearchResults] = useState([]);

    useEffect(() => {
        loadCustomers();
        loadServices();
        toggleShowAll();
    }, []);

    useEffect(() => {
        toggleShowAll();
    }, [customers]);

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

    const navigateToReceipt = (customerId) => {
        const receiptUrl = `/receipt/${customerId}`;
        window.location.href = receiptUrl;
    };

    const getServiceNameById = (serviceId) => {
        const matchedService = services.find(
            (service) => service._id === serviceId
        );
        return matchedService ? matchedService.serviceName : "ไม่พบบริการ";
    };

    const startDateObject = new Date(`${startDate}T00:00:00`);
    const endDateObject = new Date(`${endDate}T23:59:59`);

    const filterAndSortCustomers = () => {

        const filteredAndSortedCustomers = customers
            .filter((customer) => {
                const customerEndDate = new Date(customer.enddate);
                return (
                    customerEndDate >= startDateObject &&
                    customerEndDate <= endDateObject &&
                    customer.status.state5
                );
            })
            .sort((a, b) => {
                const dateA = new Date(a.enddate);
                const dateB = new Date(b.enddate);
                return dateB - dateA;
            });

        setSearchResults(filteredAndSortedCustomers);
    };

    const toggleShowAll = () => {
        setStartDate("");
        setEndDate("");
        const allCustomersFiltered = customers.filter(
            (customer) => customer.status.state5
        );
        const sortedAllCustomers = allCustomersFiltered.sort((a, b) => {
            const dateA = new Date(a.enddate);
            const dateB = new Date(b.enddate);
            return dateB - dateA;
        });

        setSearchResults(sortedAllCustomers);
    };

    return (
        <div className="history">
            <div className="history-head">
                <div className="history-history">
                    ประวัติการซ่อม
                </div>
            </div>

            <div className="history-filter">
                <label htmlFor="startDateSelect">เลือกวันเริ่มต้น : </label>
                <input
                    type="date"
                    id="startDateSelect"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                />
                <label htmlFor="endDateSelect">เลือกวันสิ้นสุด : </label>
                <input
                    type="date"
                    id="endDateSelect"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                />
                <div className="history-filterbutton" onClick={filterAndSortCustomers}>
                    ยืนยัน
                </div>
                <div className="history-filterbutton" onClick={toggleShowAll}>
                    แสดงทั้งหมด
                </div>
            </div>

            <div className="history-item">
                {searchResults.map((customer) => (
                    <div className="history-customer row" onClick={() => navigateToReceipt(customer._id)} key={customer._id}>
                        <div className="col col-8">
                            <div className="history-detail">{customer.car.brand} {customer.car.selectedModel} {customer.car.color} {customer.car.numPlate}</div>
                            <div>รายการซ่อม :
                                {customer.services.map((service, serviceIndex) => (
                                    <div className="history-repair" key={serviceIndex}>
                                        {getServiceNameById(service.serviceName)}
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className="history-date col col- 4">
                            <div>วันที่รับรถ : {customer.startdate}</div>
                            <div>วันที่ส่งมอบรถ : {customer.enddate}</div>
                            <div>ชื่อลูกค้า : {customer.customer.customerName}</div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default History;