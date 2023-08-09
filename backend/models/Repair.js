const mongoose = require('mongoose');

const repairSchema = new mongoose.Schema({
  customer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Customer', // อ้างอิงไปยังโมเดล Customer
    required: true,
  },
  services: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Service', // อ้างอิงไปยังโมเดล Service
  }],
});

const Repair = mongoose.model('Repair', repairSchema);

module.exports = Repair;
