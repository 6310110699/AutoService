import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './SpareManagement.scss';

const SpareManagement = () => {
    const [spares, setSpares] = useState([]);
    const [spareName, setSpareName] = useState('');
    const [spareType, setSpareType] = useState('');
    const [sparePrice, setSparePrice] = useState('');
    const [editingSpareId, setEditingSpareId] = useState(null);
    const [message, setMessage] = useState('');

    const [searchText, setSearchText] = useState('');

    const filteredSpares = spares.filter((spare) => {
        return spare.spareName.toLowerCase().includes(searchText.toLowerCase()) ||
            spare.spareType.toLowerCase().includes(searchText.toLowerCase())
    });

    useEffect(() => {
        loadSpares();
    }, []);

    const loadSpares = async () => {
        try {
            const response = await axios.get('http://localhost:3001/spares');
            setSpares(response.data);
            setMessage('');
        } catch (error) {
            console.error('เกิดข้อผิดพลาดในการโหลดข้อมูลอะไหล่:', error);
            setMessage('เกิดข้อผิดพลาดในการดึงข้อมูลอะไหล่');
        }
    };

    const handleAddSpare = async () => {
        try {
            await axios.post('http://localhost:3001/spares', {
                spareName,
                spareType,
                sparePrice,
            });
            loadSpares();
            clearForm();
        } catch (error) {
            console.error('เกิดข้อผิดพลาดในการเพิ่มข้อมูลอะไหล่:', error);
            setMessage('เกิดข้อผิดพลาดในการเพิ่มข้อมูลอะไหล่');
        }
    };

    const handleUpdateSpare = async (id) => {
        try {
            await axios.put(`http://localhost:3001/spares/${id}`, {
                spareName,
                spareType,
                sparePrice,
            });
            loadSpares();
            clearForm();
        } catch (error) {
            console.error('เกิดข้อผิดพลาดในการแก้ไขข้อมูลอะไหล่:', error);
            setMessage('เกิดข้อผิดพลาดในการแก้ไขข้อมูลอะไหล่');
        }
    };

    const handleDeleteSpare = async (id) => {
        try {
            await axios.delete(`http://localhost:3001/spares/${id}`);
            loadSpares();
            setMessage('ลบข้อมูลอะไหล่เรียบร้อยแล้ว');
        } catch (error) {
            console.error('เกิดข้อผิดพลาดในการลบข้อมูลอะไหล่:', error);
            setMessage('เกิดข้อผิดพลาดในการลบข้อมูลอะไหล่');
        }
    };

    const clearForm = () => {
        setSpareName('');
        setSpareType('');
        setSparePrice('');
        setEditingSpareId(null);
        setMessage('');
    };

    const handleEditSpare = (spare) => {
        setSpareName(spare.spareName);
        setSpareType(spare.spareType)
        setSparePrice(spare.sparePrice);
        setEditingSpareId(spare._id);
    };

    return (
        <div className=''>
            <div className='sparemanagement-title'>
                จัดการข้อมูลอะไหล่
            </div>

            <form className='sparemanagement-form'>
                <label>ชื่ออะไหล่:</label>
                <input
                    type="text"
                    class="form-control"
                    value={spareName}
                    onChange={(e) => setSpareName(e.target.value)}
                />
                <label>ประเภท:</label>
                <input
                    type="text"
                    class="form-control"
                    value={spareType}
                    onChange={(e) => setSpareType(e.target.value)}
                />
                <label>ราคา:</label>
                <input
                    type="number"
                    class="form-control"
                    value={sparePrice}
                    onChange={(e) => setSparePrice(e.target.value)}
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
                        onClick={editingSpareId ? () =>
                            handleUpdateSpare(editingSpareId) : handleAddSpare}
                    >
                        {editingSpareId ? 'แก้ไข' : 'เพิ่ม'}
                    </button>
                </div>
            </form>

            <div className='sparemanagement-data'>
                <div className='search-title'>
                    ค้นหาอะไหล่
                </div>
                <input
                    type="text"
                    class='form-control'
                    value={searchText}
                    onChange={(e) => setSearchText(e.target.value)}
                    placeholder="ค้นหาอะไหล่"
                />
                <table>
                    <thead>
                        <tr>
                            <th>ชื่ออะไหล่</th>
                            <th>ประเภท</th>
                            <th>ราคา</th>
                            <th>การดำเนินการ</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredSpares.map((spare) => (
                            <tr key={spare._id}>
                                <td>{spare.spareName}</td>
                                <td>{spare.spareType}</td>
                                <td>{spare.sparePrice}</td>
                                <td>
                                    <button className='edit-button' onClick={() => handleEditSpare(spare)}>แก้ไข</button>
                                    <button className='delete-button' onClick={() => handleDeleteSpare(spare._id)}>ลบ</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default SpareManagement;