const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const ThreadSchema = new Schema({
  dateCreated: {
    type: String,
    default: new Date()
  },
  threadText: {
    type: String,
    required: true,
    min: 1,
    max: 1000
  },
  deleteKey: {
    type: String,
    required: true,
    min: 1,
    max: 10,
  }
});

const Thread = mongoose.model('Thread', ThreadSchema);

module.exports = Thread;