const {app, BrowserWindow} = require('electron');
const Store = require('electron-store');
// const store = new Store();
const store = new Store({
  defaults: {
    // 800x600 is the default size of our window
    windowBounds: { width: 900, height: 600 }
  }
});
let win;

// require('electron-reload')(__dirname);

app.on('ready', () => {
	let { width, height } = store.get('windowBounds');

	win = new BrowserWindow({
    'width' : width, 
    'height': height, 
    'minHeight': 400,
    'minWidth': 600,
    'maxWidth': 1920
});

	win.on('resize', () => {
		let { width, height } = win.getBounds();
		store.set('windowBounds', { width, height });
	});

	win.loadURL(`file://${__dirname}/index.html`);
});

// Quit when all windows are closed.
app.on('window-all-closed', function () {
  // On OS X it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', function () {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) {
    createWindow()
  }
})