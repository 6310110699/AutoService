import React, { useState } from 'react';
import EmployeeManagement from '../employeemanagement/EmployeeManagement';
import SpareManagement from '../sparemanagement/SpareManagement';
import './TabView.scss'
import ServiceManagement from '../servicemanagement/ServiceManagement';
import RepairManagement from '../repairmanagement/RepairManagement';

const TabView = () => {
  const [activeTab, setActiveTab] = useState('employee'); // เพิ่ม state เพื่อเก็บแท็บที่ถูกเลือก

  const handleTabClick = (tab) => {
    setActiveTab(tab);
  };

  return (
    <div>
      <div>
        {/* แสดงแท็บสำหรับเลือกหน้าจัดการข้อมูลพนักงาน */}
        <button onClick={() => handleTabClick('employee')} className={activeTab === 'employee' ? 'active' : ''}>
          จัดการข้อมูลพนักงาน
        </button>
        {/* แสดงแท็บสำหรับเลือกหน้าจัดการข้อมูลสินค้า */}
        <button onClick={() => handleTabClick('spare')} className={activeTab === 'spare' ? 'active' : ''}>
          จัดการข้อมูลอะไหล่
        </button>
        <button onClick={() => handleTabClick('service')} className={activeTab === 'service' ? 'active' : ''}>
          จัดการข้อมูลรายการซ่อม
        </button>
        {/* <button onClick={() => handleTabClick('repair')} className={activeTab === 'repair' ? 'active' : ''}>
          ลูกค้า
        </button> */}
      </div>
      <div>
        {/* แสดงคอมโพเนนต์ของหน้าจัดการข้อมูลพนักงานหรือสินค้าขึ้นอยู่กับ activeTab */}
        {activeTab === 'employee' && <EmployeeManagement />}
        {activeTab === 'spare' && <SpareManagement />}
        {activeTab === 'service' && <ServiceManagement />}
        {/* {activeTab === 'repair' && <RepairManagement />} */}
      </div>
    </div>
  );
};

export default TabView;
