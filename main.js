const { app, BrowserWindow, ipcMain } = require('electron');

function createWindow() {
    // 创建浏览器窗口
    let win = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            /**
             * 因为 Electron 在运行环境中引入了 Node.js，所以在 DOM 中有一些额外的变量，比如 module、exports 和 require
             * 这导致 了许多库不能正常运行，因为它们也需要将同名的变量加入运行环境中
             * 我们可以通过禁用 Node.js 来解决这个问题
             * 可是，我们依然需要使用 Node.js 和 Electron 提供的 API，因此这里就不禁止了，而是选择在index.html的开头
             * 在引入那些库之前将这些变量重命名
             */
            nodeIntegration: true
        }
    });

    // 加载index.html文件
    win.loadFile('index.html');

    // 打开开发者工具
    win.webContents.openDevTools()

}

// 监听来自win进程的请求
ipcMain.on('readFile', (event, arg) => {

    require('fs').readFile(arg, (err, data) => {

        // 回复
        event.reply('readFileReply', err || data.toString('utf-8'));

    });

});

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
    // 在 macOS 上，除非用户用 Cmd + Q 确定地退出，
    // 否则绝大部分应用及其菜单栏会保持激活。
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

app.on('activate', () => {
    // 在macOS上，当单击dock图标并且没有其他窗口打开时，
    // 通常在应用程序中重新创建一个窗口。
    if (BrowserWindow.getAllWindows().length === 0) {
        createWindow();
    }
});