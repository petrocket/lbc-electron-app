'use strict'

import { app, BrowserWindow } from 'electron'
import { UpdateInfo } from 'electron-updater'
import * as path from 'path'
import { format as formatUrl } from 'url'
const log = require('electron-log')
const { autoUpdater } = require("electron-updater")


autoUpdater.logger = log
autoUpdater.logger.transports.file.level = 'info'
log.info('App starting...')

function sendStatusToWindow(text:String) {
  log.info('Status: ' + text);
  //win.webContents.send('message', text);
}

function createWindow() {
  const mainWindow = new BrowserWindow({webPreferences: {nodeIntegration: true}})
  const isDevelopment = process.env.NODE_ENV !== 'production'

  if (isDevelopment) {
    mainWindow.webContents.openDevTools()
  }

  if (isDevelopment) {
    mainWindow.loadURL(`http://localhost:${process.env.ELECTRON_WEBPACK_WDS_PORT}`)
  }
  else {
    mainWindow.loadURL(formatUrl({
      pathname: path.join(__dirname, 'index.html'),
      protocol: 'file',
      slashes: true
    }))
  }

  mainWindow.on('closed', () => {
    mainWindow.destroy()
  })

  mainWindow.webContents.on('devtools-opened', () => {
    mainWindow.focus()
    setImmediate(() => {
      mainWindow.focus()
    })
  })

  return mainWindow 
}

autoUpdater.on('checking-for-update', () => {
  sendStatusToWindow('Checking for update...');
})
autoUpdater.on('update-available', (info:UpdateInfo) => {
  sendStatusToWindow('Update available.');
})
autoUpdater.on('update-not-available', (info:UpdateInfo) => {
  sendStatusToWindow('Update not available.');
})
autoUpdater.on('error', (err:Error) => {
  sendStatusToWindow('Error in auto-updater. ' + err);
})
autoUpdater.on('download-progress', (progressObj: any) => {
  let log_message = "Download speed: " + progressObj.bytesPerSecond;
  log_message = log_message + ' - Downloaded ' + progressObj.percent + '%';
  log_message = log_message + ' (' + progressObj.transferred + "/" + progressObj.total + ')';
  sendStatusToWindow(log_message);
})
autoUpdater.on('update-downloaded', (info:UpdateInfo) => {
  sendStatusToWindow('Update downloaded');
});

// quit application when all windows are closed
app.on('window-all-closed', () => {
  // on macOS it is common for applications to stay open until the user explicitly quits
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

// create main BrowserWindow when electron is ready
app.on('ready', () => {
  createWindow()
  autoUpdater.checkForUpdatesAndNotify();

  app.on('activate', () => {
    // on macOS it is common to re-create a window even after all windows have been closed
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
})
