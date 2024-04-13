const express = require('express');
const router = express.Router();
const fetchuser = require('../middleware/fetchuser');
const { body, validationResult } = require('express-validator');
const Blogs = require('../models/Blogs');

// Add new blogs using: post "/api/auth/addnote" . login required
router.post('/addnote', fetchuser, [
    body('title', 'Enter Valid title').isLength({ min: 3 }),
    body('description', 'Description must be atleast min 5 characters').isLength({ min: 5 })
], async (req, res) => {
    try {

        const { title, description, tag } = req.body;
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const blog = new Blogs({
            title, description, tag, user: req.user.id
        })
        const saveNote = await blog.save();
        res.json(saveNote);

    } catch (error) {
        console.error(error.message);
        res.status(500).send("some error occured");
    }
}) 

// Get all the blogs using: get "/api/blogs/fetchallnotes" . login required
router.get('/fetchallnotes', async (req, res) => {
    try {
        const blogs = await Blogs.find();
        res.json(blogs);

    } catch (error) {
        console.error(error.message);
        res.status(500).send("some error occured");
    }
})

// Update all the blogs using: put "/api/blogs/fetchallnotes" . login required
router.put('/updatenote/:id', fetchuser, async (req, res) => {

    const { title, description, tag } = req.body;
    //create a newNote object
    const newNote = {};
    if (title) { newNote.title = title };
    if (description) { newNote.description = description };
    if (tag) { newNote.tag = tag };

    //Find the blog to be updated and update its
    let blog = await Blogs.findById(req.params.id);
    if (!blog) { return res.status(404).send("not found") };

    if (blog.user.toString() !== req.user.id) {
        return res.status(401).send("Not Allowed");
    }

    blog = await Blogs.findByIdAndUpdate(req.params.id, { $set: newNote }, { new: true });
    res.json({blog});
});


// Delete all the blogs using: DELETE "/api/blogs/deletenote" . login required
router.delete('/deletenote/:id', fetchuser, async (req, res) => {
    // const { title, description, tag } = req.body;
    
    //Find the blog to be delete and delete its
    let blog = await Blogs.findById(req.params.id);
    if (!blog) { return res.status(404).send("not found") };

    //Allow deletion only if users owns this blog
    if (blog.user.toString() !== req.user.id) {
        return res.status(401).send("Not Allowed");
    }

    blog = await Blogs.findByIdAndDelete(req.params.id);
    res.json({"Success":"Blogs has been deleted", blog:blog});
});

module.exports = router;