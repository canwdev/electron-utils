// In main process.
const { ipcMain } = require('electron')

// 接收渲染进程消息，同步返回
/*ipcOnEventSync('testEvtSync', (data) => {
  return 'Sync got data ' + data
})*/
const ipcOnEventSync = (eventName, handler) => {
  ipcMain.on(eventName, async(event, arg) => {
    event.returnValue = await handler(arg)
  })
}

// 接收渲染进程消息，异步返回
/*ipcOnEventAsync('testEvtAsync', (data) => {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve('Async got data ' + data)
    }, 2000)
  })
})*/
const ipcOnEventAsync = (eventName, handler) => {
  ipcMain.on(eventName, async(event, arg) => {
    try {
      const result = await handler(arg)
      event.reply(`${eventName}__reply`, result)
    } catch (e) {
      console.error(e)
      event.reply(`${eventName}__error`, e)
    }
  })
}

module.exports = {
  ipcOnEventSync,
  ipcOnEventAsync
}
