const { app, BrowserWindow, ipcMain, dialog } = require("electron");
const path = require("path");

let mainWindow;

app.whenReady().then(() => {
  mainWindow = new BrowserWindow({
    width: 400,
    height: 600,
    frame: false,
    backgroundColor: "#1e1e1e",
    hasShadow: false,
    alwaysOnTop: true,
    skipTaskbar: true,
    resizable: false,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    },
  });

  mainWindow.loadFile("index.html");

  // Controles de janela
  ipcMain.on("minimize-window", () => {
    mainWindow.minimize();
  });

  ipcMain.on("close-window", () => {
    mainWindow.close();
  });

  // Diálogo para seleção de imagem
  ipcMain.handle("select-theme-image", async () => {
    const result = await dialog.showOpenDialog({
      properties: ["openFile"],
      filters: [{ name: "Imagens", extensions: ["png", "jpg", "jpeg"] }],
    });

    if (!result.canceled && result.filePaths.length > 0) {
      return result.filePaths[0];
    }

    return null;
  });

  ipcRenderer.on("set-background-image", (event, imagePath) => {
    const container = document.querySelector(".container");
    const opacity = parseFloat(document.getElementById("opacityRange").value);

    container.style.backgroundImage = `url("${imagePath}")`;
    container.style.backgroundColor = `rgba(30, 30, 30, ${opacity})`;
  });
});
