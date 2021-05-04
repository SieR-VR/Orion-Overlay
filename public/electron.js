"use strict";
exports.__esModule = true;
var electron_1 = require("electron");
var isDev = require("electron-is-dev");
var path = require("path");
var electron_openvr_js_1 = require("electron-openvr.js");
var electron_glut_1 = require("electron-glut");
var IVRSystem = electron_openvr_js_1.vr.VR_Init(electron_openvr_js_1.vr.EVRApplicationType.VRApplication_Overlay);
var IVROverlay = electron_openvr_js_1.vr.IVROverlay_Init();
var _a = IVROverlay.CreateDashboardOverlay("ElectronOverlay", "Test Electron Overlay"), MainHandle = _a.MainHandle, ThumbnailHandle = _a.ThumbnailHandle;
electron_1.app.disableHardwareAcceleration();
var mainWindow;
var createWindow = function () {
    mainWindow = new electron_1.BrowserWindow({
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
            offscreen: true
        }
    });
    // production에서는 패키지 내부 리소스에 접근.
    // 개발 중에는 개발 도구에서 호스팅하는 주소에서 로드.
    mainWindow.loadURL(isDev ? 'http://localhost:3000' : "file://" + path.join(__dirname, '../build/index.html'));
    if (isDev) {
        mainWindow.webContents.openDevTools({ mode: 'detach' });
    }
    mainWindow.setResizable(true);
    // Emitted when the window is closed.
    mainWindow.on('closed', function () { return (mainWindow = undefined); });
    mainWindow.focus();
};
// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
electron_1.app.on('ready', function () {
    createWindow();
    IVROverlay.SetOverlayFromFile(ThumbnailHandle, "C:/Users/nwh63/Desktop/dev/orion-overlay/public/logo192.png");
    IVROverlay.SetOverlayWidthInMeters(MainHandle, 3.0);
    IVROverlay.SetOverlayTextureBounds(MainHandle, { uMax: 1, uMin: 0, vMax: 1, vMin: 0 });
    console.log(electron_glut_1.electron_glut.GLUT_Init());
    mainWindow.webContents.on('paint', function (event, dirty, image) {
        var handle = electron_glut_1.electron_glut.GLUT_TextureUpdate();
        var texture = {
            eColorSpace: electron_openvr_js_1.vr.EColorSpace.ColorSpace_Auto,
            eType: electron_openvr_js_1.vr.ETextureType.TextureType_OpenGL,
            handle: handle
        };
        console.log(texture);
        IVROverlay.SetOverlayTexture(MainHandle, texture);
    });
    mainWindow.webContents.setFrameRate(80);
});
// Quit when all windows are closed.
electron_1.app.on('window-all-closed', function () {
    if (process.platform !== 'darwin') {
        electron_1.app.quit();
    }
});
electron_1.app.on('activate', function () {
    if (mainWindow === null) {
        createWindow();
    }
});
