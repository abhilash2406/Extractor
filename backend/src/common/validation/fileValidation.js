import path from 'path';
import BadRequest from '../exception/badRequest.js';

const fileValidation = ({
    file, // Single file or array of files
    allowedTypes, // Array of allowed file types
    maxSizeMB, // Max file size in megabytes
    required = false, // Whether the file is required or not
    maxFiles, // Max number of files allowed
}) => {
    if (required && !file) throw new BadRequest('File is required');

    const files = Array.isArray(file) ? file : [file];

    const maxSize = maxSizeMB * 1024 * 1024;
    if (maxFiles && files?.length > maxFiles) {
        throw new BadRequest(`Only up to ${maxFiles} file(s) are allowed`);
    }

    files?.forEach((f) => {
        if (f?.size > maxSize) {
            throw new BadRequest(`File exceeds maximum size of ${maxSizeMB} MB`);
        }

        const fileType = f?.mimetype || path.extname(f?.originalname).toLowerCase();
        if (!allowedTypes.includes(fileType)) {
            throw new BadRequest(
                `Invalid file type. Allowed types are: ${allowedTypes?.join(', ')}`
            );
        }
    });
};

export default fileValidation;
