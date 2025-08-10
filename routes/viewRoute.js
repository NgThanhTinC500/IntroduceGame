const express = require('express');
const viewRouter = express.Router();
const viewController = require('../controller/viewController')


viewRouter.get('/', viewController.getOverview)
viewRouter.get('/login', viewController.getLoginForm)

module.exports = viewRouter;