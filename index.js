const express = require("express");
const mongoose = require("mongoose");
const winston = require("winston");
require("dotenv").config();
const app = express();
const PORT = process.env.PORT || 3000;

const booksRouter = require("./routes/books.routes");

// middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// create a logger
const logger = winston.createLogger({
    level: "info",
    transports: [
        new winston.transports.Console({
            format: winston.format.combine(winston.format.colorize({ all: true })),
        }),
        new winston.transports.File({ filename: "error.log", level: "error" }),
    ],
    exceptionHandlers: [
        new winston.transports.File({ filename: 'exceptions.log'})
    ]
});

// routes
app.use("/api/books", booksRouter);

// connect DB
mongoose
    .connect(process.env.MONGO_URI, { useNewUrlParser: true })
    .then(() => logger.info("Connected to mongodb"))
    .catch((err) => logger.error(err.message));

app.get("/", (req, res) => res.send("Hello World!"));
app.listen(PORT, () => logger.info(`Example app listening on port ${PORT}!`));
