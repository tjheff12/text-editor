const { contextBridge, ipcRenderer} = require('electron')

contextBridge.exposeInMainWorld('versions', {
  node: () => process.versions.node,
  chrome: () => process.versions.chrome,
  electron: () => process.versions.electron,
  // we can also expose variables, not just functions
  ping: () => ipcRenderer.invoke('ping'),
  
})

contextBridge.exposeInMainWorld('electron', {
    startDrag: (fileName) => {
      ipcRenderer.send('ondragstart', fileName)
    },
    startDrop: (fileName) => {
        ipcRenderer.send('startDrop', fileName)
    },
    
  
  })


ipcRenderer.on('reply', (_event, reply) => {
    
    const test = document.getElementById('text')
    console.log("reply is: " + reply)
    test.innerText = reply
})