const express = require('express')
const newsController = require('../controller/newsController')
const newsRouter = express.Router();


newsRouter
    .route('/')
    .post(newsController.createNews)
    .get(newsController.getAllNews)

newsRouter
    .route('/:id')
    .patch(newsController.updateNews)
    .get(newsController.getNews)
    .delete(newsController.deleteNews)


module.exports = newsRouter