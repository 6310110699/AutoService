const mongoose = require('mongoose');

const serviceSchema = new mongoose.Schema({
  serviceName: {
    type: String,
    required: true,
  },
  spares: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Spare',
    required: true,
  }],
});

const Service = mongoose.model('Service', serviceSchema);

module.exports = Service;
