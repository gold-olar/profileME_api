const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/User');

  



let jwtSecret = process.env.JWTSECRET;

class BaseController {    
    constructor(){
    }
    /**
     * send success 
     * @param res
     * @param data
     * @param message
     * @param token
     * @param status
     * @param header
     */

    sendSuccess(res, data, message, status, header) {
        let resp = { status: true, };

        if (message)
            resp.message = message;

        if (data || data === [] || data === {})
            resp.data = data;

        status = status ? status : 200;
        resp.HttpStatus = status;        

        if (header) return res.header(header, token).status(status).json(resp);

        return res.status(status).json(resp);
    }

    /**
     *  send error 
     * @param res
     * @param message
     * @param error
     * @param status
     */
    sendError(res, error, message, status, HttpStatus) {
        let resp = { status: false };
        resp.message = message ? message : 'An error has occurred, please try again';

        if (error)
            resp.error = error.stack;

        status = status ? status : 500;
        resp.HttpStatus = HttpStatus; 

        return res.status(status).json(resp);
    }

    checkReqBody(req) {
        if (!req || !req.body) {
            this.sendError(res, null, 'Request body should not be empty', 400);
        }
    }

    generateToken(userObject) {
        return jwt.sign(userObject, jwtSecret);
    }
    
    verifyToken(token) {
        return jwt.verify(token, jwtSecret);
    }

    async comparePassword(password, hash) {
        return bcrypt.compare(password, hash, (err, isMatch) => {
            if (err) {
                throw err;
            }
            return isMatch;
        });
    }

    // async imageUploader(image) {
    //     const options = { folder: 'profileME' };
    //     cloudinary.v2.uploader.upload(image, options, (err, result) => {
    //         if (err) {
    //             throw err;
    //         }

           
    //         return result.url;
    //     });
    // }
}





module.exports = BaseController
