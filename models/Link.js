const mongoose = require('mongoose');

const Schema = mongoose.Schema;
const linkSchema = new Schema({
    linkName: {
        type: String,
        trim: true

    },




}, { timestamps: true })

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

const Link = mongoose.model('Link', linkSchema);
module.exports = Link; 