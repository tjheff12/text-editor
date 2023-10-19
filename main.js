//dependancies
const { app, BrowserWindow, ipcMain, Menu, webContents } = require('electron')
const path = require('node:path')
const fs = require('fs')
const https = require('https')
const dialog = require('electron').dialog

const isMac = process.platform === 'darwin'
let currFile = 'None';

//function for creating a new browser window
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
  
  
  return win
}

const menuTemplate = [
  {
    label: 'File',
    submenu: [
      {
        label:'New File',
        accelerator: 'CmdOrCtrl+N',
        // click event
        click() {
           // construct the select file dialog 
           win.webContents.send('displayFileContentsInTextbox', 'Petah, the horse is here.')
           currFile = 'None'
        } 
    },
      {
         label:'Open File',
         accelerator: 'CmdOrCtrl+O',
         // click event
         click() {
            // construct the select file dialog 
            dialog.showOpenDialog({
              properties: ['openFile'],
              //defines accepted file types. This can open anything, but its helpful for the user to define a default
              filters: [{ name: 'Text Files', extensions: ['txt'] },
                { name: 'All Files', extensions: ['*'] },
            
              ],
            })
            .then(function(fileObj) {
               
               if (!fileObj.canceled) {
                 win.webContents.send('FILE_OPEN', fileObj.filePaths)
                 currFile = fileObj.filePaths[0];
                 console.log(currFile)
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
        
        if(currFile === 'None'){
          dialog.showSaveDialog({
            
          })
          .then(function(fileObj) {
             
            if (!fileObj.canceled) {
              console.log(fileObj.filePath)
              currFile = fileObj.filePath;
              win.webContents.send('getContents')
              ipcMain.once('contentReply', (event, contents) => {
                console.log("savingFile")
                console.log(currFile);
                fs.writeFile(currFile, contents, err => {
                  if (err) {
                    console.error(err);
                  }
              });
        })
             }
          })
          .catch(function(err) {
             console.error(err)  
          })
        } else {
          win.webContents.send('getContents')
          ipcMain.once('contentReply', (event, contents) => {
            console.log("savingFile")
            console.log(currFile);
            fs.writeFile(currFile, contents, err => {
              if (err) {
                console.error(err);
              }
          });
        })
        }
        
        
        
      }
     },
     { type: 'separator' },
     {
         label:'Exit',
         click() {
            app.quit()
         } 
       }
    ]
  },
  {
    label: 'Edit',
    submenu: [
      { role: 'undo' },
      { role: 'redo' },
      { type: 'separator' },
      { role: 'cut' },
      { role: 'copy' },
      { role: 'paste' },
      ...(isMac
        ? [
            { role: 'pasteAndMatchStyle' },
            { role: 'delete' },
            { role: 'selectAll' },
            { type: 'separator' },
            {
              label: 'Speech',
              submenu: [
                { role: 'startSpeaking' },
                { role: 'stopSpeaking' }
              ]
            }
          ]
        : [
            { role: 'delete' },
            { type: 'separator' },
            { role: 'selectAll' }
          ])
    ]
  },
  {
    label:'Debug',
    submenu: [
      {
        label:'Open Dev Tools',
        click(){
          win.webContents.openDevTools();
        }
      },
      {
        label:'Print Textbox to Console',
        click(){
          win.webContents.send('textValue')
        }
      },
  ]
  }
]

//sets menu to be template above
const menu = Menu.buildFromTemplate(menuTemplate)
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
            fileContents =  fs.readFileSync(filePath, 'utf8')
            
            let reply = String(fileContents);
            //Leftover relic for replacing newline with ascii. This was fixed in renderer by changing innerHTML instead of innerText
            //let test2 = test.replace(/(?:\r\n|\r|\n)/g, '&#013;&#010;')
            console.log(reply)
            event.reply('displayFileContentsInTextbox', reply)
        }
    })
    
})



app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
      app.quit()
    }
  })


ipcMain.on('logText', (event, text) => {
  console.log(text)
})