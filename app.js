const express = require('express') // import express
const app = express(); // tạo instance từ đó
const userRouter = require('./routes/userRoute');
const newsRouter = require('./routes/newsRoute');
const morgan = require('morgan');
const globalErrorHanlder = require('./controller/errorController')
const viewRouter = require('./routes/viewRoute')
const path = require('path')

app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'))


// phân tích data trong body của request và gắn vào reqbody
app.use(express.json())

if (process.env.NODE_ENV === "development") {
    app.use(morgan("dev"))
}

// ROUTE nào định nghĩa sau middleWare thì mới được áp dụng
app.use((req, res, next) => {
    console.log("Test middle ware nha")
    next()
});

// json.({}) => gui json response to client
// app.get('/api/v1/test', (req, res) => {
//     res.status(200).json({
//         status: 'success',
//         message: "qua tuyt voi"
//     })
// })

// console.log(process.env)
app.use(express.json())


app.use(express.static(path.join(__dirname, 'public')))


// ROUTE
app.use("/", viewRouter)

app.use("/api/v1/users", userRouter)
app.use("/api/v1/news", newsRouter)

app.use(globalErrorHanlder)
module.exports = app