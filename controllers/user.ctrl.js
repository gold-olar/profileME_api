
const User = require('../models/User');
const BaseController = require('./base.ctrl');
const cloudinary = require('cloudinary');


cloudinary.config({ 
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
    api_key: process.env.CLOUDINARY_API_KEY, 
    api_secret: process.env.CLOUDINARY_API_SECRET 
});
const Cloudinary_options = { folder: 'profileME' };



class UserController extends BaseController {
    constructor() {
        super()
    }

    async create(req, res) {
        super.checkReqBody(req);
        try {
            const { username, email,  password } = req.body;
            const existingUser = await User.findOne({ username });
            const existingEmail = await User.findOne({ email });
            if (existingEmail)
                return super.sendError(res, null, 'A user with this email already exists', 400);
            if (existingUser)
                return super.sendError(res, null, 'A user already exists with the same username', 400);

            const userParams = { username, email, password };
            const newUser = new User(userParams);
            let savedUser = await newUser.save();
            let tokenData = { userId: savedUser._id, username: savedUser.username }
            let token = super.generateToken(tokenData);
            savedUser = { token, user: savedUser }
            return super.sendSuccess(res, savedUser);
        } catch (err) {
            return super.sendError(res, err, err.message, err.status);
        }
    }

    async login(req, res) {
        super.checkReqBody(req);
        try {
            const { email, password } = req.body;
            let userInDb = await User.findOne({ email });
            if (userInDb) {
                const isPasswordCorrect = super.comparePassword(password, userInDb.password);
                if (!isPasswordCorrect) {
                    return super.sendError(res, null, 'Incorrect  password', 400);
                }
                let tokenData = { userId: userInDb._id, username: userInDb.username };
                const token = super.generateToken(tokenData);
                userInDb = { token, user: userInDb }
                return super.sendSuccess(res, userInDb);
            }

            return super.sendError(res, null, 'Email not found, Please register first. ', 400);
        } catch (err) {
            return super.sendError(res, err, err.message, err.status);
        }
    }


    async addUserDetails(req, res) {
        const { username } = req.user;
        const {introduction, whatYouDo, facebook, twitter, github, linkedin, 
            image, behance, dribble      } = req.body;
            try {
         const UserProfile = await User.findOne({username});
         if(!UserProfile){
            return super.sendError(res, null, 'Details upload failed because User was not found.', 400);
         }
         const imageUrl = await  cloudinary.v2.uploader.upload(image, Cloudinary_options, (err, result) => {
             if (err) {
                 throw err;
             }
             return result.url;
         });


         UserProfile.introduction = introduction;
         UserProfile.whatYouDo = whatYouDo;
         UserProfile.facebook = facebook;
         UserProfile.twitter = twitter;
         UserProfile.image = imageUrl.url;
         UserProfile.behance = behance;
         UserProfile.github = github;
         UserProfile.dribble = dribble;
         UserProfile.linkedin = linkedin;
         
         await UserProfile.save();


           return super.sendSuccess(res, UserProfile, "Updated Successfully.", 200); 
        } catch (err) {
            return super.sendError(res, err, err.message, err.status);
        }
    }

    async getUserByUsername(req, res) {
        const username = req.params.username;
        try {
            const user = await User.findOne({ username });
            if (!user) {
                return super.sendError(res, null, 'User not found', 404);
            }
            return super.sendSuccess(res, user, 'Successful');
        } catch (err) {
            return super.sendError(res, err, err.message, err.status);
        }
    }
}

module.exports = new UserController();