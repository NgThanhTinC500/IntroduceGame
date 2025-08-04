const express = require('express') // import express

const app = express(); // tạo instance từ đó

// ROUTE nào định nghĩa sau middleWare thì mới được áp dụng
app.use((req, res, next) => {
    console.log("Test middle ware nha")
    next()
});

// json.({}) => gui json response to client
app.get('/api/v1/test', (req, res) =>{
    res.status(200).json({
        status: 'success',
        message: "qua tuyt voi"
    })
})

// console.log(process.env)

// phân tích data trong body của request và gắn vào reqbody
app.use(express.json())



module.exports = app