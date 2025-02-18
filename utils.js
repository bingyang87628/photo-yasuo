const utils = {
    /**
     * 格式化文件大小
     * @param {number} bytes - 字节数
     * @returns {string} - 格式化后的大小
     */
    formatFileSize(bytes) {
        if (bytes === 0) return '0 B';
        const k = 1024;
        const sizes = ['B', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return (bytes / Math.pow(k, i)).toFixed(2) + ' ' + sizes[i];
    },

    /**
     * 生成下载文件名
     * @param {string} originalName - 原始文件名
     * @returns {string} - 新文件名
     */
    generateFileName(originalName) {
        const ext = originalName.split('.').pop();
        const name = originalName.replace(`.${ext}`, '');
        return `${name}_compressed.${ext}`;
    },

    /**
     * 下载Blob文件
     * @param {Blob} blob - 文件blob
     * @param {string} fileName - 文件名
     */
    downloadBlob(blob, fileName) {
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = fileName;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }
}; 