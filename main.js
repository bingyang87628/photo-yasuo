document.addEventListener('DOMContentLoaded', () => {
    const dropZone = document.getElementById('dropZone');
    const fileInput = document.getElementById('fileInput');
    const qualityInput = document.getElementById('quality');
    const qualityValue = document.getElementById('qualityValue');
    const previewContainer = document.getElementById('previewContainer');
    const downloadAllBtn = document.getElementById('downloadAll');

    const compressor = new ImageCompressor();
    const processedImages = new Map(); // 存储处理后的图片
    const originalFiles = new Map(); // 存储原始文件

    // 存储 blob URLs 以便及时释放
    const blobUrls = new Set();

    /**
     * 创建并跟踪 Blob URL
     * @param {Blob} blob - Blob 对象
     * @returns {string} - Blob URL
     */
    function createBlobUrl(blob) {
        const url = URL.createObjectURL(blob);
        blobUrls.add(url);
        return url;
    }

    /**
     * 释放所有已创建的 Blob URLs
     */
    function releaseAllBlobUrls() {
        blobUrls.forEach(url => {
            URL.revokeObjectURL(url);
        });
        blobUrls.clear();
    }

    // 更新质量显示并重新压缩所有图片
    qualityInput.addEventListener('input', async (e) => {
        const quality = e.target.value;
        qualityValue.textContent = `${quality}%`;
        
        // 重新压缩所有图片
        await recompressAllImages(quality / 100);
    });

    // 处理拖拽事件
    dropZone.addEventListener('dragover', (e) => {
        e.preventDefault();
        dropZone.classList.add('drag-over');
    });

    dropZone.addEventListener('dragleave', () => {
        dropZone.classList.remove('drag-over');
    });

    dropZone.addEventListener('drop', (e) => {
        e.preventDefault();
        dropZone.classList.remove('drag-over');
        handleFiles(e.dataTransfer.files);
    });

    // 处理文件选择
    fileInput.addEventListener('change', (e) => {
        handleFiles(e.target.files);
    });

    // 下载所有压缩图片
    downloadAllBtn.addEventListener('click', () => {
        processedImages.forEach((blob, fileName) => {
            utils.downloadBlob(blob, utils.generateFileName(fileName));
        });
    });

    /**
     * 重新压缩所有图片
     * @param {number} quality - 压缩质量 0-1
     */
    async function recompressAllImages(quality) {
        const previews = document.querySelectorAll('.preview-item');
        
        // 释放之前的 Blob URLs
        releaseAllBlobUrls();
        
        for (const preview of previews) {
            const fileName = preview.dataset.fileName;
            const originalFile = originalFiles.get(fileName);
            
            if (originalFile) {
                try {
                    // 重新压缩
                    const newBlob = await compressor.compress(originalFile, { quality });
                    
                    // 更新预览图
                    const compressedImage = preview.querySelector('.compressed-image');
                    const newUrl = createBlobUrl(newBlob);
                    
                    // 确保图片加载完成后再更新其他信息
                    await new Promise((resolve) => {
                        compressedImage.onload = resolve;
                        compressedImage.src = newUrl;
                    });
                    
                    // 更新信息
                    const compressedSize = preview.querySelector('.compressed-size');
                    const compressionRatio = preview.querySelector('.compression-ratio');
                    compressedSize.textContent = `压缩后: ${utils.formatFileSize(newBlob.size)}`;
                    compressionRatio.textContent = `压缩率: ${((originalFile.size - newBlob.size) / originalFile.size * 100).toFixed(1)}%`;
                    
                    // 更新存储的压缩结果
                    processedImages.set(fileName, newBlob);
                } catch (error) {
                    console.error('重新压缩失败:', error);
                }
            }
        }
    }

    /**
     * 处理图片文件
     * @param {FileList} files - 文件列表
     */
    async function handleFiles(files) {
        const imageFiles = Array.from(files).filter(file => file.type.startsWith('image/'));
        
        if (imageFiles.length === 0) {
            alert('请选择图片文件！');
            return;
        }

        downloadAllBtn.disabled = true;
        
        // 并行处理所有图片
        await Promise.all(imageFiles.map(file => processImage(file)));
        
        downloadAllBtn.disabled = false;
    }

    /**
     * 处理单个图片
     * @param {File} file - 图片文件
     */
    async function processImage(file) {
        // 创建预览元素
        const previewItem = document.createElement('div');
        previewItem.className = 'preview-item';
        previewItem.dataset.fileName = file.name;
        previewContainer.appendChild(previewItem);

        // 存储原始文件
        originalFiles.set(file.name, file);

        try {
            // 创建原图预览
            const originalUrl = createBlobUrl(file);

            // 初始压缩
            const quality = qualityInput.value / 100;
            const compressedBlob = await compressor.compress(file, { quality });
            const compressedUrl = createBlobUrl(compressedBlob);

            // 等待图片加载完成
            await Promise.all([
                new Promise(resolve => {
                    const img = new Image();
                    img.onload = resolve;
                    img.src = originalUrl;
                }),
                new Promise(resolve => {
                    const img = new Image();
                    img.onload = resolve;
                    img.src = compressedUrl;
                })
            ]);

            // 更新预览内容
            previewItem.innerHTML = `
                <div class="image-comparison">
                    <div>
                        <h4>原图</h4>
                        <img src="${originalUrl}" alt="原图 - ${file.name}">
                    </div>
                    <div>
                        <h4>压缩后</h4>
                        <img src="${compressedUrl}" alt="压缩后 - ${file.name}" class="compressed-image">
                    </div>
                </div>
                <div class="image-info">
                    <p>文件名: ${file.name}</p>
                    <p>原始大小: ${utils.formatFileSize(file.size)}</p>
                    <p class="compressed-size">压缩后: ${utils.formatFileSize(compressedBlob.size)}</p>
                    <p class="compression-ratio">压缩率: ${((file.size - compressedBlob.size) / file.size * 100).toFixed(1)}%</p>
                    <button onclick="utils.downloadBlob(processedImages.get('${file.name}'), '${utils.generateFileName(file.name)}')">
                        下载此图片
                    </button>
                </div>
            `;

            // 存储压缩结果
            processedImages.set(file.name, compressedBlob);
        } catch (error) {
            console.error('处理图片失败:', error);
            previewItem.innerHTML = `
                <div class="error-message">
                    处理图片 ${file.name} 失败: ${error.message}
                </div>
            `;
        }
    }

    // 页面卸载时清理资源
    window.addEventListener('beforeunload', () => {
        releaseAllBlobUrls();
    });
}); 