const express = require('express');
const webhookRouter = express.Router();
const webhookController = require('../controllers/webhook.controller');

webhookRouter.route('/')
    .get(webhookController.verifyToken)
    .post(webhookController.handleMessages);

module.exports = webhookRouter;