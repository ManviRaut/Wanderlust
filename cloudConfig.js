const cloudinary = require('cloudinary').v2;
const {CloudinaryStorage} = require('multer-storage-cloudinary');

cloudinary.config(
    {
        cloud_name: process.env.CLOUD_NAME,
        api_key: process.env.CLOUDE_API_KEY,
        api_secret: process.env.CLOUDE_API_SECRET
    }
);

// const storage = new CloudinaryStorage({
//     cloudinary: cloudinary,
//     params: {
//         folder: 'wanderlust_DEV',
//         allowedFormats: ["png", "jpg", "jpeg"],

//     },
// });
// module.exports = {
//     cloudinary,
//     storage,
// }

const storage = new CloudinaryStorage({
    cloudinary,
    params: async (req, file) => {
        return {
            folder: 'wanderlust_DEV',
            resource_type: 'image',
            format: file.mimetype.split('/')[1], // auto-detect (jpg, png, etc.)
        };
    },
});

module.exports = {
    cloudinary,
    storage,
};
