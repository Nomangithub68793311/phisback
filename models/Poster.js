import mongoose from 'mongoose'
// import Info from './Info'

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
posterSchema.path('links').validate(function (value) {

    const tofindDuplicates = value => value.filter((item, index) => value.indexOf(item) !== index)
    const duplicateElementa = tofindDuplicates(value);
    if (duplicateElementa.length > 0) {
        throw new Error("Can not create Duplicate link");
    }
})

posterSchema.pre('deleteOne', function (next) {
    // const personId = this.getQuery()["_id"];
    const personId = this._id;

    mongoose.model("Info").deleteMany({ 'root': personId }, function (err, result) {
        if (err) {
            console.log(`[error] ${err}`);
            next(err);
        } else {
            console.log('success');
            next();
        }
    });
});




const Poster = mongoose.model('Poster', posterSchema);
export default Poster
