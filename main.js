const { app, BrowserWindow } = require('electron')
const path = require('path')
const isDev = process.env.NODE_ENV === 'development'
const serve = require("electron-serve");


const appServe = app.isPackaged ? serve({
  directory: path.join(__dirname, "out")
}) : null;

function createWindow() {
  const mainWindow = new BrowserWindow({
    width: 1400,
    height: 900,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js')
    }
  })

  if (isDev) {
    mainWindow.loadURL('http://localhost:3000')
    mainWindow.webContents.openDevTools()
  }else if (app.isPackaged) {
    appServe(win).then(() => {
      win.loadURL("app://-");
    });
  } else {
    // Charger la page index.html du dossier out
    const indexPath = path.join(__dirname, 'out', 'index.html')
    mainWindow.loadFile(indexPath)
  // Empêcher les navigations vers des URLs externes ou inexistantes
  mainWindow.webContents.on("will-navigate", (event, url) => {
    event.preventDefault()

    const parsedUrl = new URL(url)
    let pathname = parsedUrl.pathname
    if(pathname.startsWith("/C:")){
      pathname = pathname.slice(3);
    }
    if (pathname !== "/" && pathname.endsWith("/")) {
      pathname = pathname.slice(0, -1);
    }
    let htmlPath = "";
    if (pathname === "/") {
      htmlPath = path.join(__dirname, "out", "index.html");
    } else if(pathname.endsWith(".html")){
      htmlPath = path.join(`${pathname}`)

    }else {
      htmlPath = path.join(__dirname, "out", `${pathname}.html`);
    }
    const searchParams = {};
    parsedUrl.searchParams.forEach((value, key) => {
      searchParams[key] = value;
    });
    let query = "";
    const paramEntries = Object.entries(searchParams);
    if (paramEntries.length > 0) {
      query = `?${new URLSearchParams(searchParams).toString()}`;
    }
    mainWindow.loadURL(`file://${htmlPath}${query}`);
  })

  // Empêcher l'ouverture de nouvelles fenêtres
  mainWindow.webContents.setWindowOpenHandler(() => {
    return { action: "deny" }
  })
    // Debug: afficher le chemin
    console.log('Loading file from:', indexPath)
  }
}

app.whenReady().then(() => {
  createWindow()

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow()
    }
  })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})