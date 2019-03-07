const Thread = require('../models/thread-model.js');

function ControllerHandler(){
  this.getThreads = (req, res)=>{
    const board = req.params.board;
    Thread.find({board: board}, (err, docs)=>{
      if (err) console.log(err);
      let response = [];

      for (let i = 0; i<docs.length; i++){
        let obj = {
          board: docs[i].board,
          threadText: docs[i].threadText,
          dateCreated: docs[i].dateCreated,
          comments: docs[i].comments.length, 
          reported: docs[i].reported
        }
        response.push(obj);
      }
      res.json(response);
    })
  }
  
  this.addThread = (req, res)=>{
    const board = req.params.board,
          text = req.body.threadText,
          key = req.body.deleteKey;
    Thread.findOne({threadText: text}, (err, doc)=>{
      if (err) console.log(err);
      if (doc){
        res.json({message: 'Please stop spamming'});
        console.log('spam response');
      } else {
        let thread = new Thread({
          board: board,
          threadText: text,
          deleteKey: key
        })
        thread.save().then( (doc)=>{
          console.log(`document created: ${doc}`);
          let response = {
            message: "Document Created",
            id: doc._id
          }
          res.json(response);
        }
        );
      }
    })
  }
  /*TODO FIX THIS SO THAT IT DELETES THE SPECIFIED ID IF KEYS MATCH*/
  this.deleteThread = (req, res)=>{
    const id = req.body.id;
    const key = req.body.key;
    Thread.findOneAndDelete({_id: id, deleteKey: key}, (err, doc)=>{
      if (err) console.log(err);
      if (doc){
        console.log('thread deleted');
        res.json({message: "Thread deleted"});
      } else {
        console.log('This key does not match')
        res.json({message: "Key did not match. Try again."});
      }
    })
  },
  this.reportThread = (req, res)=>{
    const id = req.params.board;
    Thread.findOneAndUpdate({_id: id}, {reported: true}, (err,doc)=>{
      if (err) console.log(err);
      console.log(doc.reported);
      res.json({message: "Thread has been reported"});
    })
  }
}

module.exports = ControllerHandler;