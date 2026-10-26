const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  openWindow: (route, width, height) => ipcRenderer.send('open-window', { route, width, height }),
  closeWindow: () => ipcRenderer.send('close-window'),
});

