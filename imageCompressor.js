class ImageCompressor {
    constructor() {
        this.canvas = document.createElement('canvas');
        this.ctx = this.canvas.getContext('2d');
    }

    /**
     * 压缩图片
     * @param {File} file - 原始图片文件
     * @param {Object} options - 压缩选项
     * @param {number} options.quality - 压缩质量 0-1
     * @param {number} options.maxWidth - 最大宽度
     * @returns {Promise<Blob>} - 压缩后的图片Blob对象
     */
    async compress(file, options = {}) {
        const { quality = 0.8, maxWidth = 1920 } = options;

        try {
            // 加载图片
            const image = await this.loadImage(file);
            
            // 计算尺寸
            let { width, height } = image;
            if (width > maxWidth) {
                height = Math.round((height * maxWidth) / width);
                width = maxWidth;
            }

            // 设置canvas尺寸
            this.canvas.width = width;
            this.canvas.height = height;

            // 清空canvas
            this.ctx.clearRect(0, 0, width, height);
            
            // 绘制图片
            this.ctx.drawImage(image, 0, 0, width, height);

            // 根据图片类型选择压缩格式
            const mimeType = this.getOptimalMimeType(file.type);
            
            // 转换为blob
            const blob = await new Promise(resolve => {
                this.canvas.toBlob(
                    blob => resolve(blob),
                    mimeType,
                    quality
                );
            });

            return blob;
        } catch (error) {
            console.error('图片压缩失败:', error);
            throw error;
        }
    }

    /**
     * 获取最优的压缩格式
     * @param {string} originalType - 原始图片类型
     * @returns {string} - 压缩格式
     */
    getOptimalMimeType(originalType) {
        // 如果原图是PNG且支持WebP，则使用WebP
        if (this.canvas.toDataURL('image/webp').indexOf('data:image/webp') === 0) {
            return 'image/webp';
        }
        // 否则使用原格式，默认为JPEG
        return originalType || 'image/jpeg';
    }

    /**
     * 加载图片
     * @param {File} file - 图片文件
     * @returns {Promise<HTMLImageElement>}
     */
    loadImage(file) {
        return new Promise((resolve, reject) => {
            const image = new Image();
            image.onload = () => resolve(image);
            image.onerror = reject;
            image.src = URL.createObjectURL(file);
        });
    }
} 