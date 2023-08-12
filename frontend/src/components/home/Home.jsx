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
  const [phoneNumber, setPhoneNumber] = useState('');
  
  const [editingCustomerId, setEditingCustomerId] = useState(null)  

  const [message, setMessage] = useState('');

  useEffect(() => {
    loadCustomers();
  }, []);

  const loadCustomers = async () => {
    try {
      const response = await axios.get('http://localhost:3001/repairs');
      setCustomers(response.data);
      setMessage('');
    } catch (error) {
      console.error('Error loading customer data:', error);
      setMessage('Error loading customer data');
    }
  };

  const handleAddCustomer = async () => {
    try {
      await axios.post('http://localhost:3001/repairs', {
        customerName,
        phoneNumber,
      });
      clearForm();
      setShowModal(false);
      loadCustomers();
    } catch (error) {
      console.error('Error adding customer:', error);
      setMessage('ลงทะเบียนรถไม่สำเร็จ');
    }
  };

  const handleUpdateCustomer = async (id) => {
    try {
      await axios.put(`http://localhost:3001/repairs/${id}`, {
        customerName,
        phoneNumber,
      });
      clearForm();
      setShowModal(false);
      loadCustomers();
    } catch (error) {
      console.error('Error updating customer:', error);
      setMessage('เกิดข้อผิดพลาดในการแก้ไขข้อมูล customer');
    }
  };

  const handleEditCustomer = (customer) => {
    setCustomerName(customer.customer.customerName);
    setPhoneNumber(customer.customer.phoneNumber);
    setEditingCustomerId(customer._id);
    setShowModal(true);
  };

  const handleDeleteCustomer = async (id) => {
    try {
      await axios.delete(`http://localhost:3001/repairs/${id}`);
      loadCustomers();
    } catch (error) {
      console.error('Error deleting customer:', error);
      setMessage('เกิดข้อผิดพลาดในการลบข้อมูลลูกค้า');
    }
  };

  const clearForm = () => {
    setCustomerName('');
    setPhoneNumber('');
    setMessage('');
    setEditingCustomerId(null);
  };

  const [showModal, setShowModal] = useState(false);
  const handleAddCustomerModal = () => {
    setShowModal(true);
  };
  const handleAddCustomerModalClose = () => {
    setShowModal(false);
    clearForm();
  };

  return (
    <div className="container">
      <h2>ระบบลงทะเบียนรถ</h2>
      <table>
        <thead>
          <tr>
            <th>ชื่อลูกค้า</th>
            <th>เบอร์โทรศัพท์</th>
            <th>การดำเนินการ</th>
          </tr>
        </thead>
        <tbody>
          {customers.map((customer, index) => (
            <tr key={index}>
              <td onClick={() => handleEditCustomer(customer)}>{customer.customer.customerName}</td>
              <td>{customer.customer.phoneNumber}</td>
              <td>
                <button onClick={() => handleDeleteCustomer(customer._id)}>ลบ</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      
      <button onClick={handleAddCustomerModal}>ลงทะเบียนรถ</button>

      <Modal isOpen={showModal} onRequestClose={handleAddCustomerModalClose}>
        <div className="">
          <div className="">
            <h3>{editingCustomerId ? 'แก้ไขข้อมูลลูกค้า' : 'ลงทะเบียนรถ'}</h3>
            {message && <div className="message">{message}</div>}
            <form>
              <label>ชื่อลูกค้า:</label>
              <input type="text" value={customerName} onChange={(e) => setCustomerName(e.target.value)} />
              <label>เบอร์โทรศัพท์:</label>
              <input type="text" value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} />
              <button type="button" onClick={editingCustomerId ? () => handleUpdateCustomer(editingCustomerId) : handleAddCustomer}>
                {editingCustomerId ? 'แก้ไข' : 'ลงทะเบียน'}
              </button>
              <button type="button" onClick={handleAddCustomerModalClose}>ยกเลิก</button>
            </form>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default RepairManagement;
