const mongoose = require('mongoose');

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
    links: { type: Array, "default": [], unique: true },

    details: [{
        type: mongoose.Schema.Types.ObjectId,

        ref: 'Info'
    }],



}, { timestamps: true })
// posterSchema.path('links').validate(function (value) {
//     console.log(value.length)
//     if (value.length > 5) {
//         throw new Error("One cannot have more than five accounts");
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

const Poster = mongoose.model('Poster', posterSchema);
module.exports = Poster; 