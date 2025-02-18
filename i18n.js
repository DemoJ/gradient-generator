// 语言配置
const translations = {
    'zh-CN': {
        title: '渐变背景生成器 - 在线创建精美渐变背景',
        description: '免费在线渐变背景生成器，轻松创建和下载漂亮的渐变背景图片。支持自定义颜色、角度和尺寸，可导出多种格式。',
        keywords: '渐变背景,背景生成器,在线工具,CSS渐变,设计工具,图片生成器',
        pageTitle: '渐变背景生成器',
        presetGradients: '推荐渐变：',
        neonPurple: '霓虹紫',
        coralPink: '珊瑚粉',
        auroraPurple: '极光紫',
        oceanBlue: '海洋蓝',
        candyGradient: '糖果渐变',
        tropicalVibes: '热带风情',
        deepPurple: '深邃紫',
        warmOrange: '热情橙',
        customGradient: '自定义渐变：',
        gradientAngle: '渐变角度：',
        imageSize: '图片尺寸：',
        width: '宽度',
        height: '高度',
        imageFormat: '图片格式：',
        downloadButton: '下载背景图片',
        languageSelector: '语言：'
    },
    'en': {
        title: 'Gradient Background Generator - Create Beautiful Gradient Backgrounds Online',
        description: 'Free online gradient background generator. Create and download beautiful gradient background images. Customize colors, angles, and sizes, export in multiple formats.',
        keywords: 'gradient background,background generator,online tool,CSS gradient,design tool,image generator',
        pageTitle: 'Gradient Background Generator',
        presetGradients: 'Preset Gradients:',
        neonPurple: 'Neon Purple',
        coralPink: 'Coral Pink',
        auroraPurple: 'Aurora Purple',
        oceanBlue: 'Ocean Blue',
        candyGradient: 'Candy Gradient',
        tropicalVibes: 'Tropical Vibes',
        deepPurple: 'Deep Purple',
        warmOrange: 'Warm Orange',
        customGradient: 'Custom Gradient:',
        gradientAngle: 'Gradient Angle:',
        imageSize: 'Image Size:',
        width: 'Width',
        height: 'Height',
        imageFormat: 'Image Format:',
        downloadButton: 'Download Background Image',
        languageSelector: 'Language:'
    }
};

// 语言管理类
class LanguageManager {
    constructor() {
        this.translations = translations;
        this.currentLanguage = this.getSavedLanguage() || this.getSystemLanguage();
        // 立即更新页面内容和按钮状态
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => {
                this.updateContent();
                this.updateButtons();
            });
        } else {
            this.updateContent();
            this.updateButtons();
        }
    }

    // 获取保存的语言设置
    getSavedLanguage() {
        return localStorage.getItem('preferredLanguage');
    }

    // 获取系统语言
    getSystemLanguage() {
        const language = navigator.language || navigator.userLanguage;
        return language.startsWith('zh') ? 'zh-CN' : 'en';
    }

    // 获取翻译文本
    translate(key) {
        return this.translations[this.currentLanguage]?.[key] || key;
    }

    // 切换语言
    setLanguage(lang) {
        if (this.translations[lang]) {
            this.currentLanguage = lang;
            localStorage.setItem('preferredLanguage', lang);
            document.documentElement.lang = lang; // 设置html标签的lang属性
            this.updateContent();
            this.updateButtons();
        }
    }

    // 更新语言切换按钮状态
    updateButtons() {
        document.querySelectorAll('.language-btn').forEach(btn => {
            const lang = btn.getAttribute('onclick').match(/'([^']+)'/)[1];
            btn.classList.toggle('active', lang === this.currentLanguage);
        });
    }

    // 更新页面内容
    updateContent() {
        try {
            // 更新 meta 标签
            document.title = this.translate('title');
            document.querySelector('meta[name="description"]').content = this.translate('description');
            document.querySelector('meta[name="keywords"]').content = this.translate('keywords');
            document.querySelector('meta[property="og:title"]').content = this.translate('title');
            document.querySelector('meta[property="og:description"]').content = this.translate('description');

            // 更新所有带有 data-lang 属性的元素
            document.querySelectorAll('[data-lang]').forEach(element => {
                const key = element.getAttribute('data-lang');
                if (key) {
                    if (element.tagName === 'INPUT' && element.type === 'placeholder') {
                        element.placeholder = this.translate(key);
                    } else {
                        element.textContent = this.translate(key);
                    }
                }
            });

            // 更新预设渐变按钮的标题
            const presetButtons = document.querySelectorAll('.preset-btn');
            presetButtons.forEach(button => {
                const titleKey = button.getAttribute('data-title-key');
                if (titleKey) {
                    button.title = this.translate(titleKey);
                }
            });

            // 更新输入框占位符
            const widthInput = document.querySelector('#width');
            const heightInput = document.querySelector('#height');
            if (widthInput) widthInput.placeholder = this.translate('width');
            if (heightInput) heightInput.placeholder = this.translate('height');

            // 设置html标签的lang属性
            document.documentElement.lang = this.currentLanguage;
        } catch (error) {
            console.error('更新页面内容时发生错误:', error);
        }
    }
}

// 创建全局语言管理器实例
window.languageManager = new LanguageManager();

// 导出语言切换方法供HTML调用
window.setLanguage = (lang) => window.languageManager.setLanguage(lang);