import { app, BrowserWindow, ipcMain } from "electron";
import path from "path";
import { exec } from "child_process";

let mainWindow: BrowserWindow | null = null;

app.whenReady().then(() => {
  mainWindow = new BrowserWindow({
    width: 300,
    height: 400,
    alwaysOnTop: false, // NÃO sobrepõe outras janelas
    frame: false,
    transparent: true,
    resizable: false,
    skipTaskbar: true, // Oculta da barra de tarefas
    focusable: false, // Não pode ser focado, evita sobreposição
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      nodeIntegration: false,
      contextIsolation: true,
    },
  });

  mainWindow.loadURL(`file://${path.join(__dirname, "index.html")}`);

  // Move a janela para a camada do papel de parede
  setTimeout(setWindowToDesktopLayer, 500);
});

// Define a janela na camada do papel de parede
function setWindowToDesktopLayer() {
  if (mainWindow) {
    const winId = mainWindow.getNativeWindowHandle().readUInt32LE(0);
    exec(
      `xprop -id ${winId} -f _NET_WM_STATE 32a -set _NET_WM_STATE _NET_WM_STATE_BELOW`,
      (error) => {
        if (error) console.error("Erro ao definir a janela no fundo:", error);
      }
    );
  }
}

// Fecha a janela ao sair
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

// IPC para minimizar e fechar
ipcMain.on("minimize-window", () => {
  if (mainWindow) mainWindow.minimize();
});

ipcMain.on("close-window", () => {
  if (mainWindow) mainWindow.close();
});
