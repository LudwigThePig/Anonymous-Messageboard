const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const ThreadSchema = new Schema({
  board: {
    type: String,
    required: true
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
  },
  dateCreated: {
    type: String,
    default: new Date()
  },
  comments: {
    type: [String]
  }
});

const Thread = mongoose.model('Thread', ThreadSchema);

module.exports = Thread;