const electron = require('electron');
const url = require('url');
const path = require('path');

const {app, BrowserWindow, Menu, ipcMain} = electron;

// SET ENV
process.env.NODE_ENV = 'production';

let mainWindow;
let addWindow;

// Listen for the app to be ready
app.on('ready', function()
{
    // Create new window
    mainWindow = new BrowserWindow({});

    //mainWindow.maximize();

    // Load main window
    mainWindow.loadURL(url.format({
        pathname: path.join(__dirname, 'mainWindow.html'),
        protocol: 'file',
        slashes: true
    }));

    // Quit application when main window gets closed
    mainWindow.on('closed', function(){
        app.quit();
    });

    if(process.env.NODE_ENV != 'production') {
        // Build the menu from the template
        const mainMenu = Menu.buildFromTemplate(mainMenuTemplate);
        // Insert the menu
        Menu.setApplicationMenu(mainMenu);
    } else {
        Menu.setApplicationMenu(null);
    }
});

// Catch item:add
ipcMain.on('item:add', function(e, item){
    mainWindow.webContents.send('item:add', item);
    addWindow.close();
});

// Create menu template
const mainMenuTemplate = [
    {
        label: 'File',
        submenu: [
            {
                label: 'Quit',
                accelerator: process.platform == 'darwin' ? 'Command+Q' : 'Ctrl+Q',
                click(){
                    app.quit();
                }
            },
            {
                label: 'Toggle DevTools',
                accelerator: process.platform == 'darwin' ? 'Command+I' : 'Ctrl+I',
                click(item, focusedWindow){
                    focusedWindow.toggleDevTools();
                }
            },
            {
                role: 'reload'
            }
        ]
    }
];

// If mac, add empty object to menu
if(process.platform == 'darwin') {
    mainMenuTemplate.unshift({}); // Unshift adds to the start of the array (opposite of push)
}
