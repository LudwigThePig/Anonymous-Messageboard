'use strict';
var expect = require('chai').expect;
const Thread = require('../controllers/thread-handler.js');
const Reply = require('../controllers/reply-handler.js');

const thread = new Thread;
const reply = new Reply;

module.exports = function (app) {
  
  app.route('/api/threads/:board')
    .get(thread.getThreads)
    .post(thread.addThread)
    .delete(thread.deleteThread);
    
  app.route('/api/replies/:board')
  ;

};
