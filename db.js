const mongoDBURI = "mongodb://Escare:escare1234@127.0.0.1:27017/nftCollection" 
const mongoose = require('mongoose');
require('dotenv').config();
mongoose.connect(mongoDBURI, {
    useCreateIndex: true,
    useUnifiedTopology: true,
    useNewUrlParser: true,
    useFindAndModify: false,
}).then(() => {
    console.log("Mongodb is connected");
}).catch((e) => {
    console.log("Mongodb is not connected");
});