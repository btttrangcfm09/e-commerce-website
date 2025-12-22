import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Upload, Trash2, AlertCircle } from 'lucide-react';
import { API_URL } from '@/utils/constants';

const MAX_FILES = 5;
const MAX_SIZE = 5 * 1024 * 1024;
const ACCEPTED_TYPES = ['image/jpeg', 'image/png', 'image/webp'];

const convertGoogleDriveUrl = (url) => {
    // Nếu là local URL (bắt đầu bằng /uploads), thêm backend URL
    if (url.startsWith('/uploads')) {
        const backendUrl = API_URL || 'http://localhost:3000';
        return `${backendUrl}${url}`;
    }
    // Nếu là Google Drive URL, convert
    try {
        const fileId = url.match(/\/d\/(.+?)\/view/)?.[1];
        if (!fileId) return url;
        return `https://drive.google.com/thumbnail?id=${fileId}&sz=w1000`;
    } catch {
        return url;
    }
};

export default function ProductImageUpload({ onChange, initialImages = [] }) {
    const [prevImages, setPrevImages] = useState([]);
    const [images, setImages] = useState([]);
    const [error, setError] = useState(null);
    
    useEffect(() => {
        if (Array.isArray(initialImages) && initialImages.length > 0) {
            // Nếu là array JavaScript thẳng, dùng trực tiếp
            const existingImages = initialImages
                .filter(url => url && typeof url === 'string')
                .map(url => ({
                    name: url.split('/').pop(),
                    preview: convertGoogleDriveUrl(url.trim()),
                    originalUrl: url.trim(),
                    isExisting: true
                }));
            setPrevImages(existingImages);
        }
    }, [initialImages]);
    

    const convertToBase64 = (file) => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result);
            reader.onerror = error => reject(error);
        });
    };
    
    const handleFileChange = async (e) => {
        const files = Array.from(e.target.files);
        
        if (files.some(file => !ACCEPTED_TYPES.includes(file.type))) {
            setError('Only JPG, PNG and WebP files are allowed');
            return;
        }
        
        if (files.some(file => file.size > MAX_SIZE)) {
            setError('Files must be under 5MB');
            return;
        }
        
        if (images.length + files.length > MAX_FILES) {
            setError(`Maximum ${MAX_FILES} images allowed`);
            return;
        }
        
        try {
            const base64Files = await Promise.all(
                files.map(async file => ({
                    name: file.name,
                    size: file.size,
                    type: file.type,
                    base64: await convertToBase64(file),
                    preview: URL.createObjectURL(file),
                    isExisting: false
                }))
            );
            
            const newImages = [...images, ...base64Files];
            setImages(newImages);
            onChange(newImages.map(img => img.isExisting ? img.originalUrl : img.base64));
            setError(null);
        } catch (err) {
            setError('Error processing images');
            console.error(err);
        }
    };
    
    const removeImage = (index) => {
        const newImages = images.filter((_, i) => i !== index);
        setImages(newImages);
        // Gộp prevImages và newImages để gửi lên parent
        const allImages = [
            ...prevImages.map(img => img.originalUrl),
            ...newImages.map(img => img.isExisting ? img.originalUrl : img.base64)
        ];
        onChange(allImages);
    };

    const removePrevImage = (index) => {
        const newPrevImages = prevImages.filter((_, i) => i !== index);
        setPrevImages(newPrevImages);
        // Gộp prevImages mới và images hiện tại để gửi lên parent
        const allImages = [
            ...newPrevImages.map(img => img.originalUrl),
            ...images.map(img => img.isExisting ? img.originalUrl : img.base64)
        ];
        onChange(allImages);
    };

    return (
        <div className="space-y-4">
            <div className="border-2 border-dashed rounded-lg p-6 text-center">
                <input
                    type="file"
                    multiple
                    accept=".jpg,.jpeg,.png,.webp"
                    onChange={handleFileChange}
                    className="hidden"
                    id="file-upload"
                />
                <label htmlFor="file-upload" className="cursor-pointer">
                    <Upload className="mx-auto h-12 w-12 text-gray-400" />
                    <p className="mt-2">Click to upload or drag and drop</p>
                    <p className="text-sm text-gray-500">JPG, PNG or WebP (max 5MB per file)</p>
                </label>
            </div>

            {error && (
                <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>{error}</AlertDescription>
                </Alert>
            )}

            {prevImages.length > 0 && (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {prevImages.map((file, index) => (
                        <Card key={index} className="relative">
                            <img
                                src={file.preview}
                                alt={`Preview ${index + 1}`}
                                className="w-full h-40 object-cover rounded-t-lg"
                            />
                            <div className="p-2 flex justify-between items-center">
                                <span className="text-sm truncate">{file.name}</span>
                                <Button 
                                    type="button"
                                    variant="destructive" 
                                    size="icon"
                                    onClick={() => removePrevImage(index)}
                                >
                                    <Trash2 className="h-4 w-4" />
                                </Button>
                            </div>                            
                        </Card>
                    ))}
                </div>
            )}

            {images.length > 0 && (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {images.map((file, index) => (
                        <Card key={index} className="relative">
                            <img
                                src={file.preview}
                                alt={`Preview ${index + 1}`}
                                className="w-full h-40 object-cover rounded-t-lg"
                            />
                            <div className="p-2 flex justify-between items-center">
                                <span className="text-sm truncate">{file.name}</span>
                                <Button 
                                    type="button"
                                    variant="destructive" 
                                    size="icon"
                                    onClick={() => removeImage(index)}
                                >
                                    <Trash2 className="h-4 w-4" />
                                </Button>
                            </div>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    );
}