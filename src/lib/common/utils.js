import {ipcMain, shell, dialog, BrowserWindow} from "electron";


export const openWeb = (url) => {
    shell.openExternal(url);
}