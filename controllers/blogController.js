const Blog = require("../models/blog");
const Draft = require("../models/draft");
const cloudinary = require("../utils/cloudinary");
const { MongoClient } = require("mongodb");
const client = new MongoClient(process.env.MONGODB, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

let collection;

const connectToClient = async (name) => {
    try {
        await client.connect();
        collection = client.db("Blogs").collection(name);
    } catch (e) {
        console.log(e);
    }
};

const createBlog = async (req, res) => {
    let { img, title, readingTime, summary, content, category, tags } =
        req.body;
    if (req.params && req.params.id !== "undefined") {
        const blog = await Blog.findByIdAndUpdate(
            { _id: req.params.id },
            req.body,
            { new: true }
        );
        res.json(blog);
    } else {
        let blog = new Blog({
            img,
            title,
            readingTime,
            summary,
            content,
            category,
            tags,
        });

        try {
            let savedBlog = await blog.save();
            res.json(savedBlog);
        } catch (e) {
            console.log(e);
        }
    }
};

const getAllBlogs = async (req, res) => {
    const allBlogs = await Blog.find({}).sort({ createdAt: -1 });

    res.json(allBlogs);
};

const getOneBlog = async (req, res) => {
    const id = req.params.id;
    const blog = await Blog.findById(id);

    res.json(blog);
};

const deleteBlog = async (req, res) => {
    await Blog.findByIdAndDelete(req.params.id);
    const allBlogs = await Blog.find({}).sort({ createdAt: -1 });
    res.json(allBlogs);
};

const saveDraft = async (req, res) => {
    console.log(req.params.id);
    if (req.params.id !== "undefined") {
        const draft = await Draft.findByIdAndUpdate(
            { _id: req.params.id },
            req.body,
            { new: true }
        );
    } else {
        const draft = await new Draft(req.body).save();
        res.json(draft);
    }
};

const getAllDrafts = async (req, res) => {
    const allDrafts = await Draft.find({}).sort({ createdAt: -1 });

    res.json(allDrafts);
};

const getOneDraft = async (req, res) => {
    const id = req.params.id;
    const draft = await Draft.findById(id);

    res.json(draft);
};

const deleteDraft = async (req, res) => {
    await Draft.findByIdAndDelete(req.params.id);
    const allDrafts = await Draft.find({}).sort({ createdAt: -1 });
    res.json(allDrafts);
};

const blogSearch = async (req, res) => {
    connectToClient("blogs");
    try {
        let result = await collection
            .aggregate([
                {
                    $search: {
                        autocomplete: {
                            query: req.query.term,
                            path: "title",
                        },
                    },
                },
                {
                    $limit: 10,
                },
            ])
            .toArray();
        res.json(result);
    } catch (e) {
        res.status(500).send({ message: e.message });
    }
};

const unPublish = async (req, res) => {
    const id = req.params.id;

    const blog = await Blog.findById(id);
    const addedToDraft = await Draft.insertMany([blog]);
    await Blog.deleteOne(blog);

    res.json(addedToDraft);
};

const publishDraft = async (req, res) => {
    const id = req.params.id;

    const draft = await Draft.findById(id);
    const addedToBlog = await Blog.insertMany([draft]);
    await Draft.deleteOne(draft);
    const allDrafts = await Draft.find({});

    res.json(addedToBlog);
};

const draftSearch = async (req, res) => {
    connectToClient("drafts");
    try {
        let result = await collection
            .aggregate([
                {
                    $search: {
                        autocomplete: {
                            query: req.query.term,
                            path: "title",
                        },
                    },
                },
                {
                    $limit: 10,
                },
            ])
            .toArray();
        res.json(result);
    } catch (e) {
        res.status(500).send({ message: e.message });
    }
};

module.exports = {
    createBlog,
    getAllBlogs,
    getOneBlog,
    saveDraft,
    getAllDrafts,
    deleteDraft,
    deleteBlog,
    blogSearch,
    unPublish,
    draftSearch,
    getOneDraft,
    publishDraft,
    // testUpload,
};
