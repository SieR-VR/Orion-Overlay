import { app, BrowserWindow, Main, Renderer } from 'electron';
import * as isDev from 'electron-is-dev';
import * as path from 'path';
import * as fs from 'fs';
import { vr } from 'electron-openvr.js'; 
import { electron_glut } from 'electron-glut';

const IVRSystem = vr.VR_Init(vr.EVRApplicationType.VRApplication_Overlay);
const IVROverlay = vr.IVROverlay_Init();

const { MainHandle, ThumbnailHandle } = IVROverlay.CreateDashboardOverlay("ElectronOverlay", "Test Electron Overlay");


app.disableHardwareAcceleration()

let mainWindow: BrowserWindow;

const createWindow = () => {
    mainWindow = new BrowserWindow({
        width: 900,
        height: 680,
        center: true,
        kiosk: !isDev,
        resizable: true,
        fullscreen: false,
        fullscreenable: true,
        webPreferences: {
            nodeIntegration: true,
            enableRemoteModule: true,
            devTools: isDev,
            offscreen: true,
        },
    });

    // production에서는 패키지 내부 리소스에 접근.
    // 개발 중에는 개발 도구에서 호스팅하는 주소에서 로드.
    mainWindow.loadURL(isDev ? 'http://localhost:3000' : `file://${path.join(__dirname, '../build/index.html')}`);

    if (isDev) {
        mainWindow.webContents.openDevTools({ mode: 'detach' });
    }

    mainWindow.setResizable(true);

    // Emitted when the window is closed.
    mainWindow.on('closed', () => (mainWindow = undefined!));
    mainWindow.focus();
};

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', () => {
    createWindow();
    IVROverlay.SetOverlayFromFile(ThumbnailHandle, "C:/Users/nwh63/Desktop/dev/orion-overlay/public/logo192.png");
    IVROverlay.SetOverlayWidthInMeters(MainHandle, 3.0);
    IVROverlay.SetOverlayTextureBounds(MainHandle, { uMax: 1, uMin: 0, vMax: 1, vMin: 0});
    console.log(electron_glut.GLUT_Init());
    mainWindow.webContents.on('paint', (event, dirty, image) => {
        const handle = electron_glut.GLUT_TextureUpdate();
        const texture: vr.Texture_t = {
            eColorSpace: vr.EColorSpace.ColorSpace_Auto,
            eType: vr.ETextureType.TextureType_OpenGL,
            handle: handle
        }
        console.log(texture);
        IVROverlay.SetOverlayTexture(MainHandle, texture);
    })
    mainWindow.webContents.setFrameRate(80);
});

// Quit when all windows are closed.
app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

app.on('activate', () => {
    if (mainWindow === null) {
        createWindow();
    }
});
