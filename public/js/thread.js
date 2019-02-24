const boardName = location.pathname.slice(3).toString();
let threads = [];
const http = {
  getter: ()=>{
    return fetch(`/api/threads/${boardName}`)
  },
  poster: (thread)=>{
    const options = {
      method: "POST",
      body: thread,
      headers: {'Content-Type': 'application/json'}
    }
    return fetch(`/api/threads/${boardName}`, options)
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
  const boardNameFormated = boardName.slice(0,1).toUpperCase() + boardName.slice(1);
  document.getElementById('boardName').innerText = `${boardNameFormated} Board`;
};

const init = ()=>{
  console.log('good day mate, more to come soon');
  console.log(boardName);
  renderer();
};

document.onload = init();