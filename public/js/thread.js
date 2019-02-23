(function(){
    const threadName = location.pathname.slice(1).toString();
    let threads = [];
    const http = {
      getter: ()=>{
        return fetch(`/api/threads/${threadName}`)
      },
      poster: (thread)=>{
        const options = {
          method: "POST",
          body: thread,
          headers: {'Content-Type': 'application/json'}
        }
        return fetch(`/api/threads/${threadName}`, options)
      },
      deleter: (thread)=>{
        const options = {
          method: "POST",
          body: thread,
          headers: {'Content-Type': 'application/json'}
        }
        return fetch(`/api/threads/${threadName}`)
      }
    }//end http
    const renderer = ()=>{
      http.getter()
        .then(console.log(threads));
    };
    
    const init = ()=>{
      console.log('good day mate, more to come soon')
    };
    init();
  })()//end iife