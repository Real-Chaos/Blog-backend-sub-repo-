const mongoose = require("mongoose");
const marked = require("marked");
const slugify = require("slugify");
const createDomPurify = require('dompurify')
const {JSDOM} = require("jsdom")
const dompurify = createDomPurify(new JSDOM().window)

const blogSchema = mongoose.Schema({
    img: {
        type: String,
        required: true,
    },
    title: {
        type: String,
        required: true,
    },
    readingTime: {
        type: String,
        required: true,
    },
    summary: {
        type: String,
        required: true,
    },
    content: {
        type: String,
        required: true,
    },
    category: {
        type: String,
        required: true,
    },
    tags: {
        type: Array,
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    slug: {
        type: String,
        required: true,
        unique: true,
    },
    sanitizedHtml: {
        type: String,
        required: true
    }
});

blogSchema.pre("validate", function (next) {
    if (this.title) {
        this.slug = slugify(this.title, { lower: true, strict: true });
    }

    if(this.content) {
        this.sanitizedHtml = dompurify.sanitize(marked.parse(this.content))
    }

    next()
});

const Blog = mongoose.model("Blog", blogSchema);

module.exports = Blog;
