const authController = require('../controllers/index');
const Router = require('express').Router();
Router.get('/', authController.showRegistrationPage);
Router.post('/register', authController.registerUser);
Router.get('/register_success', authController.registerSuccess);
Router.get('/*', authController.pageNotFound);
module.exports  = Router;