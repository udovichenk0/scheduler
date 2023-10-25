let fading = false;
let interval: NodeJS.Timer;
self.addEventListener('message', function(e){
    switch (e.data) {
        case 'start':
            if (!fading){
                fading = true;
                interval = setInterval(function(){
                    self.postMessage('tick');
                }, 50);
            }
            break;
        case 'stop':
            clearInterval(interval);
            fading = false;
            break;
    }
}, false);