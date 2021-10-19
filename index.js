function isElectionDevMode() {
  const electron = require('electron');

  const app = electron.app || electron.remote.app;

  const isEnvSet = 'ELECTRON_IS_DEV' in process.env;
  const getFromEnv = parseInt(process.env.ELECTRON_IS_DEV, 10) === 1;

  return isEnvSet ? getFromEnv : !app.isPackaged;
}
const isDev = isElectionDevMode()
const path = require('path')
const fs = require('fs')
const argsParser = require('./args-parser')

// 获得正确的参数
const getArgParams = (argv = process.argv) => {
  if (isDev) {
    return argsParser(argv, 2)
  } else {
    return argsParser(argv, 1)
  }
}

function getCorrectPath(basePath, relativePath) {
  let ret
  if (isDev) {
    ret = path.join(basePath, relativePath)
  } else {
    const asarUnpackedPath = basePath.replace(/\.asar([\\/])/, '.asar.unpacked$1')
    ret = path.join(asarUnpackedPath, relativePath)
  }
  return ret
}

// 设置文件可读写
const setReadAndWritePermissions = (filePath) => {
  if (!fs.existsSync(filePath)) {
    return
  }
  const mode = fs.statSync(filePath).mode
  const newMode = mode | 0o666
  fs.chmodSync(filePath, newMode)
}

module.exports = {
  isElectionDevMode,
  isDev,
  getArgParams,
  argsParser,
  getCorrectPath,
  setReadAndWritePermissions
}
