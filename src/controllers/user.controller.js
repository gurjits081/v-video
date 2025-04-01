import { asyncHandler } from "../utils/asyncHandler.js";
import { APIError } from "../utils/APIError.js";
import { User } from "../models/user.models.js"
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { APIResponse } from "../utils/APIResponse.js";

const registerUser = asyncHandler( async (req, res) => {
    // get user details frontend
    // validation - not empty || to be improved later
    // check if user already exists: username, email
    // check for images, check for avatar
    // upload them to cloudinary, avatar
    // create user object - create entry in db
    // remove password and refresh token field from response
    // check for user creation
    // return response
    const { fullName, email, username, password } = req.body;
    console.log(password, email);
    // TOBE: Better validation handling
    if(
        [fullName, email, username, password].some((field) => field?.trim() === "")
    ){
        throw new APIError(400, "All fields are required!")
    }

    const existedUser = User.findOne({
        $or: [{ username }, { email }]
    })

    if(existedUser) {
        throw new APIError(409, "User with email or username already exists")
    }

    const avatarLocalPath = req.files?.avatar[0]?.path;
    const coverImageLocalPath = req.files?.files?.coverImage[0]?.path;
    if(!avatarLocalPath) {
        throw new APIError(400, "Avatar file is required")
    }

    const avatar = await uploadOnCloudinary(avatarLocalPath);
    const coverImage = await uploadOnCloudinary(coverImageLocalPath);

    if(!avatar) {
        throw new APIError(500, "Avatar upload failed")
    }

    const user = await User.create({
            fullName,
            avatar: avatar.url,
            coverImage: coverImage?.url || "",
            email,
            password,
            username: username.toLowerCase()
        })
    
    const createdUser = await User.findById(user._id).select(
        "-password -refreshToken"
    )

    if(!createdUser) {
        throw new APIError(500, "Something went wrong while registering a user")
    }

    return res.status(201).json(
        new APIResponse(200, createdUser, "User registered successfully")
    )
} )

export { registerUser }
