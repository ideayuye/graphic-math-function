
const electron = require('electron');

const {app} = electron;

const {BrowserWindow} = electron;

let mainWindow;

function createWindow(){
    mainWindow = new BrowserWindow({width:1000,height:600});

    mainWindow.loadURL(`file://${__dirname}/test.html`);

    mainWindow.webContents.openDevTools();

    mainWindow.on('closed',()=>{
        mainWindow = null;
    });

}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow);

// Quit when all windows are closed.
app.on('window-all-closed', () => {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) {
    createWindow();
  }
});

