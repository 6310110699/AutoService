import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './BrandModelManagement.scss';
import Modal from 'react-bootstrap/Modal';

const BrandModelManagement = () => {
    const [brandmodels, setBrandModels] = useState([]);

    const [model, setModel] = useState('');
    const [brand, setBrand] = useState('');

    const [editingBrandModelId, setEditingBrandModelId] = useState(null);
    const [message, setMessage] = useState('');

    const [showAddEditBrandModelModal, setShowAddEditBrandModelModal] = useState('');

    const [searchText, setSearchText] = useState('');

    const filteredBrandModels = brandmodels.filter((brandmodel) => {
        return brandmodel.model.toLowerCase().includes(searchText.toLowerCase()) ||
            brandmodel.brand.toLowerCase().includes(searchText.toLowerCase())
    });

    const sortByBrand = (data) => {
        return data.sort((a, b) => {
            if (a.brand.toLowerCase() < b.brand.toLowerCase()) return -1;
            if (a.brand.toLowerCase() > b.brand.toLowerCase()) return 1;

            if (a.model.toLowerCase() < b.model.toLowerCase()) return -1;
            if (a.model.toLowerCase() > b.model.toLowerCase()) return 1;
            return 0;
        });
    };

    // นำฟังก์ชัน sortByBrand มาใช้กับข้อมูลที่ต้องการเรียง
    const sortedBrandModels = sortByBrand(filteredBrandModels);

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

    const handleAddBrandModel = (brandmodel) => {
        setShowAddEditBrandModelModal(true);

        setModel(brandmodel.model);
        setBrand(brandmodel.brand);
        setEditingBrandModelId(brandmodel._id);
    };

    const handlePushBrandModel = async () => {
        try {
            await axios.post('http://localhost:3001/brandmodels', {
                model,
                brand,
            });

            setShowAddEditBrandModelModal();
            loadBrandModels();
            clearForm();
        } catch (error) {
            console.error('เกิดข้อผิดพลาดในการเพิ่มข้อมูลรุ่นรถ:', error);
            setMessage(error.response.data.message);
        }
    };

    const handleEditBrandModel = (brandmodel) => {
        setShowAddEditBrandModelModal(true);
        setModel(brandmodel.model);
        setBrand(brandmodel.brand);
        setEditingBrandModelId(brandmodel._id);
    };

    const handleUpdateBrandModel = async (id) => {
        try {
            await axios.put(`http://localhost:3001/brandmodels/${id}`, {
                model,
                brand,
            });

            setShowAddEditBrandModelModal(false);
            loadBrandModels();
            clearForm();
        } catch (error) {
            console.error('เกิดข้อผิดพลาดในการแก้ไขข้อมูลรุ่นรถ:', error);
            setMessage(error.response.data.message);
        }
    };

    const handleDeleteBrandModel = async (id) => {
        try {
            await axios.delete(`http://localhost:3001/brandmodels/${id}`);
            loadBrandModels();
            setMessage(error.response.data.message);
        } catch (error) {
            console.error('เกิดข้อผิดพลาดในการลบข้อมูลรุ่นรถ:', error);
            setMessage(error.response.data.message);
        }
    };

    const clearForm = () => {
        setModel('');
        setBrand('');
        setEditingBrandModelId(null);
        setMessage('');
    };

    const handleAddEditBrandModelModalClose = () => {
        setShowAddEditBrandModelModal(false)
        clearForm();
    };

    return (
        <div className='brandmodel-management'>
            <div className='brandmodelmanagement-data'>
                <div className='search-title'>
                    ค้นหารุ่นหรือยี่ห้อรถ
                </div>

                <div className='row'>
                    <div className='col-10'>
                        <input
                            type="text"
                            class='form-control'
                            value={searchText}
                            onChange={(e) => setSearchText(e.target.value)}
                            placeholder="ค้นหารุ่นหรือยี่ห้อรถ"
                        />
                    </div>

                    <div className='col-2 add-button' onClick={handleAddBrandModel}>
                        เพิ่มรุ่นรถ
                    </div>
                </div>

                <table>
                    <thead>
                        <tr>
                            <th>รุ่นรถ</th>
                            <th>ยี่ห้อ</th>
                            <th>การดำเนินการ</th>
                        </tr>
                    </thead>
                    <tbody>
                        {sortedBrandModels.map((brandmodel) => (
                            <tr key={brandmodel._id}>
                                <td>{brandmodel.model}</td>
                                <td>{brandmodel.brand}</td>
                                <td>
                                    <div
                                        className='edit-button'
                                        onClick={() => handleEditBrandModel(brandmodel)}
                                    >
                                        แก้ไข
                                    </div>
                                    <div
                                        className='delete-button'
                                        onClick={() => handleDeleteBrandModel(brandmodel._id)}
                                    >
                                        ลบ
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <Modal
                className='addeditbrandmodelmodal'
                show={showAddEditBrandModelModal}
                onHide={handleAddEditBrandModelModalClose}
                backdrop="static"
                size="lg"
                centered
            >
                <Modal.Header closeButton>
                    <Modal.Title>
                        <div>
                            {editingBrandModelId ? 'แก้ไขรุ่นหรือยี่ห้อรถ' : 'เพิ่มรุ่นรถ'}
                        </div>
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
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
                </Modal.Body>
                <Modal.Footer>
                    <div className='button-no' onClick={handleAddEditBrandModelModalClose}>
                        ยกเลิก
                    </div>
                    <div className='button-yes'
                        onClick={editingBrandModelId ? () =>
                            handleUpdateBrandModel(editingBrandModelId) : handlePushBrandModel}>
                        {editingBrandModelId ? 'แก้ไข' : 'เพิ่ม'}
                    </div>
                </Modal.Footer>
            </Modal>
        </div>
    );
};

export default BrandModelManagement;