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
    let id;
      
    suite('POST', function() {
      test('Posting a thread', (done)=>{
        chai.request(server)
          .post('/api/threads/general')
          .send({threadText: "testing", deleteKey: "test"})
          .end((err, res)=>{
            assert.equal(res.status, 200);
            assert.equal(res.body.message, "Document Created"); //This is the response sent when the thread text is a duplicate.
            done();
          })
      })
    });
  
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
          id = res.body[res.body.length-1]._id; //id to the test suite for deletion
          done();
        })
      })
    });
    
    suite('DELETE', function() {
      test('Deleting a thread with the wrong key', (done)=>{
        chai.request(server)
          .delete('/api/threads/general')
          .send({id: id, key: 'wrongkey'})
          .end((err, res)=>{
            assert.equal(res.status, 200, 'Should connect');
            assert.isString(res.body.message, 'Response should be a string.');
            assert.equal(res.body.message, 'Key did not match. Try again.')
            done();
          });
      })
      test('Deleting a thread with the right key', (done)=>{
        chai.request(server)
          .delete('/api/threads/general')
          .send({id: id, key: 'test'})
          .end((err, res)=>{
            assert.equal(res.status, 200, 'Should connect');
            assert.isString(res.body.message, 'Response should be a string.');
            assert.equal(res.body.message, 'Thread deleted')
            done();
          });
      })
    });
    
//     suite('PUT', function() { Not support PUT requests for this messageboard
      
//     });
    

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
