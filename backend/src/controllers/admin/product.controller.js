const ProductService = require('../../services/product.service');
const fs = require('fs');
const path = require('path');
const { google } = require('googleapis');
exports.get = async (req, res, next) => {
    //logic idk
    try {
        res.status(200).json(await ProductService.get(req));
    } catch (err) {
        next(err);
    }
};

exports.addProduct = async (req, res, next) => {
    const tempDir = path.join(__dirname, '../../../uploads');
    try {
        const { images, ...productData } = req.body;
        let imageUrls = null;

        if (images?.length) {
            if (!fs.existsSync(tempDir)) {
                fs.mkdirSync(tempDir, { recursive: true });
            }

            const uploadedUrls = [];

            const auth = new google.auth.GoogleAuth({
                credentials: {
                    type: process.env.GCP_TYPE,
                    project_id: process.env.GCP_PROJECT_ID,
                    private_key_id: process.env.GCP_PRIVATE_KEY_ID,
                    private_key: process.env.GCP_PRIVATE_KEY,
                    client_email: process.env.GCP_CLIENT_EMAIL,
                    client_id: process.env.GCP_CLIENT_ID,
                    auth_uri: process.env.GCP_AUTH_URI,
                    token_uri: process.env.GCP_TOKEN_URI,
                    auth_provider_x509_cert_url: process.env.GCP_AUTH_PROVIDER_CERT_URL,
                    client_x509_cert_url: process.env.GCP_CLIENT_CERT_URL,
                    universe_domain: process.env.GCP_UNIVERSE_DOMAIN,
                },
                scopes: ['https://www.googleapis.com/auth/drive.file'],
            });

            const drive = google.drive({ version: 'v3', auth });
            const folder = await drive.files.create({
                requestBody: {
                    name: `Product/${productData.name}`,
                    mimeType: 'application/vnd.google-apps.folder',
                    parents: [process.env.BASE_FOLDER_ID],
                },
                fields: 'id',
            });

            for (let chunk of images) {
                try {
                    if (typeof chunk === 'string' && chunk.includes(';base64,')) {
                        const [header, base64Data] = chunk.split(';base64,');
                        const mimeType = header.replace('data:', '');
                        const buffer = Buffer.from(base64Data, 'base64');
                        const filePath = path.join(tempDir, `temp_${Date.now()}.jpg`);

                        await fs.promises.writeFile(filePath, buffer);

                        const response = await drive.files.create({
                            requestBody: {
                                name: `product_${Date.now()}.jpg`,
                                parents: [folder.data.id],
                            },
                            media: {
                                mimeType,
                                body: fs.createReadStream(filePath),
                            },
                            fields: 'id, webViewLink',
                        });

                        await drive.permissions.create({
                            fileId: response.data.id,
                            requestBody: {
                                role: 'reader',
                                type: 'anyone'
                            }
                        });

                        fs.unlinkSync(filePath);
                        uploadedUrls.push(response.data.webViewLink);
                    }
                } catch (chunkError) {
                    console.error('Error processing chunk:', chunkError);
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
    const tempDir = path.join(__dirname, '../../../uploads');
    try {
        const id = req.params.id;
        const { images, ...productData } = req.body;
        let imageUrls = null;

        if (images?.length) {
            if (!fs.existsSync(tempDir)) {
                fs.mkdirSync(tempDir, { recursive: true });
            }

            const uploadedUrls = [];

            const auth = new google.auth.GoogleAuth({
                credentials: {
                    type: process.env.GCP_TYPE,
                    project_id: process.env.GCP_PROJECT_ID,
                    private_key_id: process.env.GCP_PRIVATE_KEY_ID,
                    private_key: process.env.GCP_PRIVATE_KEY,
                    client_email: process.env.GCP_CLIENT_EMAIL,
                    client_id: process.env.GCP_CLIENT_ID,
                    auth_uri: process.env.GCP_AUTH_URI,
                    token_uri: process.env.GCP_TOKEN_URI,
                    auth_provider_x509_cert_url: process.env.GCP_AUTH_PROVIDER_CERT_URL,
                    client_x509_cert_url: process.env.GCP_CLIENT_CERT_URL,
                    universe_domain: process.env.GCP_UNIVERSE_DOMAIN,
                },
                scopes: ['https://www.googleapis.com/auth/drive.file'],
            });

            const drive = google.drive({ version: 'v3', auth });
            const folder = await drive.files.create({
                requestBody: {
                    name: `Product/${id}`,
                    mimeType: 'application/vnd.google-apps.folder',
                    parents: [process.env.BASE_FOLDER_ID],
                },
                fields: 'id',
            });

            for (let chunk of images) {
                try {
                    if (typeof chunk === 'string' && chunk.includes(';base64,')) {
                        const [header, base64Data] = chunk.split(';base64,');
                        const mimeType = header.replace('data:', '');
                        const buffer = Buffer.from(base64Data, 'base64');
                        const filePath = path.join(tempDir, `temp_${Date.now()}.jpg`);

                        await fs.promises.writeFile(filePath, buffer);

                        const response = await drive.files.create({
                            requestBody: {
                                name: `product_${Date.now()}.jpg`,
                                parents: [folder.data.id],
                            },
                            media: {
                                mimeType,
                                body: fs.createReadStream(filePath),
                            },
                            fields: 'id, webViewLink',
                        });

                        await drive.permissions.create({
                            fileId: response.data.id,
                            requestBody: {
                                role: 'reader',
                                type: 'anyone'
                            }
                        });

                        fs.unlinkSync(filePath);
                        uploadedUrls.push(response.data.webViewLink);
                    }
                } catch (chunkError) {
                    console.error('Error processing chunk:', chunkError);
                }
            }

            if (uploadedUrls.length) {
                imageUrls = `{${uploadedUrls.join(',')}}`;
            }
        }

        const updatedProduct = {
            id,
            ...productData,
            ...(imageUrls && { imageUrls }),
        };

        const result = await ProductService.editProductService(updatedProduct);
        
        if (fs.existsSync(tempDir)) {
            fs.rmSync(tempDir, { recursive: true });
        }
        
        return res.status(200).json({ message: 'Product updated successfully', data: result });
    } catch (err) {
        if (fs.existsSync(tempDir)) {
            fs.rmSync(tempDir, { recursive: true });
        }
        next(err);
    }
};

exports.getProduct = async (req, res, next) => {
    try {
        const id = req.params.id;

        const result = await ProductService.getProductById(id);
        res.status(200).json({
            message: result,
        });
    } catch (err) {
        next(err);
    }
};
