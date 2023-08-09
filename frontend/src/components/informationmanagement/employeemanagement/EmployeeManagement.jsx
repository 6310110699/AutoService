import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './EmployeeManagement.scss';

const EmployeeManagement = () => {
    const [employees, setEmployees] = useState([]);
    const [name, setName] = useState('');
    const [nickname, setNickname] = useState('');
    const [phone, setPhone] = useState('');
    const [subdistrict, setSubdistrict] = useState('');
    const [district, setDistrict] = useState('');
    const [province, setProvince] = useState('');
    const [editingEmployeeId, setEditingEmployeeId] = useState(null);
    const [message, setMessage] = useState('');

    const [searchText, setSearchText] = useState(''); 

    const filteredEmployees = employees.filter((employee) => {
        return employee.name.toLowerCase().includes(searchText.toLowerCase()) ||
        employee.nickname.toLowerCase().includes(searchText.toLowerCase())
    });

    useEffect(() => {
        loadEmployees();
    }, []);

    const loadEmployees = async () => {
        try {
            const response = await axios.get('http://localhost:3001/employees');
            setEmployees(response.data);
            setMessage('');
        } catch (error) {
            console.error('เกิดข้อผิดพลาดในการโหลดข้อมูลพนักงาน:', error);
            setMessage('เกิดข้อผิดพลาดในการดึงข้อมูลพนักงาน');
        }
    };

    const handleAddEmployee = async () => {
        try {
            await axios.post('http://localhost:3001/employees', {
                name,
                nickname,
                phone,
                subdistrict,
                district,
                province,
            });
            loadEmployees();
            clearForm();
        } catch (error) {
            console.error('เกิดข้อผิดพลาดในการเพิ่มข้อมูลพนักงาน:', error);
            setMessage('เกิดข้อผิดพลาดในการเพิ่มข้อมูลพนักงาน');
        }
    };

    const handleUpdateEmployee = async (id) => {
        try {
            await axios.put(`http://localhost:3001/employees/${id}`, {
                name,
                nickname,
                phone,
                subdistrict,
                district,
                province,
            });
            loadEmployees();
            clearForm();
        } catch (error) {
            console.error('เกิดข้อผิดพลาดในการแก้ไขข้อมูลพนักงาน:', error);
            setMessage('เกิดข้อผิดพลาดในการแก้ไขข้อมูลพนักงาน');
        }
    };

    const handleDeleteEmployee = async (id) => {
        try {
            await axios.delete(`http://localhost:3001/employees/${id}`);
            loadEmployees();
            setMessage('ลบข้อมูลพนักงานเรียบร้อยแล้ว');
        } catch (error) {
            console.error('เกิดข้อผิดพลาดในการลบข้อมูลพนักงาน:', error);
            setMessage('เกิดข้อผิดพลาดในการลบข้อมูลพนักงาน');
        }
    };

    const clearForm = () => {
        setName('');
        setNickname('');
        setPhone('');
        setSubdistrict('');
        setDistrict('');
        setProvince('');
        setEditingEmployeeId(null);
        setMessage('');
    };

    const handleEditEmployee = (employee) => {
        setName(employee.name);
        setNickname(employee.nickname)
        setPhone(employee.phone);
        setSubdistrict(employee.address.subdistrict);
        setDistrict(employee.address.district);
        setProvince(employee.address.province);
        setEditingEmployeeId(employee._id);
    };

    return (
        <div className='container'>
            <h2 className='employeemanagement-title'>จัดการข้อมูลพนักงาน</h2>
            {message && <div>{message}</div>}
            <form>
                <label>ชื่อ-นามสกุล:</label>
                <input type="text" value={name} onChange={(e) => setName(e.target.value)} />
                <label>ชื่อเล่น:</label>
                <input type="text" value={nickname} onChange={(e) => setNickname(e.target.value)} />
                <label>เบอร์โทร:</label>
                <input type="text" value={phone} onChange={(e) => setPhone(e.target.value)} />
                <label>ตำบล:</label>
                <input type="text" value={subdistrict} onChange={(e) => setSubdistrict(e.target.value)} />
                <label>อำเภอ:</label>
                <input type="text" value={district} onChange={(e) => setDistrict(e.target.value)} />
                <label>จังหวัด:</label>
                <input type="text" value={province} onChange={(e) => setProvince(e.target.value)} />
                <div>
                    <button type="button" onClick={editingEmployeeId ? () =>
                        handleUpdateEmployee(editingEmployeeId) : handleAddEmployee}>
                        {editingEmployeeId ? 'แก้ไข' : 'เพิ่ม'}
                    </button>
                </div>
            </form>
            <form>
                <input type="text" value={searchText} onChange={(e) => setSearchText(e.target.value)} placeholder="ค้นหาชื่อพนักงาน" />
            </form>
            <table>
                <thead>
                    <tr>
                        <th>ชื่อ-นามสกุล</th>
                        <th>ชื่อเล่น</th>
                        <th>เบอร์โทร</th>
                        <th>ที่อยู่</th>
                        <th>การดำเนินการ</th>
                    </tr>
                </thead>
                <tbody>
                    {filteredEmployees.map((employee) => (
                        <tr key={employee._id}>
                            <td>{employee.name}</td>
                            <td>{employee.nickname}</td>
                            <td>{employee.phone}</td>
                            <td>{employee.address.subdistrict}, {employee.address.district}, {employee.address.province}</td>
                            <td>
                                <button className='edit-button' onClick={() => handleEditEmployee(employee)}>แก้ไข</button>
                                <button className='delete-button' onClick={() => handleDeleteEmployee(employee._id)}>ลบ</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default EmployeeManagement;
