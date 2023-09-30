import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import "./Home.scss";
import SelectMechanicModal from './selectmechanicmodal/SelectMechanicModal';
import StatusModal from './statusmodal/StatusModal';
import SelectSpareModal from './selectsparemodal/SelectSpareModal';
import SelectServiceModal from './selectservicemodal/SelectServiceModal';
import EditCarRegistrationModal from './editcarregistrationmodal/EditCarRegistrationModal';

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
  const [enddate, setEndDate] = useState('');

  const [serviceFee, setServiceFee] = useState(0);

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

  const [searchCar, setSearchCar] = useState('');

  const filteredCars = customers.filter((customer) => {
    return customer.car.numPlate.toLowerCase().includes(searchCar.toLowerCase()) ||
      customer.car.brand.toLowerCase().includes(searchCar.toLowerCase())
  });

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
    setEndDate(customer.enddate);
    setServiceFee(customer.serviceFee)
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
        enddate,
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

  const handleColorChange = (e) => {
    setSelectedColor(e.target.value);
    if (e.target.value === 'custom-color') {
      setCustomColor('');
    }
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
      // 1. คำนวณค่าราคาของบริการแต่ละบริการ
      const serviceCost = selectedServices.reduce((acc, serviceId) => {
        const sparePartsData = selectedSparePartsForService[serviceId]?.map((selectedSparePart) => {
          const sparePart = spareParts.find((sp) => sp._id === selectedSparePart.sparePartId);
          if (sparePart) {
            const quantity = selectedSparePart.quantity;
            const partCost = sparePart.sparePrice * quantity;
            return partCost;
          }
          return 0;
        }) || [];
        
        // บวกค่าราคาของอะไหล่ใน service นี้
        const serviceTotal = sparePartsData.reduce((sum, partCost) => sum + partCost, 0);
        
        // บวกค่าราคาของบริการนี้เข้ากับค่าก่อนหน้า
        return acc + serviceTotal;
      }, 0);

      let totalCost = parseFloat(serviceFee) + parseFloat(serviceCost);

      // 2. ส่งข้อมูลไปยัง API
      await axios.put(`http://localhost:3001/repairs/${id}`, {
        numPlate,
        lineId,
        brand: customBrand || brand,
        customerName,
        phoneNumber,
        selectedModel: customModel || selectedModel,
        selectedColor: customColor || selectedColor,
        startdate,
        enddate,
        services: selectedServices.map((serviceId) => {
          const sparePartsData = selectedSparePartsForService[serviceId]?.map((selectedSparePart) => ({
            sparePartId: selectedSparePart.sparePartId,
            quantity: selectedSparePart.quantity,
          })) || [];
          
          return {
            serviceName: serviceId,
            spareParts: sparePartsData,
          };
        }),
        state1,
        state2,
        state3,
        state4,
        state5,
        serviceFee,
        totalCost,
      });
  
      // 3. อัปเดตสถานะและโหลดข้อมูลใหม่
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
        enddate,
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
        const currentDate = new Date(); // Create a new Date instance for the current date and time
        const formattedDate = currentDate.toISOString().slice(0, 16);
        setEndDate(formattedDate);
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
      <div>
        <input
        type="text"
        class="form-control"
        value={searchCar}
        onChange={(e) => setSearchCar(e.target.value)}
        placeholder="ค้นหาป้ายทะเบียนหรือยี่ห้อรถ"
      />
      </div>
      <table className="repair-table">
        <tbody>
          {filteredCars
            .filter((customer) => !customer.status.state5)
            .map((customer, index) => (
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
                  <Link to={`/receipt/${customer._id}`}>
                    <button>
                      จ่ายแล้ว
                    </button>
                  </Link>
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

      <EditCarRegistrationModal
        showCarRigisterModal={showCarRigisterModal}
        handleAddCustomerModalClose={handleAddCustomerModalClose}
        message={message}
        numPlate={numPlate}
        lineId={lineId}
        brand={brand}
        brandmodels={brandmodels}
        customerName={customerName}
        selectedModel={selectedModel}
        customModel={customModel}
        phoneNumber={phoneNumber}
        selectedColor={selectedColor}
        customColor={customColor}
        startdate={startdate}
        handleBrandChange={handleBrandChange}
        uniqueCustomerNames={uniqueCustomerNames}
        handleModelChange={handleModelChange}
        handleColorChange={handleColorChange}
        colors={colors}
        setStartDate={setStartDate}
        handleUpdateCustomer={handleUpdateCustomer}
        editingCustomerId={editingCustomerId}
        setNumPlate={setNumPlate}
        setLineId={setLineId}
        setCustomerName={setCustomerName}
        setCustomModel={setCustomModel}
        setPhoneNumber={setPhoneNumber}
        setCustomColor={setCustomColor}
      />

      <SelectServiceModal
        showSelectServiceModal={showSelectServiceModal}
        handleSelectServiceModalClose={handleSelectServiceModalClose}
        currentStep={currentStep}
        services={services}
        handleNextStep={handleNextStep}
        selectedServices={selectedServices}
        handleSelectService={handleSelectService}
        selectedSparePartsForService={selectedSparePartsForService}
        serviceFee={serviceFee}
        handlePreviousStep={handlePreviousStep}
        handleEditSpareParts={handleEditSpareParts}
        spareParts={spareParts}
        handleQuantityChange={handleQuantityChange}
        handleDeleteSparePart={handleDeleteSparePart}
        setServiceFee={setServiceFee}
        handleAddService={handleAddService}
        editingCustomerId={editingCustomerId}
      />

      <SelectSpareModal
        showSparePartsModal={showSparePartsModal}
        handleSelectSparePartModalClose={handleSelectSparePartModalClose}
        spareParts={spareParts}
        handleSaveSpareParts={handleSaveSpareParts}
        selectedSparePartsByService={selectedSparePartsByService}
        currentStepServiceId={currentStepServiceId}
        handleSelectSparePart={handleSelectSparePart}
      />

      <SelectMechanicModal
        showSelectMechanicModal={showSelectMechanicModal}
        handleSelectMechanicModalClose={handleSelectMechanicModalClose}
        mechanics={mechanics}
        selectedMechanics={selectedMechanics}
        handleSelectMechanic={handleSelectMechanic}
        handleAddMechanic={handleAddMechanic}
        editingCustomerId={editingCustomerId}
      />

      <StatusModal
        showStatusModal={showStatusModal}
        handleStatusModalClose={handleStatusModalClose}
        selectedCustomerStatus={selectedCustomerStatus}
        state1={state1}
        state2={state2}
        state3={state3}
        state4={state4}
        state5={state5}
        setState2={setState2}
        setState3={setState3}
        setState4={setState4}
        setState5={setState5}
        handleToggleState={handleToggleState}
        handleUpdateStatus={handleUpdateStatus}
        editingCustomerId={editingCustomerId}
      />
       
    </div>
  );
};

export default Repair;
