import React, { useState, useEffect } from "react";
import axios from "axios";
import "./History.scss";

function History() {
  const [customers, setCustomers] = useState([]);
  const [services, setServices] = useState([]);

  useEffect(() => {
    loadCustomers();
    loadServices();
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

  const getServiceNameById = (serviceId) => {
    const matchedService = services.find(
      (service) => service._id === serviceId
    );
    return matchedService ? matchedService.serviceName : "ไม่พบบริการ";
  };

  return (
    <div>
      <div>ประวัติการซ่อม</div>

      <table style={{width:"80%"}} className="้history-table">
        <tbody >
          {customers
            .filter((customer) => customer.status.state5)
            .map((customer, index) => (
              <tr key={index}>
                <div className="history">
                  <td style={{width:"70%"}}>
                    <div>
                      {customer.car.brand} {customer.car.selectedModel}{" "}
                      {customer.car.color} {customer.car.numPlate}
                    </div>
                    <div>รายการซ่อม :</div>
                    <ul>
                      {customer.services.map((service, serviceIndex) => (
                        <li key={serviceIndex}>
                          {getServiceNameById(service.serviceName)}
                        </li>
                      ))}
                    </ul>
                  </td>
                  <td>
                    <div>วันที่รับรถ : {customer.startdate}</div>
                    <div>วันที่ส่งมอบรถ : {customer.enddate}</div>
                    <div>ชื่อลูกค้า : {customer.customer.customerName}</div>
                  </td>
                </div>
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  );
}

export default History;