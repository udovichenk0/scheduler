let timer:NodeJS.Timer
onmessage = function(e) {
  switch(e.data.command){
    case 'start': 
      timer = setInterval(() => {
        self.postMessage({isRunning: true})
      }, 1000)
      break
    case 'stop': 
      clearInterval(timer)
      self.postMessage({isRunning: false})
      break
  }
};