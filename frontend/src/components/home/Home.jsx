import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Modal from 'react-bootstrap/Modal';
import { Link, useNavigate } from 'react-router-dom';

const Repair = () => {
  const [brandmodels, setBrandModels] = useState([]);
  const [customers, setCustomers] = useState([]);

  const [numPlate, setNumPlate] = useState('');
  const [brand, setBrand] = useState('');
  const [customBrand, setCustomBrand] = useState('');
  const [lineId, setLineId] = useState('');
  const [customerName, setCustomerName] = useState('');
  const [selectedModel, setSelectedModel] = useState('');
  const [customModel, setCustomModel] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [color, setColor] = useState('');
  const [startdate, setStartDate] = useState('');


  const [editingCustomerId, setEditingCustomerId] = useState(null);

  const [message, setMessage] = useState('');
  const [showModal, setShowModal] = useState(false);

  

  useEffect(() => {
    loadBrandModels();
    loadCustomers();
  }, []);

  const loadBrandModels = async () => {
    try {
      const response = await axios.get('http://localhost:3001/brandmodels');
      setBrandModels(response.data);
    } catch (error) {
      console.error('Error loading brand models:', error);
    }
  };

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

  // const handleAddCustomer = async () => {
  //   try {
  //     let brandId = null;

  //     // Check if the entered brand exists in brandmodels
  //     const existingBrand = brandmodels.find((brandmodel) => brandmodel.brand === brand);
  //     if (!existingBrand) {
  //       // If brand doesn't exist, add it to brandmodels
  //       const response = await axios.post('http://localhost:3001/brandmodels', {
  //         brand,
  //         model: selectedModel,
  //       });
  //       brandId = response.data._id;
  //     } else {
  //       brandId = existingBrand._id;
  //     }

  //     await axios.post('http://localhost:3001/repairs', {
  //       numPlate,
  //       lineId,
  //       brand,
  //       customerName,
  //       phoneNumber,
  //       selectedModel,
  //       color,
  //       startdate,
  //     });
  //     clearForm();
  //     setShowModal(false);
  //     loadCustomers();
  //   } catch (error) {
  //     console.error('Error adding customer:', error);
  //     setMessage('ลงทะเบียนรถไม่สำเร็จ');
  //   }
  // };

  const handleUpdateCustomer = async (id) => {
    try {
      // let brandId = null;

      // // Check if the entered brand exists in brandmodels
      // const existingBrand = brandmodels.find((brandmodel) => brandmodel.brand === brand);
      // if (!existingBrand) {
      //   // If brand doesn't exist, add it to brandmodels
      //   const response = await axios.post('http://localhost:3001/brandmodels', {
      //     brand,
      //     model: selectedModel,
      //   });
      //   brandId = response.data._id;
      // } else {
      //   brandId = existingBrand._id;
      // }

      await axios.put(`http://localhost:3001/repairs/${id}`, {
        numPlate,
        lineId,
        brand: customBrand || brand,
        customerName,
        phoneNumber,
        selectedModel: customModel || selectedModel,
        color,
        startdate,
      });

      if (customModel) {
        await axios.post('http://localhost:3001/brandmodels', {
          brand: customBrand || brand,
          model: customModel,
        });
      }
      // clearForm();
      setShowModal(false);
      loadCustomers();
    } catch (error) {
      console.error('Error updating customer:', error);
      setMessage('เกิดข้อผิดพลาดในการแก้ไขข้อมูล customer');
    }
  };


  const handleEditCustomer = (customer) => {
    setNumPlate(customer.car.numPlate);
    setLineId(customer.customer.lineId);
    setBrand(customer.car.brand);
    setCustomerName(customer.customer.customerName);
    setPhoneNumber(customer.customer.phoneNumber);
    setSelectedModel(customer.car.selectedModel);
    setColor(customer.car.color);
    setStartDate(customer.startdate);
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

  // const clearForm = () => {
  //   setNumPlate('');
  //   setLineId('');
  //   setBrand('');
  //   setCustomerName('');
  //   setPhoneNumber('');
  //   setSelectedModel('');
  //   setColor('');
  //   setStartDate('');
  //   setMessage('');
  //   setEditingCustomerId(null);
  // };

  // const handleAddCustomerModal = () => {
  //   setShowModal(true);
  // };

  const handleAddCustomerModalClose = () => {
    setShowModal(false);
    // clearForm();
    // setBrand('');
    // setSelectedModel('');
  };

  const handleBrandChange = (e) => {
    setBrand(e.target.value);
    setSelectedModel('');
    setCustomBrand('');
    setCustomModel('');
  };

  const handleModelChange = (e) => {
    setSelectedModel(e.target.value);
    if (e.target.value === 'custom-model') {
      setCustomModel('');
    }
  };

  // const handleAddBrandModel = async () => {
  //   try {
  //     const response = await axios.post('http://localhost:3001/brandmodels', {
  //       brand: customBrand || brand,
  //       model: customModel,
  //     });
  //     setBrandModels([...brandmodels, response.data]);
  //     setSelectedModel(response.data.model);
  //     // setShowModal(false);  // ไม่ปิด Modal
  //   } catch (error) {
  //     console.error('Error adding brand and model:', error);
  //   }
  // };


  return (
    <div className="container">
      <h2>ระบบลงทะเบียนรถ</h2>
      <table>
        <thead>
          <tr>
            <th>ป้ายทะเบียน</th>
            <th>การดำเนินการ</th>
          </tr>
        </thead>
        <tbody>
          {customers.map((customer, index) => (
            <tr key={index}>
              <td onClick={() => handleEditCustomer(customer)}>{customer.car.numPlate}</td>
              <td>
                <button onClick={() => handleDeleteCustomer(customer._id)}>ลบ</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <Link to="/carregis">
        <button>ลงทะเบียนรถ</button>
      </Link>
      <Modal show={showModal} onHide={handleAddCustomerModalClose} backdrop="static" size="xl" centered>
        <Modal.Header closeButton>
          <Modal.Title>{editingCustomerId ? 'แก้ไขข้อมูลลูกค้า' : 'ลงทะเบียนรถ'}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="">
            <div className="">
              <div>
                {editingCustomerId ? 'แก้ไขข้อมูลลูกค้า' : 'ลงทะเบียนรถ'}
              </div>

              {message && <div className="message">{message}</div>}

              <form>
                <label>ป้ายทะเบียน เช่น XX 0000 NARATHIWAT</label>
                <input
                  type="text"
                  className="form-control"
                  value={numPlate}
                  onChange={(e) => setNumPlate(e.target.value)}
                />
                <label>LINE ID</label>
                <input
                  type="text"
                  className="form-control"
                  value={lineId}
                  onChange={(e) => setLineId(e.target.value)}
                />
                <div>
                  <label>ยี่ห้อรถ:</label>
                  <select value={brand} onChange={handleBrandChange}>
                    <option value="">กรุณาเลือก</option>
                    {Array.from(new Set(brandmodels.map((brandmodel) => brandmodel.brand))).map((uniqueBrand) => (
                      <option key={uniqueBrand} value={uniqueBrand}>
                        {uniqueBrand}
                      </option>
                    ))}
                    <option value="other">อื่นๆ</option>
                  </select>
                  {brand === 'other' && (
                    <input
                      type="text"
                      value={customBrand}
                      onChange={(e) => setCustomBrand(e.target.value)}
                      placeholder="กรอกยี่ห้อรถ"
                    />
                  )}
                </div>
                <label>ชื่อลูกค้า:</label>
                <input
                  type="text"
                  className="form-control"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                />
                <div>
                  <label>รุ่นรถ:</label>
                  <select value={selectedModel} onChange={handleModelChange}>
                    <option value="">กรุณาเลือก</option>
                    {brandmodels
                      .filter((brandmodel) => brandmodel.brand === brand)
                      .map((brandmodel) => (
                        <option key={brandmodel._id} value={brandmodel.model}>
                          {brandmodel.model}
                        </option>
                      ))}
                    <option value="custom-model">
                      {customModel ? customModel : 'กรุณากรอกรุ่นรถ'}
                    </option>
                  </select>
                  {selectedModel === 'custom-model' && (
                    <>
                      <input
                        type="text"
                        value={customModel}
                        onChange={(e) => setCustomModel(e.target.value)}
                        placeholder="กรอกรุ่นรถ"
                      />
                      {/* <button onClick={handleAddBrandModel}>เพิ่มยี่ห้อและรุ่น</button> */}
                    </>
                  )}
                </div>
                <label>เบอร์โทรศัพท์:</label>
                <input
                  type="number"
                  className="form-control"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                />
                <div>
                  <label>สี:</label>
                  <select
                    value={color}
                    onChange={(e) => setColor(e.target.value)}
                    className="form-control"
                  >
                    <option value="">กรุณาเลือก</option>
                    <option value="red">แดง</option>
                    <option value="blue">น้ำเงิน</option>
                    <option value="yellow">เหลือง</option>
                    <option value="white">ขาว</option>
                    <option value="black">ดำ</option>
                    <option value="purple">ม่วง</option>
                    <option value="green">เขียว</option>
                    <option value="orange">ส้ม</option>
                    <option value="brown">น้ำตาล</option>
                    <option value="pink">ชมพู</option>
                    <option value="lightblue">ฟ้า</option>
                    <option value="grey">เทา</option>
                  </select>
                  <div>
                    <label>วันที่:</label>
                    <input
                      type="date"
                      value={startdate}
                      onChange={(e) => setStartDate(e.target.value)}
                      className="form-control"
                    />
                  </div>

                </div>

              </form>
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <button type="button" onClick={() => handleUpdateCustomer(editingCustomerId)}>
            แก้ไข
          </button>
          <button type="button" onClick={handleAddCustomerModalClose}>ยกเลิก</button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default Repair;







// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import { Link, useNavigate } from 'react-router-dom';

// const Repair = () => {
//     const [brandmodels, setBrandModels] = useState([]);
//   const [customers, setCustomers] = useState([]);

//   const [numPlate, setNumPlate] = useState('');
//   const [brand, setBrand] = useState('');
//   const [customBrand, setCustomBrand] = useState('');
//   const [lineId, setLineId] = useState('');
//   const [customerName, setCustomerName] = useState('');
//   const [selectedModel, setSelectedModel] = useState('');
//   const [customModel, setCustomModel] = useState('');
//   const [phoneNumber, setPhoneNumber] = useState('');
//   const [color, setColor] = useState('');
//   const [startdate, setStartDate] = useState('');


//   const [editingCustomerId, setEditingCustomerId] = useState(null);

//   const [message, setMessage] = useState('');

//   const navigate = useNavigate();

//   useEffect(() => {
//     loadCustomers();
//   }, []);

//   const loadCustomers = async () => {
//     try {
//       const response = await axios.get('http://localhost:3001/repairs');
//       setCustomers(response.data);
//       setMessage('');
//     } catch (error) {
//       console.error('Error loading customer data:', error);
//       setMessage('Error loading customer data');
//     }
//   };

//   const handleDeleteCustomer = async (id) => {
//     try {
//       await axios.delete(`http://localhost:3001/repairs/${id}`);
//       loadCustomers();
//     } catch (error) {
//       console.error('Error deleting customer:', error);
//       setMessage('Error deleting customer');
//     }
//   };

//   const handleEditCustomer = (customerData) => {
//     setNumPlate(customerData.car.numPlate);
//     setLineId(customerData.customer.lineId);
//     setBrand(customerData.car.brand);
//     setCustomerName(customerData.customer.customerName);
//     setPhoneNumber(customerData.customer.phoneNumber);
//     setSelectedModel(customerData.car.selectedModel);
//     setColor(customerData.car.color);
//     setStartDate(customerData.car.startdate);
//     navigate('/carregis');
//   };

//   return (
//     <div className="container">
//       <h2>ระบบลงทะเบียนรถ</h2>
//       <table>
//         <thead>
//           <tr>
//             <th>ป้ายทะเบียน</th>
//             <th>LINE ID</th>
//             <th>ชื่อลูกค้า</th>
//             <th>เบอร์โทรศัพท์</th>
//             <th>การดำเนินการ</th>
//           </tr>
//         </thead>
//         <tbody>
//           {customers.map((customer, index) => (
//             <tr key={index}>
//               <td onClick={() => handleEditCustomer(customer)}>{customer.car.numPlate}</td>
//               <td>{customer.customer.lineId}</td>
//               <td>{customer.customer.customerName}</td>
//               <td>{customer.customer.phoneNumber}</td>
//               <td>
//                 <button onClick={() => handleDeleteCustomer(customer._id)}>ลบ</button>
//               </td>
//             </tr>
//           ))}
//         </tbody>
//       </table>

//       <Link to="/carregis">
//         <button>ลงทะเบียนรถ</button>
//       </Link>
//     </div>
//   );
// };

// export default Repair;


