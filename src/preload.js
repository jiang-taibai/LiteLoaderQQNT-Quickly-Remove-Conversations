const {contextBridge, ipcRenderer} = require('electron')

contextBridge.exposeInMainWorld("QuicklyRemoveConversations", {
    getConfig: (dataPath) => ipcRenderer.invoke('QuicklyRemoveConversations.getConfig', dataPath),
    setConfig: (dataPath, config) => ipcRenderer.invoke('QuicklyRemoveConversations.setConfig', dataPath, config),
});
