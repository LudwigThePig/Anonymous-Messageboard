const Thread = require('../models/thread-model.js');

function ReplyHandler(){
  this.getReplies = (req, res)=>{
    const id = req.params.board;
    Thread.findById(id, (err, doc)=>{
      if (err) console.log(err);
      const response = {
        board: doc.board,
        threadText: doc.threadText,
        dateCreated: doc.dateCreated,
        comments: doc.comments.map(x => x.reply)
      }
      res.json(response);
    })
  };
  
  this.addReply = (req, res)=>{
    const reply = {
      reply: req.body.reply,
      key:req.body.key
    }
    const id = req.body.id;
    Thread.findById(id, (err, doc)=>{
      if (err) console.log(err);
      doc.comments.push(reply);
      doc.save()
        .then(res.json({message: "Comment Posted"}));
    })
  };
  
  this.deleteReply = (req, res)=>{
    const id = req.params.board;
    const key = req.body.key;
    const index = req.body.index;
    Thread.findOne({_id: id}, (err, doc)=>{
      if (err) console.log(err);
      if (doc.comments[index].key === key){
        doc.comments.splice(index, 1);
        doc.save().then(
          res.json({message: "Reply deleted successfully"})
        )
      } else{
        res.json({message: "Invalid key for this comment"})
      }
    })
  };
  
  this.putReply = (req, res)=>{
  
  }
  
}

module.exports = ReplyHandler;