const app = require('../app')
const News = require('../model/newsModel')
const catchAsync = require('../utils/catchAsync')



exports.getOverview = catchAsync(async (req, res, next) => {
    const news = await News.find().limit(6);
    res.status(200).render('overview', {
        title: 'Test',
        news: news
    })
})

exports.getLoginForm = (req, res) => {
    res.status(200).render('login')
}