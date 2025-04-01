import { v2 as cloudinary } from 'cloudinary';
import fs from 'fs';
import "dotenv/config";

cloudinary.config({ 
    cloud_name: process.env.CLOUDINARY_NAME, 
    api_key: process.env.CLOUDINARY_API_KEY, 
    api_secret: process.env.CLOUDINARY_SECRET_KEY
});

const uploadOnCloudinary = async (localFilePath) => {
    try {
        if(!localFilePath) return null;
        // upload the file on cloudinary
        const response = await cloudinary.uploader.upload(localFilePath, {
            resource_type: 'auto'
        })
        // file has been uploaded successfully
        fs.unlinkSync(localFilePath)
        return response;
    } catch (error) {
        console.log("Cloudinary Error: ", error)
        fs.unlinkSync(localFilePath) // remove the locally saved temporary file as the uplaod operation got failed
        return null;
    }
}


export { uploadOnCloudinary }
