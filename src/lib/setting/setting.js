import {openWeb} from "../common/utils";

const {manifest} = LiteLoader.plugins.QuicklyRemoveConversations

export const initSettingPanel = () => {
    const settingPanelOfVersionSection = new SettingPanelOfVersionSection()
    settingPanelOfVersionSection.init()
}

class SettingPanelOfVersionSection {
    constructor() {
        this.settingPanelVersionSection = document.querySelector('#quickly-remove-conversations-config-panel-version')
        this.checkUpdateText = this.settingPanelVersionSection.querySelector('.check-update-text')
        this.checkUpdateBtn = this.settingPanelVersionSection.querySelector('.check-update-btn')
        this.updateTitle = this.settingPanelVersionSection.querySelector('.update-title')
        this.updateDesc = this.settingPanelVersionSection.querySelector('.update-desc')
        this.openGithubPageBtn = this.settingPanelVersionSection.querySelector('.open-github-page-btn')
        this.openDownloadPageBtn = this.settingPanelVersionSection.querySelector('.open-download-page-btn')
    }

    init() {
        this.initCheckUpdateBtn()
        this.initOpenGithubPageBtn()
        this.initOpenDownloadPageBtn()
    }

    initCheckUpdateBtn() {
        this.handleCheckUpdateBtnClick()
        this.checkUpdateBtn.addEventListener('click', this.handleCheckUpdateBtnClick)
    }

    initOpenGithubPageBtn() {
        this.openGithubPageBtn.addEventListener('click', () => {
            openWeb('https://github.com/jiang-taibai/LiteLoader-Quickly-Remove-Conversations')
        })
    }

    initOpenDownloadPageBtn() {
        this.openDownloadPageBtn.addEventListener('click', () => {
            openWeb('https://github.com/jiang-taibai/LiteLoader-Quickly-Remove-Conversations/releases/latest')
        })
    }

    handleCheckUpdateBtnClick() {
        this.checkUpdateText.textContent = `当前版本${manifest.version}，正在检查更新中……`
        SettingPanelUtils.disableBtn(this.checkUpdateBtn)
        this.checkUpdateBtn.textContent = '检查更新中'
        fetch('https://api.github.com/repos/jiang-taibai/LiteLoader-Quickly-Remove-Conversations/releases/latest')
            .then(res => res.json())
            .then(data => {
                const latestVersion = data.tag_name

                if (latestVersion === manifest.version) {
                    this.checkUpdateText.textContent = `当前版本${manifest.version}，已是最新版本`
                } else {
                    this.checkUpdateText.textContent = `当前版本${manifest.version}，最新版本${latestVersion}`
                    this.updateTitle.textContent = `${data.name} 更新说明`
                    this.updateDesc.textContent = data.body
                }

                SettingPanelUtils.enableBtn(this.checkUpdateBtn)
                this.checkUpdateBtn.textContent = '检查更新'
            })
            .catch(err => {
                this.checkUpdateText.textContent = `当前版本${manifest.version}，检查更新失败：${err}`
                SettingPanelUtils.enableBtn(this.checkUpdateBtn)
                this.checkUpdateBtn.textContent = '检查更新'
            })
    }
}

class SettingPanelUtils {
    static disableBtn(btn) {
        btn.setAttribute('is-disabled', true)
    }

    static enableBtn(btn) {
        btn.removeAttribute('is-disabled')
    }
}
