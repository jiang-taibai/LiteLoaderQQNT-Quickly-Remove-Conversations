const {getConfig} = window.QuicklyRemoveConversations
const {data: dataPath} = LiteLoader.plugins.QuicklyRemoveConversations.path

/**
 * 移除会话，即模拟右键点击消息列表中的某个消息，然后点击“从消息列表中移除”
 * @param conversationElement
 * @returns {Promise<boolean>}
 */
function removeConversation(conversationElement) {
    let rightClickEvent = new MouseEvent('contextmenu', {
        bubbles: true,
        cancelable: true,
        view: window,
        button: 2
    });
    conversationElement.dispatchEvent(rightClickEvent);
    return new Promise((resolve, reject) => {
        getQContextMenuItemByTextContent("从消息列表中移除", 100, 1)
        .then(menuItemElement => {
            if (menuItemElement) {
                menuItemElement.click();
                resolve(true);
            } else {
                resolve(false);
            }
        })
    })
}

/**
 * 获取右键菜单中的某个菜单项
 * @param text          根据菜单项的文本内容 text 来查找
 * @param maxAttempts   最大尝试次数，因为有可能菜单项还未加载出来
 * @param interval      尝试间隔时间
 * @returns {Promise<Element|null>}
 */
async function getQContextMenuItemByTextContent(text, maxAttempts, interval) {
    let attempts = 0;
    while (attempts < maxAttempts) {
        const menuItems = document.querySelectorAll('.q-context-menu-item');
        for (let item of menuItems) {
            if (item.textContent.includes(text)) {
                return item;
            }
        }
        await new Promise(resolve => setTimeout(resolve, interval));
        attempts++;
    }
    console.error(`未找到文本内容为 ${text} 的菜单项，尝试次数：${attempts}，重试间隔：${interval}ms`);
    return null;
}

async function matchingEvent(event) {
    const config = await getConfig(dataPath);
    const {keyboard, mouse} = config.shortcut
    return checkMouse(event, mouse) && checkKeyboard(event, keyboard);
}

/**
 * 检查鼠标按钮是否与配置匹配
 * @param {MouseEvent} event - 触发的事件
 * @param {string} mouseButton - 配置中的鼠标按钮
 * @returns {boolean} - 是否匹配
 */
function checkMouse(event, mouseButton) {
    switch (mouseButton) {
        case 'left':
            return event.button === 0;
        case 'wheel':
            return event.button === 1;
        case 'right':
            return event.button === 2;
        default:
            return false;
    }
}

/**
 * 检查键盘修饰键是否严格与配置匹配
 * @param {MouseEvent} event - 触发的事件
 * @param {string} modifier - 配置中的单个键盘修饰键
 * @returns {boolean} - 是否匹配
 */
function checkKeyboard(event, modifier) {
    if (modifier === 'none') {
        return true;
    }
    const pressed = {
        'ctrl': event.ctrlKey,
        'shift': event.shiftKey,
        'alt': event.altKey
    };
    const onlyOnePressed = (key) => pressed[key] && !pressed.ctrl !== (key === 'ctrl') && !pressed.shift !== (key === 'shift') && !pressed.alt !== (key === 'alt');
    return onlyOnePressed(modifier);
}

/**
 * 处理鼠标中键点击事件
 * @param event 鼠标事件对象
 */
async function handleMouseDown(event) {
    let target = event.target.closest('.recent-contact-item');
    if (!target) return
    if (await matchingEvent(event)) {
        // 阻止默认行为和事件冒泡，防止点开聊天框
        event.preventDefault();
        event.stopImmediatePropagation();
        removeConversation(target).then((result) => {
            if (!result) {
                console.error('移除失败');
            }
        });
    }
}

export {
    handleMouseDown
}