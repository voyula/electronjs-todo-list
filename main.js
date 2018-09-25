const {
  app,
  BrowserWindow,
  Menu,
  ipcMain
} = require('electron')

let mainWindow,
  addWindow

app.on('ready', function() {
  mainWindow = new BrowserWindow({
    backgroundColor: 'lightgray',
    width: 800,
    height: 600
  })

  mainWindow.loadFile('windows/main.html')

  const mainMenu = Menu.buildFromTemplate(mainMenuTemplate);
  Menu.setApplicationMenu(mainMenu);

  mainWindow.on('closed', function() {
    mainWindow = null
  })
})

ipcMain.on('item:add', function(e, item) {
  mainWindow.webContents.send('item:add', item);
  addWindow.close();
  addWindow = null;
});

const mainMenuTemplate = [{
  label: 'Settings',
  submenu: [{
      label: 'Add Item',
      click() {
        addWindow = new BrowserWindow({
          width: 300,
          height: 200,
          title: 'Add TODO List Item'
        })
        addWindow.loadFile('windows/add.html')
        addWindow.on('close', function() {
          addWindow = null;
        })
      }
    },
    {
      label: 'Clear Items',
      click() {
        mainWindow.webContents.send('item:clear');
      }
    },
    {
      label: 'Quit',
      accelerator: process.platform == 'darwin' ? 'Command+Q' : 'Ctrl+Q',
      click() {
        app.quit();
      }
    }
  ]
}];

if (process.platform == 'darwin') {
  mainMenuTemplate.unshift({});
}

app.on('window-all-closed', function() {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', function() {
  if (mainWindow === null) {
    createWindow()
  }
})
