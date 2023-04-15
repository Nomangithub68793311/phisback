import mongoose from 'mongoose'

const Schema = mongoose.Schema;
const demoSchema = new Schema({
    linkName: {
        type: String,
        trim: true

    },
    username: {
        type: String,
        trim: true

    },
    age: {
        type: Number,

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

const Demo = mongoose.model('Demo', demoSchema);

export default Demo


// DB_CONNECTION=mysql
// DB_HOST=127.0.0.1
// DB_PORT=3306
// DB_DATABASE=back4page
// DB_USERNAME=yoyo
// DB_PASSWORD=68793311rana

// MAIL_MAILER=smtp
// MAIL_HOST=smtp.mailgun.org
// MAIL_PORT=587
// MAIL_USERNAME=postmaster@my.shannonit.org
// MAIL_PASSWORD=181d1b8553b5108e17974fd11ed3c6e6-f2340574-5b964417
// MAIL_ENCRYPTION=tls
// MAIL_FROM_ADDRESS=no-reply@back4page.com
// MAIL_FROM_NAME=Back4page  Krtujj@#%123
