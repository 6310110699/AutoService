import React, { useEffect, useState } from 'react';
import axios from 'axios';

const BrandModelManagement = () => {
    const [brandmodels, setBrandModels] = useState([]);

    const [model, setModel] = useState('');
    const [brand, setBrand] = useState('');

    const [editingBrandModelId, setEditingBrandModelId] = useState(null);
    const [message, setMessage] = useState('');

    const [searchText, setSearchText] = useState('');

    const filteredBrandModels = brandmodels.filter((brandmodel) => {
        return brandmodel.model.toLowerCase().includes(searchText.toLowerCase()) ||
            brandmodel.brand.toLowerCase().includes(searchText.toLowerCase())
    });

    useEffect(() => {
        loadBrandModels();
    }, []);

    const loadBrandModels = async () => {
        try {
            const response = await axios.get('http://localhost:3001/brandmodels');
            setBrandModels(response.data);
            setMessage('');
        } catch (error) {
            console.error('เกิดข้อผิดพลาดในการโหลดข้อมูลรุ่นรถ:', error);
            setMessage('เกิดข้อผิดพลาดในการดึงข้อมูลรุ่นรถ');
        }
    };

    const handleAddBrandModel = async () => {
        try {
            await axios.post('http://localhost:3001/brandmodels', {
                model,
                brand,
            });
            loadBrandModels();
            clearForm();
        } catch (error) {
            console.error('เกิดข้อผิดพลาดในการเพิ่มข้อมูลรุ่นรถ:', error);
            setMessage('เกิดข้อผิดพลาดในการเพิ่มข้อมูลรุ่นรถ');
        }
    };

    const handleUpdateBrandModel = async (id) => {
        try {
            await axios.put(`http://localhost:3001/brandmodels/${id}`, {
                model,
                brand,
            });
            loadBrandModels();
            clearForm();
        } catch (error) {
            console.error('เกิดข้อผิดพลาดในการแก้ไขข้อมูลรุ่นรถ:', error);
            setMessage('เกิดข้อผิดพลาดในการแก้ไขข้อมูลรุ่นรถ');
        }
    };

    const handleDeleteBrandModel = async (id) => {
        try {
            await axios.delete(`http://localhost:3001/brandmodels/${id}`);
            loadBrandModels();
            setMessage('ลบข้อมูลรุ่นรถเรียบร้อยแล้ว');
        } catch (error) {
            console.error('เกิดข้อผิดพลาดในการลบข้อมูลรุ่นรถ:', error);
            setMessage('เกิดข้อผิดพลาดในการลบข้อมูลรุ่นรถ');
        }
    };

    const clearForm = () => {
        setModel('');
        setBrand('');
        setEditingBrandModelId(null);
        setMessage('');
    };

    const handleEditBrandModel = (brandmodel) => {
        setModel(brandmodel.model);
        setBrand(brandmodel.brand);
        setEditingBrandModelId(brandmodel._id);
    };

    return (
        <div className=''>
            <div className='brandmodelmanagement-title'>
                จัดการข้อมูลรุ่นและยี่ห้อรถ
            </div>

            <form className='brandmodelmanagement-form'>
                <label>รุ่นรถ:</label>
                <input
                    type="text"
                    class="form-control"
                    value={model}
                    onChange={(e) => setModel(e.target.value)}
                />
                <label>ยี่ห้อ:</label>
                <input
                    type="text"
                    class="form-control"
                    value={brand}
                    onChange={(e) => setBrand(e.target.value)}
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
                        onClick={editingBrandModelId ? () =>
                            handleUpdateBrandModel(editingBrandModelId) : handleAddBrandModel}
                    >
                        {editingBrandModelId ? 'แก้ไข' : 'เพิ่ม'}
                    </button>
                </div>
            </form>

            <div className='brandmodelmanagement-data'>
                <div className='search-title'>
                    ค้นหารุ่นหรือยี่ห้อรถ
                </div>

                <input
                    type="text"
                    class='form-control'
                    value={searchText}
                    onChange={(e) => setSearchText(e.target.value)}
                    placeholder="ค้นหารุ่นหรือยี่ห้อรถ"
                />
                
                <table>
                    <thead>
                        <tr>
                            <th>รุ่นรถ</th>
                            <th>ยี่ห้อ</th>
                            <th>การดำเนินการ</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredBrandModels.map((brandmodel) => (
                            <tr key={brandmodel._id}>
                                <td>{brandmodel.model}</td>
                                <td>{brandmodel.brand}</td>
                                <td>
                                    <button className='edit-button' onClick={() => handleEditBrandModel(brandmodel)}>แก้ไข</button>
                                    <button className='delete-button' onClick={() => handleDeleteBrandModel(brandmodel._id)}>ลบ</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

        </div>
    );
};

export default BrandModelManagement;