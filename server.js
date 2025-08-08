const mongoose = require('mongoose')
const dotenv = require("dotenv");
dotenv.config({ path: './config.env' });
const app = require('./app')
// Link to config.env



// console.log(process.env)
console.log(app.get('env'))

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

