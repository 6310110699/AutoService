// models/vehicleModel.js

const mongoose = require('mongoose');

const customerSchema = new mongoose.Schema({
  customer: {
    customerName: {
      type: String,
      required: true,
    },
    phoneNumber: {
      type: String,
      required: true,
    },
  }

});

const Customer = mongoose.model('Customer', customerSchema);

module.exports = Customer;
