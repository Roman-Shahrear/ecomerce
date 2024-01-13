const express = require('express');
const cookieParser = require("cookie-parser");

const app = express();

const errorMiddleware = require("./middleware/error");

app.use(express.json());
app.use(cookieParser());

//Route Imports
const productRoute = require("./routes/productRoutes");
const userRoute = require("./routes/userRoutes");

app.use("/api/v1", productRoute);
app.use("/api/v1", userRoute);


// Middleware for Errors
app.use(errorMiddleware);

module.exports = app;