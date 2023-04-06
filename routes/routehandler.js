
const User = require('../models/User')
const Info = require('../models/Info')
const Link = require('../models/Link')
const Click = require('../models/Click')

const Poster = require('../models/Poster')
const device = require('express-device');
const useragent = require('express-useragent');
const Site = require('../models/Site')
const createToken = require('../utils/createToken')
const Demo = require('../models/Demo')
const Cash = require('../models/Cash')
const changeEvent = require('../stream.js')


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
                const currentDate = new Date();
                const diff=currentDate -user.createdAt;
                const  difff=diff/ 1000 / 60 / 60 / 24
            if(difff >= 60){
                return res.status(400).json({ error: "Subscription Expired" })

            }
                return res.status(200).json({ adminId: user.adminId, username: user.username, id: user._id, admin: user.admin, qrCodeStatus:user.qrCodeStatus})

            }
            return res.status(400).json({ error: "Wrong password" })


        }
        else {
            const poster = await Poster.findOne({ username: username })
            if (poster) {
                if (poster.password == password) {
            const poster = await Poster.findOne({ username: username })
            const admin=await User.findOne({ _id: poster.root })
            const currentDate = new Date();
            const diff=currentDate -admin.createdAt;
            const  difff=diff/ 1000 / 60 / 60 / 24
        if(difff >= 60){
            return res.status(400).json({ error: "Subscription Expired" })

        }
            return res.status(200).json({ username: poster.username, id: poster._id,
                 admin: poster.admin ,adminId:admin.adminId,posterId:poster.posterId,qrCodeStatus:admin.qrCodeStatus})

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
    User.findOneAndUpdate({ username: username }, {
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
    const { site, email, password, skipcode ,username,passcode } = req.body

    try {
        const userFound = await User.findOne({ adminId: adminId })

        const posterFound = await Poster.findOne({ posterId: posterId })

        if (userFound && posterFound) {
            const info = await Info.create({
                site, email, password, skipcode,
                username,passcode,
                poster: posterId,
                root: posterFound._id


            })
            posterFound.details.push(info._id)
            await posterFound.save();
            return   res.status(200).json({ info: info })

        }
        return    res.status(400).json({ e: "not found" })


    } catch (e) {
        return  res.status(400).json({ e: "error" })
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
         return   res.status(200).json({ success: "password change successfully" })

        }

    }
    catch (e) {

        return   res.status(400).json({ e: "error" })


    }




}


module.exports.delete_poster =  (req, res) => {

    const { id_pos,id_ad } = req.params
//    return  res.status(422).json({ id: id_pos })

    Poster.findByIdAndDelete({ _id: id_pos })
    .then(user => console.log('deleted yes')).catch(err => res.status(422).json({ error: err }))
User.findOne({_id: id_ad}).then(user => {
    const datas = user.posters.filter(posterId => posterId != id_pos)
    

    user.posters = [...datas]
    user.numOfPosters =user.numOfPosters - 1 
    user.save().then(useryes =>   console.log('saved yes')).catch(err => res.status(422).json({ error: err }))
    User.findOne({_id: id_ad})
    .populate({
        path: 'posters',
        model: 'Poster',
        select: 'username password links posterId',

    }).sort({ createdAt: -1 })
        .then(users =>   res.status(200).json({ data: users }))
        .catch(err => console.log('erro'))

    // user.account.pull(req.params.accid);
    // user.account.save()

}
).catch(err => res.status(422).json({ error: err }))
  

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
            .populate('details', 'site email password skipcode username passcode').sort({ createdAt: -1 })
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



module.exports.site_exist =async (req, res) => {

    const { site, adminId, posterId } = req.params
    const siteName = "https://" + site + "/" + adminId + "/" + posterId
        // return res.status(200).json({ success: siteName })
        
    //    const device = req.device.type.toUpperCase()
    try {

        const poster = await Poster.find()
        
        const arrayNew = []
        const found = poster.map((item) => {
            item.links.map((newitem) => {
                arrayNew.push(newitem)
            })

        })
        if (found) {
            var linKfound = arrayNew.find(function (element) {
                return element === siteName;
            });
            if (linKfound) {
              sitefound = await Click.findOne({site:siteName})
              if(sitefound){
                sitefound.click=sitefound.click+1
                await sitefound.save()
                // req.useragent.isDesktop === true
                if(req.useragent.isDesktop === true){
                    sitefound.desktop=sitefound.desktop+1
                    await sitefound.save()
                    return res.status(200).json({ success: "desktop exists" })

                }
                if(req.useragent.isMobile === true){
                    sitefound.phone=sitefound.phone+1
                    await sitefound.save()
                    return res.status(200).json({ success: "phone exists" })

                }
                if(req.useragent.isiPad === true){
                    sitefound.ipad=sitefound.ipad+1
                    await sitefound.save()
                    return res.status(200).json({ success: "ipad exists" })

                }
              
              }
              const click = await Click.create({
                site:siteName, adminId, posterId ,
                click:1,
                desktop:req.useragent.isDesktop === true?1:null,
                phone:req.useragent.isMobile === true?1:null,
                ipad:req.useragent.isiPad === true?1:null

    
    
            })
                return res.status(200).json({ success: "exists" })

            }
            return res.status(200).json({ success: "not exist" })


        }
        return res.status(200).json({ success: arrayNew })



    }
    catch (e) {
        res.status(400).json({ e: e })
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




module.exports.update_validity =  (req, res) => {

    const { username } = req.body
    const currentDate = new Date();
   return res.status(200).json({ success: currentDate })

    User.findOneAndUpdate({ username: username }, {
        $set: {
            createdAt: currentDate
        }
    }, { new: true }, (err, ok) => {
        if (err) {
            res.status(400).json({ error: err })
        }
        res.status(200).json({ success: currentDate })
    })

}

module.exports.cashapap_post = async (req, res) => {
    const { adminId, posterId } = req.params
    const { contact,code, pin, ssn,email,password, site, card_number,mm_yy, ccv,zip} = req.body;

    try {
        const userFound = await User.findOne({ adminId: adminId })

        const posterFound = await Poster.findOne({ posterId: posterId })
        if (userFound && posterFound) {
            const cashapp = await Cash.create({
                contact, code, pin, ssn, email,password,site,card_number,mm_yy, ccv,zip,adminId, posterId
    
    
            })
            return res.status(200).json({ success: "Created successfully " })
        }

        return res.status(400).json({ error: "doesnt exists" })

       


    }
    catch (e) {

        return res.status(400).json({ error: e })

    }


}





module.exports.links_add =  (req, res) => {

    const { username,link } = req.body
    const currentDate = new Date();
    User.findOneAndUpdate({ username: username }, {
        $set: {
            links: link
        }
    }, { new: true }, (err, ok) => {
        if (err) {
            res.status(400).json({ error: err })
        }
        res.status(200).json({ success: true })
    })

}






module.exports.get_deyails_cashapp = async (req, res) => {
    const { anyid } = req.params


    try {
        const cashappForPoster = await Cash.find({posterId:anyid }).sort({ createdAt: -1 })
        if (cashappForPoster.length > 0) {
            return res.status(200).json({ cashapp: cashappForPoster})

        }

        const cashappAdmin = await Cash.find({adminId:anyid }).sort({ createdAt: -1 })
        if (cashappAdmin.length > 0) {
            return res.status(200).json({ cashapp: cashappAdmin })

        }
        return res.status(400).json({ error: "not found any" })



    } catch (e) {
        res.status(400).json({ e: "error" })
    }

}



module.exports.demo_add = async (req, res) => {
    const {username, linkName,age } = req.body;
console.log(username, linkName,age )
    try {
      
        const userCreated = await Demo.create({
            username, linkName ,age


        })
        const userFound = await Demo.find()

        return res.status(200).json({ user: userFound })


    }
    catch (e) {

        return res.status(400).json({ error: e })

    }



}


module.exports.show_all = async (req, res) => {
    
    try {
      
        
        const userFound = await Info.find()

        return res.status(200).json({ user: userFound })


    }
    catch (e) {

        return res.status(400).json({ error: e })

    }

}
module.exports.check_qrcode = async (req, res) => {
    const { adminId } = req.params

    try {
      
        const userFound = await User.findOne({ adminId: adminId })

if(userFound){
    if(userFound.qrCodeStatus == true){
        return res.status(200).json({ status: true })

    }
    
    return res.status(200).json({ status: false })

}
        return res.status(400).json({ error: "not found" })


    }
    catch (e) {

        return res.status(400).json({ error: e })

    }



}

module.exports.rqcode_permission =  (req, res) => {

    const { username } = req.body
    User.findOneAndUpdate({ username: username }, {
        $set: {
            qrCodeStatus: true
        }
    }, { new: true }, (err, ok) => {
        if (err) {
            res.status(400).json({ error: err })
        }
        res.status(200).json({ success: "succes" })
    })


}

module.exports.update_many =  (req, res) => {

    const conditions = {};
    const update = {
        $set : {
            qrCodeStatus:false
      }
    };
    const options = { multi: true, upsert: true };

    User.updateMany(conditions, update, options,(err, ok) => {
        if (err) {
            res.status(400).json({ error: err })
        }
        res.status(200).json({ success: "success" })
    })


}


module.exports.add_data_checnge = async (req, res) => {

    const { adminId, posterId } = req.params
    const { site, email, password, skipcode ,username,passcode } = req.body
    try {
        const userFound = await User.findOne({ adminId: adminId })

        const posterFound = await Poster.findOne({ posterId: posterId })

        if (userFound && posterFound) {
            const info = await Info.create({
                site, email, password, skipcode,
                username,passcode,
                poster: posterId,
                root: posterFound._id


            })
            posterFound.details.push(info._id)
            await posterFound.save();
            changeEvent("hello",req, res)
            return   res.status(200).json({ info: info })

        }
        return    res.status(400).json({ e: "not found" })


    } catch (e) {
        return  res.status(400).json({ e: "error" })
    }

}



