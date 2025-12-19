const { productUpload, upload } = require('../config/multer');

function checkFileUpload(req, res, next) {
    return productUpload.array('images')(req, res, next); // 'images' là trường trong formData của client
}

const { google } = require('googleapis');
const fs = require('fs');

async function getOrCreateUserFolder(drive, userId) {
    const userFolderPath = `User/${userId}`;
    const folders = userFolderPath.split('/');
    let parentId = process.env.BASE_FOLDER_ID;

    for (const folder of folders) {
        const response = await drive.files.list({
            q: `name='${folder}' and mimeType='application/vnd.google-apps.folder' and '${parentId}' in parents`,
            fields: 'files(id)',
        });

        if (response.data.files.length > 0) {
            parentId = response.data.files[0].id;
        } else {
            const folderMetadata = {
                name: folder,
                mimeType: 'application/vnd.google-apps.folder',
                parents: [parentId],
            };
            const newFolder = await drive.files.create({
                requestBody: folderMetadata,
                fields: 'id',
            });
            parentId = newFolder.data.id;
        }
    }
    return parentId;
}

const uploadProfileImage = async (req, res, next) => {
    try {
        upload.single('image')(req, res, async (err) => {
            if (err) {
                return res.status(400).json({ error: err.message });
            }

            if (!req.file) {
                delete req.body.image;
                return next();
            }

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
            const userFolderId = await getOrCreateUserFolder(drive, req.user.userId);

            const response = await drive.files.create({
                requestBody: {
                    name: `profile_${Date.now()}_${req.file.originalname}`,
                    parents: [userFolderId],
                },
                media: {
                    mimeType: req.file.mimetype,
                    body: fs.createReadStream(req.file.path),
                },
                fields: 'id, webViewLink',
            });

            fs.unlinkSync(req.file.path);
            req.body.image = response.data.webViewLink;
            next();
        });
    } catch (error) {
        return res.status(500).json({ error: 'Failed to upload image' });
    }
};

module.exports = { uploadProfileImage, checkFileUpload };
