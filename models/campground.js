const mongoose = require('mongoose');
const Comment = require('./comment');
//SCHEMA SETUP
const campgroundSchema = new mongoose.Schema({
    name: String,
    price: String, //added
    image: String,
    description: String,
    author: {
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
        username: 'String'
    },
    comments: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Comment'
        }
    ]
});

campgroundSchema.pre('remove', async function () { // used for deleting all comments related to campground
    await Comment.deleteMany({
        _id: {
            $in: this.comments
        }
    });
});

module.exports = mongoose.model('Campground', campgroundSchema);