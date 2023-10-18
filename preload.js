const { contextBridge, ipcRenderer} = require('electron')



contextBridge.exposeInMainWorld('electron', {
    
    startDrop: (fileName) => {
        ipcRenderer.send('loadFile', fileName)
    },
  
  })


ipcRenderer.on('displayFileContentsInTextbox', (_event, reply) => {
    
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
  ipcRenderer.send('logText', text)
})




ipcRenderer.on('getContents', (event, args) => {
  elem = document.getElementById('texteditor');
  text = elem.value;
  event.sender.send('contentReply', text)
})