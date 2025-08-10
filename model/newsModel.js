const mongoose = require('mongoose');
const validator = require('validator');

const newsSchema = new mongoose.Schema(
    {
        tags: {
            type: String,
            required: [true, '[Phai co tag'],
            enum: {
                values: ['Tin Tức', 'Sự Kiện', 'Hướng Dẫn'],
            }
        },
        title: {
            type: String,
            required: [true, 'Phai co title']
        },
        datePost: {
            type: Date,
            // required: [true, 'Phai co DATE']
        },
        content: {
            type: String,
            required: true,
        },
        image: {
            type: String,
            required: true
        },
        createAt: {
            type: Date,
            default: Date.now(), // timeStamp = miliseconds
            select: false,
        },

    }
)




const News = new mongoose.model('News', newsSchema)

module.exports = News