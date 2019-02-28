/*
*
*  PLEASE RUN THE TEST MULTIPLE TIMES. 
*  Tests can post threads faster than they can delete them.
*  You may get an error saying: 'This thread already exists' should equal 'Thread Created'.
*       
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
    const id = '5c7838a90479833484cdf4ee'; //ID for test thread 
    suite('POST', function() {
      test('Posting a reply', (done)=>{
      chai.request(server)
          .post('/api/replies/general')
          .send({reply: "testing", key: "test", id: id})
          .end((err, res)=>{
            assert.equal(res.status, 200, 'Should connect');
            assert.isObject(res.body, 'Should be an object');
            assert.isString(res.body.message, 'Response message should be a string');
            assert.equal(res.body.message, "Comment Posted");
            done();
          });
      });
      
    });
    
    suite('GET', function() {
      test('Getting replies', (done)=>{
      chai.request(server)
          .get(`/api/replies/${id}`)
          .send({key: "test", id: id})
          .end((err, res)=>{
            assert.equal(res.status, 200, 'Should connect');
            assert.equal(res.body.board, 'general');
            assert.isArray(res.body.comments, 'Comments should be stored in an array');
            assert.equal(res.body.comments[0], 'testing');
            done();
          });
      });
      
      
    });
    
//     suite('PUT', function() {
      //No need to update comments
//     });
    
    suite('DELETE', function() {
      test('Deleting a reply with the wrong key', (done)=>{
        chai.request(server)
          .delete(`/api/replies/${id}`)
          .send({key: "wrongkey", index: 0})
          .end((err, res)=>{
            assert.equal(res.status, 200, 'Should connect');
            assert.isString(res.body.message, 'Response message should be a string');
            assert.equal(res.body.message, 'Invalid key for this comment');
            done();
          })
      })
      
      test('Deleting replies with the correct key', (done)=>{
        chai.request(server)
          .delete(`/api/replies/${id}`)
          .send({key: "test", index: 0})
          .end((err, res)=>{
            assert.equal(res.status, 200, 'Should connect');
            assert.isString(res.body.message, 'Response message should be a string');
            assert.equal(res.body.message, 'Reply deleted successfully');
            done();
          });
      });
    });
    
  });

});
