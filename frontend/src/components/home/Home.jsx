// import React from "react";

// function Home() {
//     return(
//         <h2>Home Component</h2>
//     )
// }

// export default Home;



// import { useEffect, useState } from "react";
// import { useNavigate, useLocation } from "react-router-dom";
// import { useCookies } from "react-cookie";
// import axios from "axios";
// import { ToastContainer, toast } from "react-toastify";
// import 'react-toastify/dist/ReactToastify.css';

// const Home = () => {
//   const navigate = useNavigate();
//   const [cookies, removeCookie] = useCookies([]);
//   const [username, setUsername] = useState('');
//   const location=useLocation()
//   useEffect(() => {
//     const verifyCookie = async () => {
//       if (!cookies.token) {
//         navigate("/login");
//       }
//       const { data } = await axios.post(
//         "http://localhost:3001/verify-token",
//         { token: cookies.token },
//         { withCredentials: true }
//       );
//       const { isValid, username } = data;
//       if (isValid) {
//         setUsername(username);
//         console.log(username);
//         toast(`Hello ${username}`, {
//           position: "top-right",
//         });
//       } else {
//         removeCookie("token");
//         navigate("/login");
//       }
//     };
//     verifyCookie();
//   }, [cookies, navigate, removeCookie]);

//   const handleLogout = () => {
//     removeCookie("token");
//     navigate("/login");
//   };

//   return (
//     <>
//       <div className="home_page">
//         <h4>
//           Welcome 
//         </h4>
//       </div>
//       <ToastContainer />
//     </>
//   );
// };

// export default Home;







import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Modal from 'react-modal';

const RepairManagement = () => {
  const [customers, setCustomers] = useState([]);
  const [customerName, setCustomerName] = useState('');

  const [services, setServices] = useState([]);
  const [selectedServices, setSelectedServices] = useState([]);

  const [message, setMessage] = useState('');
  const [repairs, setRepairs] = useState([]);

  const [modalCustomerForm, setModalCustomerForm] = useState(false);
  const [modalRepairForm, setModalRepairForm] = useState(false);

  useEffect(() => {
    loadCustomers();
    loadServices();
    loadRepairs();
  }, []);

  const loadCustomers = async () => {
    try {
      const response = await axios.get('http://localhost:3001/customers');
      setCustomers(response.data);
      setMessage('');
    } catch (error) {
      console.error('เกิดข้อผิดพลาดในการโหลดข้อมูลลูกค้า:', error);
      setMessage('เกิดข้อผิดพลาดในการดึงข้อมูลลูกค้า');
    }
  };

  const loadServices = async () => {
    try {
      const response = await axios.get('http://localhost:3001/services');
      setServices(response.data);
      setMessage('');
    } catch (error) {
      console.error('เกิดข้อผิดพลาดในการโหลดข้อมูลบริการ:', error);
      setMessage('เกิดข้อผิดพลาดในการดึงข้อมูลบริการ');
    }
  };

  const loadRepairs = async () => {
    try {
      const response = await axios.get('http://localhost:3001/repairs');
      setRepairs(response.data);
      setMessage('');
    } catch (error) {
      console.error('เกิดข้อผิดพลาดในการโหลดข้อมูลการซ่อม:', error);
      setMessage('เกิดข้อผิดพลาดในการดึงข้อมูลการซ่อม');
    }
  };

  const handleAddCustomer = async () => {
    try {
      await axios.post('http://localhost:3001/customers', {
        customerName: customerName,
      });
      setCustomerName('');
      loadCustomers();
      setMessage('เพิ่มข้อมูลลูกค้าเรียบร้อยแล้ว');
      setModalCustomerForm(false);
    } catch (error) {
      console.error('เกิดข้อผิดพลาดในการเพิ่มข้อมูลลูกค้า:', error);
      setMessage('เกิดข้อผิดพลาดในการเพิ่มข้อมูลลูกค้า');
    }
  };

  const handleAddRepair = async () => {
    try {
      await axios.post('http://localhost:3001/repairs', {
        serviceIds: selectedServices,
      });
      setSelectedServices([]);
      loadRepairs();
      setMessage('เพิ่มข้อมูลการซ่อมเรียบร้อยแล้ว');
      setModalRepairForm(false);
    } catch (error) {
      console.error('เกิดข้อผิดพลาดในการเพิ่มข้อมูลการซ่อม:', error);
      setMessage('เกิดข้อผิดพลาดในการเพิ่มข้อมูลการซ่อม');
    }
  };

  const editRepair = async (id, repairData) => {
    try {
      await axios.put(`http://localhost:3001/repairs/${id}`, repairData);
      loadRepairs();
      setMessage('แก้ไขข้อมูลการซ่อมเรียบร้อยแล้ว');
    } catch (error) {
      console.error('เกิดข้อผิดพลาดในการแก้ไขข้อมูลการซ่อม:', error);
      setMessage('เกิดข้อผิดพลาดในการแก้ไขข้อมูลการซ่อม');
    }
  };

  const deleteRepair = async (id) => {
    try {
      await axios.delete(`http://localhost:3001/repairs/${id}`);
      loadRepairs();
      setMessage('ลบข้อมูลการซ่อมเรียบร้อยแล้ว');
    } catch (error) {
      console.error('เกิดข้อผิดพลาดในการลบข้อมูลการซ่อม:', error);
      setMessage('เกิดข้อผิดพลาดในการลบข้อมูลการซ่อม');
    }
  };

  return (
    <div className='container'>
      <h2>จัดการข้อมูลการซ่อม</h2>
      {message && <div className='message'>{message}</div>}
      <button onClick={() => setModalCustomerForm(true)}>เพิ่มข้อมูลลูกค้า</button>
      

      <Modal isOpen={modalCustomerForm} onRequestClose={() => setModalCustomerForm(false)}>
        <form>
          <label>ชื่อลูกค้า:</label>
          <input type='text' value={customerName} onChange={(e) => setCustomerName(e.target.value)} />
          <button type='button' onClick={handleAddCustomer}>
            เพิ่ม
          </button>
        </form>
        <button onClick={() => setModalCustomerForm(false)}>ปิด</button>
      </Modal>

      <Modal isOpen={modalRepairForm} onRequestClose={() => setModalRepairForm(false)}>
        <form>
          <label>บริการที่เกี่ยวข้อง:</label>
          <select
            multiple
            value={selectedServices}
            onChange={(e) => setSelectedServices(Array.from(e.target.selectedOptions, (option) => option.value))}
          >
            {services.map((service) => (
              <option key={service._id} value={service._id}>
                {service.serviceName}
              </option>
            ))}
          </select>
          <button type='button' onClick={handleAddRepair}>
            เพิ่ม
          </button>
        </form>
        <button onClick={() => setModalRepairForm(false)}>ปิด</button>
      </Modal>

      <table>
        <thead>
          <tr>
            <th>ชื่อลูกค้า</th>
            <th>บริการที่เกี่ยวข้อง</th>
            <th>การจัดการ</th>
          </tr>
        </thead>
        <tbody>
          {repairs.map((repair) => (
            <tr key={repair._id}>
              <td>{repair.customerName}</td>
              <td>
                {repair.services.map((service) => (
                  <div key={service._id}>
                    <p>{service.serviceName}</p>
                    <ul>
                      {service.parts.map((part) => (
                        <li key={part._id}>{part.partName}</li>
                      ))}
                    </ul>
                  </div>
                ))}
              </td>
              <td>
              <button onClick={() => setModalRepairForm(true)}>เพิ่มข้อมูลการซ่อม</button>
                <button onClick={() => editRepair(repair._id, repair)}>แก้ไข</button>
                <button onClick={() => deleteRepair(repair._id)}>ลบ</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default RepairManagement;
