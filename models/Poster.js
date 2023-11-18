import mongoose from 'mongoose'
import Info from './Info'

const Schema = mongoose.Schema;
const posterSchema = new Schema({
    username: {
        type: String,
        trim: true

    },

    password: { type: String, },
    root: {
        type: mongoose.Schema.Types.ObjectId,

        ref: 'User'
    },
    links: { type: Array, "default": [] },

    details: [{
        type: mongoose.Schema.Types.ObjectId,

        ref: 'Info'
    }],
    posterId: { type: String },

    admin: { type: Boolean, default: false },

}, { timestamps: true })


// posterSchema.pre('remove',async function(next){

//     try{
//         await Info.remove({
//             "_id":{
//                 $in:this.details
//             }
//         })
//         next()
//     }catch(err){
// next(err)
//     }
// })



const Poster = mongoose.model('Poster', posterSchema);
export default Poster
