const { app, BrowserWindow } = require('electron');
const path = require('path');
let mainWindow = null;
const createWindow = () => {

	mainWindow = new BrowserWindow({
		width:1000,
		height:1000,
		webPreferences: {
            nodeIntegration: true
        }
	});

	mainWindow.webContents.openDevTools();

	mainWindow.loadFile(path.resolve(__dirname,'dist/index.html'));

	mainWindow.on('closed', () => {
		if (process.platform !== 'darwin') app.quit();
	});
}

app.on('ready', createWindow);