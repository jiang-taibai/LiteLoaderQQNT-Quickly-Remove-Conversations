const {openExternal} = LiteLoader.api


export const openWeb = (url) => {
    openExternal(url);
}

export const setSelectOption = (settingSelectElement, targetDataValue) => {
    const options = settingSelectElement.querySelectorAll('setting-option');
    options.forEach(option => {
        if (option.getAttribute('data-value') === targetDataValue) {
            option.click()
        }
    });
}