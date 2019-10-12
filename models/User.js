const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const {Schema} = mongoose;

const userSchema = new Schema({
    username: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    firstName:{
        type: String,
    },
    lastName : {
        type: String,
    },
    introduction:{
        type: String,
    },
    whatYouDo:{
        type: String,
    },
    image: {
        type: String,
        default: 'https://res.cloudinary.com/goldolar/image/upload/v1570075131/user.png'
    },
    facebook: {
        type: String,
    },
    twitter: {
        type: String,
    },
    github: {
        type: String,
    },
    behance: {
        type: String,
    },
    dribble: {
        type: String,
    },
    linkedin: {
        type: String,
    },

});

userSchema.pre('save', function (next) {
    let user = this;
    bcrypt.hash(user.password, 10, (err, hash) => {
        if (err)
            return err;

        user.password = hash;
        next();
    });
});

const userModel = mongoose.model('User', userSchema);

module.exports = userModel;
