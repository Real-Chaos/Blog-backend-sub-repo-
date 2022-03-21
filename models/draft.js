const mongoose = require("mongoose")

const draftSchema = mongoose.Schema({
    img: {
        type: String,
        
    },
    title: {
        type: String,
        
    },
    readingTime: {
        type: String,
        
    },
    summary: {
        type: String,
        
    },
    content: {
        type: String,
        
    },
    category: {
        type: String,
        
    },
    tags: {
        type: Array,
        
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
})


const Draft = mongoose.model('Draft', draftSchema)

module.exports = Draft