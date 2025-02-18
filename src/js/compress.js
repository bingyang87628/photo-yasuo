class ImageCompressor {
    constructor() {
        this.quality = 0.8;
        this.maxWidth = 1920;
        this.maxHeight = 1080;
    }

    async compress(file) {
        try {
            // 创建图片对象
            const img = await this.createImage(file);
            
            // 创建 canvas
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');

            // 计算压缩后的尺寸
            let { width, height } = this.calculateSize(img);
            
            canvas.width = width;
            canvas.height = height;

            // 绘制图片
            ctx.drawImage(img, 0, 0, width, height);

            // 转换为 blob
            const blob = await new Promise(resolve => {
                canvas.toBlob(resolve, 'image/jpeg', this.quality);
            });

            // 清理资源
            canvas.width = 0;
            canvas.height = 0;

            return {
                blob,
                width,
                height,
                originalSize: file.size,
                compressedSize: blob.size,
                name: file.name,
                type: 'image/jpeg'
            };
        } catch (error) {
            console.error('压缩失败:', error);
            throw error;
        }
    }

    createImage(file) {
        return new Promise((resolve, reject) => {
            const img = new Image();
            img.onload = () => resolve(img);
            img.onerror = reject;
            img.src = URL.createObjectURL(file);
        });
    }

    calculateSize(img) {
        let { width, height } = img;
        
        if (width > this.maxWidth || height > this.maxHeight) {
            const ratio = Math.min(
                this.maxWidth / width,
                this.maxHeight / height
            );
            width = Math.round(width * ratio);
            height = Math.round(height * ratio);
        }

        return { width, height };
    }

    setQuality(quality) {
        this.quality = quality / 100;
    }
} 