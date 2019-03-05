const boardName = location.pathname.slice(3).toString();
let threads = [];
const http = {
  getter: ()=>{
    return fetch(`/api/threads/${boardName}`)
      .then(response => response.json())
      .then(data => threads = data)
      .then(_=> renderer())
      .catch(err => console.log(err));
  },
  poster: (thread)=>{
    const options = {
      method: "POST",
      body: thread,
      headers: {'Content-Type': 'application/json'}
    }
    return fetch(`/api/threads/${boardName}`, options)
      .then(response => response)
      .then(data => data)
      .catch(err => console.log(err));
  },
  deleter: (thread)=>{
    const options = {
      method: "POST",
      body: thread,
      headers: {'Content-Type': 'application/json'}
    }
    return fetch(`/api/threads/${boardName}`)
  }
}//end http
const renderer = ()=>{  
  for (let i = 0; i < threads.length; i++){
    console.log(threads[i]);
    if (!threads[i].reported){
      renderThread(threads[i]);
    }

  }
};

const renderThread = {
  norm: (thread)=>{
    const div = document.createElement('div');
    const threadText = document.createElement('h3');
    const date = document.createElement('span');
    const replyCount = document.createElement('span');

    if (thread.threadText.length > 100){ //Display only some of the text
      threadText.innerText = thread.threadText.slice(0, 100) + "...";
    } else {
        threadText.innerText = thread.threadText
      }
      date.innerText = thread.dateCreated;
      replyCount.innerText = `${thread.comments.length} replies`

      div.setAttribute('class', 'threadDiv');
      div.setAttribute('onclick', `location.href='/b/${thread.board}/${thread._id}'`)

      div.appendChild(threadText);
      div.appendChild(date);
      div.appendChild(replyCount);
      document.getElementById('threads').appendChild(div);
  }
}

const eventListeners = ()=>{
  const dom = {
    form: document.getElementById('newThread'),
    textArea: document.getElementsByName('text')[0],
    deleteKey: document.getElementsByName('deleteKey')[0]
  }
  dom.form.addEventListener('submit', (e)=>{
    e.preventDefault();
    if (dom.textArea.value.length > 5000){
      alert("Threads cannot be longer than 5,000 characters");
      return;
    }
    const request = {
      "threadText": dom.textArea.value,
      "deleteKey": dom.deleteKey.value
    }
    http.poster(JSON.stringify(request));
    location.reload();

  })
};

const init = ()=>{
  http.getter();
  const boardNameFormated = boardName.slice(0,1).toUpperCase() + boardName.slice(1);
  document.getElementById('boardName').innerText = `${boardNameFormated} Board`;
  eventListeners();
};

document.onload = init();