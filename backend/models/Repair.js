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
    },
    selectedColor: {
      type: String,
      required: true,
    }
  },
  services: [{
    serviceName: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Service',
    },
    spareParts: [{
      sparePartId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'SparePart',
      },
      quantity: {
        type: Number,
      },
      partCost: {
        type: Number,
      },
    }],
  }],
  serviceFee: {
    type: Number,
  },
  totalCost: {
    type: Number,
  },
  mechanics: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Employee',
  }],
  startdate: {
    type: String,
    required: true,
  },
  enddate: {
    type: String,
  },
  status: {
    state1: {
      type: Boolean,
      default: true,
    },
    state2: {
      type: Boolean,
      default: false,
    },
    state3: {
      type: Boolean,
      default: false,
    },
    state4: {
      type: Boolean,
      default: false,
    },
    state5: {
      type: Boolean,
      default: false,
    },
  },
});

const Customer = mongoose.model('Customer', customerSchema);

module.exports = Customer;