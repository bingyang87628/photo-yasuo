# Image Compressor

一个纯前端的图片压缩工具,无需后端服务即可实现图片压缩功能。

## 在线预览

👉 [立即体验](https://bingyang87628.github.io/photo-yasuo)

![预览图](docs/preview.png)

## 特性

- 🚀 纯浏览器端压缩,无需上传服务器
- 💪 支持批量处理多张图片
- 🎨 实时预览压缩效果
- 📊 显示压缩前后对比数据
- 📱 响应式设计,完美支持移动端
- 🔧 提供压缩质量调节
- 💾 一键下载压缩后的图片
- 📦 支持离线使用

## 详细说明

### 支持的图片格式

- JPG/JPEG
- PNG
- WebP
- BMP

### 压缩参数

- 质量: 0-100
- 最大尺寸: 1920x1080
- 输出格式: JPEG

### 注意事项

- 所有操作均在浏览器本地完成,不会上传图片到服务器
- 建议使用现代浏览器以获得最佳体验
- 过大的图片可能会导致浏览器性能问题

## 开发相关

### 本地开发

```bash
# 克隆项目
git clone https://github.com/bingyang87628/photo-yasuo.git

# 进入项目目录
cd photo-yasuo

# 使用 Live Server 或其他方式启动
```

### 技术栈

- 原生 JavaScript (ES6+)
- HTML5 Canvas API
- File API
- Drag & Drop API

### 贡献代码

1. Fork 本仓库
2. 创建新的功能分支
3. 提交你的修改
4. 创建 Pull Request

## 更新日志

### v1.0.0 (2024-03-xx)

- 🎉 首次发布
- ✨ 支持拖拽上传
- 🔧 支持质量调节
- 📊 显示压缩效果对比

## License

MIT