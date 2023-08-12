// import React, { useState, useEffect } from 'react';
// import axios from 'axios';

// const RepairManagement = () => {
//   const [customers, setCustomers] = useState([]);
//   const [selectedCustomer, setSelectedCustomer] = useState('');
//   const [services, setServices] = useState([]);
//   const [selectedServices, setSelectedServices] = useState([]);
//   const [message, setMessage] = useState('');
//   const [repairs, setRepairs] = useState([]);

//   useEffect(() => {
//     loadCustomers();
//     loadServices();
//     loadRepairs();
//   }, []);

//   const loadCustomers = async () => {
//     try {
//       const response = await axios.get('http://localhost:3001/customers');
//       setCustomers(response.data);
//       setMessage('');
//     } catch (error) {
//       console.error('เกิดข้อผิดพลาดในการโหลดข้อมูลลูกค้า:', error);
//       setMessage('เกิดข้อผิดพลาดในการดึงข้อมูลลูกค้า');
//     }
//   };

//   const loadServices = async () => {
//     try {
//       const response = await axios.get('http://localhost:3001/services');
//       setServices(response.data);
//       setMessage('');
//     } catch (error) {
//       console.error('เกิดข้อผิดพลาดในการโหลดข้อมูลบริการ:', error);
//       setMessage('เกิดข้อผิดพลาดในการดึงข้อมูลบริการ');
//     }
//   };

//   const loadRepairs = async () => {
//     try {
//       const response = await axios.get('http://localhost:3001/repairs');
//       setRepairs(response.data);
//       setMessage('');
//     } catch (error) {
//       console.error('เกิดข้อผิดพลาดในการโหลดข้อมูลการซ่อม:', error);
//       setMessage('เกิดข้อผิดพลาดในการดึงข้อมูลการซ่อม');
//     }
//   };

//   const handleAddRepair = async () => {
//     try {
//       await axios.post('http://localhost:3001/repairs', {
//         customerId: selectedCustomer,
//         serviceIds: selectedServices,
//       });
//       setSelectedCustomer('');
//       setSelectedServices([]);
//       loadRepairs();
//       setMessage('เพิ่มข้อมูลการซ่อมเรียบร้อยแล้ว');
//     } catch (error) {
//       console.error('เกิดข้อผิดพลาดในการเพิ่มข้อมูลการซ่อม:', error);
//       setMessage('เกิดข้อผิดพลาดในการเพิ่มข้อมูลการซ่อม');
//     }
//   };

//   const editRepair = async (id, repairData) => {
//     try {
//       await axios.put(`http://localhost:3001/repairs/${id}`, repairData);
//       loadRepairs();
//       setMessage('แก้ไขข้อมูลการซ่อมเรียบร้อยแล้ว');
//     } catch (error) {
//       console.error('เกิดข้อผิดพลาดในการแก้ไขข้อมูลการซ่อม:', error);
//       setMessage('เกิดข้อผิดพลาดในการแก้ไขข้อมูลการซ่อม');
//     }
//   };

//   const deleteRepair = async (id) => {
//     try {
//       await axios.delete(`http://localhost:3001/repairs/${id}`);
//       loadRepairs();
//       setMessage('ลบข้อมูลการซ่อมเรียบร้อยแล้ว');
//     } catch (error) {
//       console.error('เกิดข้อผิดพลาดในการลบข้อมูลการซ่อม:', error);
//       setMessage('เกิดข้อผิดพลาดในการลบข้อมูลการซ่อม');
//     }
//   };

//   return (
//     <div className='container'>
//       <h2>จัดการข้อมูลการซ่อม</h2>
//       {message && 
//       <div className='message'>
//         {message}
//         </div>}
//       <form>
//         <label>ชื่อลูกค้า:</label>
//         <select 
//         value={selectedCustomer} 
//         onChange={(e) => setSelectedCustomer(e.target.value)}>
//           <option value=''>-- เลือกลูกค้า --</option>
//           {customers.map((customer) => (
//             <option key={customer._id} value={customer._id}>
//               {customer.customerName}
//             </option>
//           ))}
//         </select>
//         <label>บริการที่เกี่ยวข้อง:</label>
//         <select
//           multiple
//           value={selectedServices}
//           onChange={(e) => setSelectedServices(Array.from(e.target.selectedOptions, (option) => option.value))}
//         >
//           {services.map((service) => (
//             <option key={service._id} value={service._id}>
//               {service.serviceName}
//             </option>
//           ))}
//         </select>
//         <button type='button' onClick={handleAddRepair}>
//           เพิ่ม
//         </button>
//       </form>
//       <table>
//         <thead>
//           <tr>
//             <th>ชื่อลูกค้า</th>
//             <th>บริการที่เกี่ยวข้อง</th>
//             <th>การจัดการ</th>
//           </tr>
//         </thead>
//         <tbody>
//           {repairs.map((repair) => (
//             <tr key={repair._id}>
//               <td>{repair.customerName}</td>
//               <td>
//                 {repair.services.map((service) => (
//                   <div key={service._id}>
//                     <p>{service.serviceName}</p>
//                     <ul>
//                       {service.parts.map((part) => (
//                         <li key={part._id}>{part.partName}</li>
//                       ))}
//                     </ul>
//                   </div>
//                 ))}
//               </td>
//               <td>
//                 <button onClick={() => editRepair(repair._id, repair)}>แก้ไข</button>
//                 <button onClick={() => deleteRepair(repair._id)}>ลบ</button>
//               </td>
//             </tr>
//           ))}
//         </tbody>
//       </table>
//     </div>
//   );
// };

// export default RepairManagement;
