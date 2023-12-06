import React, { useState, useEffect } from "react";
import axios from "axios";
import "./Startpage.scss";

const StartPage = () => {
  const [customers, setCustomers] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);

  const handleSearch = async () => {
    if (searchQuery.length === 10) {
      const filteredResults = customers.filter(
        (customer) =>
          customer.customer.phoneNumber.includes(searchQuery) &&
          !customer.status.state5
      );
      setSearchResults(filteredResults);

      // โหลดข้อมูลล่าสุดจาก API เมื่อค้นหาใหม่
      try {
        const response = await axios.get("http://localhost:3001/repairs");
        setCustomers(response.data);

        // อัปเดต searchResults ใหม่หลังจากโหลดข้อมูลใหม่
        const updatedResults = response.data.filter(
          (customer) =>
            customer.customer.phoneNumber.includes(searchQuery) &&
            !customer.status.state5
        );
        setSearchResults(updatedResults);
      } catch (error) {
        console.error("Error loading customer data:", error);
      }
    } else {
      setSearchResults([]);
    }
  };

  return (
    <div className="startpage">
      <div className="search-bar">
        <input
          type="text"
          placeholder="กรุณากรอกเบอร์โทรศัพท์"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <span className="search-button" onClick={handleSearch}>ค้นหา</span>
      </div>

      {searchResults.length > 0 ? (
        <div>
          {searchResults.map((customer, index) => (
            <div key={index}>
              <div className="status-header-container">
                <div className="status-header">
                  {customer.car.brand} {customer.car.selectedModel}{" "}
                  {customer.car.color} {customer.car.numPlate}
                </div>
              </div>

              <div className="status-container">
                <div className="row">
                  <div className="state col col-2">
                    <div className="status-image-container">
                      <div className={`state ${customer.status.state1 ? "status-active" : "status"}`}>
                        <div className="state-circle1"></div>
                        <div className="state-circle2">
                          <img src='./assets/image/car.png'></img>
                        </div>
                      </div>
                    </div>
                    <div className='state-label'>รับรถ</div>
                    <div className='statebutton-container'>
                      <div className={`state ${customer.status.state1 ? "button-true" : "button-false"}`}>เรียบร้อย</div>
                    </div>
                  </div>
                  <div className="state col col-2">
                    <div className="status-image-container">
                      <div className={`state ${customer.status.state2 ? "status-active" : "status"}`}>
                        <div className="state-circle1"></div>
                        <div className="state-circle2">
                          <img src='./assets/image/state2.png'></img>
                        </div>
                      </div>
                    </div>
                    <div className='state-label'>ตรวจสภาพรถ</div>
                    <div className='statebutton-container'>
                      <div className={`state ${customer.status.state2 ? "button-true" : "button-false"}`}>เรียบร้อย</div>
                    </div>
                  </div>
                  <div className="state col col-2">
                    <div className="status-image-container">
                      <div className={`state ${customer.status.state3 ? "status-active" : "status"}`}>
                        <div className="state-circle1"></div>
                        <div className="state-circle2">
                          <img src='./assets/image/state3.png'></img>
                        </div>
                      </div>
                    </div>
                    <div className='state-label'>หาอะไหล่</div>
                    <div className='statebutton-container'>
                      <div className={`state ${customer.status.state3 ? "button-true" : "button-false"}`}>เรียบร้อย</div>
                    </div>
                  </div>
                  <div className="state col col-2">
                    <div className="status-image-container">
                      <div className={`state ${customer.status.state4 ? "status-active" : "status"}`}>
                        <div className="state-circle1"></div>
                        <div className="state-circle2">
                          <img src='./assets/image/state4.png'></img>
                        </div>
                      </div>
                    </div>
                    <div className='state-label'>ดำเนินการซ่อม</div>
                    <div className='statebutton-container'>
                      <div className={`state ${customer.status.state4 ? "button-true" : "button-false"}`}>เรียบร้อย</div>
                    </div>
                  </div>
                  <div className="state col col-2">
                    <div className="status-image-container">
                      <div className={`state ${customer.status.state5 ? "status-active" : "status"}`}>
                        <div className="state-circle1"></div>
                        <div className="state-circle2">
                          <img src='./assets/image/state5.png'></img>
                        </div>
                      </div>
                    </div>
                    <div className='state-label'>ส่งมอบรถ</div>
                    <div className='statebutton-container'>
                      <div className={`state ${customer.status.state5 ? "button-true" : "button-false"}`}>เรียบร้อย</div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="status-price-container">
                <div className="">
                  ราคาโดยประมาณ {customer.totalCost} บาท
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="no-result">ไม่พบผลลัพธ์</div>
      )}
    </div>
  );
};

export default StartPage;