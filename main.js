const { app, BrowserWindow } = require('electron');
const path = require('path');
const url = require('url');
const dbConnection = require('./database');

const createWindow = () => {
  const win = new BrowserWindow({
    width: 1440,
    height: 1024,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      enableRemoteModule: true,
    },
  });

  // Load the HTML file using a file path or a URL
  win.loadFile('pages/login/index.html'); // You can also use 'loadURL' with a full URL

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

// // Handle the request for Kecamatan data
// ipcMain.on('getKecamatanData', (event) => {
//   // Query to fetch Kecamatan values from the database
//   dbConnection.query('SELECT kecamatan FROM data', (err, rows) => {
//     if (err) {
//       console.error('Error fetching Kecamatan data:', err);
//       return;
//     }

//     // Send the Kecamatan data to the renderer process
//     event.reply('kecamatanData', rows);
//   });
// });
