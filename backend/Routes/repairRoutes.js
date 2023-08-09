// routes/repairs.js
const express = require('express');
const router = express.Router();
const Repair = require('../models/Repair');

// Get all repairs
router.get('/', async (req, res) => {
  try {
    const repairs = await Repair.find().populate('customer services');
    res.json(repairs);
  } catch (error) {
    res.status(500).json({ error: 'An error occurred while fetching repairs.' });
  }
});

// Create a new repair
router.post('/', async (req, res) => {
  const { customer, services } = req.body;
  try {
    const newRepair = new Repair({ customer, services });
    await newRepair.save();
    res.status(201).json(newRepair);
  } catch (error) {
    res.status(400).json({ error: 'Failed to create a new repair.' });
  }
});

// Update a repair
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { customer, services } = req.body;
  try {
    const updatedRepair = await Repair.findByIdAndUpdate(id, { customer, services }, { new: true });
    if (!updatedRepair) {
      return res.status(404).json({ error: 'Repair not found.' });
    }
    res.json(updatedRepair);
  } catch (error) {
    res.status(400).json({ error: 'Failed to update repair.' });
  }
});

// Delete a repair
router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const deletedRepair = await Repair.findByIdAndRemove(id);
    if (!deletedRepair) {
      return res.status(404).json({ error: 'Repair not found.' });
    }
    res.json(deletedRepair);
  } catch (error) {
    res.status(400).json({ error: 'Failed to delete repair.' });
  }
});

module.exports = router;
