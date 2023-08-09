// routes/customers.js
const express = require('express');
const router = express.Router();
const Customer = require('../models/Customer');

// Get all customers
router.get('/', async (req, res) => {
  try {
    const customers = await Customer.find();
    res.json(customers);
  } catch (error) {
    res.status(500).json({ error: 'An error occurred while fetching customers.' });
  }
});

// Create a new customer
router.post('/', async (req, res) => {
  const { customerName } = req.body;
  try {
    const newCustomer = new Customer({ customerName });
    // await newCustomer.save();
    res.status(201).json(newCustomer);
  } catch (error) {
    res.status(400).json({ error: 'Failed to create a new customer.' });
  }
});

// Update a customer
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { customerName } = req.body;
  try {
    const updatedCustomer = await Customer.findByIdAndUpdate(id, { customerName }, { new: true });
    if (!updatedCustomer) {
      return res.status(404).json({ error: 'Customer not found.' });
    }
    res.json(updatedCustomer);
  } catch (error) {
    res.status(400).json({ error: 'Failed to update customer.' });
  }
});

// Delete a customer
router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const deletedCustomer = await Customer.findByIdAndRemove(id);
    if (!deletedCustomer) {
      return res.status(404).json({ error: 'Customer not found.' });
    }
    res.json(deletedCustomer);
  } catch (error) {
    res.status(400).json({ error: 'Failed to delete customer.' });
  }
});

module.exports = router;
