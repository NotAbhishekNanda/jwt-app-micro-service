const express = require("express");
const router = require('./routes/route');
const app = express();

app.use(express.json()); //for handling json data

app.use(router)

app.listen(5000, () => {
console.log("Server running on port 5000");
});
