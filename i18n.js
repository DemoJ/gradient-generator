const translations = {
    'zh-CN': {
        pageTitle: 'Gradient Pro',
        customColors: '色彩配置',
        gradientSettings: '角度控制',
        presetGradients: '大师预设',
        uploadImage: '叠加素材',
        imageSettings: '导出设置',
        chooseFile: '点击或拖拽图片至此',
        imageScale: '缩放比例',
        downloadButton: '下载壁纸',
        copyCss: '复制 CSS',
        width: '宽度',
        height: '高度',
        randomGradient: '随机灵感', // 确保中文也有这个key
        // 预设名称
        p_dreamy_purple: '梦幻紫',
        p_sunset_glow: '日落金',
        p_ocean_blue: '深海蓝',
        p_mint_fresh: '薄荷绿',
        p_sakura_pink: '樱花粉',
        p_aurora_green: '极光绿',
        p_neon_city: '霓虹城',
        p_morning_mist: '晨雾灰',
        p_lemon_soda: '柠檬苏打',
        p_starry_night: '星空黑',
        p_coral_reef: '珊瑚红',
        p_sky_mirror: '天空之镜'
    },
    'en': {
        pageTitle: 'Gradient Pro',
        customColors: 'Colors',
        gradientSettings: 'Angle',
        presetGradients: 'Presets',
        uploadImage: 'Overlay',
        imageSettings: 'Export',
        chooseFile: 'Drop image or click',
        imageScale: 'Scale',
        downloadButton: 'Download',
        copyCss: 'Copy CSS',
        width: 'Width',
        height: 'Height',
        randomGradient: 'Randomize', // 修复：补全英文翻译
        // Presets
        p_dreamy_purple: 'Dreamy Purple',
        p_sunset_glow: 'Sunset Glow',
        p_ocean_blue: 'Ocean Blue',
        p_mint_fresh: 'Mint Fresh',
        p_sakura_pink: 'Sakura Pink',
        p_aurora_green: 'Aurora Green',
        p_neon_city: 'Neon City',
        p_morning_mist: 'Morning Mist',
        p_lemon_soda: 'Lemon Soda',
        p_starry_night: 'Starry Night',
        p_coral_reef: 'Coral Reef',
        p_sky_mirror: 'Sky Mirror'
    }
};

class LanguageManager {
    constructor() {
        this.lang = localStorage.getItem('lang') || 'zh-CN';
        this.init();
    }

    init() {
        this.applyLanguage(this.lang);
        
        document.querySelectorAll('.lang-pill button').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const target = e.target.closest('button');
                if(!target) return;
                const code = target.dataset.langCode;
                this.setLanguage(code);
            });
        });
    }

    setLanguage(code) {
        this.lang = code;
        localStorage.setItem('lang', code);
        this.applyLanguage(code);
        window.dispatchEvent(new CustomEvent('languageChanged', { detail: { lang: code } }));
    }

    applyLanguage(code) {
        const data = translations[code];
        if (!data) return;

        document.querySelectorAll('.lang-pill button').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.langCode === code);
        });

        document.querySelectorAll('[data-lang]').forEach(el => {
            const key = el.dataset.lang;
            if (data[key]) {
                if (el.tagName === 'BUTTON' && el.querySelector('i') && el.childNodes.length > 1) {
                    // 仅替换文本节点，保留图标
                    Array.from(el.childNodes).forEach(node => {
                        // 查找非空的文本节点进行替换
                        if (node.nodeType === Node.TEXT_NODE && node.textContent.trim() !== '') {
                            node.textContent = ' ' + data[key]; // 补一个空格保持间距
                        }
                        // 针对 span 包裹的文本 (如 Random 按钮中的 span)
                        if (node.nodeType === Node.ELEMENT_NODE && node.dataset.lang === key) {
                             node.textContent = data[key];
                        }
                    });
                    
                    // 特殊处理结构：如果 data-lang 在子 span 上（如 random 按钮）
                    const targetSpan = el.querySelector(`[data-lang="${key}"]`);
                    if(targetSpan) targetSpan.textContent = data[key];

                } else if (el.tagName === 'LABEL') {
                    el.textContent = data[key];
                } else if (el.classList.contains('group-title')) {
                     const icon = el.querySelector('i');
                     el.textContent = '';
                     if(icon) el.appendChild(icon);
                     el.appendChild(document.createTextNode(' ' + data[key]));
                } else {
                    el.textContent = data[key];
                }
            }
        });
    }
    
    get(key) {
        return translations[this.lang][key] || key;
    }
}

document.addEventListener('DOMContentLoaded', () => {
    window.langManager = new LanguageManager();
});