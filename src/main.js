const fs = require('fs')
const path = require('path')
const {ipcMain} = require('electron')

let configInMemory = void 0

ipcMain.handle('QuicklyRemoveConversations.getConfig', (_, dataPath) => {
    if (configInMemory) return configInMemory
    const configPath = path.join(dataPath, 'config.json') // 配置文件路径
    // 配置文件不存在则创建
    if (!fs.existsSync(configPath)) {
        // 配置文件目录不存在则创建
        if (!fs.existsSync(dataPath)) {
            fs.mkdirSync(dataPath, {recursive: true})
        }
        fs.writeFileSync(configPath, '{}')
    }
    // 读取配置文件
    const defaultConfig = JSON.parse(fs.readFileSync(path.join(__dirname, 'default-config.json'), 'utf-8'))
    let config = JSON.parse(fs.readFileSync(configPath, 'utf-8'))
    // 如果配置版本号不一致则重置配置文件
    if (config.version !== defaultConfig.version) {
        config = defaultConfig
        fs.writeFileSync(configPath, JSON.stringify(defaultConfig))
    }
    configInMemory = config
    return config
})

ipcMain.handle('QuicklyRemoveConversations.setConfig', (_, dataPath, config) => {
    configInMemory = config
    const configPath = path.join(dataPath, 'config.json') // 配置文件路径
    fs.writeFileSync(configPath, JSON.stringify(config))
})

ipcMain.on('QuicklyRemoveConversations.getConfigInMemory', (event) => {
    event.returnValue = configInMemory;
});

module.exports.onBrowserWindowCreated = window => {
}
