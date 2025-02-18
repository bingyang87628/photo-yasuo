class ImagePreview {
    constructor() {
        this.compressor = new ImageCompressor();
        this.initElements();
        this.initEventListeners();
    }

    initElements() {
        this.dropZone = document.getElementById('dropZone');
        this.fileInput = document.getElementById('fileInput');
        this.selectFile = document.getElementById('selectFile');
        this.qualityInput = document.getElementById('quality');
        this.qualityValue = document.getElementById('qualityValue');
        this.previewArea = document.getElementById('previewArea');
        this.controlPanel = document.querySelector('.control-panel');
        this.actionButtons = document.querySelector('.action-buttons');
        this.downloadAll = document.getElementById('downloadAll');
        this.reset = document.getElementById('reset');
    }

    initEventListeners() {
        // 文件选择相关
        this.selectFile.addEventListener('click', () => this.fileInput.click());
        this.fileInput.addEventListener('change', (e) => this.handleFiles(e.target.files));
        
        // 拖放相关
        this.dropZone.addEventListener('dragover', (e) => {
            e.preventDefault();
            this.dropZone.classList.add('drag-over');
        });
        
        this.dropZone.addEventListener('dragleave', () => {
            this.dropZone.classList.remove('drag-over');
        });
        
        this.dropZone.addEventListener('drop', (e) => {
            e.preventDefault();
            this.dropZone.classList.remove('drag-over');
            this.handleFiles(e.dataTransfer.files);
        });

        // 质量调节
        this.qualityInput.addEventListener('input', (e) => {
            const quality = e.target.value;
            this.qualityValue.textContent = quality + '%';
            this.compressor.setQuality(quality);
            this.updatePreviews();
        });

        // 下载按钮
        this.downloadAll.addEventListener('click', () => this.downloadAllImages());
        
        // 重置按钮
        this.reset.addEventListener('click', () => this.resetAll());
    }

    async handleFiles(files) {
        const imageFiles = Array.from(files).filter(file => file.type.startsWith('image/'));
        
        if (imageFiles.length === 0) {
            alert('请选择图片文件');
            return;
        }

        this.controlPanel.hidden = false;
        this.actionButtons.hidden = false;
        
        for (const file of imageFiles) {
            await this.addPreview(file);
        }
    }

    async addPreview(file) {
        try {
            const result = await this.compressor.compress(file);
            
            const card = document.createElement('div');
            card.className = 'preview-card';
            card.innerHTML = `
                <h3>${file.name}</h3>
                <div class="preview-images">
                    <img src="${URL.createObjectURL(file)}" alt="原图">
                    <img src="${URL.createObjectURL(result.blob)}" alt="压缩后">
                </div>
                <div class="preview-info">
                    <p>原始大小: ${utils.formatSize(result.originalSize)}</p>
                    <p>压缩后: ${utils.formatSize(result.compressedSize)}</p>
                    <p>压缩率: ${Math.round((1 - result.compressedSize / result.originalSize) * 100)}%</p>
                </div>
                <button class="download-btn">下载</button>
            `;

            const downloadBtn = card.querySelector('.download-btn');
            downloadBtn.addEventListener('click', () => {
                const link = utils.createDownloadLink(result.blob, `compressed_${file.name}`);
                link.click();
                URL.revokeObjectURL(link.href);
            });

            this.previewArea.appendChild(card);
        } catch (error) {
            console.error('预览生成失败:', error);
            alert(`处理文件 ${file.name} 时发生错误`);
        }
    }

    async updatePreviews() {
        // 实现预览更新逻辑
    }

    downloadAllImages() {
        // 实现批量下载逻辑
    }

    resetAll() {
        this.previewArea.innerHTML = '';
        this.controlPanel.hidden = true;
        this.actionButtons.hidden = true;
        this.fileInput.value = '';
    }
}

// 初始化
document.addEventListener('DOMContentLoaded', () => {
    new ImagePreview();
}); 