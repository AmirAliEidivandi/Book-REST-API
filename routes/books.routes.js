const express = require("express");
const router = express.Router();

const { Book, validateBook } = require("../models/books.models");

router.post("/", async (req, res) => {
    const error = await validateBook(req.body);
    if (error.message) res.status(400).send(error.message);

    const book = new Book({
        name: req.body.bookName,
        author: {
            name: req.body.authorName,
            age: req.body.authorAge,
        },
        genre: req.body.genre,
    });

    book.save()
        .then((book) => res.status(201).send(book))
        .catch(() => res.status(500).send("Book was not stored in db"));
});

// GET ALL BOOKS
router.get("/", async (req, res) => {
    try {
        const books = await Book.find({});
        res.status(200).json(books);
    } catch (error) {
        res.status(404).json({ error: error.message });
    }
});

module.exports = router;
