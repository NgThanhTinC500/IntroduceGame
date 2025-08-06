const mongoose = require('mongoose')
const app = require('./app')
const dotenv = require("dotenv");
// Link to config.env
dotenv.config({ path: './config.env' });
// console.log(process.env)


const DB = process.env.DATABASE.replace("<PASSWORD>",
    process.env.DATABASE_PASSWORD,
)

mongoose
    // pending => đang chờ
    .connect(DB)
    // thành công => chạy then
    .then(() => console.log("DB CONNECT SUCCESSFUL"))
    // thất bại => chạy catch
    .catch((err) => console.log("ERROR"))

const port = process.env.PORT
const server = app.listen(port, () => {
    console.log(`App running on port ${port} ...`)

})

