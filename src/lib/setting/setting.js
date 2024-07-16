import {openWeb} from "../common/utils.js";

const {manifest} = LiteLoader.plugins.QuicklyRemoveConversations

export const initSetting = (view) => {
    const settingOfVersionSection = new SettingOfVersionSection(view)
    settingOfVersionSection.init()
}

class SettingOfVersionSection {
    constructor(view) {
        this.settingPanelVersionSection = view.querySelector('#quickly-remove-conversations-config-panel-version')
        this.checkUpdateText = this.settingPanelVersionSection.querySelector('.check-update-text')
        this.checkUpdateBtn = this.settingPanelVersionSection.querySelector('.check-update-btn')
        this.updateSettingPanel = this.settingPanelVersionSection.querySelector('.update-setting-panel')
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
        this.checkUpdateBtn.addEventListener('click', () => this.handleCheckUpdateBtnClick())
        this.handleCheckUpdateBtnClick()
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
        this.checkUpdateBtn.textContent = '检查更新中'
        fetch('https://api.github.com/repos/jiang-taibai/LiteLoader-Quickly-Remove-Conversations/releases/latest')
            .then(res => res.json())
            .then(data => {
                let latestVersion = data.tag_name
                if (latestVersion.startsWith('v')) {
                    latestVersion = latestVersion.substring(1)
                }
                if (latestVersion === manifest.version) {
                    this.checkUpdateText.textContent = `当前版本 ${manifest.version}，已是最新版本`
                    this.updateSettingPanel.style.display = 'none'
                } else {
                    this.checkUpdateText.textContent = `当前版本 ${manifest.version}，最新版本 ${latestVersion}`
                    this.updateSettingPanel.style.display = 'block'
                    this.updateTitle.textContent = `${latestVersion} 更新说明`
                    this.updateDesc.textContent = data.body
                }
                this.checkUpdateBtn.textContent = '检查更新'
            })
            .catch(err => {
                this.checkUpdateText.textContent = `当前版本 ${manifest.version}，检查更新失败：${err}`
                this.checkUpdateBtn.textContent = '检查更新'
            })
    }
}
