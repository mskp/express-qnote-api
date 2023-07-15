import { Schema, model } from 'mongoose';

const userSchema = new Schema({
    name: {
        type: String,
        required: true,
        min: 5
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
        min: 5,
        max: 1024
    },
    date: {
        type: Date,
        default: Date.now
    }
})

const User = model('user', userSchema);
export default User;