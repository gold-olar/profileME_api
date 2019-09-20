const express = require('express');
const router = express.Router();
const UserController = require('../controllers/user.ctrl');
const auth = require('../services/auth');



router.get('/', (req, res) => {
    res.status(200).json({
        message: 'Welcome to Profile Me API...'
    });
});


router.post('/register', UserController.create );


router.post('/login', UserController.login);


router.put('/editProfile', auth.authenticateUser,  UserController.addUserDetails);


router.get('/:username', UserController.getUserByUsername);




module.exports = router;