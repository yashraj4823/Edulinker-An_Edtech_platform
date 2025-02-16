const mongoose = require("mongoose");
require("dotenv").config();

exports.connect = () => {
    mongoose.connect(process.env.MONGODB_URL, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
    .then(() => console.log("Database Connected Successfully"))
    .catch((error) => {
        console.log("Database Connection Failed!", error);
        console.error(error);
        process.exit(1);
    })
};