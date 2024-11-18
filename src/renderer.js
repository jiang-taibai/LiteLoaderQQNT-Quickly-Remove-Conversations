import {handleMouseDown} from "./lib/shortcut-handler.js";
import {initSetting} from "./lib/setting/setting.js";
const {getConfig} = window.QuicklyRemoveConversations
const {data: dataPath, plugin} = LiteLoader.plugins.QuicklyRemoveConversations.path

// 预加载配置文件到内存
getConfig(dataPath).then(config => {})

/**
 * 不断尝试添加鼠标点击事件监听器
 */
const addMiddleMouseButtonDownEventListenerInterval = setInterval(() => {
    if (location.hash.includes('#/main')) {
        document.body.addEventListener('mousedown', handleMouseDown, true);
        clearInterval(addMiddleMouseButtonDownEventListenerInterval);
    }
}, 100);

export const onSettingWindowCreated = async (view) => {
    const htmlFilePath = `local:///${plugin}/src/lib/setting/setting.html`
    const cssFilePath = `local:///${plugin}/src/lib/setting/setting.css`
    const htmlText = await (await fetch(htmlFilePath)).text()
    view.insertAdjacentHTML('afterbegin', htmlText)
    document.head.insertAdjacentHTML('beforeend', `<link rel="stylesheet" href="${cssFilePath}" />`)
    initSetting(view)
}
