const url = location.pathname.slice(3).toString().split('/');
const board = url[0];
const id = url[1];

let thread = {};
const http = {
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
      .then(response => response)
      .then(data => data)
      .catch(err => console.log(err));
  },
  
  deleter: (thread)=>{
    const options = {
      method: "POST",
      body: thread,
      headers: {'Content-Type': 'application/json'}
    };
    return fetch(`/api/replies/${id}`)
  }
}//end http
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
    const commentList = document.createElement('ul');
    for (let i = 0; i < comments.length; i++){
      const li = document.createElement('li');
      li.innerText = comments[i];
      commentList.appendChild(li);
    }
    document.getElementById('replyNode').appendChild(commentList);
  }
};

const eventListeners = ()=>{
  const dom = {
    form: document.getElementById('replyForm'),
    reply: document.getElementsByName('text')[0],
  }
  dom.form.addEventListener('submit', (e)=>{
    e.preventDefault();
    const request = {
      "reply": dom.reply.value,
      "id": id
    }
    http.poster(JSON.stringify(request));
    location.reload();
  })
};


const init = ()=>{
  http.getter();
  eventListeners();

};

document.onload = init();