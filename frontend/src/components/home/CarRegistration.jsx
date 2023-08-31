import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const CarRegistration = () => {

    const [brandmodels, setBrandModels] = useState([]);

    const [numPlate, setNumPlate] = useState('');
    const [brand, setBrand] = useState('');
    const [customBrand, setCustomBrand] = useState('');
    const [lineId, setLineId] = useState('');
    const [customerName, setCustomerName] = useState('');
    const [selectedModel, setSelectedModel] = useState('');
    const [customModel, setCustomModel] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [color, setColor] = useState('');
    const [startdate, setStartDate] = useState('');

    const [message, setMessage] = useState('');

    const navigate = useNavigate();

    useEffect(() => {
        loadBrandModels();
    }, []);

    const loadBrandModels = async () => {
        try {
            const response = await axios.get('http://localhost:3001/brandmodels');
            setBrandModels(response.data);
        } catch (error) {
            console.error('Error loading brand models:', error);
        }
    };

    const handleAddCustomer = async () => {
        try {
            await axios.post('http://localhost:3001/repairs', {
                numPlate,
                lineId,
                brand: customBrand || brand,
                customerName,
                phoneNumber,
                selectedModel: customModel || selectedModel,
                color,
                startdate,
                services:[],
                mechanics:[],
            });

            if (customModel) {
                await axios.post('http://localhost:3001/brandmodels', {
                    brand: customBrand || brand,
                    model: customModel,
                });
            }

            navigate('/home');
        } catch (error) {
            console.error('Error adding customer:', error);
            setMessage('ลงทะเบียนรถไม่สำเร็จ');
        }
    };

    const handleBrandChange = (e) => {
        setBrand(e.target.value);
        setSelectedModel('');
        setCustomBrand('');
        setCustomModel('');
    };

    const handleModelChange = (e) => {
        setSelectedModel(e.target.value);
        if (e.target.value === 'custom-model') {
            setCustomModel('');
        }
    };

    return (
        <div className="">
            <div className="">
                <div className="">
                   
                    {message && <div className="message">{message}</div>}

                    <form>
                        <div className='row'>
                            <div className='col col-6'>
                                <label>ป้ายทะเบียน เช่น XX 0000 NARATHIWAT</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    value={numPlate}
                                    onChange={(e) => setNumPlate(e.target.value)}
                                />
                            </div>
                            <div className='col col-6'>
                                <label>LINE ID</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    value={lineId}
                                    onChange={(e) => setLineId(e.target.value)}
                                />
                            </div>
                        </div>
                        <div className='row'>
                            <div className='col col-6'>
                                <label>ยี่ห้อรถ:</label>
                                <select className="form-control" value={brand} onChange={handleBrandChange}>
                                    <option value="">กรุณาเลือก</option>
                                    {Array.from(new Set(brandmodels.map((brandmodel) => brandmodel.brand))).map((uniqueBrand) => (
                                        <option key={uniqueBrand} value={uniqueBrand}>
                                            {uniqueBrand}
                                        </option>
                                    ))}
                                    <option value="other">อื่นๆ</option>
                                </select>
                                {brand === 'other' && (
                                    <input
                                        type="text"
                                        value={customBrand}
                                        onChange={(e) => setCustomBrand(e.target.value)}
                                        placeholder="กรอกยี่ห้อรถ"
                                    />
                                )}
                            </div>
                            <div className='col col-6'>
                                <label>ชื่อลูกค้า:</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    value={customerName}
                                    onChange={(e) => setCustomerName(e.target.value)}
                                />
                            </div>

                        </div>
                        <div className='row'>
                            <div className='col col-6'>
                                <label>รุ่นรถ:</label>
                                <select className="form-control" value={selectedModel} onChange={handleModelChange}>
                                    <option value="">กรุณาเลือก</option>
                                    {brandmodels
                                        .filter((brandmodel) => brandmodel.brand === brand)
                                        .map((brandmodel) => (
                                            <option key={brandmodel._id} value={brandmodel.model}>
                                                {brandmodel.model}
                                            </option>
                                        ))}
                                    <option value="custom-model">
                                        {customModel ? customModel : 'กรุณากรอกรุ่นรถ'}
                                    </option>
                                </select>
                                {selectedModel === 'custom-model' && (
                                    <>
                                        <input
                                            type="text"
                                            value={customModel}
                                            onChange={(e) => setCustomModel(e.target.value)}
                                            placeholder="กรอกรุ่นรถ"
                                        />
                                    </>
                                )}
                            </div>
                            <div className='col col-6'>
                                <label>เบอร์โทรศัพท์:</label>
                                <input
                                    type="number"
                                    className="form-control"
                                    value={phoneNumber}
                                    onChange={(e) => setPhoneNumber(e.target.value)}
                                />
                            </div>
                        </div>
                        <div className='row'>
                            <div className='col col-6'>
                                <label>สี:</label>
                                <select
                                    value={color}
                                    onChange={(e) => setColor(e.target.value)}
                                    className="form-control"
                                >
                                    <option value="">กรุณาเลือก</option>
                                    <option value="red">แดง</option>
                                    <option value="blue">น้ำเงิน</option>
                                    <option value="yellow">เหลือง</option>
                                    <option value="white">ขาว</option>
                                    <option value="black">ดำ</option>
                                    <option value="purple">ม่วง</option>
                                    <option value="green">เขียว</option>
                                    <option value="orange">ส้ม</option>
                                    <option value="brown">น้ำตาล</option>
                                    <option value="pink">ชมพู</option>
                                    <option value="lightblue">ฟ้า</option>
                                    <option value="grey">เทา</option>
                                </select>

                            </div>
                            <div className='col col-6'>
                                <label>วันที่:</label>
                                <input
                                    type="date"
                                    value={startdate}
                                    onChange={(e) => setStartDate(e.target.value)}
                                    className="form-control"
                                />
                            </div>
                        </div>
                    </form>
                </div>
            </div>
            <div className='button-container'>
            <button className='button' type="button" onClick={handleAddCustomer}>
                ลงทะเบียน
            </button>
            </div>
        </div>
    );
};

export default CarRegistration;