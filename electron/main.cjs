const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');

const isDev = process.env.NODE_ENV === 'development';
const startUrl = isDev 
  ? 'http://localhost:5173' 
  : `file://${path.join(__dirname, '../dist/index.html')}`;

function createWindow(route = '/', width = 1280, height = 820) {
  const win = new BrowserWindow({
    width,
    height,
    minWidth: 800,
    minHeight: 600,
    backgroundColor: '#0f0f13',
    titleBarStyle: 'hiddenInset',
    autoHideMenuBar: true,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false,
    },
  });

  win.loadURL(`${startUrl}/#${route}`);

  return win;
}

app.whenReady().then(() => {
  createWindow('/', 1280, 840);

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow('/', 1280, 840);
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});

ipcMain.on('open-window', (event, { route, width, height }) => {
  createWindow(route, width || 1280, height || 840);
});

ipcMain.on('close-window', (event) => {
  const win = BrowserWindow.fromWebContents(event.sender);
  if (win) win.close();
});
