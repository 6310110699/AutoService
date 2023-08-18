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
    <div>
      <div>
        <button onClick={() => handleTabClick('employee')} className={activeTab === 'employee' ? 'active' : ''}>
          จัดการข้อมูลพนักงาน
        </button>
        <button onClick={() => handleTabClick('spare')} className={activeTab === 'spare' ? 'active' : ''}>
          จัดการข้อมูลอะไหล่
        </button>
        <button onClick={() => handleTabClick('service')} className={activeTab === 'service' ? 'active' : ''}>
          จัดการข้อมูลบริการ
        </button>
        <button onClick={() => handleTabClick('brandmodel')} className={activeTab === 'brandmodel' ? 'active' : ''}>
          จัดการข้อมูลรุ่นและยี่ห้อรถ
        </button>
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
