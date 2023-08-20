import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams,useNavigate } from 'react-router-dom';

const CarRegistration = () => {
    // const { id } = useParams();

    const [brandmodels, setBrandModels] = useState([]);
    // const [customers, setCustomers] = useState([]);

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


    // const [editingCustomerId, setEditingCustomerId] = useState(null);

    const [message, setMessage] = useState('');

    const navigate = useNavigate();

    useEffect(() => {
        loadBrandModels();
        // loadCustomers();

        // if (id) {
        //     loadCustomerDataForEditing(id);
        //   }
    }, []);

    const loadBrandModels = async () => {
        try {
            const response = await axios.get('http://localhost:3001/brandmodels');
            setBrandModels(response.data);
        } catch (error) {
            console.error('Error loading brand models:', error);
        }
    };

    // const loadCustomers = async () => {
    //     try {
    //         const response = await axios.get('http://localhost:3001/repairs');
    //         setCustomers(response.data);
    //         setMessage('');
    //     } catch (error) {
    //         console.error('Error loading customer data:', error);
    //         setMessage('Error loading customer data');
    //     }
    // };

    //   const loadCustomerDataForEditing = async (customerId) => {
    //     try {
    //       const response = await axios.get(`http://localhost:3001/repairs/${customerId}`);
    //       const customerData = response.data;
    //       setNumPlate(customerData.numPlate);
    //       setLineId(customerData.customer.lineId);
    //       setBrand(customerData.car.brand);
    //       setCustomerName(customerData.customer.customerName);
    //       setSelectedModel(customerData.car.selectedModel);
    //       setPhoneNumber(customerData.customer.phoneNumber);
    //       setColor(customerData.car.color);
    //       setStartDate(customerData.car.startdate);
    //       setEditingCustomerId(customerId);
    //     } catch (error) {
    //       console.error('Error loading customer data for editing:', error);
    //       setMessage('Error loading customer data for editing');
    //     }
    //   };

    const handleAddCustomer = async () => {
        try {
            await axios.post('http://localhost:3001/repairs', {
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

            // const response = await axios.post('http://localhost:3001/brandmodels', {
            //     brand: customBrand || brand,
            //     model: customModel,
            // });

            // clearForm();
            // loadCustomers();
            navigate('/home');
        } catch (error) {
            console.error('Error adding customer:', error);
            setMessage('ลงทะเบียนรถไม่สำเร็จ');
        }
    };

    // const handleUpdateCustomer = async (id) => {
    //     try {
    //         let brandId = null;

    //         const existingBrand = brandmodels.find((brandmodel) => brandmodel.brand === brand);
    //         if (!existingBrand) {

    //             const response = await axios.post('http://localhost:3001/brandmodels', {
    //                 brand,
    //                 model: selectedModel,
    //             });
    //             brandId = response.data._id;
    //         } else {
    //             brandId = existingBrand._id;
    //         }

    //         await axios.put(`http://localhost:3001/repairs/${id}`, {
    //             numPlate,
    //             lineId,
    //             brand,
    //             customerName,
    //             phoneNumber,
    //             selectedModel,
    //             color,
    //             startdate,
    //         });
    //         clearForm();
    //         loadCustomers();
    //     } catch (error) {
    //         console.error('Error updating customer:', error);
    //         setMessage('เกิดข้อผิดพลาดในการแก้ไขข้อมูล customer');
    //     }
    // };

    // const clearForm = () => {
    //     setNumPlate('');
    //     setLineId('');
    //     setBrand('');
    //     setCustomerName('');
    //     setPhoneNumber('');
    //     setSelectedModel('');
    //     setColor('');
    //     setStartDate('');
    //     setMessage('');
    //     setEditingCustomerId(null);
    // };

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
    //     try {
    //         const response = await axios.post('http://localhost:3001/brandmodels', {
    //             brand: customBrand || brand,
    //             model: customModel,
    //         });
    //         setBrandModels([...brandmodels, response.data]);
    //         setSelectedModel(response.data.model);
    //     } catch (error) {
    //         console.error('Error adding brand and model:', error);
    //     }
    // };


    return (
        <div className="">
            <div className="">
                <div className="">
                    <div>
                        ลงทะเบียนรถ
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
                                    {/* <button>เพิ่มยี่ห้อและรุ่น</button> */}
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
            <button type="button" onClick={handleAddCustomer}>
  ลงทะเบียน
</button>

        </div>
    );
};

export default CarRegistration;



// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import { useParams } from 'react-router-dom';

// const CarRegistration = () => {
//   const [brandmodels, setBrandModels] = useState([]);
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

//   const { id } = useParams();

//   useEffect(() => {
//     loadBrandModels();
//     if (id) {
//       loadCustomerData(id);
//     }
//   }, [id]);

//   const handleBrandChange = (e) => {
//     setBrand(e.target.value);
//     setSelectedModel('');
//     setCustomBrand('');
//     setCustomModel('');
//   };

//   const loadBrandModels = async () => {
//     try {
//       const response = await axios.get('http://localhost:3001/brandmodels');
//       setBrandModels(response.data);
//     } catch (error) {
//       console.error('Error loading brand models:', error);
//     }
//   };

//   const loadCustomerData = async (customerId) => {
//     try {
//       const response = await axios.get(`http://localhost:3001/repairs/${customerId}`);
//       const customerData = response.data;

//       setNumPlate(customerData.car.numPlate);
//       setLineId(customerData.customer.lineId);
//       setBrand(customerData.car.brand);
//       setCustomerName(customerData.customer.customerName);
//       setPhoneNumber(customerData.customer.phoneNumber);
//       setSelectedModel(customerData.car.selectedModel);
//       setColor(customerData.car.color);
//       setStartDate(customerData.car.startdate);
//       setEditingCustomerId(customerData._id);
//     } catch (error) {
//       console.error('Error loading customer data:', error);
//     }
//   };


//     const handleModelChange = (e) => {
//         setSelectedModel(e.target.value);
//     };

//     const handleAddBrandModel = async () => {
//         // เพิ่มโค้ดเมื่อต้องการเพิ่มยี่ห้อและรุ่น
//     };

//     const handleSubmit = async (e) => {
//         e.preventDefault();
//         try {
//             const brandId = await handleAddBrandModel();

//             const data = {
//                 numPlate,
//                 customer: {
//                     lineId,
//                     customerName,
//                     phoneNumber,
//                 },
//                 car: {
//                     brand: brandId || brand,
//                     selectedModel,
//                     color,
//                     startdate,
//                 },
//             };

//             if (id) {
//                 await axios.put(`http://localhost:3001/repairs/${id}`, data);
//             } else {
//                 await axios.post('http://localhost:3001/repairs', data);
//             }

//             // ดำเนินการเสร็จสิ้นการลงทะเบียน
//         } catch (error) {
//             console.error('Error registering car:', error);
//         }
//     };

//     return (
//         <div className="container">
//             <h2>{id ? 'แก้ไขข้อมูลลูกค้า' : 'ลงทะเบียนรถ'}</h2>
//             <form onSubmit={handleSubmit}>
//                 <label>ป้ายทะเบียน เช่น XX 0000 NARATHIWAT</label>
//                 <input
//                     type="text"
//                     className="form-control"
//                     value={numPlate}
//                     onChange={(e) => setNumPlate(e.target.value)}
//                 />
//                 <label>LINE ID</label>
//                 <input
//                     type="text"
//                     className="form-control"
//                     value={lineId}
//                     onChange={(e) => setLineId(e.target.value)}
//                 />
//                 <div>
//                     <label>ยี่ห้อรถ:</label>
//                     <select value={brand} onChange={handleBrandChange}>
//                         <option value="">กรุณาเลือก</option>
//                         {Array.from(new Set(brandmodels.map((brandmodel) => brandmodel.brand))).map((uniqueBrand) => (
//                             <option key={uniqueBrand} value={uniqueBrand}>
//                                 {uniqueBrand}
//                             </option>
//                         ))}
//                         <option value="other">อื่นๆ</option>
//                     </select>
//                     {brand === 'other' && (
//                         <input
//                             type="text"
//                             value={customBrand}
//                             onChange={(e) => setCustomBrand(e.target.value)}
//                             placeholder="กรอกยี่ห้อรถ"
//                         />
//                     )}
//                 </div>
//                 <label>ชื่อลูกค้า:</label>
//                 <input
//                     type="text"
//                     className="form-control"
//                     value={customerName}
//                     onChange={(e) => setCustomerName(e.target.value)}
//                 />
//                 <div>
//                     <label>รุ่นรถ:</label>
//                     <select value={selectedModel} onChange={handleModelChange}>
//                         <option value="">กรุณาเลือก</option>
//                         {brandmodels
//                             .filter((brandmodel) => brandmodel.brand === brand)
//                             .map((brandmodel) => (
//                                 <option key={brandmodel._id} value={brandmodel.model}>
//                                     {brandmodel.model}
//                                 </option>
//                             ))}
//                         <option value="custom-model">
//                             {customModel ? customModel : 'กรุณากรอกรุ่นรถ'}
//                         </option>
//                     </select>
//                     {selectedModel === 'custom-model' && (
//                         <>
//                             <input
//                                 type="text"
//                                 value={customModel}
//                                 onChange={(e) => setCustomModel(e.target.value)}
//                                 placeholder="กรอกรุ่นรถ"
//                             />
//                             <button onClick={handleAddBrandModel}>เพิ่มยี่ห้อและรุ่น</button>
//                         </>
//                     )}
//                 </div>
//                 <label>เบอร์โทรศัพท์:</label>
//                 <input
//                     type="number"
//                     className="form-control"
//                     value={phoneNumber}
//                     onChange={(e) => setPhoneNumber(e.target.value)}
//                 />
//                 <div>
//                     <label>สี:</label>
//                     <select
//                         value={color}
//                         onChange={(e) => setColor(e.target.value)}
//                         className="form-control"
//                     >
//                         <option value="">กรุณาเลือก</option>
//                         <option value="red">แดง</option>
//                         <option value="blue">น้ำเงิน</option>
//                         <option value="yellow">เหลือง</option>
//                         <option value="white">ขาว</option>
//                         <option value="black">ดำ</option>
//                         <option value="purple">ม่วง</option>
//                         <option value="green">เขียว</option>
//                         <option value="orange">ส้ม</option>
//                         <option value="brown">น้ำตาล</option>
//                         <option value="pink">ชมพู</option>
//                         <option value="lightblue">ฟ้า</option>
//                         <option value="grey">เทา</option>
//                     </select></div>
//                 <div>
//                     <label>วันที่:</label>
//                     <input
//                         type="date"
//                         value={startdate}
//                         onChange={(e) => setStartDate(e.target.value)}
//                         className="form-control"
//                     /></div>
//                 <button type="submit">{id ? 'แก้ไข' : 'ลงทะเบียน'}</button>
//             </form></div>
//             );
// };

//             export default CarRegistration;
