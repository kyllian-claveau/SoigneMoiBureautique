const { app, BrowserWindow, Menu } = require('electron');
const path = require('path');

function createWindow() {
    const mainWindow = new BrowserWindow({
        width: 800,
        height: 600,
		icon: 'https://soignemoiproject.online/images/favicon.ico',
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'),
            nodeIntegration: true,
            contextIsolation: false,
        },
    });

    mainWindow.loadFile('index.html');

    // Supprimer le menu par défaut
    Menu.setApplicationMenu(null);

    // Optionnel: Pour ouvrir les outils de développement, décommentez la ligne suivante
    // mainWindow.webContents.openDevTools({ mode: 'detach' });
}

app.on('ready', createWindow);

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
        createWindow();
    }
});
