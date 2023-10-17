
// const information = document.getElementById('info')
// information.innerText = `This app is using Chrome (v${window.versions.chrome()}), Node.js (v${window.versions.node()}), and Electron (v${window.versions.electron()})`

// const func = async () => {
//     const response = await window.versions.ping()
//     console.log(response) // prints out 'pong'
//   }

  
// func()


// document.getElementById('drag1').ondragstart = (event) => {
//     event.preventDefault()
//     window.electron.startDrag('drag-and-drop-1.md')
//   }
  
//   document.getElementById('drag2').ondragstart = (event) => {
//     event.preventDefault()
//     window.electron.startDrag('drag-and-drop-2.md')
// }

// document.getElementById('test').dragin = (event) => {
//     const test = document.getElementById('test')
//     test.innerText = window.electron.getText(fileName)

// }

document.addEventListener('drop', (event) => {
    event.preventDefault();
    event.stopPropagation();
 
    for (const f of event.dataTransfer.files) {
        // Using the path attribute to get absolute file path
        //console.log('File Path of dragged files: ', f.path)
        window.electron.startDrop(f.path)
      }
});
 
document.addEventListener('dragover', (e) => {
    e.preventDefault();
    e.stopPropagation();
  });
 
document.addEventListener('dragenter', (event) => {
    //console.log('File is in the Drop Space');
});
 
document.addEventListener('dragleave', (event) => {
    //console.log('File has left the Drop Space');
});

document.addEventListener('fileLoad', (event) => {
  const textArea = document.getElementById('texteditor');
  textArea.innerText = 'test';
});

