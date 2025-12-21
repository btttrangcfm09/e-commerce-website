const ProductRepository = require('../repositories/product.repository');
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
    /**
     * Get products with filters, pagination and sorting
     * Business logic layer that uses repository
     */
    static async get(req) {
        try {
            const filters = {
                search: req.query.search || null,
                categoryId: req.query.categoryId ? parseInt(req.query.categoryId) : null,
                minPrice: req.query.minPrice ? parseFloat(req.query.minPrice) : null,
                maxPrice: req.query.maxPrice ? parseFloat(req.query.maxPrice) : null,
                includeInactive: req.query.includeInactive === 'true',
                page: req.query.page ? parseInt(req.query.page) : 1,
                pageSize: req.query.pageSize ? parseInt(req.query.pageSize) : 10,
                sortBy: req.query.sortBy || 'id',
                sortOrder: req.query.sortOrder || 'asc',
            };

            // Validate business rules
            if (filters.minPrice !== null && filters.minPrice < 0) {
                throw new Error('Minimum price cannot be negative');
            }

            if (filters.maxPrice !== null && filters.maxPrice < 0) {
                throw new Error('Maximum price cannot be negative');
            }

            if (filters.minPrice !== null && filters.maxPrice !== null && filters.minPrice > filters.maxPrice) {
                throw new Error('Minimum price cannot be greater than maximum price');
            }

            if (filters.page < 1) {
                throw new Error('Page must be greater than 0');
            }

            if (filters.pageSize < 1 || filters.pageSize > 100) {
                throw new Error('Page size must be between 1 and 100');
            }

            // Get products from repository
            const products = await ProductRepository.findAll(filters);

            // Format response
            return {
                products: products,
                pagination: {
                    page: filters.page,
                    pageSize: filters.pageSize,
                    total: products.length > 0 ? parseInt(products[0].total_count) : 0,
                    totalPages: products.length > 0 ? Math.ceil(parseInt(products[0].total_count) / filters.pageSize) : 0,
                },
            };
        } catch (err) {
            throw new Error('Error fetching products: ' + err.message);
        }
    }

    /**
     * Get products by category
     */
    static async getProductsByCategory(categoryId, options = {}) {
        try {
            const filters = {
                ...options,
                categoryId: parseInt(categoryId),
            };

            const products = await ProductRepository.findAll(filters);
            
            return {
                products,
                totalCount: products.length > 0 ? parseInt(products[0].total_count) : 0,
            };
        } catch (err) {
            throw new Error('Error fetching products by category: ' + err.message);
        }
    }

    /**
     * Get product by ID
     */
    static async getProductById(productId) {
        try {
            const product = await ProductRepository.findById(parseInt(productId));
            
            if (!product) {
                throw new Error('Product not found');
            }
            
            return product;
        } catch (err) {
            throw new Error('Error fetching product by ID: ' + err.message);
        }
    }

    /**
     * Add new product with validation
     */
    static async addNewProductService(productData) {
        try {
            const { name, description, price, stock, categoryId, imageUrls } = productData;

            // Validate required fields
            if (!name || !description || price == null || stock == null || !categoryId) {
                throw new Error('Missing required fields: name, description, price, stock, categoryId');
            }

            // Validate business rules
            if (price < 0) {
                throw new Error('Price cannot be negative');
            }

            if (stock < 0) {
                throw new Error('Stock cannot be negative');
            }

            if (name.trim().length < 3) {
                throw new Error('Product name must be at least 3 characters');
            }

            if (description.trim().length < 10) {
                throw new Error('Product description must be at least 10 characters');
            }

            // Create product
            const result = await ProductRepository.create({
                name: name.trim(),
                description: description.trim(),
                price: parseFloat(price),
                stock: parseInt(stock),
                categoryId: parseInt(categoryId),
                imageUrls: imageUrls || null,
            });

            return result;
        } catch (err) {
            throw err;
        }
    }

    /**
     * Update product with validation
     */
    static async editProductService(updatedProductData) {
        try {
            const { id, name, description, price, stock, categoryId, imageUrls } = updatedProductData;

            if (!id) {
                throw new Error('Product ID is required');
            }

            // Check if product exists
            const exists = await ProductRepository.exists(parseInt(id));
            if (!exists) {
                throw new Error('Product not found');
            }

            // Validate business rules if values are provided
            if (price !== null && price !== undefined && price < 0) {
                throw new Error('Price cannot be negative');
            }

            if (stock !== null && stock !== undefined && stock < 0) {
                throw new Error('Stock cannot be negative');
            }

            if (name && name.trim().length < 3) {
                throw new Error('Product name must be at least 3 characters');
            }

            if (description && description.trim().length < 10) {
                throw new Error('Product description must be at least 10 characters');
            }

            // Update product
            const result = await ProductRepository.update(parseInt(id), {
                name: name ? name.trim() : null,
                description: description ? description.trim() : null,
                price: price !== null && price !== undefined ? parseFloat(price) : null,
                stock: stock !== null && stock !== undefined ? parseInt(stock) : null,
                categoryId: categoryId ? parseInt(categoryId) : null,
                imageUrls: imageUrls || null,
            });

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
