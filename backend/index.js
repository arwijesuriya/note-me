require("dotenv").config();

const config = require("./config.json");
const mongoose = require("mongoose");

mongoose.connect(config.connectionString);

const User = require("./models/user.model");
const Note = require("./models/note.model");

const express = require("express");
const cors = require("cors");
const app = express();

const jwt = require("jsonwebtoken");
const { authenticateToken } = require("./utilities");

app.use(express.json());

app.use(
    cors({
        origin: "*",
    })
);

app.get("/", (req, res) => {
    res.json({ data: "Hello" });
});

// create account
app.post("/create-account", async (req, res) => {
    const { fullName, email, password } = req.body;

    if (!fullName) {
        return res.status(400).json({ 
            message: "Full name is required" 
        });
    }

    if (!email) {
        return res.status(400).json({
            error: true,
            message: "Email is required",
        });
    }

    if (!password) {
        return res.status(400).json({
            error: true,
            message: "Password is required",
        });
    }

    const isUser = await User.findOne({ email: email });

    if (isUser) {
        return res.json({
            error: true,
            message: "User already exists",
        });
    }

    const user = new User({
        fullName,
        email,
        password,
    });

    await user.save();

    const accessToken = jwt.sign({ user }, process.env.ACCESS_TOKEN_SECRET, { 
        expiresIn: "36000m", 
    });

    return res.json({
        error: false,
        user,
        accessToken,
        message: "Account created successfully",
    });
});

// login account
app.post("/login", async (req, res) => {
    const { email, password } = req.body;

    if (!email) {
        return res.status(400).json({
            message: "Email is required",
        });
    }

    if (!password) {
        return res.status(400).json({
            message: "Password is required",
        });
    }

    const userInfo = await User.findOne({ email: email });

    if (!userInfo) {
        return res.status(400).json({
            message: "User does not exist",
        });
    }

    if (userInfo.email == email && userInfo.password) {
        const user = { user: userInfo };
        const accessToken = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, {
            expiresIn: "36000m",
        });

        return res.json({
            error: false,
            message: "Login successful",
            email,
            accessToken,
        });
    }
    else {
        return res.status(400).json({
            error: true,
            message: "Invalid credentials",
        });
    }
});

// add note
app.post("/add-note", authenticateToken, async (req, res) => {
    const { title, content, tags } = req.body;
    const { user } = req.user;

    if (!title) {
        return res.status(400).json({
            error: true,
            message: "Title is required",
        });
    }

    if (!content) {
        return res.status(400).json({
            error: true,
            message: "Content is required",
        });
    }

    try {
        const note = new Note({
            title,
            content,
            tags: tags || [],
            userId: user._id,
        });

        await note.save();

        return res.json({
            error: false,
            note,
            message: "Note added successfully",
        });
    }
    catch (error) {
        return res.status(500).json({
            error: true,
            message: "Something went wrong",
        });
    }
});

// edit note
app.put("/edit-note/:noteId", authenticateToken, async (req, res) => {
    const noteId = req.params.noteId;
    const { title, content, tags, isPinned } = req.body;
    const { user } = req.user;

    if (!title && !content && !tags) {
        return res.status(400).json({
            error: true,
            message: "No changes were made",
        });
    }

    try {
        const note = await Note.findOne({ _id: noteId, userId: user._id });
        
        if (!note) {
            return res.status(404).json({
                error: true,
                message: "Note does not exist",
            });
        }

        if (title) note.title = title;
        if (content) note.content = content;
        if (tags) note.tags = tags;
        if (isPinned) note.isPinned = isPinned;

        await note.save();

        return res.json({
            error: false,
            note,
            message: "Note updated successfully",
        });
    }
    catch (error) {
        return res.status(500).json({
            error: true,
            message: "Something went wrong",
        });
    }
});

// get all notes
app.get("/get-all-notes/", authenticateToken, async (req, res) => {
    const { user } = req.user;

    try {
        const notes = await Note.find({ userId: user._id }).sort({ isPinned: -1 });

        return res.json({
            error: false,
            notes,
            message: "Notes fetched successfully",
        });
    }
    catch (error) {
        return res.status(500).json({
            error: true,
            message: "Something went wrong",
        });
    }
});

// delete notes
app.delete("/delete-note/:noteId", authenticateToken, async (req, res) => {
    const noteId = req.params.noteId;
    const { user } = req.user;

    try {
        const note = await Note.findOne({ _id: noteId, userId: user._id });
        
        if (!note) {
            return res.status(404).json({
                error: true,
                message: "Note does not exist",
            });
        }

        await Note.deleteOne({ _id: noteId, userId: user._id });

        return res.json({
            error: false,
            message: "Note deleted successfully",
        });
    }
    catch (error) {
        return res.status(500).json({
            error: true,
            message: "Something went wrong",
        });
    }
});

app.listen(8000);

module.exports = app;