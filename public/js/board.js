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
  
  //sorts threads, with the newest being first
  threads.sort(function(a,b){
    return new Date(b.dateCreated) - new Date(a.dateCreated);
  });
  
  for (let i = 0; i < threads.length; i++){
    const domNode = document.getElementById('threads');
    if (!threads[i].reported){
      const threadDiv = renderThread.norm(threads[i]);
      domNode.insertBefore(threadDiv, domNode.children[i+1]);
    } else {
      const threadDiv = renderThread.reported(threads[i], i, domNode);
      domNode.insertBefore(threadDiv, domNode.children[i+1]);

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
    
        //"Thu Feb 28 2019 19:37:35 GMT+0000 (Coordinated Universal Time)" => "Feb 28 2019 19:50:20 GMT"
    const prunedDate = thread.dateCreated.split(' ').slice(1,5).join(" ") + " GMT"; //
    date.innerText = `Created: ${prunedDate}`;
    
    replyCount.innerText = `${thread.comments} replies`

    div.setAttribute('class', 'threadDiv');
    div.setAttribute('onclick', `location.href='/b/${thread.board}/${thread.id}'`)

    div.appendChild(threadText);
    div.appendChild(date);
    div.appendChild(replyCount);
    return div;
  },
  
  reported: (thread, i, domNode)=>{
    const div = document.createElement('div');
    const threadText = document.createElement('h3');
    const span = document.createElement('span');

    threadText.innerText = "Reported Thread";
    span.innerText = "Click To View";
    
    
    div.setAttribute('class', 'reported');
    div.setAttribute('id', `r${thread._id}`)
    div.addEventListener('click', (e)=>{
      e.preventDefault();      
      const element = document.getElementById(`r${thread._id}`);
      element.parentNode.replaceChild(renderThread.norm(thread), div);
    });
    
    div.appendChild(threadText);
    div.appendChild(span);    
    return div;
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