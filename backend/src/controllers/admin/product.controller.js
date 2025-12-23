const ProductService = require('../../services/product.service');
const fs = require('fs');
const path = require('path');
exports.get = async (req, res, next) => {
    try {
        // Nếu có query ?id= thì lấy product theo id
        if (req.query.id) {
            const product = await ProductService.getProductById(req.query.id);
            return res.status(200).json([product]); // Trả về array để frontend xử lý consistent
        }
        // Không thì lấy list products
        res.status(200).json(await ProductService.get(req));
    } catch (err) {
        next(err);
    }
};

exports.addProduct = async (req, res, next) => {
    const uploadDir = path.join(__dirname, '../../../uploads/products');
    try {
        const { images, ...productData } = req.body;
        let imageUrls = null;

        if (images?.length) {
            // Tạo thư mục nếu chưa tồn tại
            if (!fs.existsSync(uploadDir)) {
                fs.mkdirSync(uploadDir, { recursive: true });
            }

            const uploadedUrls = [];

            for (let imageData of images) {
                try {
                    if (typeof imageData === 'string' && imageData.includes(';base64,')) {
                        const [header, base64Data] = imageData.split(';base64,');
                        const mimeType = header.replace('data:', '');
                        const extension = mimeType.split('/')[1] || 'jpg';
                        const buffer = Buffer.from(base64Data, 'base64');
                        
                        // Tạo tên file unique
                        const fileName = `product_${Date.now()}_${Math.random().toString(36).substring(7)}.${extension}`;
                        const filePath = path.join(uploadDir, fileName);

                        // Lưu file vào local storage
                        await fs.promises.writeFile(filePath, buffer);

                        // Tạo URL path cho database (để frontend có thể access qua /uploads/products/...)
                        const imageUrl = `/uploads/products/${fileName}`;
                        uploadedUrls.push(imageUrl);
                    }
                } catch (chunkError) {
                    console.error('Error processing image:', chunkError);
                }
            }

            if (uploadedUrls.length) {
                imageUrls = `{${uploadedUrls.join(',')}}`;
            }
        }

        const addedProduct = {
            ...productData,
            ...(imageUrls && { imageUrls }),
        };

        const { id, name, price } = await ProductService.addNewProductService(addedProduct);
        return res.status(200).json({
            message: `Added new product named ${name} !`,
        });
    } catch (err) {
        next(err);
    }
};

exports.editProduct = async (req, res, next) => {
    const uploadDir = path.join(__dirname, '../../../uploads/products');
    try {
        const id = req.params.id;
        const { images, ...productData } = req.body;

        const updatedProduct = {
            id,
            ...productData,
        };

        // Chỉ xử lý upload ảnh mới khi có images trong request
        if (images?.length) {
            // Tạo thư mục nếu chưa tồn tại
            if (!fs.existsSync(uploadDir)) {
                fs.mkdirSync(uploadDir, { recursive: true });
            }

            const uploadedUrls = [];

            for (let imageData of images) {
                try {
                    if (typeof imageData === 'string' && imageData.includes(';base64,')) {
                        const [header, base64Data] = imageData.split(';base64,');
                        const mimeType = header.replace('data:', '');
                        const extension = mimeType.split('/')[1] || 'jpg';
                        const buffer = Buffer.from(base64Data, 'base64');
                        
                        // Tạo tên file unique
                        const fileName = `product_${Date.now()}_${Math.random().toString(36).substring(7)}.${extension}`;
                        const filePath = path.join(uploadDir, fileName);

                        // Lưu file vào local storage
                        await fs.promises.writeFile(filePath, buffer);

                        // Tạo URL path cho database
                        const imageUrl = `/uploads/products/${fileName}`;
                        uploadedUrls.push(imageUrl);
                    }
                } catch (chunkError) {
                    console.error('Error processing image:', chunkError);
                }
            }

            // Chỉ update imageUrls khi có ảnh mới được upload thành công
            if (uploadedUrls.length) {
                updatedProduct.imageUrls = `{${uploadedUrls.join(',')}}`;
            }
        }
        // Nếu không có images → giữ nguyên ảnh cũ (không gửi imageUrls field)

        const result = await ProductService.editProductService(updatedProduct);
        
        return res.status(200).json({ message: 'Product updated successfully', data: result });
    } catch (err) {
        next(err);
    }
};

exports.deleteProduct = async (req, res, next) => {
    try {
        const id = req.params.id;
        const adminId = req.user.userId; // Get admin ID from auth middleware
        const { hardDelete = false } = req.query; // Optional hard delete flag

        // Validate product ID
        if (!id || isNaN(parseInt(id))) {
            return res.status(400).json({
                error: 'Invalid product ID'
            });
        }

        // Delete product (soft delete by default)
        const result = await ProductService.deleteProductService(
            parseInt(id), 
            hardDelete === 'true',
            adminId
        );
        
        return res.status(200).json({
            message: `Product ${result.deletion_type === 'SOFT_DELETE' ? 'deactivated' : 'deleted'} successfully`,
            data: result
        });
    } catch (err) {
        next(err);
    }
};
