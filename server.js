const dotenv = require("dotenv");
dotenv.config({ path: './config.env' });
const mongoose = require('mongoose')
const app = require('./app')
// Link to config.env



// console.log(process.env)
console.log(app.get('env'))

const DB = process.env.DATABASE.replace("<PASSWORD>",
    process.env.DATABASE_PASSWORD,
)
console.log("Check 1")

mongoose
    // pending => đang chờ
    .connect(DB)
    // thành công => chạy then
    .then(() => console.log("DB CONNECT SUCCESSFUL"))
    // thất bại => chạy catch
    .catch((err) => {
    console.error("DB Connection Error:");
});


const port = process.env.PORT
const server = app.listen(port, () => {
    console.log(`App running on port ${port} ...`)

})

