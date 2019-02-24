const Thread = require('../models/thread-model.js');

function ControllerHandler(){
  this.getThreads = (req, res)=>{
    const board = req.params.board;
    Thread.find({board: board}, (err, docs)=>{
      if (err) console.log(err);
      for (let i = 0; i<docs.length; i++){
        docs[i].deleteKey = ''; //Avoids sending the key to the client.
      }
      res.json(docs);

    })
  }
  
  this.addThread = (req, res)=>{
    const board = req.params.board,
          text = req.body.threadText,
          key = req.body.deleteKey;
    console.log(board, text, key);
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
            dateCreated: doc.dateCreated,
            threadText: doc.threadText,
          }
          res.json(response);
        }
        );
      }
    })
  }
  
  this.deleteThread = (req, res)=>{
  }
}

module.exports = ControllerHandler;