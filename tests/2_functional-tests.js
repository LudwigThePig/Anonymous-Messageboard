/*
*
*
*       FILL IN EACH FUNCTIONAL TEST BELOW COMPLETELY
*       -----[Keep the tests in the same order!]-----
*       (if additional are added, keep them at the very end!)
*/

var chaiHttp = require('chai-http');
var chai = require('chai');
var assert = chai.assert;
var server = require('../server');

chai.use(chaiHttp);

suite('Functional Tests', function() {

  suite('API ROUTING FOR /api/threads/:board', function() {
    
    suite('GET', function() {
      test('Getting threads', (done)=>{
      chai.request(server)
        .get('/api/threads/general')
        .query({})
        .end((err, res)=>{
          assert.equal(res.status, 200, 'Should connect');
          assert.isArray(res.body, 'Threads should be stored in an array');
          assert.isObject(res.body[0], 'Each thread should be an object');
          assert.isString(res.body[0].board, 'The name of the board should be a string');
          assert.isString(res.body[0].threadText, 'Thread text should be a string');
          assert.isString(res.body[0].deleteKey, 'Delete key should be a string');
          assert.isArray(res.body[0].comments, 'Comments should be stored in an array');
          assert.isObject(res.body[0].comments[0], 'Each comment should stored in an object with its key');
        
          
  // threadText: {
  //   type: String,
  //   required: true,
  //   min: 1,
  //   max: 5000
  // },
  // deleteKey: {
  //   type: String,
  //   required: true,
  //   min: 1,
  //   max: 12,
  // },
  // dateCreated: {
  //   type: String,
  //   default: new Date()
  // },
  // comments: {
  //   type: [{
  //     reply: {
  //       type: String,
  //       min: 1,
  //       max: 280,
  //       required: true
  //     },
  //     key: {
  //       type: String,
  //       min: 1,
  //       max: 12,
  //       required: true
  //     }
  //   }]
  // }
// });
          done();
        })
      })
    });
    
    suite('POST', function() {
      
    });
    
    suite('DELETE', function() {
      
    });
    
    suite('PUT', function() {
      
    });
    

  });
  
  suite('API ROUTING FOR /api/replies/:board', function() {
    
    suite('POST', function() {
      
    });
    
    suite('GET', function() {
      
    });

    suite('PUT', function() {
      
    });
    
    suite('DELETE', function() {
      
    });
    
  });

});
