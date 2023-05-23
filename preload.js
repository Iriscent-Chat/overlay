const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('electronAPI',{
    doAuth: () => ipcRenderer.invoke('do-auth'),
    exit: () => ipcRenderer.invoke('exit'),
    minimize: () => ipcRenderer.invoke('minimize'),
    launchChat: (settings) => ipcRenderer.send('launch-chat', settings),
    askLogout: () => ipcRenderer.invoke('ask-logout'),
    forceQuit: () => ipcRenderer.invoke('force-quit'),
    updateRPC: (options) => ipcRenderer.invoke('update-rpc', (options)),
})