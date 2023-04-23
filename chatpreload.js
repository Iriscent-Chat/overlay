const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('electronAPI', {
  getChatSettings: () => ipcRenderer.invoke('get-chat-settings')
})