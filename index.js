const express = require('express');
const app = express();
require('./db');

app.use(express.json());
app.use(function(req, res, next) {
    res.header('Access-Control-Allow-Origin', "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});
app.use('/', require('./routers/getRoute'),);

const port = process.env.PORT || 3000

app.listen(port, () => {
    console.log(`Server is running at the port ${port}`);
});