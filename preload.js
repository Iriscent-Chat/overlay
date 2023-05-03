const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('electronAPI',{
    doAuth: () => ipcRenderer.invoke('do-auth'),
    exit: () => ipcRenderer.invoke('exit'),
    launchChat: (settings) => ipcRenderer.send('launch-chat', settings),
    askLogout: () => ipcRenderer.invoke('ask-logout'),
    forceQuit: () => ipcRenderer.invoke('force-quit')
})