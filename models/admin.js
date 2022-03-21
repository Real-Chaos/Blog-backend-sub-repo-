const mongoose = require("mongoose")

const adminSchema = mongoose.Schema({
    username: {
        type: String,
        required: true
    }, 
    passwordHash: {
        type: String,
        required: true
    }
})


adminSchema.set('toJSON', {
    transform: (document, returnedObjects) => {
        returnedObjects.id = returnedObjects._id.toString()
        delete returnedObjects._id
        delete returnedObjects.__v
        delete returnedObjects.passwordHash
    }
})

const Admin = mongoose.model('Admin', adminSchema)

module.exports = Admin