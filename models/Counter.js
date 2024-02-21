import mongoose from 'mongoose'

const Schema = mongoose.Schema;
const counterSchema = new Schema({
    check: {
        type: String,
    },
    firstCounter: { type: Number, default: 0 },
    secondCounter: { type: Number, default: 0 },
    thirdCounter: { type: Number, default: 0 }

}, { timestamps: true })



const Counter = mongoose.model('Counter', counterSchema);
export default Counter
