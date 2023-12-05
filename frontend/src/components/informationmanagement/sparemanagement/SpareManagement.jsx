import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import './SpareManagement.scss';
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

    const [searchText, setSearchText] = useState('');

    const filteredSpares = spares.filter((spare) => {
        return spare.spareName.toLowerCase().includes(searchText.toLowerCase()) ||
            spare.spareType.toLowerCase().includes(searchText.toLowerCase())
    });

    const editButtonRef = useRef(null);

    useEffect(() => {
        loadSpares();
        // loadCompatibleCarModels();
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

    // const loadCompatibleCarModels = async () => {
    //     try {
    //         const response = await axios.get('http://localhost:3001/brandmodels');
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

    const handleAddSpare = async () => {
        try {
            await axios.post('http://localhost:3001/spares', {
                spareName,
                spareType,
                sparePrice,
                // compatibleCarModels: selectedModels,
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
                // compatibleCarModels: selectedModels,
            });
            loadSpares();
            clearForm();
            
            if (editButtonRef.current) {
                editButtonRef.current.scrollIntoView({ behavior: 'smooth' });
            }
            
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
        // setSelectedModels([]);
        setEditingSpareId(null);
        setMessage('');
    };

    const handleEditSpare = (spare) => {
        window.scrollTo(0, 0);

        setSpareName(spare.spareName);
        setSpareType(spare.spareType)
        setSparePrice(spare.sparePrice);
        // setSelectedModels(spare.compatibleCarModels);
        setEditingSpareId(spare._id);
    };

    return (
        <div>
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
                            {/* <th>รุ่นรถที่ใช้ได้</th> */}
                            <th>ราคา</th>
                            <th>การดำเนินการ</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredSpares.map((spare) => (
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
                                    <button ref={editButtonRef} className='edit-button' onClick={() => handleEditSpare(spare)}>แก้ไข</button>
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