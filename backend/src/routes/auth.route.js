const authController = require('../controller/auth.controller');
const authUser = require('../middleware/auth.middleware');

const { Router } = require('express');
const authRouter = Router();


//login and register routes
authRouter.post('/register', authController.register);
authRouter.post('/login', authController.login);

// logged in user details
authRouter.get('/get-me',authUser, authController.getMe);

// logout route
authRouter.post('/logout',authController.logout)


module.exports = authRouter;
