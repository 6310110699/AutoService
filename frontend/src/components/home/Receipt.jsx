import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

const Receipt = () => {
    const { customerId } = useParams();

    const [customers, setCustomers] = useState([]);
    const [spareParts, setSpareParts] = useState([]);
    const [sparePrices, setSparePrices] = useState({});

    const [message, setMessage] = useState('');

    useEffect(() => {
        loadCustomers();
        loadSpareParts();
    }, []);

    const loadCustomers = async () => {
        try {
            const response = await axios.get('http://localhost:3001/repairs');
            setCustomers(response.data);

            setMessage('');
        } catch (error) {
            console.error('Error loading customer data:', error);
            setMessage('Error loading customer data');
        }
    };

    const loadSpareParts = async () => {
        try {
            const response = await axios.get('http://localhost:3001/spares');
            setSpareParts(response.data);

            const prices = {};
            response.data.forEach((sparePart) => {
                prices[sparePart._id] = sparePart.sparePrice;
            });

            setSparePrices(prices);
        } catch (error) {
            console.error('Error loading spare parts:', error);
        }
    }

    const getPartNameFromId = (sparePartId) => {
        const sparePart = spareParts.find(
            (sparePart) => sparePart._id === sparePartId
        );
        const price = sparePrices[sparePartId];
        return sparePart
            ? `${sparePart.spareName} (ราคา: ${price} บาท)`
            : "ไม่พบบริการ";
    };

    const customer = customers.find((c) => c._id === customerId);

    if (!customer) {
        return <div>ไม่พบข้อมูลลูกค้า</div>;
    }

    return (
        <div>
            <h2>ใบเสร็จของลูกค้า: {customer.customer.customerName}</h2>
            <h3>รายการอะไหล่:</h3>
            <ul>
                {customer.services.map((service) => (
                    <div key={service.serviceName}>
                        <ul>
                            {service.spareParts.map((sparePart) => (
                                <li key={sparePart.sparePartId}>
                                    <div>{getPartNameFromId(sparePart.sparePartId)}</div>
                                    <div>จำนวน: {sparePart.quantity}</div>
                                    <div>ราคา: {sparePrices[sparePart.sparePartId]} บาท</div>
                                </li>
                            ))}
                        </ul>
                    </div>
                ))}
            </ul>
            <h2>ค่าบริการ: {customer.serviceFee}</h2>
            <h2>ยอดสุทธิ: {customer.totalCost}</h2>
        </div>
    );

};

export default Receipt;