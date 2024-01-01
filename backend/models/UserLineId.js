const mongoose = require('mongoose');

const userlineidSchema = new mongoose.Schema({
    userId: {
    type: String,
    required: true,
  },
  lineIdData: {
    type: String,
    required: true,
  },
});

const UserLineId = mongoose.model('UserLineId', userlineidSchema);

module.exports = UserLineId;