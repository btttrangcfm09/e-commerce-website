const Product = require('../models/Product');
const { google } = require('googleapis');
const path = require('path');
const crypto = require('crypto');
const fs = require('fs');
require('dotenv').config();
const auth = new google.auth.GoogleAuth({
    keyFile: process.env.JSON_FILE,
    scopes: ['https://www.googleapis.com/auth/drive.file'],
});

const drive = google.drive({ version: 'v3', auth });

async function createOrGetFolder(folderName, parentId) {
    const query = parentId
        ? `name='${folderName}' and mimeType='application/vnd.google-apps.folder' and '${parentId}' in parents`
        : `name='${folderName}' and mimeType='application/vnd.google-apps.folder'`;

    const response = await drive.files.list({
        q: query,
        fields: 'files(id, name)',
    });

    if (response.data.files.length > 0) {
        return response.data.files[0].id;
    }

    const folderMetadata = {
        name: folderName,
        mimeType: 'application/vnd.google-apps.folder',
        ...(parentId && { parents: [parentId] }),
    };

    const folder = await drive.files.create({
        requestBody: folderMetadata,
        fields: 'id',
    });

    return folder.data.id;
}

async function createNestedFolders(path, baseId) {
    const folders = path.split('/').filter(Boolean);
    let currentParentId = baseId;

    for (const folder of folders) {
        currentParentId = await createOrGetFolder(folder, currentParentId);
    }

    return currentParentId;
}

class ProductService {
    // Lấy danh sách toàn bộ sản phẩm (bao gồm các tiêu chí tìm kiếm, phân trang, sắp xếp)
    static async get(req) {
        try {
            return await Product.get(req);
        } catch (err) {
            throw new Error('Error fetching all products: ' + err.message);
        }
    }

    // Lấy danh sách sản phẩm theo danh mục
    static async getProductsByCategory(categoryId, options = {}) {
        try {
            const { products, totalCount } = await Product.get({
                ...options,
                categoryId,
            });
            return { products, totalCount };
        } catch (err) {
            throw new Error('Error fetching products by category: ' + err.message);
        }
    }

    // Lấy thông tin chi tiết của một sản phẩm theo ID
    static async getProductById(productId) {
        try {
            const product = await Product.getById(productId);
            if (!product) {
                throw new Error('Product not found');
            }
            return product;
        } catch (err) {
            throw new Error('Error fetching product by ID: ' + err.message);
        }
    }
    static async addNewProductService(productData) {
        try {
            const result = await Product.addNewProduct(productData);
            return result;
        } catch (err) {
            throw err;
        }
    }

    static async editProductService(updatedProductData) {
        try {
            const result = await Product.updateProduct(updatedProductData);
            return result;
        } catch (err) {
            throw err;
        }
    }

    static async addProductImageService(req) {
        const BASE_FOLDER_ID = process.env.BASE_FOLDER_ID;
        const folderPath = `Products/${crypto.randomBytes(32).toString('hex')}`;
        const finalFolderId = await createNestedFolders(folderPath, BASE_FOLDER_ID);

        const uploadResults = await Promise.all(
            req.files.map(async (file) => {
                const response = await drive.files.create({
                    requestBody: {
                        name: `product_${crypto.randomBytes(32).toString('hex')}${path.extname(file.originalname)}`,
                        parents: [finalFolderId],
                    },
                    media: {
                        mimeType: file.mimetype,
                        body: fs.createReadStream(file.path),
                    },
                    fields: 'id, webViewLink',
                });

                fs.unlinkSync(file.path);
                return {
                    name: file.originalname,
                    fileId: response.data.id,
                    url: response.data.webViewLink,
                };
            })
        );
        return uploadResults;
    }
}
module.exports = ProductService;
