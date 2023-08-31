const express = require('express');
const router = express.Router();
const Customer = require('../models/Repair');

// สร้างรายการรถใหม่
router.post('/', async (req, res) => {
  try {
    const { numPlate, lineId, customerName, phoneNumber, brand, selectedModel, color, services, mechanics, startdate } = req.body;
    const newCustomer = await Customer.create({
      customer: { lineId, customerName, phoneNumber },
      car: { numPlate, brand, selectedModel, color },
      services,
      mechanics,
      startdate
    });
    res.status(201).json(newCustomer);
  } catch (error) {
    res.status(500).json({ message: 'Error adding customer', error });
  }
});

// ดึงรายการรถทั้งหมด
router.get('/', async (req, res) => {
  try {
    const customers = await Customer.find();
    res.status(200).json(customers);
  } catch (error) {
    res.status(500).json({ message: 'Error loading customer data', error });
  }
});

// แก้ไขข้อมูลรถ
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { numPlate, lineId, customerName, phoneNumber, brand, selectedModel, color, services, mechanics, startdate } = req.body;
    const updatedCustomer = await Customer.findByIdAndUpdate(
      id,
      {
        customer: { lineId, customerName, phoneNumber },
        car: { numPlate, brand, selectedModel, color },
        services,
        mechanics,
        startdate
      },
      { new: true, useFindAndModify: false }
    );
    res.status(200).json(updatedCustomer);
  } catch (error) {
    res.status(500).json({ message: 'Error updating customer', error });
  }
});

// ลบข้อมูลรถ
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await Customer.findByIdAndRemove(id);
    res.status(200).json({ message: 'Customer deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting customer', error });
  }
});

module.exports = router;
