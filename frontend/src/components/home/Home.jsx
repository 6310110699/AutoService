import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Modal from 'react-bootstrap/Modal';
import { Link } from 'react-router-dom';
import "./Home.scss";
import bin from '../../assets/bin.png';

const Repair = () => {
  const [brandmodels, setBrandModels] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [services, setServices] = useState([]);
  const [spareParts, setSpareParts] = useState([]);
  const [mechanics, setMechanics] = useState([]);

  const [message, setMessage] = useState('');

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

  const [selectedServices, setSelectedServices] = useState([]);
  const [selectedSpareParts, setSelectedSpareParts] = useState([]);
  const [selectedSparePartsByService, setSelectedSparePartsByService] = useState({});
  const [selectedSparePartsForService, setSelectedSparePartsForService] = useState({});
  const [selectedMechanics, setSelectedMechanics] = useState([]);

  const [editingCustomerId, setEditingCustomerId] = useState(null);

  const [showCarRigisterModal, setShowCarRigisterModal] = useState(false);
  const [showSelectServiceModal, setShowSelectServiceModal] = useState(false);
  const [showSparePartsModal, setShowSparePartsModal] = useState(false);
  const [showSelectMechanicModal, setShowSelectMechanicModal] = useState(false);

  useEffect(() => {
    loadBrandModels();
    loadCustomers();
    loadServices();
    loadSpareParts();
    loadMechanics();
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

      const selectedSparePartsByServiceInitial = {};
      response.data.forEach((customer) => {
        customer.services.forEach((service) => {
          selectedSparePartsByServiceInitial[service.serviceName] = service.spareParts;
        });
      });
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

  const handleUpdateCustomer = async (id) => {
    try {
      await axios.put(`http://localhost:3001/repairs/${id}`, {
        numPlate,
        lineId,
        brand: customBrand || brand,
        customerName,
        phoneNumber,
        selectedModel: customModel || selectedModel,
        color,
        startdate,
        services: selectedServices,
      });

      if (customModel) {
        await axios.post('http://localhost:3001/brandmodels', {
          brand: customBrand || brand,
          model: customModel,
        });
      }

      setShowCarRigisterModal(false);
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
    setShowCarRigisterModal(true);
  };

  const handleEditRepairCar = (customer) => {
    setNumPlate(customer.car.numPlate);
    setLineId(customer.customer.lineId);
    setBrand(customer.car.brand);
    setCustomerName(customer.customer.customerName);
    setPhoneNumber(customer.customer.phoneNumber);
    setSelectedModel(customer.car.selectedModel);
    setColor(customer.car.color);
    setStartDate(customer.startdate);
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

  const handleEditMecanics = (customer) => {
    setNumPlate(customer.car.numPlate);
    setLineId(customer.customer.lineId);
    setBrand(customer.car.brand);
    setCustomerName(customer.customer.customerName);
    setPhoneNumber(customer.customer.phoneNumber);
    setSelectedModel(customer.car.selectedModel);
    setColor(customer.car.color);
    setStartDate(customer.startdate);
    setSelectedServices(customer.services);
    setSelectedMechanics(customer.mechanics);
    setEditingCustomerId(customer._id);
    setShowSelectMechanicModal(true);
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

  const handleAddCustomerModalClose = () => {
    setShowCarRigisterModal(false);
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
        return {
          serviceName: serviceId,
          spareParts: selectedSparePartsByService[serviceId] || [],
        };
      });

      await axios.put(`http://localhost:3001/repairs/${id}`, {
        numPlate,
        lineId,
        brand: customBrand || brand,
        customerName,
        phoneNumber,
        selectedModel: customModel || selectedModel,
        color,
        startdate,
        services: serviceData,
      });
      setCurrentStep(1);
      setShowSelectServiceModal(false);
      loadCustomers();
    } catch (error) {
      console.error('Error adding service:', error);
      setMessage('เกิดข้อผิดพลาดในการเพิ่มบริการ');
    }
  };

  const [currentStepServiceId, setCurrentStepServiceId] = useState(null);

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

      if (updatedSelectedSpareParts.includes(sparepartId)) {
        updatedSelectedSpareParts.splice(updatedSelectedSpareParts.indexOf(sparepartId), 1);
      } else {
        updatedSelectedSpareParts.push(sparepartId);
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

  const handleSelectMechanicModalClose = () => {
    setShowSelectMechanicModal(false);
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
        color,
        startdate,
        services: selectedServices,
        mechanics: selectedMechanics,
      });
      setShowSelectMechanicModal(false);
      window.location.reload();
    } catch (error) {
      setMessage('เกิดข้อผิดพลาดในการเพิ่มช่าง');
    }
  };

  const [currentStep, setCurrentStep] = useState(1);
  const handleNextStep = () => {
    setCurrentStep((prevStep) => prevStep + 1);
  };

  const handlePreviousStep = () => {
    setCurrentStep((prevStep) => prevStep - 1);
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
                <td onClick={() => handleEditCustomer(customer)}>
                  {customer.car.brand} {customer.car.selectedModel} {customer.car.color} {customer.car.numPlate}
                </td>
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
                  <img src={bin} />
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
                      onChange={(e) => setCustomerName(e.target.value)}
                    />
                  </div>
                </div>
                <div className='row'>
                  <div className='col col-6'>
                    <label>รุ่นรถ:</label>
                    <select className="form-control" value={selectedModel} onChange={handleModelChange}>
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
                          const sparePart = spareParts.find((sparePart) => sparePart._id === selectedSparePartId);
                          return (
                            <li key={sparePart._id}>
                              <div>
                                {sparePart.spareName}
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
                  checked={selectedSparePartsByService[currentStepServiceId]?.includes(sparePart._id)}
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
    </div>
  );
};

export default Repair;
