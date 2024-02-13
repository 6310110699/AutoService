import React, { useState, useEffect } from 'react';
import axios from 'axios';
// import Select from 'react-select';
import './ServiceManagement.scss';
import Modal from 'react-bootstrap/Modal';

const ServiceManagement = () => {
  const [services, setServices] = useState([]);
  const [serviceName, setServiceName] = useState('');
  // const [selectedSpares, setSelectedSpares] = useState([]);
  // const [spares, setSpares] = useState([]);
  // const [sparesByCategory, setSparesByCategory] = useState([]);
  // const [sparePrices, setSparePrices] = useState({});

  const [editingServiceId, setEditingServiceId] = useState(null);
  const [message, setMessage] = useState('');

  const [showAddEditServiceModal, setShowAddEditServiceModal] = useState('');

  const [searchText, setSearchText] = useState('');

  const filteredServices = services.filter((service) => {
    return service.serviceName.toLowerCase().includes(searchText.toLowerCase())
  });

  const sortByService = (data) => {
    return data.sort((a, b) => {
      if (a.serviceName.toLowerCase() < b.serviceName.toLowerCase()) return -1;
      if (a.serviceName.toLowerCase() > b.serviceName.toLowerCase()) return 1;
      return 0;
    });
  };

  // นำฟังก์ชัน sortByBrand มาใช้กับข้อมูลที่ต้องการเรียง
  const sortedServices = sortByService(filteredServices);

  useEffect(() => {
    loadServices();
    // loadSpares();
    // loadSparePrices();
  }, []);

  const loadServices = async () => {
    try {
      const response = await axios.get('https://autoservice-k7ez.onrender.com/services');
      setServices(response.data);
      setMessage('');
    } catch (error) {
      console.error('เกิดข้อผิดพลาดในการโหลดข้อมูลบริการ:', error);
      setMessage('เกิดข้อผิดพลาดในการดึงข้อมูลบริการ');
    }
  };

  // const loadSpares = async () => {
  //   try {
  //     const response = await axios.get('https://autoservice-k7ez.onrender.com/spares');
  //     const sparesData = response.data;

  //     // Group spares by category
  //     const sparesGroupedByCategory = {};
  //     sparesData.forEach((spare) => {
  //       if (!sparesGroupedByCategory[spare.spareType]) {
  //         sparesGroupedByCategory[spare.spareType] = [];
  //       }
  //       sparesGroupedByCategory[spare.spareType].push(spare);
  //     });

  //     // Convert the grouped data into an array
  //     const sparesByCategory = Object.keys(sparesGroupedByCategory).map((spareType) => ({
  //       categoryName: spareType,
  //       spares: sparesGroupedByCategory[spareType],
  //     }));

  //     setSparesByCategory(sparesByCategory);
  //     setSpares(response.data);
  //     setMessage('');
  //   } catch (error) {
  //     console.error('เกิดข้อผิดพลาดในการโหลดข้อมูลอะไหล่:', error);
  //     setMessage('เกิดข้อผิดพลาดในการดึงข้อมูลอะไหล่');
  //   }
  // };

  // const loadSparePrices = async () => {
  //   try {
  //     const response = await axios.get('https://autoservice-k7ez.onrender.com/spares');
  //     const prices = {};
  //     response.data.forEach((spare) => {
  //       prices[spare._id] = spare.sparePrice;
  //     });
  //     setSparePrices(prices);
  //     setMessage('');
  //   } catch (error) {
  //     console.error('เกิดข้อผิดพลาดในการโหลดข้อมูลราคาอะไหล่:', error);
  //     setMessage('เกิดข้อผิดพลาดในการดึงข้อมูลราคาอะไหล่');
  //   }
  // };

  const handleAddService = (service) => {
    setShowAddEditServiceModal(true);

    setServiceName(service.serviceName);
    // setSelectedModels(spare.compatibleCarModels);
    setEditingServiceId(service._id);
  };

  const handlePushService = async () => {
    try {
      await axios.post('https://autoservice-k7ez.onrender.com/services', {
        serviceName,
        // spares: selectedSpares,
      });

      setShowAddEditServiceModal(false);
      loadServices();
      clearForm();
    } catch (error) {
      console.error('เกิดข้อผิดพลาดในการเพิ่มข้อมูลบริการ:', error);
      setMessage(error.response.data.message);
    }
  };

  const handleEditService = (service) => {
    setShowAddEditServiceModal(true);
    setServiceName(service.serviceName);
    // setSelectedSpares(service.spares);
    setEditingServiceId(service._id);
  };

  const handleUpdateService = async () => {
    try {
      await axios.put(`https://autoservice-k7ez.onrender.com/services/${editingServiceId}`, {
        serviceName,
        // spares: selectedSpares,
      });

      setShowAddEditServiceModal(false);
      loadServices();
      clearForm();
    } catch (error) {
      console.error('เกิดข้อผิดพลาดในการแก้ไขข้อมูลบริการ:', error);
      setMessage(error.response.data.message);
    }
  };

  const handleDeleteService = async (id) => {
    try {
      await axios.delete(`https://autoservice-k7ez.onrender.com/services/${id}`);
      loadServices();
      setMessage(error.response.data.message);
    } catch (error) {
      console.error('เกิดข้อผิดพลาดในการลบข้อมูลบริการ:', error);
      setMessage(error.response.data.message);
    }
  };

  const clearForm = () => {
    setServiceName('');
    // setSelectedSpares([]);
    setEditingServiceId(null);
    setMessage('');
  };

  const handleAddEditServiceModalClose = () => {
    setShowAddEditServiceModal(false)
    clearForm();
  };

  return (
    <div className='service-management'>
      <div className='servicemanagement-data'>
        <div className='search-title'>
          ค้นหาบริการ
        </div>

        <div className='row'>
          <div className='col-10 input-search'>
            <input
              type="text"
              class='form-control'
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              placeholder="ค้นหาบริการ"
            />
          </div>

          <div className='col-2 add-button' onClick={handleAddService}>
            เพิ่มอะไหล่
          </div>
        </div>

        <table>
          <thead>
            <tr>
              <th>ชื่อบริการ</th>
              {/* <th>อะไหล่ที่ใช้ในบริการ</th>
              <th>ราคา</th> */}
              <th>การดำเนินการ</th>
            </tr>
          </thead>
          <tbody>
            {sortedServices.map((service) => (
              <tr key={service._id}>
                <td>{service.serviceName}</td>
                {/* <td>
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
                </td> */}
                <td>
                  <div className='edit-button' onClick={() => handleEditService(service)}>แก้ไข</div>
                  <div className='delete-button' onClick={() => handleDeleteService(service._id)}>ลบ</div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Modal
        className='addeditservicemodal'
        show={showAddEditServiceModal}
        onHide={handleAddEditServiceModalClose}
        backdrop="static"
        size="lg"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>
            <div>
              {editingServiceId ? 'แก้ไขชื่อบริการ' : 'เพิ่มบริการ'}
            </div>
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <label>ชื่อบริการ:</label>
          <input
            type='text'
            class="form-control"
            value={serviceName}
            onChange={(e) => setServiceName(e.target.value)}
          />
          {/* <label>อะไหล่ที่ใช้ในบริการ:</label>
        <Select
          isMulti
          styles={{
            groupHeading: (defaultStyles) => ({
              ...defaultStyles,
              fontSize: "20px"
            }),

            option: (defaultStyles, state) => ({
              ...defaultStyles,
              fontSize: "18px"
            }),

            control: (defaultStyles) => ({
              ...defaultStyles,
              padding: "5px",
              borderRadius: "8px",
              fontSize: "20px"
            }),
          }}
          value={selectedSpares.map((spareId) => ({
            value: spareId,
            label: spares.find((spare) => spare._id === spareId)?.spareName || 'อะไหล่ไม่ถูกพบ',
          }))}
          options={sparesByCategory.flatMap((category) => [
            {
              label: category.categoryName,
              options: category.spares.map((spare) => ({
                value: spare._id,
                label: spare.spareName,
              })),
            },
          ])}
          onChange={(selectedOptions) =>
            setSelectedSpares(selectedOptions.map((option) => option.value))
          }
        /> */}

          {message &&
            <div className='error-form'>
              {message}
            </div>
          }
        </Modal.Body>
        <Modal.Footer>
          <div className='button-no' onClick={handleAddEditServiceModalClose}>
            ยกเลิก
          </div>
          <div className='button-yes'
            onClick={editingServiceId ? () =>
              handleUpdateService(editingServiceId) : handlePushService}>
            {editingServiceId ? 'แก้ไข' : 'เพิ่ม'}
          </div>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default ServiceManagement;
