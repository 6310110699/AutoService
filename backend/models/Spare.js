const mongoose = require('mongoose');

const spareSchema = new mongoose.Schema({
  spareName: {
    type: String,
    required: true,
    unique: true
  },
  spareType: {
    type: String,
    required: true,
  },
  sparePrice: {
    type: String,
    required: true,
  },
  compatibleCarModels: [{
    type: String, // เปลี่ยนเป็น String
    required: true,
  }],
});

const Spare = mongoose.model('Spare', spareSchema);

module.exports = Spare;
