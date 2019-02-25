const Thread = require('../models/thread-model.js');

function ReplyHandler(){
  this.getReplies = (req, res)=>{
    const id = req.params.board;
    Thread.findById(id, (err, doc)=>{
      if (err) console.log(err);
      const response = doc.map(x => x.reply);
      res.json(response);
    })
  };
  
  this.addReply = (req, res)=>{
    console.log(req.body);
    const reply = {
      reply: req.body.reply,
      key:req.body.key
    }
    const id = req.body.id;
    Thread.findById(id, (err, doc)=>{
      if (err) console.log(err);
      doc.comments.push(reply);
      doc.save()
        .then(console.log(doc));
    })
  };
  
  this.deleteReply = (req, res)=>{
  
  };
  
  this.putReply = (req, res)=>{
  
  }
  
}

module.exports = ReplyHandler;