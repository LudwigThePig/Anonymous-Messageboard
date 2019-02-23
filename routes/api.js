'use strict';
var expect = require('chai').expect;
const Thread = require('../controllers/thread-handler.js');

const thread = new Thread;

module.exports = function (app) {
  
  app.route('/api/threads/:board')
    .get(thread.getThreads)
    .post(thread.addThread)
    .delete(thread.deleteThread);
    
  app.route('/api/replies/:board');

};
