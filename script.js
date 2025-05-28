document.addEventListener('DOMContentLoaded', function() {
    // 获取DOM元素
    const preview = document.getElementById('preview');
    const color1Input = document.getElementById('color1');
    const color2Input = document.getElementById('color2');
    const angleInput = document.getElementById('angle');
    const angleValue = document.getElementById('angleValue');
    const downloadBtn = document.getElementById('download');
    const cssCodeDisplay = document.getElementById('cssCode');
    const presetItems = document.querySelectorAll('.preset-item');
    const languageButtons = document.querySelectorAll('.language-btn');
    
    // 语言切换功能
    languageButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            languageButtons.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
        });
    });

    // 更新颜色值显示
    function updateColorValues() {
        const color1Value = document.querySelector('#color1').nextElementSibling;
        const color2Value = document.querySelector('#color2').nextElementSibling;
        if (color1Value) color1Value.textContent = color1Input.value.toLowerCase();
        if (color2Value) color2Value.textContent = color2Input.value.toLowerCase();
    }

    // 更新预览和CSS代码
    function updatePreview() {
        const angle = angleInput.value;
        const color1 = color1Input.value;
        const color2 = color2Input.value;
        
        const gradient = `linear-gradient(${angle}deg, ${color1} 0%, ${color2} 100%)`;
        preview.style.background = gradient;
        angleValue.textContent = `${angle}°`;
        
        // 更新CSS代码显示
        cssCodeDisplay.textContent = `background: ${gradient};`;
        
        // 更新颜色值显示
        updateColorValues();
    }

    // 事件监听器
    color1Input.addEventListener('input', updatePreview);
    color2Input.addEventListener('input', updatePreview);
    angleInput.addEventListener('input', updatePreview);

    // 预设渐变点击事件
    presetItems.forEach(item => {
        item.addEventListener('click', function() {
            // 移除其他项目的激活状态
            presetItems.forEach(i => i.classList.remove('active'));
            // 激活当前项目
            this.classList.add('active');
            
            const colors = JSON.parse(this.dataset.colors);
            color1Input.value = colors[0];
            color2Input.value = colors[1];
            updatePreview();
            
            // 添加点击动画
            this.style.transform = 'scale(0.98)';
            setTimeout(() => {
                this.style.transform = '';
            }, 150);
        });
    });

    // 下载功能
    downloadBtn.addEventListener('click', function() {
        const width = parseInt(document.getElementById('width').value);
        const height = parseInt(document.getElementById('height').value);
        const format = document.querySelector('input[name="format"]:checked').value;
        
        // 创建临时canvas
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');

        // 计算渐变角度
        const angle = parseInt(angleInput.value);
        const radians = (angle * Math.PI) / 180;
        
        // 计算渐变起点和终点
        const centerX = width / 2;
        const centerY = height / 2;
        const length = Math.sqrt(width * width + height * height) / 2;
        
        const x1 = centerX - Math.cos(radians) * length;
        const y1 = centerY - Math.sin(radians) * length;
        const x2 = centerX + Math.cos(radians) * length;
        const y2 = centerY + Math.sin(radians) * length;

        // 创建渐变
        const gradient = ctx.createLinearGradient(x1, y1, x2, y2);
        gradient.addColorStop(0, color1Input.value);
        gradient.addColorStop(1, color2Input.value);

        // 填充渐变
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, width, height);

        // 设置MIME类型和质量
        let mimeType = `image/${format}`;
        let quality = 0.92;
        
        if (format === 'webp') {
            quality = 0.85;
        }

        // 下载图片
        const link = document.createElement('a');
        link.download = `gradient-${Date.now()}.${format}`;
        link.href = canvas.toDataURL(mimeType, quality);
        link.click();
        
        // 下载按钮动画反馈
        downloadBtn.innerHTML = '<i class="fas fa-check"></i><span>已下载</span>';
        setTimeout(() => {
            downloadBtn.innerHTML = '<i class="fas fa-download"></i><span data-lang="downloadButton">下载背景图片</span>';
        }, 2000);
    });

    // 初始化默认渐变
    function initializeDefault() {
        // 激活第一个预设
        if (presetItems.length > 0) {
            presetItems[0].classList.add('active');
        }
        updatePreview();
        updateColorValues();
    }

    // 初始化
    initializeDefault();
});

// 复制CSS代码功能
function copyCSSCode() {
    const cssCode = document.getElementById('cssCode').textContent;
    navigator.clipboard.writeText(cssCode).then(() => {
        const copyBtn = document.querySelector('.copy-btn');
        const originalContent = copyBtn.innerHTML;
        copyBtn.innerHTML = '<i class="fas fa-check"></i>已复制';
        copyBtn.style.color = '#10b981';
        copyBtn.style.borderColor = '#10b981';
        
        setTimeout(() => {
            copyBtn.innerHTML = originalContent;
            copyBtn.style.color = '';
            copyBtn.style.borderColor = '';
        }, 2000);
    }).catch(() => {
        alert('复制失败，请手动复制CSS代码');
    });
}

// 随机渐变功能
function randomGradient() {
    const colors = [
        '#667eea', '#764ba2', '#f093fb', '#f5576c', '#4facfe', '#00f2fe',
        '#43e97b', '#38f9d7', '#fa709a', '#fee140', '#a8edea', '#fed6e3',
        '#ff9a9e', '#fecfef', '#a18cd1', '#fbc2eb', '#ff6b6b', '#4ecdc4',
        '#45b7d1', '#96c93d', '#f39c12', '#e74c3c', '#9b59b6', '#1abc9c',
        '#34495e', '#e67e22', '#3498db', '#e91e63', '#8e24aa', '#00bcd4'
    ];
    
    const color1 = colors[Math.floor(Math.random() * colors.length)];
    let color2 = colors[Math.floor(Math.random() * colors.length)];
    
    // 确保两个颜色不同
    while (color2 === color1) {
        color2 = colors[Math.floor(Math.random() * colors.length)];
    }
    
    const angle = Math.floor(Math.random() * 360);
    
    document.getElementById('color1').value = color1;
    document.getElementById('color2').value = color2;
    document.getElementById('angle').value = angle;
    
    // 移除所有预设的激活状态
    document.querySelectorAll('.preset-item').forEach(item => {
        item.classList.remove('active');
    });
    
    // 更新预览
    const preview = document.getElementById('preview');
    const angleValue = document.getElementById('angleValue');
    const cssCodeDisplay = document.getElementById('cssCode');
    
    const gradient = `linear-gradient(${angle}deg, ${color1} 0%, ${color2} 100%)`;
    preview.style.background = gradient;
    angleValue.textContent = `${angle}°`;
    cssCodeDisplay.textContent = `background: ${gradient};`;
    
    // 更新颜色值显示
    const color1Value = document.querySelector('#color1').nextElementSibling;
    const color2Value = document.querySelector('#color2').nextElementSibling;
    if (color1Value) color1Value.textContent = color1.toLowerCase();
    if (color2Value) color2Value.textContent = color2.toLowerCase();
    
    // 随机按钮动画
    const randomBtn = document.querySelector('.preview-btn');
    randomBtn.style.transform = 'scale(0.95)';
    setTimeout(() => {
        randomBtn.style.transform = '';
    }, 150);
}

// 全屏预览功能
function toggleFullscreen() {
    const previewContainer = document.querySelector('.preview-container');
    
    if (!document.fullscreenElement) {
        previewContainer.requestFullscreen().then(() => {
            previewContainer.classList.add('fullscreen-mode');
            const btn = document.querySelector('.preview-btn:last-child');
            btn.innerHTML = '<i class="fas fa-compress"></i>退出全屏';
        }).catch(err => {
            console.log('全屏失败:', err);
        });
    } else {
        document.exitFullscreen().then(() => {
            previewContainer.classList.remove('fullscreen-mode');
            const btn = document.querySelector('.preview-btn:last-child');
            btn.innerHTML = '<i class="fas fa-expand"></i>全屏预览';
        });
    }
}

// 监听全屏状态变化
document.addEventListener('fullscreenchange', () => {
    const previewContainer = document.querySelector('.preview-container');
    const btn = document.querySelector('.preview-btn:last-child');
    
    if (!document.fullscreenElement) {
        previewContainer.classList.remove('fullscreen-mode');
        btn.innerHTML = '<i class="fas fa-expand"></i>全屏预览';
    }
});

// 键盘快捷键
document.addEventListener('keydown', (e) => {
    // Ctrl/Cmd + C 复制CSS
    if ((e.ctrlKey || e.metaKey) && e.key === 'c' && e.target.tagName !== 'INPUT') {
        e.preventDefault();
        copyCSSCode();
    }
    
    // 空格键随机渐变
    if (e.key === ' ' && e.target.tagName !== 'INPUT') {
        e.preventDefault();
        randomGradient();
    }
    
    // F11 全屏
    if (e.key === 'F11') {
        e.preventDefault();
        toggleFullscreen();
    }
});

// 鼠标滚轮调整角度
document.getElementById('preview').addEventListener('wheel', (e) => {
    if (e.ctrlKey || e.metaKey) {
        e.preventDefault();
        const angleInput = document.getElementById('angle');
        const currentAngle = parseInt(angleInput.value);
        const delta = e.deltaY > 0 ? -5 : 5;
        const newAngle = Math.max(0, Math.min(360, currentAngle + delta));
        
        angleInput.value = newAngle;
        
        // 手动触发更新
        const event = new Event('input');
        angleInput.dispatchEvent(event);
    }
});

// 添加全屏模式样式
const style = document.createElement('style');
style.textContent = `
.fullscreen-mode {
    background: var(--primary-gradient) !important;
}

.fullscreen-mode .preview-canvas {
    width: 100vw !important;
    height: 100vh !important;
}

.fullscreen-mode .preview-overlay {
    bottom: 5% !important;
}
`;
document.head.appendChild(style);