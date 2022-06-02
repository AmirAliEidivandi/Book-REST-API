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

// GET THE BOOK BY ID
router.get("/:id", async (req, res) => {
    try {
        const { id: bookId } = req.params;
        const book = await Book.findById({ _id: bookId });

        if (!book) res.status(404).json({ error: `No book with id: ${bookId}` });

        res.status(200).json({ book });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// UPDATE BOOK BY ID
router.put("/:id", async (req, res) => {
    try {
        const { id: bookId } = req.params;
        const book = await Book.findByIdAndUpdate(
            bookId,
            {
                name: req.body.bookName,
                author: {
                    name: req.body.authorName,
                    age: req.body.authorAge,
                },
                genre: req.body.genre,
            },
            {
                new: true,
                runValidators: true,
            }
        );

        if (!book) {
            res.status(404).json({ error: `No book with id: ${bookId}` });
        }

        res.status(200).json({ book });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.delete("/:id", async (req, res) => {
    try {
        const { id: bookId } = req.params;
        const book = await Book.findByIdAndDelete({ _id: bookId });

        if (!book) {
            res.status(404).json({ error: `No book with id: ${bookId}` });
        }

        res.status(200).json({ book });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
