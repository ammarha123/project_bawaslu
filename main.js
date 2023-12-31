const { app, BrowserWindow } = require('electron');
const path = require('path');
const url = require('url');
const dbConnection = require('./database');

// Enable the remote module
app.allowRendererProcessReuse = false; // This line is necessary for Electron 12+

const createWindow = () => {
  const win = new BrowserWindow({
    width: 1440,
    height: 1024,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      enableRemoteModule: true, // Enable the remote module
    },
  });

  // Load the HTML file using a file path or a URL
  win.loadFile('pages/login/index.html');

  // Open DevTools for debugging (remove in production)
  win.webContents.openDevTools();
};

app.whenReady().then(() => {
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});
