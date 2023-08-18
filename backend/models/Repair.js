const mongoose = require('mongoose');

const customerSchema = new mongoose.Schema({
  customer: {
    
    lineId: {
      type: String,
      required: true,
    },
    customerName: {
      type: String,
      required: true,
    },
    phoneNumber: {
      type: String,
      required: true,
    },
  },
  car: {
    numPlate: {
      type: String,
      required: true,
    },
    brand: {
      type: String,
      required: true,
    },
    selectedModel: {
      type: String,
      required: true,
    }
  },
  startdate: {
    type: String,
    required: true,
  }
});

const Customer = mongoose.model('Customer', customerSchema);

module.exports = Customer;
