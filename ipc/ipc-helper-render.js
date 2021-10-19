// In renderer process (web page).
const { ipcRenderer } = require('electron')

// 向主进程发送同步消息
/*const res = ipcSendEventSync('testEvtSync', 1)*/
const ipcSendEventSync = (eventName, data) => {
  return ipcRenderer.sendSync(eventName, data)
}

// 向主进程发送异步消息
/*ipcSendEventAsync('testEvtAsync', 2).then(res => {
  console.log(res)
}).catch(e => {
  console.error(e)
})*/
const ipcSendEventAsync = (eventName, data, timeout = 30000) => {
  return new Promise((resolve, reject) => {
    ipcRenderer.send(eventName, data)
    const channelEventReply = `${eventName}__reply` // 调用成功事件名
    const channelEventError = `${eventName}__error` // 调用失败事件名
    // eslint-disable-next-line prefer-const
    let timer // 失败计时器

    // 处理调用事件
    const handleReply = (event, arg) => {
      clearTimeout(timer)
      ipcRenderer.removeListener(channelEventError, handleError) // 清理事件
      return resolve(arg)
    }
    const handleError = (event, error) => {
      clearTimeout(timer)
      ipcRenderer.removeListener(channelEventReply, handleReply)
      return reject(error)
    }

    if (timeout) {
      // 考虑主进程不返回的情况
      timer = setTimeout(() => {
        ipcRenderer.removeListener(channelEventReply, handleReply)
        return reject(new Error(`Timeout for ${timeout}ms`))
      }, timeout)
    }

    // 监听调用事件
    ipcRenderer.once(channelEventReply, handleReply)
    ipcRenderer.once(channelEventError, handleError)
  })
}


/**
 * 监听消息更新事件
 * @param channel
 * @param listener 回调函数
 */
const ipcOnMessage = (channel, listener) => {
  ipcRenderer.on(channel, listener)
}

const ipcOffMessage = (channel, listener) => {
  ipcRenderer.off(channel, listener)
}

module.exports = {
  ipcSendEventSync,
  ipcSendEventAsync,
  ipcOnMessage,
  ipcOffMessage,
}
