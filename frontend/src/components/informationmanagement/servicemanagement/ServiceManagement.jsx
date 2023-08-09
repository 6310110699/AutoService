// import React, { useState, useEffect } from 'react';
// import axios from 'axios';

// const ServiceManagement = () => {
//   const [services, setServices] = useState([]);
//   const [serviceName, setServiceName] = useState('');
//   const [selectedSpareParts, setSelectedSpareParts] = useState([]); // ให้มี state สำหรับเก็บอะไหล่ที่เลือกในแต่ละรายการบริการ
//   const [spareParts, setSpareParts] = useState([]);
//   const [message, setMessage] = useState('');

//   useEffect(() => {
//     loadServices();
//     loadSpareParts();
//   }, []);

//   const loadServices = async () => {
//     try {
//       const response = await axios.get('http://localhost:3001/repairrecord');
//       setServices(response.data);
//       setMessage('');
//     } catch (error) {
//       console.error('เกิดข้อผิดพลาดในการโหลดข้อมูลรายการซ่อม:', error);
//       setMessage('เกิดข้อผิดพลาดในการดึงข้อมูลรายการซ่อม');
//     }
//   };

//   const loadSpareParts = async () => {
//     try {
//       const response = await axios.get('http://localhost:3001/spares');
//       setSpareParts(response.data);
//       setMessage('');
//     } catch (error) {
//       console.error('เกิดข้อผิดพลาดในการโหลดข้อมูลอะไหล่:', error);
//       setMessage('เกิดข้อผิดพลาดในการดึงข้อมูลอะไหล่');
//     }
//   };

//   const handleAddService = async () => {
//     try {
//       await axios.post('http://localhost:3001/repairrecord', {
//         name: serviceName,
//         sparePart: selectedSpareParts, // ส่งข้อมูลอะไหล่ที่เลือกในแต่ละรายการ
//         price: calculateServicePrice(selectedSpareParts),
//       });
//       loadServices();
//       clearForm();
//     } catch (error) {
//       console.error('เกิดข้อผิดพลาดในการเพิ่มข้อมูลบริการ:', error);
//       setMessage('เกิดข้อผิดพลาดในการเพิ่มข้อมูลบริการ');
//     }
//   };

//   const calculateServicePrice = (selectedSpareParts) => {
//     const totalPrice = selectedSpareParts.reduce((total, sparePartId) => {
//       const sparePart = spareParts.find((spare) => spare._id === sparePartId);
//       return total + (sparePart ? sparePart.sparePrice : 0);
//     }, 0);
//     return totalPrice;
//   };

//   const handleDeleteService = async (id) => {
//     try {
//       await axios.delete(`http://localhost:3001/repairrecord/${id}`);
//       loadServices();
//       setMessage('ลบข้อมูลบริการเรียบร้อยแล้ว');
//     } catch (error) {
//       console.error('เกิดข้อผิดพลาดในการลบข้อมูลบริการ:', error);
//       setMessage('เกิดข้อผิดพลาดในการลบข้อมูลบริการ');
//     }
//   };

//   const clearForm = () => {
//     setServiceName('');
//     setSelectedSpareParts([]);
//     setMessage('');
//   };

//   const handleEditService = (service) => {
//     setServiceName(service.name);
//     setSelectedSpareParts(service.sparePart.map((spare) => spare._id));
//   };

//   return (
//     <div>
//       <h2>จัดการข้อมูลบริการ</h2>
//       {message && <div>{message}</div>}
//       <form>
//         <label>ชื่อบริการ:</label>
//         <input type="text" value={serviceName} onChange={(e) => setServiceName(e.target.value)} />
//         <label>อะไหล่ที่ใช้ในบริการ:</label>
//         <select
//           multiple
//           value={selectedSpareParts}
//           onChange={(e) => setSelectedSpareParts(Array.from(e.target.selectedOptions, (option) => option.value))}
//         >
//           {spareParts.map((spare) => (
//             <option key={spare._id} value={spare._id}>
//               {spare.spareName} ({spare.spareType}) - ราคา: {spare.sparePrice} บาท
//             </option>
//           ))}
//         </select>
//         <button type="button" onClick={handleAddService}>
//           เพิ่ม
//         </button>
//       </form>
//       <table>
//         <thead>
//           <tr>
//             <th>ชื่อลูกค้า</th>
//             <th>อะไหล่ที่ใช้ในบริการ</th>
//             <th>ราคา</th>
//             <th>การดำเนินการ</th>
//           </tr>
//         </thead>
//         <tbody>
//           {services.map((service) => (
//             <tr key={service._id}>
//               <td>{service.name}</td>
//               <td>
//                 {service.sparePart.map((spare) => (
//                   <div key={spare._id}>
//                     {spare.spareName} ({spare.spareType}) - ราคา: {spare.sparePrice} บาท
//                   </div>
//                 ))}
//               </td>
//               <td>{service.price}</td>
//               <td>
//                 <button onClick={() => handleEditService(service)}>แก้ไข</button>
//                 <button onClick={() => handleDeleteService(service._id)}>ลบ</button>
//               </td>
//             </tr>
//           ))}
//         </tbody>
//       </table>
//     </div>
//   );
// };

// export default ServiceManagement;


import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ServiceManagement = () => {
  const [services, setServices] = useState([]);
  const [serviceName, setServiceName] = useState('');
  const [selectedSpares, setSelectedSpares] = useState([]);
  const [spares, setSpares] = useState([]);
  const [sparesByCategory, setSparesByCategory] = useState([]);
  const [sparePrices, setSparePrices] = useState({});
  const [message, setMessage] = useState('');

  useEffect(() => {
    loadServices();
    loadSpares();
    loadSparePrices();
  }, []);

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

  const loadSpares = async () => {
    try {
      const response = await axios.get('http://localhost:3001/spares');
      const sparesData = response.data;

      // Group spares by category
      const sparesGroupedByCategory = {};
      sparesData.forEach((spare) => {
        if (!sparesGroupedByCategory[spare.spareType]) {
          sparesGroupedByCategory[spare.spareType] = [];
        }
        sparesGroupedByCategory[spare.spareType].push(spare);
      });

      // Convert the grouped data into an array
      const sparesByCategory = Object.keys(sparesGroupedByCategory).map((spareType) => ({
        categoryName: spareType,
        spares: sparesGroupedByCategory[spareType],
      }));

      setSparesByCategory(sparesByCategory);
      setSpares(response.data);
      setMessage('');
    } catch (error) {
      console.error('เกิดข้อผิดพลาดในการโหลดข้อมูลอะไหล่:', error);
      setMessage('เกิดข้อผิดพลาดในการดึงข้อมูลอะไหล่');
    }
  };

  const loadSparePrices = async () => {
    try {
      const response = await axios.get('http://localhost:3001/spares');
      const prices = {};
      response.data.forEach((spare) => {
        prices[spare._id] = spare.sparePrice;
      });
      setSparePrices(prices);
      setMessage('');
    } catch (error) {
      console.error('เกิดข้อผิดพลาดในการโหลดข้อมูลราคาอะไหล่:', error);
      setMessage('เกิดข้อผิดพลาดในการดึงข้อมูลราคาอะไหล่');
    }
  };

  const handleAddService = async () => {
    try {
      await axios.post('http://localhost:3001/services', {
        serviceName,
        spares: selectedSpares,
      });
      loadServices();
      clearForm();
    } catch (error) {
      console.error('เกิดข้อผิดพลาดในการเพิ่มข้อมูลบริการ:', error);
      setMessage('เกิดข้อผิดพลาดในการเพิ่มข้อมูลบริการ');
    }
  };

  const handleUpdateService = async (id) => {
    try {
      await axios.put(`http://localhost:3001/services/${id}`, {
        serviceName,
        spares: selectedSpares,
      });
      loadServices();
      clearForm();
    } catch (error) {
      console.error('เกิดข้อผิดพลาดในการแก้ไขข้อมูลบริการ:', error);
      setMessage('เกิดข้อผิดพลาดในการแก้ไขข้อมูลบริการ');
    }
  };

  const handleDeleteService = async (id) => {
    try {
      await axios.delete(`http://localhost:3001/services/${id}`);
      loadServices();
      setMessage('ลบข้อมูลบริการเรียบร้อยแล้ว');
    } catch (error) {
      console.error('เกิดข้อผิดพลาดในการลบข้อมูลบริการ:', error);
      setMessage('เกิดข้อผิดพลาดในการลบข้อมูลบริการ');
    }
  };

  const clearForm = () => {
    setServiceName('');
    setSelectedSpares([]);
    setMessage('');
  };

  return (
    <div className='container'>
      <h2>จัดการข้อมูลบริการ</h2>
      {message && <div className='message'>{message}</div>}
      <form>
        <label>ชื่อบริการ:</label>
        <input type='text' value={serviceName} onChange={(e) => setServiceName(e.target.value)} />
        <label>อะไหล่ที่ใช้ในบริการ:</label>
        <select
          multiple
          value={selectedSpares}
          onChange={(e) => setSelectedSpares(Array.from(e.target.selectedOptions, (option) => option.value))}
        >
          {sparesByCategory.map((category) => (
            <optgroup key={category.categoryName} label={category.categoryName}>
              {category.spares.map((spare) => (
                <option key={spare._id} value={spare._id}>
                  {spare.spareName}
                </option>
              ))}
            </optgroup>
          ))}
        </select>
        <button type='button' onClick={handleAddService}>
          เพิ่ม
        </button>
      </form>
      <table>
        <thead>
          <tr>
            <th>ชื่อบริการ</th>
            <th>อะไหล่ที่ใช้ในบริการ</th>
            <th>ราคา</th>
            <th>การดำเนินการ</th>
          </tr>
        </thead>
        <tbody>
          {services.map((service) => (
            <tr key={service._id}>
              <td>{service.serviceName}</td>
              <td>
                {service.spares.map((spareId) => {
                  const spare = spares.find((spare) => spare._id === spareId);
                  return (
                    <div key={spareId}>
                      {spare ? `${spare.spareName}` : 'อะไหล่ไม่ถูกพบ'}
                    </div>
                  );
                })}
              </td>
              <td>
                {service.spares.map((spareId) => {
                  const sparePrice = sparePrices[spareId];
                  return (
                    <div key={spareId}>
                      {sparePrice ? `${sparePrice} บาท` : '-'}
                    </div>
                  );
                })}
              </td>
              <td>
                <button onClick={() => handleUpdateService(service._id)}>แก้ไข</button>
                <button onClick={() => handleDeleteService(service._id)}>ลบ</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ServiceManagement;
