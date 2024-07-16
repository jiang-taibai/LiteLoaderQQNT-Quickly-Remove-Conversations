const {contextBridge} = require("electron");

contextBridge.exposeInMainWorld("QuicklyRemoveConversations", {});
