
const User = require('../models/User');
const BaseController = require('../controllers/base.ctrl');



class AuthController extends BaseController {
    constructor() {
        super()
    }

      async authenticateUser(req, res, next) {
        try {
            if (!req.headers || !req.headers.token ) {
                return super.sendError(res, null, 'You do not have access to this resource', 401);
            }
            let { token } = req.headers
            const username = super.verifyToken(token).username;
            const user = await User.findOne({username});
            if (!user) {
                return super.sendError(res, null, 'You do not have access to this resource', 401);
            }
    
            req.user = user;
            next();
        } catch (err) {
            return super.sendError(res, err, err.message, err.status);
        }
    }

}

module.exports = new AuthController();