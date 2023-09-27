import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Modal from 'react-bootstrap/Modal';
import { Link } from 'react-router-dom';
import "./Home.scss";

const Repair = () => {
  const [brandmodels, setBrandModels] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [services, setServices] = useState([]);
  const [spareParts, setSpareParts] = useState([]);
  const [mechanics, setMechanics] = useState([]);
  const [colors, setColors] = useState([]);

  const [message, setMessage] = useState('');

  const [editingCustomerId, setEditingCustomerId] = useState(null);

  const [numPlate, setNumPlate] = useState('');
  const [brand, setBrand] = useState('');
  const [customBrand, setCustomBrand] = useState('');
  const [lineId, setLineId] = useState('');
  const [customerName, setCustomerName] = useState('');
  const [selectedModel, setSelectedModel] = useState('');
  const [customModel, setCustomModel] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [customColor, setCustomColor] = useState('');
  const [startdate, setStartDate] = useState('');

  const [selectedServices, setSelectedServices] = useState([]);
  const [selectedSpareParts, setSelectedSpareParts] = useState([]);
  const [selectedSparePartsByService, setSelectedSparePartsByService] = useState({});
  const [selectedSparePartsForService, setSelectedSparePartsForService] = useState({});
  const [selectedMechanics, setSelectedMechanics] = useState([]);

  const [state1, setState1] = useState(true);
  const [state2, setState2] = useState(false);
  const [state3, setState3] = useState(false);
  const [state4, setState4] = useState(false);
  const [state5, setState5] = useState(false);

  const [showCarRigisterModal, setShowCarRigisterModal] = useState(false);
  const [showSelectServiceModal, setShowSelectServiceModal] = useState(false);
  const [showSparePartsModal, setShowSparePartsModal] = useState(false);
  const [showSelectMechanicModal, setShowSelectMechanicModal] = useState(false);
  const [showStatusModal, setShowStatusModal] = useState(false);

  const [currentStepServiceId, setCurrentStepServiceId] = useState(null);

  const [currentStep, setCurrentStep] = useState(1);

  const [uniqueCustomerNames, setUniqueCustomerNames] = useState([]);

  const [selectedCustomerStatus, setSelectedCustomerStatus] = useState(null);

  const handleNextStep = () => {
    setCurrentStep((prevStep) => prevStep + 1);
  };

  const handlePreviousStep = () => {
    setCurrentStep((prevStep) => prevStep - 1);
  };

  useEffect(() => {
    loadBrandModels();
    loadCustomers();
    loadServices();
    loadSpareParts();
    loadMechanics();
    loadColors();
  }, []);

  const loadBrandModels = async () => {
    try {
      const response = await axios.get('http://localhost:3001/brandmodels');
      setBrandModels(response.data);
    } catch (error) {
      console.error('Error loading brand models:', error);
    }
  };

  const loadColors = async () => {
    try {
      const response = await axios.get('http://localhost:3001/colors');
      setColors(response.data);
    } catch (error) {
      console.error('Error loading colors:', error);
      setMessage('Error loading colors');
    }
  };

  const loadCustomers = async () => {
    try {
      const response = await axios.get('http://localhost:3001/repairs');
      setCustomers(response.data);

      const uniqueNames = [...new Set(response.data.map((customer) => customer.customer.customerName))];
      setUniqueCustomerNames(uniqueNames);

      const selectedSparePartsByServiceInitial = {};
      response.data.forEach((customer) => {
        customer.services.forEach((service) => {
          // สร้างรายการอะไหล่ที่เป็นออบเจ็กต์เพื่อเก็บข้อมูลอะไหล่
          const sparePartsData = service.spareParts.map((sparePart) => {
            return {
              sparePartId: sparePart.sparePartId, // หรืออะไหล่อื่น ๆ ที่คุณต้องการเก็บ
              quantity: sparePart.quantity, // หรือข้อมูลอื่น ๆ ที่คุณต้องการเก็บ
            };
          });

          // ใช้ชื่อบริการเป็น key ในออบเจ็กต์ selectedSparePartsByServiceInitial
          selectedSparePartsByServiceInitial[service.serviceName] = sparePartsData;
        });
      });

      // อัปเดตสถานะของรายการอะไหล่ที่ถูกเลือกสำหรับบริการ
      setSelectedSparePartsForService(selectedSparePartsByServiceInitial);

      setMessage('');
    } catch (error) {
      console.error('Error loading customer data:', error);
      setMessage('Error loading customer data');
    }
  };



  const loadServices = async () => {
    try {
      const response = await axios.get('http://localhost:3001/services');
      setServices(response.data);

    } catch (error) {
      console.error('Error loading services:', error);
    }
  };

  const loadSpareParts = async () => {
    try {
      const response = await axios.get('http://localhost:3001/spares');
      setSpareParts(response.data);
    } catch (error) {
      console.error('Error loading spare parts:', error);
    }
  };

  const loadMechanics = async () => {
    try {
      const response = await axios.get('http://localhost:3001/employees');
      setMechanics(response.data);
    } catch (error) {
      console.error('Error loading mechanics:', error);
    }
  };

  const handleSetDataCustomer = (customer) => {
    setNumPlate(customer.car.numPlate);
    setLineId(customer.customer.lineId);
    setBrand(customer.car.brand);
    setCustomerName(customer.customer.customerName);
    setPhoneNumber(customer.customer.phoneNumber);
    setSelectedModel(customer.car.selectedModel);
    setSelectedColor(customer.car.selectedColor);
    setStartDate(customer.startdate);
    setState1(customer.status.state1);
    setState2(customer.status.state2);
    setState3(customer.status.state3);
    setState4(customer.status.state4);
    setState5(customer.status.state5);
  }

  const handleAddCustomerModalClose = () => {
    setShowCarRigisterModal(false);
  };

  const handleUpdateCustomer = async (id) => {
    try {
      await axios.put(`http://localhost:3001/repairs/${id}`, {
        numPlate,
        lineId,
        brand: customBrand || brand,
        customerName,
        phoneNumber,
        selectedModel: customModel || selectedModel,
        selectedColor: customColor || selectedColor,
        startdate,
        services: selectedServices,
        state1,
        state2,
        state3,
        state4,
        state5,
      });

      if (customColor) {
        await axios.post('http://localhost:3001/colors', {
          colorname: customColor,
        });
      }

      if (customModel) {
        await axios.post('http://localhost:3001/brandmodels', {
          brand: customBrand || brand,
          model: customModel,
        });
      }

      setShowCarRigisterModal(false);
      loadCustomers();
      window.location.reload();
    } catch (error) {
      console.error('Error updating customer:', error);
      setMessage('เกิดข้อผิดพลาดในการแก้ไขข้อมูล customer');
    }
  };

  const handleEditCustomer = (customer) => {
    handleSetDataCustomer(customer);
    setSelectedServices(customer.services);
    setEditingCustomerId(customer._id);
    setShowCarRigisterModal(true);
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

  const [searchColor, setSearchColor] = useState('');
  const [filteredColors, setFilteredColors] = useState([]);

  const handleColorChange = (e) => {
    setSelectedColor(e.target.value);
    if (e.target.value === 'custom-color') {
      setCustomColor('');
    }
  };

  const handleSearchColorChange = (e) => {
    setSearchColor(e.target.value);

    // ค้นหาและตั้งค่าตัวเลือกที่ผู้ใช้ค้นหา
    const filteredOptions = colors.filter((color) =>
      color.colorname.toLowerCase().includes(searchColor.toLowerCase())
    );
    setFilteredColors(filteredOptions);
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

  const handleEditRepairCar = (customer) => {
    handleSetDataCustomer(customer);
    setSelectedServices(customer.services.map(service => service.serviceName));

    const selectedSparePartsByServiceInitial = {};
    customer.services.forEach((service) => {
      selectedSparePartsByServiceInitial[service.serviceName] = service.spareParts;
    });
    setSelectedSparePartsForService(selectedSparePartsByServiceInitial);
    setSelectedSparePartsByService(selectedSparePartsByServiceInitial);

    setEditingCustomerId(customer._id);
    setShowSelectServiceModal(true);
  };

  const handleSelectServiceModalClose = () => {
    setCurrentStep(1);
    setShowSelectServiceModal(false);
    setSelectedSparePartsForService(selectedSparePartsForService);
  };

  const handleSelectService = (serviceId) => {
    if (editingCustomerId) {
      const updatedSelectedServices = [...selectedServices];

      if (updatedSelectedServices.includes(serviceId)) {
        updatedSelectedServices.splice(updatedSelectedServices.indexOf(serviceId), 1);
      } else {
        updatedSelectedServices.push(serviceId);
      }

      setSelectedServices(updatedSelectedServices);
    }
  };

  const handleAddService = async (id) => {
    try {
      const serviceData = selectedServices.map((serviceId) => {
        const sparePartsData = selectedSparePartsForService[serviceId]?.map((selectedSparePart) => ({
          sparePartId: selectedSparePart.sparePartId,
          quantity: selectedSparePart.quantity,
        })) || [];

        return {
          serviceName: serviceId,
          spareParts: sparePartsData,
        };
      });

      await axios.put(`http://localhost:3001/repairs/${id}`, {
        numPlate,
        lineId,
        brand: customBrand || brand,
        customerName,
        phoneNumber,
        selectedModel: customModel || selectedModel,
        selectedColor: customColor || selectedColor,
        startdate,
        services: serviceData,
        state1,
        state2,
        state3,
        state4,
        state5,
      });
      setCurrentStep(1);
      setShowSelectServiceModal(false);
      loadCustomers();
    } catch (error) {
      console.error('Error adding service:', error);
      setMessage('เกิดข้อผิดพลาดในการเพิ่มบริการ');
    }
  };

  const handleSelectSparePartModalClose = () => {
    setShowSparePartsModal(false);
    setSelectedSparePartsByService(selectedSparePartsForService);
  };

  const handleEditSpareParts = (service) => {
    const initialSelectedSpareParts = selectedSparePartsByService[service._id] || [];
    setCurrentStepServiceId(service._id);
    setSelectedSpareParts(initialSelectedSpareParts);
    setShowSparePartsModal(true);
  };

  const handleSelectSparePart = (sparepartId) => {
    if (currentStepServiceId) {
      const updatedSelectedSpareParts = [...selectedSpareParts];

      if (updatedSelectedSpareParts.some(sparePart => sparePart.sparePartId.toString() === sparepartId.toString())) {
        // ถ้า sparepartId อยู่ใน updatedSelectedSpareParts ให้ทำการลบออก
        updatedSelectedSpareParts.splice(updatedSelectedSpareParts.findIndex(sparePart => sparePart.sparePartId.toString() === sparepartId.toString()), 1);
      } else {
        // ถ้า sparepartId ไม่อยู่ใน updatedSelectedSpareParts ให้ทำการเพิ่มเข้าไป
        updatedSelectedSpareParts.push({ sparePartId: sparepartId, quantity: 1 });
      }


      setSelectedSpareParts(updatedSelectedSpareParts);

      const updatedSelectedSparePartsByService = { ...selectedSparePartsByService };
      updatedSelectedSparePartsByService[currentStepServiceId] = updatedSelectedSpareParts;

      setSelectedSparePartsByService(updatedSelectedSparePartsByService);
    }
  };

  const handleSaveSpareParts = () => {
    setShowSparePartsModal(false);
    setCurrentStepServiceId(null);
    setSelectedSparePartsForService(selectedSparePartsByService);
    setSelectedSpareParts(selectedSpareParts);
  };

  const handleDeleteSparePart = (serviceId, sparePartId) => {
    const updatedSparePartsForService = { ...selectedSparePartsForService };
    const sparePartIndex = updatedSparePartsForService[serviceId]?.findIndex((sp) => sp.sparePartId === sparePartId);

    if (sparePartIndex !== -1) {
      updatedSparePartsForService[serviceId].splice(sparePartIndex, 1);
      setSelectedSparePartsForService(updatedSparePartsForService);
    }
  };


  const handleQuantityChange = (serviceId, sparePartId, newQuantity) => {
    const updatedSparePartsForService = { ...selectedSparePartsForService };
    const sparePartIndex = updatedSparePartsForService[serviceId]?.findIndex((sp) => sp.sparePartId === sparePartId);

    if (sparePartIndex !== -1) {
      updatedSparePartsForService[serviceId][sparePartIndex].quantity = parseInt(newQuantity, 10);
      setSelectedSparePartsForService(updatedSparePartsForService);
    }
  };



  const handleSelectMechanicModalClose = () => {
    setShowSelectMechanicModal(false);
  };

  const handleEditMecanics = (customer) => {
    handleSetDataCustomer(customer);
    setSelectedServices(customer.services);
    setSelectedMechanics(customer.mechanics);
    setEditingCustomerId(customer._id);
    setShowSelectMechanicModal(true);
  };

  const handleSelectMechanic = (mechanicId) => {
    if (selectedMechanics.includes(mechanicId)) {
      setSelectedMechanics(selectedMechanics.filter(id => id !== mechanicId));
    } else {
      setSelectedMechanics([...selectedMechanics, mechanicId]);
    }
  };

  const handleAddMechanic = async (id) => {
    try {
      await axios.put(`http://localhost:3001/repairs/${id}`, {
        numPlate,
        lineId,
        brand: customBrand || brand,
        customerName,
        phoneNumber,
        selectedModel: customModel || selectedModel,
        selectedColor: customColor || selectedColor,
        startdate,
        services: selectedServices,
        mechanics: selectedMechanics,
        state1,
        state2,
        state3,
        state4,
        state5,
      });
      setShowSelectMechanicModal(false);
      window.location.reload();
    } catch (error) {
      setMessage('เกิดข้อผิดพลาดในการเพิ่มช่าง');
    }
  };

  const handleStatusModalClose = () => {
    setShowStatusModal(false);
  };

  const handleUpdateStatus = async (id) => {
    try {
      await axios.put(`http://localhost:3001/repairs/${id}`, {
        numPlate,
        lineId,
        brand: customBrand || brand,
        customerName,
        phoneNumber,
        selectedModel: customModel || selectedModel,
        selectedColor: customColor || selectedColor,
        startdate,
        state1,
        state2,
        state3,
        state4,
        state5,
      });

      setShowStatusModal(false);
      loadCustomers();
    } catch (error) {
      console.error("Error updating status:", error);
      setMessage("เกิดข้อผิดพลาดในการแก้ไขสถานะ");
    }
  };

  const handleEditStatus = (customer) => {
    handleSetDataCustomer(customer);
    setEditingCustomerId(customer._id);
    setSelectedCustomerStatus(customer);
    setShowStatusModal(true);
  };

  const handleToggleState = (stateName) => {
    switch (stateName) {
      case "state2":
        setState2(!state2);
        break;
      case "state3":
        setState3(!state3);
        break;
      case "state4":
        setState4(!state4);
        break;
      case "state5":
        setState5(!state5);
        break;
      default:
        break;
    }
  };

  return (
    <div className="container">
      <div className="repair-title">
        <h2>รายการรถที่อยู่ในอู่ ณ ขณะนี้</h2>
      </div>
      <table className="repair-table">
        <tbody>
          {customers.map((customer, index) => (
            <tr key={index}>
              <div className="repair-numplate">
                <td onClick={() => handleEditStatus(customer)}>
                  {customer.car.brand} {customer.car.selectedModel} {customer.car.color} {customer.car.numPlate}
                </td>
              </div>
              <div className="repait-edit" onClick={() => handleEditCustomer(customer)}>
                <img src='./assets/image/edit.png' />
              </div>
              <td>
                <button onClick={() => handleEditRepairCar(customer)}>รายการซ่อม</button>
              </td>
              <td>
                <button>
                  จ่ายแล้ว
                </button>
              </td>
              <td>
                <button onClick={() => handleEditMecanics(customer)}>
                  ช่าง
                </button>
              </td>
              <td>
                <div className='delete-carregis' onClick={() => handleDeleteCustomer(customer._id)}>
                  <img src='./assets/image/bin.png' />
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <Link to="/carregis">
        <div className='carregis-button'>ลงทะเบียนรถ</div>
      </Link>

      <Modal
        show={showCarRigisterModal}
        onHide={handleAddCustomerModalClose}
        backdrop="static"
        size="xl"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>แก้ไขข้อมูลลูกค้า</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="">
            <div className="">
              <div>
                {editingCustomerId ? 'แก้ไขข้อมูลลูกค้า' : 'ลงทะเบียนรถ'}
              </div>

              {message && <div className="message">{message}</div>}

              <form className='customer-form'>
                <div className='row'>
                  <div className='col col-6'>
                    <label>ป้ายทะเบียน เช่น XX 0000 NARATHIWAT</label>
                    <input
                      type="text"
                      className="form-control"
                      value={numPlate}
                      onChange={(e) => setNumPlate(e.target.value)}
                    />
                  </div>
                  <div className='col col-6'>
                    <label>LINE ID</label>
                    <input
                      type="text"
                      className="form-control"
                      value={lineId}
                      onChange={(e) => setLineId(e.target.value)}
                    />
                  </div>
                </div>
                <div className='row'>
                  <div className='col col-6'>
                    <label>ยี่ห้อรถ:</label>
                    <select className="form-control" value={brand} onChange={handleBrandChange}>
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
                  <div className='col col-6'>
                    <label>ชื่อลูกค้า:</label>
                    <input
                      type="text"
                      className="form-control"
                      value={customerName}
                      list='customerNamesList'
                      onChange={(e) => setCustomerName(e.target.value)}
                    />
                    <datalist id="customerNamesList">
                      {uniqueCustomerNames.map((name, index) => (
                        <option key={index} value={name} />
                      ))}
                    </datalist>

                  </div>
                </div>
                <div className='row'>
                  <div className='col col-6'>
                    <label>รุ่นรถ:</label>
                    <select
                      className="form-control"
                      value={selectedModel}
                      onChange={handleModelChange}
                    >
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
                      </>
                    )}
                  </div>
                  <div className='col col-6'>
                    <label>เบอร์โทรศัพท์:</label>
                    <input
                      type="number"
                      className="form-control"
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                    />
                  </div>
                </div>
                <div className='row'>
                  <div className='col col-6'>
                    <label>สี:</label>
                    <input
                      type="text"
                      value={searchColor}
                      onChange={handleSearchColorChange}
                      placeholder="ค้นหาสีรถ"
                    />

                    <select
                      className="form-control"
                      value={selectedColor}
                      onChange={handleColorChange}
                    >
                      <option value="">กรุณาเลือก</option>
                      {filteredColors
                        .map((color) => (
                          <option key={color._id} value={color.colorname}>
                            {color.colorname}
                          </option>
                        ))}
                      <option value="custom-color">
                        {customColor ? customColor : 'กรุณากรอกสีรถ'}
                      </option>
                    </select>
                    {selectedColor === 'custom-color' && (
                      <>
                        <input
                          type="text"
                          value={customColor}
                          onChange={(e) => setCustomColor(e.target.value)}
                          placeholder="กรอกสีรถ"
                        />
                      </>
                    )}
                  </div>
                  <div className='col col-6'>
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

      <Modal
        show={showSelectServiceModal}
        onHide={handleSelectServiceModalClose}
        backdrop="static"
        size="xl"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>สรุปรายการซ่อม</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {currentStep === 1 && (
            <div>
              <ul>
                {services.map((service) => (
                  <div key={service._id} value={service.serviceName}>
                    <span style={{ display: "inline-block" }}>
                      <input
                        type="checkbox"
                        checked={selectedServices.includes(service._id)}
                        onChange={() => handleSelectService(service._id)}
                      />
                    </span>
                    <span style={{ display: "inline-block" }}>
                      <label className="form-control">
                        {service.serviceName}
                      </label>
                    </span>

                  </div>
                ))}
              </ul>
            </div>
          )}
          {currentStep === 2 && (
            <div>
              <ul>
                {services
                  .filter((service) => selectedServices.includes(service._id))
                  .map((selectedService) => (
                    <li key={selectedService._id}>
                      <div>
                        {selectedService.serviceName}
                      </div>
                      <ul>
                        {selectedSparePartsForService[selectedService._id]?.map((selectedSparePartId) => {
                          const sparePart = spareParts.find((sparePart) => sparePart._id === selectedSparePartId || sparePart._id === selectedSparePartId.sparePartId);
                          return (
                            <li key={sparePart._id}>
                              <div>
                                {sparePart.spareName}
                              </div>
                              <input
                                type="number"
                                value={selectedSparePartId.quantity}
                                onChange={(e) => handleQuantityChange(selectedService._id, selectedSparePartId.sparePartId, e.target.value)}
                              />
                              <div>
                                {sparePart.sparePrice}
                              </div>
                              <div className='delete-carregis' onClick={() => handleDeleteSparePart(selectedService._id, sparePart._id)}>
                                <img src='./assets/image/bin.png' />
                              </div>
                            </li>

                          );
                        })}
                      </ul>
                      <div className='add-button' onClick={() => handleEditSpareParts(selectedService)}>
                        เพิ่มอะไหล่
                      </div>
                    </li>
                  ))}
              </ul>
            </div>
          )}

        </Modal.Body>
        <Modal.Footer>
          <div>
            {currentStep === 1 && (
              <>
                <div className="cancel-button" onClick={handleSelectServiceModalClose}>
                  CANCEL
                </div>
                <button className="save-button" onClick={handleNextStep}>
                  NEXT
                </button>
              </>
            )}
            {currentStep === 2 && (
              <>
                <div className="cancel-button" onClick={handlePreviousStep}>
                  BACK
                </div>
                <div className="save-button" onClick={() => handleAddService(editingCustomerId)}>
                  SAVE
                </div>
              </>
            )}
          </div>
        </Modal.Footer>
      </Modal>

      <Modal
        show={showSparePartsModal}
        onHide={handleSelectSparePartModalClose}
        backdrop="static"
        size="xl"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>เพิ่มอะไหล่</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <ul>
            {spareParts.map((sparePart) => (
              <li key={sparePart._id}>
                <input
                  type="checkbox"
                  checked={selectedSparePartsByService[currentStepServiceId]?.some(sparePartData => sparePartData.sparePartId === sparePart._id)}
                  onChange={() => handleSelectSparePart(sparePart._id)}
                />
                {sparePart.spareName}
              </li>
            ))}

          </ul>
        </Modal.Body>
        <Modal.Footer>
          <div className="cancel-button" onClick={handleSelectSparePartModalClose}>
            CANCEL
          </div>
          <div className="save-button" onClick={handleSaveSpareParts}>
            SAVE
          </div>
        </Modal.Footer>
      </Modal>

      <Modal
        show={showSelectMechanicModal}
        onHide={handleSelectMechanicModalClose}
        backdrop="static"
        size="xl"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>ช่างที่ทำการซ่อม</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div>
            <ul>
              {mechanics.map((mechanic) => (
                <div key={mechanic._id} value={mechanic.name}>
                  <span style={{ display: "inline-block" }}>
                    <input
                      type="checkbox"
                      checked={selectedMechanics.includes(mechanic._id)}
                      onChange={() => handleSelectMechanic(mechanic._id)}
                    />
                  </span>
                  <span style={{ display: "inline-block" }}>
                    <label className="form-control">
                      {mechanic.name}
                    </label>
                  </span>
                </div>
              ))}
            </ul>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <button type="button" onClick={() => handleAddMechanic(editingCustomerId)}>
            SAVE
          </button>
          <button type="button" onClick={handleSelectMechanicModalClose}>CANCEL</button>
        </Modal.Footer>
      </Modal>

      <Modal
        show={showStatusModal}
        onHide={handleStatusModalClose}
        backdrop="static"
        size="xl"
        centered
      >
        <Modal.Body>
          <div>
            {selectedCustomerStatus && ( // ตรวจสอบว่ามีข้อมูลสถานะของลูกค้าที่ถูกเลือกหรือไม่
              <div className="status-header-container">
                <button className="status-header">
                  {selectedCustomerStatus.car.brand}{" "}
                  {selectedCustomerStatus.car.selectedModel}{" "}
                  {selectedCustomerStatus.car.color}{" "}
                  {selectedCustomerStatus.car.numPlate}
                </button>
              </div>
            )}
          </div>
          <div className="status-container">
            <div className="state">
              <div className={`state ${state1 ? "status-active" : "status"}`}>
                <div className="state-circle1"></div>
                <div className="state-circle2">
                  <img src='./assets/image/car.png'></img>
                </div>
              </div>
              <button className="button-true">เรียบร้อย</button>
            </div>
            <div className="state">
              <div className={`state ${state2 ? "status-active" : "status"}`}>
                <div className="state-circle1"></div>
                <div className="state-circle2">
                  <img src='./assets/image/state2.png'></img>
                </div>
              </div>
              <button
                onClick={() => {
                  if (state1) {
                    handleToggleState("state2");
                  }
                  if (state3 || state4 || state5) {
                    setState2(false);
                    setState3(false);
                    setState4(false);
                    setState5(false);
                  }
                }}
                className={state2 ? "button-true" : "button-false"}
              >
                เรียบร้อย
              </button>
            </div>
            <div className="state">
              <div className={`state ${state3 ? "status-active" : "status"}`}>
                <div className="state-circle1"></div>
                <div className="state-circle2">
                  <img src='./assets/image/state3.png'></img>
                </div>
              </div>
              <button
                onClick={() => {
                  if (state2) {
                    handleToggleState("state3");
                  }
                  if (state4 || state5) {
                    setState3(false);
                    setState4(false);
                    setState5(false);
                  }
                }}
                className={state3 ? "button-true" : "button-false"}
              >
                เรียบร้อย
              </button>
            </div>
            <div className="state">
              <div className={`state ${state4 ? "status-active" : "status"}`}>
                <div className="state-circle1"></div>
                <div className="state-circle2">
                  <img src='./assets/image/state4.png'></img>
                </div>
              </div>
              <button
                onClick={() => {
                  if (state3) {
                    handleToggleState("state4");
                  }
                  if (state5) {
                    setState4(false);
                    setState5(false);
                  }
                }}
                className={state4 ? "button-true" : "button-false"}
              >
                เรียบร้อย
              </button>
            </div>
            <div className="state">
              <div className={`state ${state5 ? "status-active" : "status"}`}>
                <div className="state-circle1"></div>
                <div className="state-circle2">
                  <img src='./assets/image/state5.png'></img>
                </div>
              </div>
              <button
                onClick={() => {
                  if (state4) {
                    handleToggleState("state5");
                  }
                }}
                className={state5 ? "button-true" : "button-false"}
              >
                เรียบร้อย
              </button>
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <button
            type="button"
            onClick={() => handleUpdateStatus(editingCustomerId)}
            className="status-save"
          >
            SAVE
          </button>
          <button
            type="button"
            onClick={handleStatusModalClose}
            className="status-cancel"
          >
            CANCEL
          </button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default Repair;
