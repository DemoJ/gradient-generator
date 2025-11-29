/**
 * Gradient Pro Core Logic
 */

class GradientApp {
    constructor() {
        this.state = {
            colors: ['#fccb90', '#d57eeb'],
            angle: 135,
            image: null,
            imageSrc: null,
            imageScale: 50,
            width: 1920,
            height: 1080,
            format: 'png',
            gridMode: false
        };

        this.presetsData = [
            { colors: ['#a18cd1', '#fbc2eb'], key: 'p_dreamy_purple' },
            { colors: ['#f6d365', '#fda085'], key: 'p_sunset_glow' },
            { colors: ['#a1c4fd', '#c2e9fb'], key: 'p_ocean_blue' },
            { colors: ['#84fab0', '#8fd3f4'], key: 'p_mint_fresh' },
            { colors: ['#ff9a9e', '#fecfef'], key: 'p_sakura_pink' },
            { colors: ['#85ffbd', '#fffb7d'], key: 'p_aurora_green' },
            { colors: ['#fa8bff', '#2bd2ff'], key: 'p_neon_city' },
            { colors: ['#cfd9df', '#e2ebf0'], key: 'p_morning_mist' },
            { colors: ['#f093fb', '#f5576c'], key: 'p_lemon_soda' },
            { colors: ['#0f2027', '#203a43'], key: 'p_starry_night' },
            { colors: ['#ffecd2', '#fcb69f'], key: 'p_coral_reef' },
            { colors: ['#e0c3fc', '#8ec5fc'], key: 'p_sky_mirror' }
        ];

        this.dom = this.cacheDOM();
        this.init();
    }

    cacheDOM() {
        return {
            color1: document.getElementById('color1'),
            color2: document.getElementById('color2'),
            surface1: document.getElementById('surface1'),
            surface2: document.getElementById('surface2'),
            swapBtn: document.getElementById('swapColors'),
            randomBtn: document.getElementById('randomBtn'),
            angleDial: document.getElementById('angleDial'),
            anglePointer: document.getElementById('anglePointer'),
            angleText: document.getElementById('angleText'),
            presetGrid: document.getElementById('presetGrid'),
            imageUpload: document.getElementById('imageUpload'),
            dropZone: document.getElementById('dropZone'),
            imgControls: document.getElementById('imgControls'),
            imageScale: document.getElementById('imageScale'),
            removeImgBtn: document.getElementById('removeImgBtn'),
            miniImgPreview: document.getElementById('miniImgPreview'),
            width: document.getElementById('width'),
            height: document.getElementById('height'),
            formatSelect: document.getElementById('formatSelect'),
            downloadBtn: document.getElementById('downloadBtn'),
            mainPreview: document.getElementById('mainPreview'),
            shadow: document.querySelector('.artboard-shadow'),
            cssPill: document.getElementById('copyBtn'),
            cssValue: document.querySelector('.css-value'),
            ambientBg: document.getElementById('ambientBg'),
            auroras: document.querySelectorAll('.aurora'),
            toggleGridBtn: document.getElementById('toggleGridBtn'),
            fullscreenBtn: document.getElementById('fullscreenBtn')
        };
    }

    init() {
        this.bindEvents();
        this.renderPresets();
        this.updateView(); 
        
        window.addEventListener('languageChanged', () => {
            this.renderPresets();
        });

        document.addEventListener('keydown', (e) => {
            if (e.code === 'Space' && e.target.tagName !== 'INPUT') {
                e.preventDefault();
                this.randomize();
            }
        });
    }

    bindEvents() {
        const { dom } = this;

        // Colors
        const updateColor = () => {
            this.state.colors = [dom.color1.value, dom.color2.value];
            this.updateView();
        };
        dom.color1.addEventListener('input', updateColor);
        dom.color2.addEventListener('input', updateColor);
        
        dom.swapBtn.addEventListener('click', () => {
            this.state.colors.reverse();
            dom.color1.value = this.state.colors[0];
            dom.color2.value = this.state.colors[1];
            this.updateView();
        });

        dom.randomBtn.addEventListener('click', () => this.randomize());

        // Angle Logic
        let isDragging = false;
        const calculateAngle = (e) => {
            const rect = dom.angleDial.getBoundingClientRect();
            const centerX = rect.left + rect.width / 2;
            const centerY = rect.top + rect.height / 2;
            const clientX = e.touches ? e.touches[0].clientX : e.clientX;
            const clientY = e.touches ? e.touches[0].clientY : e.clientY;
            
            const deltaX = clientX - centerX;
            const deltaY = clientY - centerY;
            let deg = Math.atan2(deltaY, deltaX) * (180 / Math.PI);
            deg += 90; 
            if (deg < 0) deg += 360;
            
            this.state.angle = Math.round(deg);
            this.updateView();
        };

        dom.angleDial.addEventListener('mousedown', (e) => { isDragging = true; calculateAngle(e); });
        window.addEventListener('mousemove', (e) => { if (isDragging) calculateAngle(e); });
        window.addEventListener('mouseup', () => isDragging = false);
        dom.angleDial.addEventListener('touchstart', (e) => { isDragging = true; calculateAngle(e); }, {passive: false});
        window.addEventListener('touchmove', (e) => { if (isDragging) { e.preventDefault(); calculateAngle(e); }}, {passive: false});
        window.addEventListener('touchend', () => isDragging = false);

        document.querySelectorAll('.angle-presets button').forEach(btn => {
            btn.addEventListener('click', () => {
                this.state.angle = parseInt(btn.dataset.deg);
                this.updateView();
            });
        });

        // Image
        dom.imageUpload.addEventListener('change', (e) => this.handleImage(e.target.files[0]));
        dom.dropZone.addEventListener('click', () => { dom.imageUpload.click(); });
        
        const prevent = (e) => { e.preventDefault(); e.stopPropagation(); };
        ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(evt => {
            dom.dropZone.addEventListener(evt, prevent);
        });
        dom.dropZone.addEventListener('dragover', () => dom.dropZone.style.borderColor = 'var(--accent)');
        dom.dropZone.addEventListener('dragleave', () => dom.dropZone.style.borderColor = '');
        dom.dropZone.addEventListener('drop', (e) => {
            dom.dropZone.style.borderColor = '';
            this.handleImage(e.dataTransfer.files[0]);
        });

        dom.removeImgBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            this.state.image = null;
            this.state.imageSrc = null;
            dom.imageUpload.value = '';
            this.updateView();
        });

        dom.imageScale.addEventListener('input', (e) => {
            this.state.imageScale = parseInt(e.target.value);
            this.updateView();
        });

        dom.width.addEventListener('input', (e) => { this.state.width = parseInt(e.target.value) || 1920; this.updateView(); });
        dom.height.addEventListener('input', (e) => { this.state.height = parseInt(e.target.value) || 1080; this.updateView(); });
        dom.formatSelect.addEventListener('change', (e) => this.state.format = e.target.value);
        dom.downloadBtn.addEventListener('click', () => this.download());

        // Toolbar
        dom.cssPill.addEventListener('click', (e) => {
            if(e.target.classList.contains('action-copy')) this.copyCSS();
        });
        dom.toggleGridBtn.addEventListener('click', () => {
            this.state.gridMode = !this.state.gridMode;
            this.updateView();
        });
        dom.fullscreenBtn.addEventListener('click', () => {
            if (!document.fullscreenElement) dom.mainPreview.requestFullscreen().catch(err => {});
            else document.exitFullscreen();
        });
    }

    handleImage(file) {
        if (!file || !file.type.startsWith('image/')) return;
        const reader = new FileReader();
        reader.onload = (e) => {
            const img = new Image();
            img.onload = () => {
                this.state.image = img;
                this.state.imageSrc = e.target.result;
                this.updateView();
            };
            img.src = e.target.result;
        };
        reader.readAsDataURL(file);
    }

    randomize() {
        const r = () => '#' + Math.floor(Math.random()*16777215).toString(16).padStart(6, '0');
        this.state.colors = [r(), r()];
        this.state.angle = Math.floor(Math.random() * 360);
        this.dom.color1.value = this.state.colors[0];
        this.dom.color2.value = this.state.colors[1];
        this.updateView();
    }

    updateView() {
        const { dom, state } = this;
        dom.surface1.style.backgroundColor = state.colors[0];
        dom.surface2.style.backgroundColor = state.colors[1];
        dom.angleText.textContent = state.angle;
        dom.anglePointer.style.transform = `translate(-50%, 0) rotate(${state.angle}deg)`;

        const gradient = `linear-gradient(${state.angle}deg, ${state.colors[0]} 0%, ${state.colors[1]} 100%)`;
        dom.mainPreview.style.background = gradient;
        dom.shadow.style.background = gradient;
        dom.cssValue.textContent = `linear-gradient(${state.angle}deg, ${state.colors[0]}, ${state.colors[1]})`;

        dom.mainPreview.innerHTML = '';
        if (state.imageSrc) {
            const img = document.createElement('img');
            img.src = state.imageSrc;
            img.className = 'preview-img';
            img.style.width = `${state.imageScale}%`;
            dom.mainPreview.appendChild(img);
            
            dom.dropZone.classList.add('has-image');
            dom.miniImgPreview.style.backgroundImage = `url(${state.imageSrc})`;
            dom.imgControls.style.display = 'flex';
        } else {
            dom.dropZone.classList.remove('has-image');
            dom.imgControls.style.display = 'none';
        }

        dom.auroras[0].style.background = state.colors[0];
        dom.auroras[1].style.background = state.colors[1];
        dom.auroras[2].style.background = this.blendColors(state.colors[0], state.colors[1], 0.5);

        this.adjustAspectRatio();
        if (state.gridMode) dom.mainPreview.classList.add('grid-mode');
        else dom.mainPreview.classList.remove('grid-mode');
    }

    adjustAspectRatio() {
        const { dom, state } = this;
        // 修正：现在我们有顶部工具栏，所以高度要重新计算
        const stage = dom.mainPreview.closest('.canvas-stage');
        if(!stage) return;
        
        const maxWidth = stage.clientWidth - 40;
        const maxHeight = stage.clientHeight - 40;
        
        const ratio = state.width / state.height;
        let finalW, finalH;

        if (maxWidth / maxHeight > ratio) {
            finalH = maxHeight;
            finalW = finalH * ratio;
        } else {
            finalW = maxWidth;
            finalH = finalW / ratio;
        }

        dom.mainPreview.style.width = `${finalW}px`;
        dom.mainPreview.style.height = `${finalH}px`;
        dom.shadow.style.width = `${finalW}px`;
        dom.shadow.style.height = `${finalH}px`;
    }

    copyCSS() {
        const css = `background: linear-gradient(${this.state.angle}deg, ${this.state.colors[0]} 0%, ${this.state.colors[1]} 100%);`;
        navigator.clipboard.writeText(css).then(() => {
            this.showToast('<i class="fas fa-check-circle"></i> CSS 已复制');
        });
    }

    showToast(html) {
        const toast = document.createElement('div');
        toast.className = 'toast';
        toast.innerHTML = html;
        document.getElementById('toastContainer').appendChild(toast);
        setTimeout(() => toast.remove(), 2500);
    }

    download() {
        const { state } = this;
        const btn = this.dom.downloadBtn;
        btn.querySelector('.btn-text').style.opacity = '0';
        btn.querySelector('.btn-icon').style.opacity = '0';
        btn.classList.add('loading');
        
        setTimeout(() => {
            const canvas = document.createElement('canvas');
            canvas.width = state.width;
            canvas.height = state.height;
            const ctx = canvas.getContext('2d');
            const w = canvas.width;
            const h = canvas.height;
            
            const angleRad = (state.angle - 180) * (Math.PI / 180); 
            const segmentLength = Math.abs(w * Math.sin(angleRad)) + Math.abs(h * Math.cos(angleRad));
            const x1 = w/2 + Math.sin(angleRad) * segmentLength/2;
            const y1 = h/2 - Math.cos(angleRad) * segmentLength/2;
            const x2 = w/2 - Math.sin(angleRad) * segmentLength/2;
            const y2 = h/2 + Math.cos(angleRad) * segmentLength/2;

            const grad = ctx.createLinearGradient(x1, y1, x2, y2);
            grad.addColorStop(0, state.colors[0]);
            grad.addColorStop(1, state.colors[1]);
            ctx.fillStyle = grad;
            ctx.fillRect(0, 0, w, h);

            if (state.image) {
                const img = state.image;
                const scale = state.imageScale / 100;
                const imgRatio = img.width / img.height;
                let drawW, drawH;
                drawW = w * scale;
                drawH = drawW / imgRatio;
                const dx = (w - drawW) / 2;
                const dy = (h - drawH) / 2;
                ctx.drawImage(img, dx, dy, drawW, drawH);
            }

            const link = document.createElement('a');
            link.download = `gradient-pro-${Date.now()}.${state.format}`;
            link.href = canvas.toDataURL(`image/${state.format}`, 0.95);
            link.click();

            btn.querySelector('.btn-text').style.opacity = '1';
            btn.querySelector('.btn-icon').style.opacity = '1';
            btn.classList.remove('loading');
        }, 100);
    }

    renderPresets() {
        const container = this.dom.presetGrid;
        container.innerHTML = ''; 
        
        this.presetsData.forEach(p => {
            const div = document.createElement('div');
            div.className = 'preset-item';
            div.style.background = `linear-gradient(135deg, ${p.colors[0]}, ${p.colors[1]})`;
            
            const nameSpan = document.createElement('span');
            nameSpan.className = 'preset-name';
            nameSpan.textContent = window.langManager ? window.langManager.get(p.key) : 'Preset';
            div.appendChild(nameSpan);

            div.onclick = () => {
                this.state.colors = [...p.colors];
                this.dom.color1.value = p.colors[0];
                this.dom.color2.value = p.colors[1];
                this.updateView();
                document.querySelectorAll('.preset-item').forEach(el => el.classList.remove('active'));
                div.classList.add('active');
            };
            container.appendChild(div);
        });
    }

    blendColors(c1, c2, percent) {
        const f = parseInt(c1.slice(1), 16),
              t = parseInt(c2.slice(1), 16),
              R1 = f >> 16, G1 = f >> 8 & 0x00FF, B1 = f & 0x0000FF,
              R2 = t >> 16, G2 = t >> 8 & 0x00FF, B2 = t & 0x0000FF;
        return "#" + (0x1000000 + (Math.round((R2 - R1) * percent) + R1) * 0x10000 
                     + (Math.round((G2 - G1) * percent) + G1) * 0x100 
                     + (Math.round((B2 - B1) * percent) + B1)).toString(16).slice(1);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    window.app = new GradientApp();
});