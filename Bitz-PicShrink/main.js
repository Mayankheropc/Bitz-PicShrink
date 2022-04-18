//ipcMain is used to communicate with the renderer processes like(index.js, etc)
const { app, BrowserWindow, Menu, ipcMain, shell } = require('electron')
const path = require('path')
const os = require('os');

const imagemin = require('imagemin')
const imageminMozjpeg = require('imagemin-mozjpeg')
const imageminPngquant = require('imagemin-pngquant')
const slash = require('slash')
const log = require('electron-log')

// setting environment
// use when in development
// process.env.NODE_ENV = 'development'

// use when in production
process.env.NODE_ENV = 'production'

const isDev = process.env.NODE_ENV !== 'production' ? true : false

let mainWindow;

function createMainWindow() {
    mainWindow = new BrowserWindow({
        show: false,
        title: 'Bitz-PicShrink',
        width: 400,
        height: 550,
        backgroundColor: '#DDEBEC',
        resizable: isDev ? true : false,
        devTools: isDev ? true : false,
        icon: `${__dirname}/app/images/icon/logo3.png`,
        
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false,
        },
    })
    mainWindow.loadFile(`${__dirname}/app/index.html`)
    mainWindow.once('ready-to-show', () => {
        mainWindow.show()
    })  
}

function createVersionWindow() {
    versionWindow = new BrowserWindow({
        parent: mainWindow,
        modal: true,
        title: 'App Version',
        width: 285,
        height: 200,
        backgroundColor: '#DDEBEC',
        resizable: isDev ? true : false,
        devTools: isDev ? true : false,
        icon: `${__dirname}/app/images/icon/logo3.png`,
        autoHideMenuBar: true,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false,
        },
    })
    versionWindow.loadFile(`${__dirname}/app/version.html`)
}

function createAboutPicShrinkWindow() {
    aboutPicShrinkWindow = new BrowserWindow({
        parent: mainWindow,
        modal: true,
        title: 'About Bitz-PicShrink',
        width: 450,
        height: 430,
        backgroundColor: '#DDEBEC',
        resizable: isDev ? true : false,
        devTools: isDev ? true : false,
        icon: `${__dirname}/app/images/icon/logo3.png`,
        autoHideMenuBar: true,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false,
        },
    })
    aboutPicShrinkWindow.loadFile(`${__dirname}/app/aboutBitzPicShrink.html`)
}

function createAboutDeveloperWindow() {
    aboutDeveloperWindow = new BrowserWindow({
        parent: mainWindow,
        modal: true,
        title: 'About Developer',
        width: 490,
        height: 600,
        backgroundColor: '#DDEBEC',
        resizable: isDev ? true : false,
        devTools: isDev ? true : false,
        icon: `${__dirname}/app/images/icon/logo3.png`,
        autoHideMenuBar: true,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false,
        },
    })
    aboutDeveloperWindow.loadFile(`${__dirname}/app/aboutDeveloper.html`)
}

function createPaypalWindow() {
    paypalWindow = new BrowserWindow({
        parent: mainWindow,
        modal: true,
        title: 'Donate: PayPal',
        width: 350,
        height: 250,
        backgroundColor: '#DDEBEC',
        resizable: isDev ? true : false,
        devTools: isDev ? true : false,
        icon: `${__dirname}/app/images/icon/logo3.png`,
        autoHideMenuBar: true,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false,
        },
    })
    paypalWindow.loadFile(`${__dirname}/app/donatePayPal.html`)
}

function createUPIWindow() {
    upiWindow = new BrowserWindow({
        parent: mainWindow,
        modal: true,
        title: 'Donate: UPI',
        width: 350,
        height: 450,
        backgroundColor: '#DDEBEC',
        resizable: isDev ? true : false,
        devTools: isDev ? true : false,
        icon: `${__dirname}/app/images/icon/logo3.png`,
        autoHideMenuBar: true,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false,
        },
    })
    upiWindow.loadFile(`${__dirname}/app/donateUPI.html`)
}

app.on('ready', () => {
    createMainWindow()

    // calling the custom menu created bellow
    const mainMenu = Menu.buildFromTemplate(menu)
    Menu.setApplicationMenu(mainMenu)

    mainWindow.on('ready', ()=>mainWindow = null)
})

ipcMain.on('image:minimized', (e, options) => {
    // options.dest = path.join(os.homedir, 'Bitz-PicShrink')
    console.log(options)
    shrinkPic(options)
})

async function shrinkPic({ file_path, img_quality, outputPath }) {
    try {
        const pngQuality = img_quality / 100

        const files = await imagemin([slash(file_path)], {
            destination: slash(outputPath),
            plugins: [
                imageminMozjpeg({ img_quality }),
                imageminPngquant({
                    quality: [pngQuality, pngQuality],
                }),
            ],
        })
        mainWindow.webContents.send('image:done')
    } catch (err) {
        log.error(err)
    }
}

// to quit the application
app.on('window-all-closed', ()=>{
    app.quit()
})


// menu for application
const menu = [
    ...(isDev ? [
        {
            label: 'Developer',
            submenu: [
                { role: 'reload' },
                { role: 'forceReload' },
                { type: 'separator' },
                { role: 'toggleDevTools' },
            ],
        },
        {
            label: 'About',
            submenu: [
                { label: 'Version', click: createVersionWindow },
                { label: 'Bitz-PicShrink', click: createAboutPicShrinkWindow },
                { type: 'separator' },
                { label: 'Developer', click: createAboutDeveloperWindow },
                { type: 'separator' },
                { label: 'More Info', click: function(){ shell.openExternal('https://bitzmint.com') } },
            ],
        },
        {
            role: 'reload',
        },
        {
            label: 'Donate',
            submenu: [
                { label: 'PayPal', click: createPaypalWindow },
                { label: 'UPI (India)', click: createUPIWindow },
            ],
        },
        {
            label: 'Help', click: function(){ shell.openExternal('https://bitzmint.com') }
        },
    ] : [
        {
            label: 'About',
            submenu: [
                { label: 'Version', click: createVersionWindow },
                { label: 'Bitz-PicShrink', click: createAboutPicShrinkWindow },
                { type: 'separator' },
                { label: 'Developer', click: createAboutDeveloperWindow },
                { type: 'separator' },
                { label: 'More Info', click: function(){ shell.openExternal('https://bitzmint.com') } },
            ],
        },
        {
            role: 'reload',
        },
        {
            label: 'Donate',
            submenu: [
                { label: 'PayPal', click: createPaypalWindow },
                { label: 'UPI (India)', click: createUPIWindow },
            ],
        },
        {
            label: 'Help',  click: function(){ shell.openExternal('https://bitzmint.com') }
        },
    ])
]
