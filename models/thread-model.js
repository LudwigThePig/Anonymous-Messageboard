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
    max: 5000
  },
  deleteKey: {
    type: String,
    required: true,
    min: 1,
    max: 12,
  },
  dateCreated: {
    type: String,
    default: new Date()
  },
  comments: {
    type: [{
      reply: {
        type: String,
        min: 1,
        max: 280,
        required: true
      },
      key: {
        type: String,
        min: 1,
        max: 12,
        required: true
      }
    }]
  },
  reported: {
    type: Boolean,
    default: false
  }
});

const Thread = mongoose.model('Thread', ThreadSchema);

module.exports = Thread;