export const swaggerFixArray = (data) => {
    if (data === null || data === undefined) {
        return data;
    }

    if (!data) {
        return [];
    }

    return Array.isArray(data) ? data : data.split(',');
};

export function bytesToSize(bytes) {
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    if (bytes === 0) return '0 Byte';
    const i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)), 10);
    return `${Math.round(bytes / 1024 ** i, 2)} ${sizes[i]}`;
}

export function validateFiles(
    req,
    key,
    maxFiles,
    isRequired,
    acceptedFileTypes = ['image', 'video'],
    size = null
) {
    if (!req.files || !req.files[key]) {
        if (isRequired) {
            throw new BadRequest(`${key} is required`, 'VALIDATION_ERROR');
        }

        if (!req.files) {
            req.files = {};
        }

        req.files[key] = maxFiles === 1 ? null : [];
        return;
    }

    let accepted = {
        document: {
            size: (size ?? 25) * 1048576,
            types: [
                'application/pdf',
                'application/vnd.ms-excel',
                'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
                'application/msword',
                'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
            ],
        },
        image: {
            size: (size ?? 25) * 1048576,
            types: ['image/png', 'image/jpeg', 'image/jpg'],
        },
        'image:svg': {
            size: (size ?? 25) * 1048576,
            types: ['image/svg+xml'],
        },
    };

    // remove unwanted file types from accepted
    accepted = acceptedFileTypes.reduce((acc, fileType) => {
        acc[fileType] = accepted[fileType];
        return acc;
    }, {});

    const files = Array.isArray(req.files[key]) ? req.files[key] : [req.files[key]];
    if (maxFiles && files.length > maxFiles) {
        throw new BadRequest(`${key} should not be more than ${maxFiles}`, [], null);
    }

    files.forEach((file) => {
        const found = Object.values(accepted).find((v) => v.types.includes(file.mimetype));
        if (!found) {
            throw new BadRequest(`${key} is not valid`, 'VALIDATION_ERROR');
        }

        const { types, size } = found;
        if (!types.includes(file.mimetype)) {
            throw new BadRequest(`Format of ${key} is not accepted`, 'VALIDATION_ERROR');
        }

        if (file.size > size) {
            throw new BadRequest(
                `${file.name} should not be more than ${bytesToSize(size)}`,
                'VALIDATION_ERROR'
            );
        }
    });

    if (maxFiles !== 1) {
        req.files[key] = files;
    }
}
