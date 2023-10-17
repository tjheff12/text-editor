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
        ipcRenderer.send('loadFile', fileName)
    },
    loadFile: () => {
        console.log("aaa");
    }
  
  })


ipcRenderer.on('reply', (_event, reply) => {
    
    const test = document.getElementById('texteditor')
    console.log("reply is: " + reply)
    test.innerHTML = reply
    test.value = reply
})


ipcRenderer.on('FILE_OPEN', (event, args) => {
  // here the args will be the fileObj.filePaths array 
  // do whatever you need to do with it 
  console.log('got FILE_OPEN', event, args)
  fileName = args[0]
  ipcRenderer.send('loadFile', fileName)
})

ipcRenderer.on('textValue', (event, args) => {
  console.log('getting textarea value')
  elem = document.getElementById('texteditor');
  text = elem.value;
  ipcRenderer.send('mainTextValue', text)
})


ipcRenderer.on('textValue', (event, args) => {
  
  elem = document.getElementById('texteditor');
  text = elem.value;
  event.reply('')
})

ipcRenderer.on('getContents', (event, args) => {
  elem = document.getElementById('texteditor');
  text = elem.value;
  event.sender.send('contentReply', text)
})