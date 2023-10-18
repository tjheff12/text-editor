/*
*
* This file is meant to provide a way to test code without changing the current working code in main.js
*
*/

const { app, BrowserWindow } = require('electron')

app.whenReady().then(() => {
const win = new BrowserWindow({ width: 800, height: 1500 })
win.loadURL('https://github.com')

const contents = win.webContents
console.log(contents)

})