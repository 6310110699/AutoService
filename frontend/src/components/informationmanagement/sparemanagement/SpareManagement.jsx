import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './SpareManagement.scss';
import Modal from 'react-bootstrap/Modal';
// import Select from 'react-select';

const SpareManagement = () => {
    const [spares, setSpares] = useState([]);
    const [spareName, setSpareName] = useState('');
    const [spareType, setSpareType] = useState('');
    const [sparePrice, setSparePrice] = useState('');
    // const [selectedModels, setSelectedModels] = useState([]);
    // const [compatibleCarModels, setCompatibleCarModels] = useState([]);
    // const [modelsByCategory, setModelsByCategory] = useState([]);

    const [editingSpareId, setEditingSpareId] = useState(null);
    const [message, setMessage] = useState('');

    const [showAddEditSpareModal, setShowAddEditSpareModal] = useState('');

    const [searchText, setSearchText] = useState('');

    const filteredSpares = spares.filter((spare) => {
        const spareNameLowerCase = spare && spare.spareName ? spare.spareName.toLowerCase() : '';
        const spareTypeLowerCase = spare && spare.spareType ? spare.spareType.toLowerCase() : '';

        return spareNameLowerCase.includes(searchText.toLowerCase()) ||
            spareTypeLowerCase.includes(searchText.toLowerCase());
    });


    const sortBySpare = (data) => {
        return data.sort((a, b) => {
            if (!a.spareType && !b.spareType) return a.spareName.localeCompare(b.spareName);
            if (!a.spareType) return 1;
            if (!b.spareType) return -1;

            if (a.spareType.toLowerCase() < b.spareType.toLowerCase()) return -1;
            if (a.spareType.toLowerCase() > b.spareType.toLowerCase()) return 1;

            if (a.spareName.toLowerCase() < b.spareName.toLowerCase()) return -1;
            if (a.spareName.toLowerCase() > b.spareName.toLowerCase()) return 1;
            return 0;
        });
    };

    // นำฟังก์ชัน sortByBrand มาใช้กับข้อมูลที่ต้องการเรียง
    const sortedSpares = sortBySpare(filteredSpares);

    useEffect(() => {
        loadSpares();
        // loadCompatibleCarModels();
    }, []);

    const loadSpares = async () => {
        try {
            const response = await axios.get('https://autoservice-k7ez.onrender.com/spares');
            setSpares(response.data);
            setMessage('');
        } catch (error) {
            console.error('เกิดข้อผิดพลาดในการโหลดข้อมูลอะไหล่:', error);
            setMessage('เกิดข้อผิดพลาดในการดึงข้อมูลอะไหล่');
        }
    };

    // const loadCompatibleCarModels = async () => {
    //     try {
    //         const response = await axios.get('https://autoservice-k7ez.onrender.com/brandmodels');
    //         const modelsData = response.data;

    //         // Group spares by category
    //         const modelsGroupedByCategory = {};
    //         modelsData.forEach((model) => {
    //             if (!modelsGroupedByCategory[model.brand]) {
    //                 modelsGroupedByCategory[model.brand] = [];
    //             }
    //             modelsGroupedByCategory[model.brand].push(model);
    //         });

    //         // Convert the grouped data into an array
    //         const modelsByCategory = Object.keys(modelsGroupedByCategory).map((brand) => ({
    //             categoryName: brand,
    //             compatibleCarModels: modelsGroupedByCategory[brand],
    //         }));

    //         setModelsByCategory(modelsByCategory);
    //         setCompatibleCarModels(response.data);
    //         setMessage('');
    //     } catch (error) {
    //         console.error('เกิดข้อผิดพลาดในการโหลดข้อมูลรุ่นรถ:', error);
    //         setMessage('เกิดข้อผิดพลาดในการดึงข้อมูลรุ่นรถ');
    //     }
    // };

    const handleAddSpare = (spare) => {
        setShowAddEditSpareModal(true);

        setSpareName(spare.spareName);
        setSpareType(spare.spareType)
        setSparePrice(spare.sparePrice);
        // setSelectedModels(spare.compatibleCarModels);
        setEditingSpareId(spare._id);
    };

    const handlePushSpare = async () => {
        if (!spareName || !spareName.trim() || !sparePrice) {
            setMessage('เกิดข้อผิดพลาดในการเพิ่มข้อมูลอะไหล่');
            return;
        }

        try {
            await axios.post('https://autoservice-k7ez.onrender.com/spares', {
                spareName,
                spareType,
                sparePrice,
                // compatibleCarModels: selectedModels,
            });

            setShowAddEditSpareModal(false);
            loadSpares();
            clearForm();
        } catch (error) {
            console.error('เกิดข้อผิดพลาดในการเพิ่มข้อมูลอะไหล่:', error);
            setMessage(error.response.data.message);
        }
    };

    const handleEditSpare = (spare) => {
        setShowAddEditSpareModal(true);
        setSpareName(spare.spareName);
        setSpareType(spare.spareType)
        setSparePrice(spare.sparePrice);
        // setSelectedModels(spare.compatibleCarModels);
        setEditingSpareId(spare._id);
    };

    const handleUpdateSpare = async (id) => {
        if (!spareName.trim() || !sparePrice) {
            setMessage('เกิดข้อผิดพลาดในการแก้ไขข้อมูลอะไหล่');
            return;
        }

        try {
            await axios.put(`https://autoservice-k7ez.onrender.com/spares/${id}`, {
                spareName,
                spareType,
                sparePrice,
                // compatibleCarModels: selectedModels,
            });

            setShowAddEditSpareModal(false);
            loadSpares();
            clearForm();
        } catch (error) {
            console.error('เกิดข้อผิดพลาดในการแก้ไขข้อมูลอะไหล่:', error);
            setMessage(error.response.data.message);
        }
    };

    const handleDeleteSpare = async (id) => {
        try {
            await axios.delete(`https://autoservice-k7ez.onrender.com/spares/${id}`);
            loadSpares();
            setMessage(error.response.data.message);
        } catch (error) {
            console.error('เกิดข้อผิดพลาดในการลบข้อมูลอะไหล่:', error);
            setMessage(error.response.data.message);
        }
    };

    const clearForm = () => {
        setSpareName('');
        setSpareType('');
        setSparePrice('');
        // setSelectedModels([]);
        setEditingSpareId(null);
        setMessage('');
    };

    const handleAddEditSpareModalClose = () => {
        setShowAddEditSpareModal(false)
        clearForm();
    };

    return (
        <div className='spare-management'>
            <div className='sparemanagement-data'>
                <div className='search-title'>
                    ค้นหาอะไหล่
                </div>

                <div className='row'>
                    <div className='col-10 input-search'>
                        <input
                            type="text"
                            class='form-control'
                            value={searchText}
                            onChange={(e) => setSearchText(e.target.value)}
                            placeholder="ค้นหาอะไหล่"
                        />
                    </div>

                    <div className='col-2 add-button' onClick={handleAddSpare}>
                        เพิ่มอะไหล่
                    </div>
                </div>

                <table>
                    <thead>
                        <tr>
                            <th>ชื่ออะไหล่</th>
                            <th>ประเภท</th>
                            {/* <th>รุ่นรถที่ใช้ได้</th> */}
                            <th>ราคา</th>
                            <th>การดำเนินการ</th>
                        </tr>
                    </thead>
                    <tbody>
                        {sortedSpares.map((spare) => (
                            <tr key={spare._id}>
                                <td>{spare.spareName}</td>
                                <td>{spare.spareType}</td>
                                {/* <td>
                                    {spare.compatibleCarModels.map((modelId) => {
                                        const model = compatibleCarModels.find((model) => model._id === modelId);
                                        return (
                                            <div key={modelId}>
                                                {model ? `${model.model}` : 'อะไหล่ไม่ถูกพบ'}
                                            </div>
                                        );
                                    })}
                                </td> */}
                                <td>{spare.sparePrice}</td>
                                <td>
                                    <div className='edit-button' onClick={() => handleEditSpare(spare)}>แก้ไข</div>
                                    <div className='delete-button' onClick={() => handleDeleteSpare(spare._id)}>ลบ</div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <Modal
                className='addeditsparemodal'
                show={showAddEditSpareModal}
                onHide={handleAddEditSpareModalClose}
                backdrop="static"
                size="lg"
                centered
            >
                <Modal.Header closeButton>
                    <Modal.Title>
                        <div>
                            {editingSpareId ? 'แก้ไขอะไหล่' : 'เพิ่มอะไหล่'}
                        </div>
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div>
                        <label>
                            ชื่ออะไหล่: <span style={{ color: 'red', fontSize: '18px' }}>*</span>
                        </label>
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
                        <label>
                            ราคา: <span style={{ color: 'red', fontSize: '18px' }}>*</span>
                        </label>
                        <input
                            type="number"
                            class="form-control"
                            value={sparePrice}
                            onChange={(e) => setSparePrice(e.target.value)}
                        />
                        {/* <label>รุ่นรถที่ใช้ได้:</label>
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
                            value={selectedModels.map((modelId) => ({
                                value: modelId,
                                label: compatibleCarModels.find((model) => model._id === modelId)?.model || 'รุ่นรถไม่ถูกพบ',
                            }))}
                            options={modelsByCategory.flatMap((category) => [
                                {
                                    label: category.categoryName,
                                    options: category.compatibleCarModels.map((model) => ({
                                        value: model._id,
                                        label: model.model,
                                    })),
                                },
                            ])}
                            onChange={(selectedOptions) =>
                                setSelectedModels(selectedOptions.map((option) => option.value))
                            }
                        /> */}
                    </div>
                    {message &&
                        <div className='error-form'>
                            {message}
                        </div>
                    }
                </Modal.Body>
                <Modal.Footer>
                    <div className='button-no' onClick={handleAddEditSpareModalClose}>
                        ยกเลิก
                    </div>
                    <div className='button-yes'
                        onClick={editingSpareId ? () =>
                            handleUpdateSpare(editingSpareId) : handlePushSpare}>
                        {editingSpareId ? 'แก้ไข' : 'เพิ่ม'}
                    </div>
                </Modal.Footer>
            </Modal>
        </div>
    );
};

export default SpareManagement;