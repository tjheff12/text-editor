const { app, BrowserWindow, ipcMain, Menu, webContents } = require('electron')
const path = require('node:path')
const fs = require('fs')
const https = require('https')
const dialog = require('electron').dialog

let currFile = 'None';

const createWindow = () => {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
        preload: path.join(__dirname, 'preload.js')
        
    },
    autoHideMenuBar: false
  })

  win.loadFile('index.html');
  //win.loadURL('https://github.com')
  
  win.webContents.openDevTools();
  return win
}

const testMenuTemplate = [{
  label: 'File',
  submenu: [
    { role: 'quit' }
  ]
},]

const testMenuTemplate2 = [
  {
    label: 'File',
    submenu: [
      {
         label:'Open File',
         accelerator: 'CmdOrCtrl+O',
         // this is the main bit hijack the click event 
         click() {
            // construct the select file dialog 
            dialog.showOpenDialog({
              properties: ['openFile']
            })
            .then(function(fileObj) {
               // the fileObj has two props 
               if (!fileObj.canceled) {
                 win.webContents.send('FILE_OPEN', fileObj.filePaths)
                 currFile = fileObj.filePaths;
               }
            })
            .catch(function(err) {
               console.error(err)  
            })
         } 
     },
     {
      label:'Save File',
      accelerator: 'CmdOrCtrl+S',
      click() {
        // construct the select file dialog 
        if(currFile === 'None'){
          dialog.showOpenDialog({
            properties: ['openFile']
          })
          .then(function(fileObj) {
             // the fileObj has two props 
             if (!fileObj.canceled) {
              
               currFile = fileObj.filePaths;
             }
          })
          .catch(function(err) {
             console.error(err)  
          })
        } 
        win.webContents.send('getContents')
        ipcMain.once('contentReply', (event, contents) => {
          console.log("savingFile")
          console.log(currFile);
          fs.writeFile(currFile[0], contents, err => {
            if (err) {
              console.error(err);
            }
          });
        })
        
        
      }
     },
     {
        label:'Console Log Contents',
        click(){
          win.webContents.send('textValue')
        }
     },
     {
         label:'Exit',
         click() {
            app.quit()
         } 
       }
    ]
  }
]

const menu = Menu.buildFromTemplate(testMenuTemplate2)
Menu.setApplicationMenu(menu)

const iconName = path.join(__dirname, 'iconForDragAndDrop.png')
const icon = fs.createWriteStream(iconName)

fs.writeFileSync(path.join(__dirname, 'drag-and-drop-1.md'), '# First file to test drag and drop')
fs.writeFileSync(path.join(__dirname, 'drag-and-drop-2.md'), '# Second file to test drag and drop')

https.get('https://img.icons8.com/ios/452/drag-and-drop.png', (response) => {
  response.pipe(icon)
})

app.whenReady().then(() => {
    
    win = createWindow()
    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) {
          createWindow()
        }
      })
    
    ipcMain.on('loadFile', (event, filePath) => {
        if (filePath != undefined) {
            console.log(filePath)
            body =  fs.readFileSync(filePath, 'utf8')
            const bodyString = String(body)
            
            //console.log(String(body).replace('\n','&#13;&#10;'))
            let test = String(body);
            let test2 = test.replace(/(?:\r\n|\r|\n)/g, '&#013;&#010;')
            console.log(test2)
            event.reply('reply', test)
        }
    })
    
})



app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
      app.quit()
    }
  })

ipcMain.on('ondragstart', (event, filePath) => {
    event.sender.startDrag({
      file: path.join(__dirname, filePath),
      icon: iconName
    })
  })

ipcMain.on('mainTextValue', (event, text) => {
  console.log(text)
})