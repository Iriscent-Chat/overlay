const { app, BrowserWindow, ipcMain, dialog, shell } = require('electron');
const path = require('path');
const Express = require("express");
var bodyParser = require('body-parser');

var chatSettings;

const createWindow = () => {
    const win = new BrowserWindow({
        width: 1080,
        height: 720,
        webPreferences: {
            preload: path.join(__dirname, 'preload.js')
        }
    });

    win.setResizable(false);
    win.setMenu(null);
  
    win.loadFile('public/index.html');
}

app.whenReady().then(() => {
    createWindow();
    ipcMain.handle('do-auth', handleTwitchAuth);
    ipcMain.handle('exit', handleExit);
    ipcMain.on('launch-chat', handleLaunch);
    ipcMain.handle('get-chat-settings', (event) => chatSettings);
    ipcMain.handle('ask-logout', handleLogout);
    ipcMain.handle('force-quit', forceQuit);

    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) createWindow();
    });
});

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit();
});

async function handleTwitchAuth() {
    var isResolved = false;

    var promise = new Promise(function(resolve, reject) {
        let app = Express();

        app.use(bodyParser.urlencoded({ extended: true }));

        app.get('/', (req, res) => {
            res.sendFile(__dirname + "/public/auth/index.html");
        });

        app.post('/auth', (req, res) => {
            resolve(req.body.token);
            res.send("Logged in! You can now close this tab!");
            server.close();
            return req.body.token;
        });

        let server = app.listen(3000);

        shell.openPath("https://id.twitch.tv/oauth2/authorize?response_type=token&client_id=opxhspb78xudppeapnoelutyyzz7li&redirect_uri=http://localhost:3000&scope=user%3Aread%3Aemail%20bits%3Aread%20channel%3Aread%3Aredemptions%20channel%3Aread%3Asubscriptions%20moderator%3Aread%3Afollowers%20user%3Aread%3Asubscriptions")
    });
    return promise;
}

function handleExit() {
    let num = dialog.showMessageBoxSync({
        message: "Are you sure you want to exit the app?",
        type: "question",
        buttons: ["Yes", "No"],
        title: "Exit?"
    });
    if (num == 0) {
        app.quit();
    }
}

function handleLaunch(event, args) {
    let settings = JSON.parse(args);
    chatSettings = settings;

    var chatWindow = new BrowserWindow({
        width: 350, 
        height: 425,
        webPreferences: {
            preload: path.join(__dirname, 'chatpreload.js')
        }
    });

    chatWindow.setMenu(null);
    chatWindow.loadFile("public/widget.html");
    chatWindow.setAlwaysOnTop(chatSettings.topMost);

    chatWindow.on('close', () => {
        delete chatWindow;
    });
}

function handleLogout() {
    let num = dialog.showMessageBoxSync({
        message: "Are you sure you want to exit and logout from the app?",
        type: "question",
        buttons: ["Yes", "No"],
        title: "Logout?"
    });
    return num;
}

async function forceQuit() {
    app.quit();
}