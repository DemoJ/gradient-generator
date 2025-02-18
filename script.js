document.addEventListener('DOMContentLoaded', function() {
    // 添加语言切换按钮的激活状态管理
    const languageButtons = document.querySelectorAll('.language-btn');
    languageButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            // 移除所有按钮的 active 类
            languageButtons.forEach(b => b.classList.remove('active'));
            // 为当前点击的按钮添加 active 类
            this.classList.add('active');
        });
    });

    const preview = document.getElementById('preview');
    const color1Input = document.getElementById('color1');
    const color2Input = document.getElementById('color2');
    const angleInput = document.getElementById('angle');
    const angleValue = document.getElementById('angleValue');
    const downloadBtn = document.getElementById('download');

    function updatePreview() {
        const gradient = `linear-gradient(${angleInput.value}deg, ${color1Input.value}, ${color2Input.value})`;
        document.querySelector('.preview').style.background = gradient;
        angleValue.textContent = `${angleInput.value}°`;
    }

    // 更新预览
    color1Input.addEventListener('input', updatePreview);
    color2Input.addEventListener('input', updatePreview);
    angleInput.addEventListener('input', updatePreview);

    // 设置默认渐变（在初始化预览之前）
    function setDefaultGradient() {
        const firstPreset = document.querySelector('.preset-btn');
        const colors = JSON.parse(firstPreset.dataset.colors);
        color1Input.value = colors[0];
        color2Input.value = colors[1];
    }

    // 初始化时设置默认渐变
    setDefaultGradient();
    
    // 初始化预览
    updatePreview();
    
    // 初始化预览比例
    updatePreviewRatio();

    // 下载功能
    downloadBtn.addEventListener('click', function() {
        const width = document.getElementById('width').value;
        const height = document.getElementById('height').value;
        const format = document.querySelector('input[name="format"]:checked').value;

        // 创建临时 canvas
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');

        // 建渐变
        const gradient = ctx.createLinearGradient(0, 0, width, height);
        gradient.addColorStop(0, color1Input.value);
        gradient.addColorStop(1, color2Input.value);

        // 填充渐变
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, width, height);

        // 根据不同格式设置质量和类型
        let mimeType = `image/${format}`;
        let quality = 0.92;

        // WebP和AVIF格式的特殊处理
        if (format === 'webp' || format === 'avif') {
            quality = 0.85;
        }

        // 下载图片
        const link = document.createElement('a');
        link.download = `gradient-background.${format}`;
        link.href = canvas.toDataURL(mimeType, quality);
        link.click();
    });

    // 添加预渐变功能
    const presetBtns = document.querySelectorAll('.preset-btn');
    
    presetBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const colors = JSON.parse(this.dataset.colors);
            color1Input.value = colors[0];
            color2Input.value = colors[1];
            updatePreview();
            
            // 添加点击动画效果
            this.style.transform = 'scale(0.95)';
            setTimeout(() => {
                this.style.transform = 'translateY(-2px)';
            }, 150);
        });
    });

    // 优化下载按钮动画
    downloadBtn.addEventListener('mouseenter', function() {
        this.style.transform = 'translateY(-2px)';
    });

    downloadBtn.addEventListener('mouseleave', function() {
        this.style.transform = 'translateY(0)';
    });

    // 添加渐变角度可视化
    angleInput.addEventListener('input', function() {
        const arrow = document.querySelector('.angle-arrow') || document.createElement('div');
        arrow.className = 'angle-arrow';
        arrow.style.transform = `rotate(${this.value}deg)`;
        preview.appendChild(arrow);
    });

    // 添加更新预览尺寸比例的功能
    function updatePreviewRatio() {
        const width = parseInt(document.getElementById('width').value);
        const height = parseInt(document.getElementById('height').value);
        const preview = document.querySelector('.preview');
        
        if (width && height) {
            const containerWidth = 800; // 增加容器内可用宽度
            const containerHeight = 600; // 增加容器内可用高度
            
            // 计算缩放比例
            const scaleX = containerWidth / width;
            const scaleY = containerHeight / height;
            const scale = Math.min(scaleX, scaleY);
            
            // 设置预览区域的尺寸
            const previewWidth = width * scale;
            const previewHeight = height * scale;
            
            preview.style.width = previewWidth + 'px';
            preview.style.height = previewHeight + 'px';
        }
    }

    // 在现有代码中添加尺寸输入监听
    document.getElementById('width').addEventListener('input', updatePreviewRatio);
    document.getElementById('height').addEventListener('input', updatePreviewRatio);

    // 初始化时调用一次
    updatePreviewRatio();
});