const app = require('./app')
const dotenv = require("dotenv");
// Link to config.env
dotenv.config({ path: './config.env' });
// console.log(process.env)




const port = process.env.PORT
const server = app.listen(port, () => {
    console.log(`App running on port ${port} ...`)

})

