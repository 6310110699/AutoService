import React, { useState, useEffect } from "react";
import axios from "axios";
import "../home/Home.scss";

const StartPage = () => {
  const [customers, setCustomers] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);

  useEffect(() => {
    loadCustomers();
  }, []);

  const loadCustomers = async () => {
    try {
      const response = await axios.get("http://localhost:3001/repairs");
      setCustomers(response.data);
    } catch (error) {
      console.error("Error loading customer data:", error);
    }
  };

  const handleSearch = () => {
    if (searchQuery.length === 10) {
      const filteredResults = customers.filter((customer) =>
        customer.customer.phoneNumber.includes(searchQuery)
      );
      setSearchResults(filteredResults);
    } else {
      setSearchResults([]);
    }
  };

  return (
    <div className="container">
      <div className="search-bar">
        <input
          type="text"
          placeholder="ค้นหาเบอร์โทรศัพท์"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <button onClick={handleSearch}>ค้นหา</button>
      </div>
      {searchResults.length > 0 ? (
        <table className="repair-table">
          <tbody>
            {searchResults.map((customer, index) => (
              <tr key={index}>
                <div className="status-header-container">
                  <button className="status-header">
                    {customer.car.brand} {customer.car.selectedModel}{" "}
                    {customer.car.color} {customer.car.numPlate}
                  </button>
                </div>
                <div className="status-container">
                  <div className="state">
                    <div
                      className={`state ${customer.status.state1 ? "status-active" : "status"
                        }`}
                    >
                      <div className="state-circle1"></div>
                      <div className="state-circle2">
                        <img src='./assets/image/car.png'></img>
                      </div>
                    </div>
                    <div className='state-label'>รับรถ</div>
                  </div>
                  <div className="state">
                    <div
                      className={`state ${customer.status.state2 ? "status-active" : "status"
                        }`}
                    >
                      <div className="state-circle1"></div>
                      <div className="state-circle2">
                        <img src='./assets/image/state2.png'></img>
                      </div>
                    </div>
                    <div className='state-label'>ตรวจสภาพรถ</div>
                  </div>
                  <div className="state">
                    <div
                      className={`state ${customer.status.state3 ? "status-active" : "status"
                        }`}
                    >
                      <div className="state-circle1"></div>
                      <div className="state-circle2">
                        <img src='./assets/image/state3.png'></img>
                      </div>
                    </div>
                    <div className='state-label'>หาอะไหล่</div>
                  </div>
                  <div className="state">
                    <div
                      className={`state ${customer.status.state4 ? "status-active" : "status"
                        }`}
                    >
                      <div className="state-circle1"></div>
                      <div className="state-circle2">
                        <img src='./assets/image/state4.png'></img>
                      </div>
                    </div>
                    <div className='state-label'>ดำเนินการซ่อม</div>
                  </div>
                  <div className="state">
                    <div
                      className={`state ${customer.status.state5 ? "status-active" : "status"
                        }`}
                    >
                      <div className="state-circle1"></div>
                      <div className="state-circle2">
                        <img src='./assets/image/state5.png'></img>
                      </div>
                    </div>
                    <div className='state-label'>ส่งมอบรถ</div>
                  </div>
                </div>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>ไม่พบผลลัพธ์</p>
      )}
    </div>
  );
};

export default StartPage;