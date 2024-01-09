import React, { useState } from 'react';
import './TabView.scss'
import EmployeeManagement from '../employeemanagement/EmployeeManagement';
import SpareManagement from '../sparemanagement/SpareManagement';
import ServiceManagement from '../servicemanagement/ServiceManagement';
import BrandModelManagement from '../brandmodelmenagement/BrandModelManagement';

const TabView = () => {
  const [activeTab, setActiveTab] = useState('employee');

  const handleTabClick = (tab) => {
    setActiveTab(tab);
  };

  return (
    <div className='management'>
      <div className='management-container'>
        <div className='management-title'>จัดการข้อมูล</div>
      </div>

      <div className='tabview'>
        <div
          className={activeTab === 'employee' ? 'active' : 'non-active'}
          onClick={() => handleTabClick('employee')}
        >
          จัดการข้อมูลพนักงาน
        </div>
        <div
          className={activeTab === 'spare' ? 'active' : 'non-active'}
          onClick={() => handleTabClick('spare')}
        >
          จัดการข้อมูลอะไหล่
        </div>
        <div
          className={activeTab === 'service' ? 'active' : 'non-active'}
          onClick={() => handleTabClick('service')}
        >
          จัดการข้อมูลบริการ
        </div>
        <div
          className={activeTab === 'brandmodel' ? 'active' : 'non-active'}
          onClick={() => handleTabClick('brandmodel')}
        >
          จัดการข้อมูลรุ่นและยี่ห้อรถ
        </div>
      </div>

      <div>
        {activeTab === 'employee' && <EmployeeManagement />}
        {activeTab === 'spare' && <SpareManagement />}
        {activeTab === 'service' && <ServiceManagement />}
        {activeTab === 'brandmodel' && <BrandModelManagement />}
      </div>
    </div>
  );
};

export default TabView;
