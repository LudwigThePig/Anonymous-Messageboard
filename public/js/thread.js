const url = location.pathname.slice(3).toString().split('/');
const board = url[0];
const id = url[1];

let thread = {}; //Stores all the info needed to render the page. Data gathered from http.getter function, which is called onload()

const http = { //All the http fetch functions that a user will ever need.
  getter: ()=>{
    return fetch(`/api/replies/${id}`)
      .then(response => response.json())
      .then(data => thread = data)
      .then(_=> renderer())
      .catch(err => console.log(err));
  },
  poster: (reply)=>{
    const options = {
      method: "POST",
      body: reply,
      headers: {'Content-Type': 'application/json'}
    };
    return fetch(`/api/replies/${id}`, options)
      .then(res => res.json())
      .then(data => console.log(data))
      .catch(err => console.log(err));
  },
  
  deleter: (thread)=>{
    const options = {
      method: "DELETE",
      body: thread,
      headers: {'Content-Type': 'application/json'}
    };
    return fetch(`/api/threads/${id}`, options)
      .then(res => res.json())
      .then(data => messageAlert(data))
      .catch(err => console.log(err));
  },
  deleteReply: (reply)=>{
    const options = {
      method: "DELETE",
      body: reply,
      headers: {'Content-Type': 'application/json'}
    }
    console.log(reply);
    return fetch(`/api/replies/${id}`, options)
      .then(res => res.json())
      .then(data => messageAlert(data))
      .catch(err => console.log(err));
  }
}//end http



/*
Renderer is called after the http.getter() function gets the thread's data.
It renders the board name, thread text, and the thread's replies (in the for loop, might split later).
*/
const renderer = ()=>{
  const boardLink = document.createElement('h2');
  boardLink.innerText = `Go back to ${board}`;
  boardLink.setAttribute('onclick', `location.href='/b/${board}'`);
  document.getElementById('header').appendChild(boardLink);
  
  const threadText = document.createElement('p');
  threadText.innerText = thread.threadText;
  document.getElementById('thread').appendChild(threadText);
  
  if (thread.comments.length !== 0){
    const comments = thread.comments;
    const commentList = document.createElement('div');
    for (let i = 0; i < comments.length; i++){
      const div = document.createElement('div');
      const p = document.createElement('p');
      const span = document.createElement('span');
      
      div.setAttribute('class', 'replyDiv')
      p.innerText = comments[i];
      span.innerText = 'Delete Comment';
      
      span.setAttribute('onclick', `appendDeleteReply(${i})`);
      
      div.appendChild(p);
      div.appendChild(span);
      commentList.appendChild(div);
    }
    document.getElementById('replyNode').appendChild(commentList);
  }
};

const eventListeners = ()=>{
  const dom = {
    formReply: document.getElementById('replyForm'),
    reply: document.getElementsByName('text')[0],
    replyKey: document.getElementsByName('delete')[0],
    formDelete: document.getElementById('deleteForm'),
    threadKey: document.getElementsByName('text')[1]
  }
  dom.formReply.addEventListener('submit', (e)=>{
    e.preventDefault();
    const request = {
      "reply": dom.reply.value,
      "key": dom.replyKey.value,
      "id": id
    }
    http.poster(JSON.stringify(request));
    location.reload();
  })
  dom.formDelete.addEventListener('submit', (e)=>{
    e.preventDefault();
    http.deleter(JSON.stringify({key: dom.threadKey.value}))
    window.location.replace(`/b/${board}`);
  })
};


/*
  This appends the form to delete a reply and adds the event listener to the form. 
  The event listener calls the HTTP deleteReply function.
  This function is called by the renderer function.
*/
const appendDeleteReply = (index)=>{
  const form = document.createElement('form');
  const text = document.createElement('input');
  const submit = document.createElement('input');
  
  text.setAttribute('type', 'text');
  text.setAttribute('placeholder', 'delete key');
  text.setAttribute('required', "''");
  submit.setAttribute('type', 'submit');
  submit.setAttribute('class', 'button');
  submit.setAttribute('value', 'delete');

  form.appendChild(text);
  form.appendChild(submit);
  
  form.addEventListener('submit', (e)=>{
    e.preventDefault();
    const reply = {
      index: index,
      key: text.value,
      id: id
    }
    http.deleteReply(JSON.stringify(reply));
  });
  
  document.getElementsByClassName('replyDiv')[index].appendChild(form);
  console.log(index);
}

const messageAlert = (message)=>{ //Just parses messages from backend into an alert. Split to scale later
  console.log(message)
  alert(message.message);
  location.reload();
}


const init = ()=>{
  http.getter();
  eventListeners();

};

document.onload = init();