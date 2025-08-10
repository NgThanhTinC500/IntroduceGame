const AppError = require('../utils/appError')
const News = require('../model/newsModel')
const catchAsync = require('../utils/catchAsync')

exports.createNews = catchAsync(async (req, res) => {
    const newNews = await News.create(req.body);
    try {
        res.status(201).json({
            status: 'success',
            data: {
                news: newNews
            }
        })
    } catch (error) {
        res.status(400).json({
            status: 'Fail',
            message: error.message
        })
    }

});


exports.getAllNews = catchAsync(async (req, res) => {
    try {
        const news = await News.find()
        res.status(200).json({
            status: 'success',
            results: news.length,
            data: {
                news
            }
        })
    } catch (error) {
        res.status(400).json({
            status: 'Fail',
            message: error.message
        })
    }
});

exports.deleteNews = catchAsync(async (req, res, nex) => {
    const news = await News.findByIdAndDelete(req.params.id);
    if (!news) {
        return next(new AppError('ko co voi cai id nay', 404))
    }
    res.status(204).json({
        status: 'success',
        message: 'data has been deleted'
    })
})


exports.updateNews = catchAsync(async (req, res, next) => {
    const news = await News.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true,
    })
    if (!news) {
        return next(new AppError('ko co voi id nay', 404))
    }
    res.status(200).json({
        status: 'success',
        data: {
            data: news
        }
    })
})

exports.getNews = catchAsync( async (req, res, next) => {
    const newsId = req.params.id;

    const news = await News.findById(newsId)
    if (!news) {
        return next(new AppError('KO co tin tuc voi id nay', 404))
    }
    res.status(200).json({
        status: 'success',
        data: {
            news
        }
    })
})