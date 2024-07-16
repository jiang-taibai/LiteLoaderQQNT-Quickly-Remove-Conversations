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
    getQContextMenuItemByTextContent("从消息列表中移除", 100, 1)
        .then(menuItemElement => {
            if (menuItemElement) {
                menuItemElement.click();
                return true;
            } else {
                return false;
            }
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

/**
 * 处理鼠标中键点击事件
 * @param event 鼠标事件对象
 */
function handleWheelDown(event) {
    let target = event.target.closest('.recent-contact-item');
    if (target && event.button === 1) {
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
    handleWheelDown
}