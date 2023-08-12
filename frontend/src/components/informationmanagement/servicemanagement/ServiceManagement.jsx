import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Select from 'react-select';
import './ServiceManagement.scss';

const ServiceManagement = () => {
  const [services, setServices] = useState([]);
  const [serviceName, setServiceName] = useState('');
  const [selectedSpares, setSelectedSpares] = useState([]);
  const [spares, setSpares] = useState([]);
  const [sparesByCategory, setSparesByCategory] = useState([]);
  const [sparePrices, setSparePrices] = useState({});
  const [editingServiceId, setEditingServiceId] = useState(null);
  const [message, setMessage] = useState('');

  const [searchText, setSearchText] = useState('');

  const filteredServices = services.filter((service) => {
    return service.serviceName.toLowerCase().includes(searchText.toLowerCase())
  });

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

  const handleUpdateService = async () => {
    try {
      await axios.put(`http://localhost:3001/services/${editingServiceId}`, {
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
    setEditingServiceId(null);
    setMessage('');
  };


  const handleEditService = (service) => {
    setServiceName(service.serviceName);
    setSelectedSpares(service.spares);
    setEditingServiceId(service._id);
  };


  return (
    <div>
      <div className='servicemanagement-title'>
        จัดการข้อมูลบริการ
      </div>

      <form className='servicemanagement-form'>
        <label>ชื่อบริการ:</label>
        <input
          type='text'
          class="form-control"
          value={serviceName}
          onChange={(e) => setServiceName(e.target.value)}
        />
        <label>อะไหล่ที่ใช้ในบริการ:</label>
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
        />

        {message &&
          <div className='error-form'>
            {message}
          </div>
        }

        <div>
          <button
            type="button"
            className='save-button'
            onClick={editingServiceId ? () =>
              handleUpdateService(editingServiceId) : handleAddService}
          >
            {editingServiceId ? 'แก้ไข' : 'เพิ่ม'}
          </button>
        </div>
      </form>

      <div className='servicemanagement-data'>
        <div className='search-title'>
          ค้นหาบริกาาร
        </div>

        <input
          type="text"
          class='form-control'
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          placeholder="ค้นหาบริการ"
        />

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
            {filteredServices.map((service) => (
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
                  <button className='edit-button' onClick={() => handleEditService(service)}>แก้ไข</button>
                  <button className='delete-button' onClick={() => handleDeleteService(service._id)}>ลบ</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

    </div>
  );
};

export default ServiceManagement;
