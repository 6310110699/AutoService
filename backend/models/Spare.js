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
    type: mongoose.Schema.Types.ObjectId,
    ref: 'BrandModel',
  }],
});

const Spare = mongoose.model('Spare', spareSchema);

module.exports = Spare;