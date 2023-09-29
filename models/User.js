import mongoose from 'mongoose'

const Schema = mongoose.Schema;
const userSchema = new Schema({
    username: {
        type: String,
        trim: true

    },
    password: { type: String, },
    adminId: { type: String },
    permission: { type: Boolean, default: false },

    posters: [{
        type: mongoose.Schema.Types.ObjectId,

        ref: 'Poster'
    }],
    // validity: { type: Date, default: Date.now },

    numOfPosters: { type: Number, default: 0 },
    numOfPostersPermission: { type: Number, default: 0 },
    admin: { type: Boolean, default: true },
    links: { type: Array, "default": [] },

qrCodeStatus:{ type: Boolean, default: false }



}, { timestamps: true })

userSchema.pre('deleteOne', function (next) {
    const personId = this.getQuery()["_id"];
    mongoose.model("Poster").deleteMany({ 'root': personId }, function (err, result) {
        if (err) {
            console.log(`[error] ${err}`);
            next(err);
        } else {
            console.log('success');
            next();
        }
    });
});


// posterSchema.path('links').validate(function (value) {

//     const tofindDuplicates = value => value.filter((item, index) => value.indexOf(item) !== index)
//     const duplicateElementa = tofindDuplicates(value);
//     if (duplicateElementa.length > 0) {
//         throw new Error("Can not create Duplicate link");
//     }
// })
// userSchema.pre('save', async function(next){
//   const salt=await bcrypt.genSalt();
//   this.password=await bcrypt.hash(this.password,salt);
//   next();
// })

// userSchema.statics.login= async function(email,password){
//        const user=  await this.findOne({email});

//         if(user){
//             const auth=  await bcrypt.compare(password, user.password);
//              if(auth){
//                 return user;

//                 } 
//               throw Error('incorrect password')




//            }
//             throw Error('incorrect email')

// }

const User = mongoose.model('User', userSchema);
export default User

