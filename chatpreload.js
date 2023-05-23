const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('electronAPI', {
  getChatSettings: () => ipcRenderer.invoke('get-chat-settings'),
  exit: () => ipcRenderer.invoke('exit'),
  minimize: () => ipcRenderer.invoke('minimize'),
  updateRPC: (options) => ipcRenderer.invoke('update-rpc', (options)),
})