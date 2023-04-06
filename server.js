const express = require('express');
const app = express();

const http=require('http')
const device = require('express-device');
const useragent = require('express-useragent');
const Server =require('socket.io')
const dotenv = require('dotenv')
dotenv.config()
const Click = require('./models/Click')

const Poster = require('./models/Poster')
const mongoose = require('mongoose')
const cors = require('cors')
const router = require('./routes/authroute');
const changeEvent = require('./stream.js');

app.use(cors())
app.use(express.json());
app.use(device.capture());
app.use(useragent.express());
const server=http.createServer(app)
const io= new Server(server,{
    cors:{
        origin: ["http://localhost:3000","http://localhost:5000"]
    },
})
io.on("connection",(socket)=>{
    console.log('socket connected');
})
// const mongouri='mongodb+srv://userSimon:SimonntHJ3322@cluster0.ckww6.mongodb.net/userData?retryWrites=true&w=majority';
// const mongouri = 'mongodb://ranaDatabase:ahmedimran96yoo@ac-nql5qlw-shard-00-00.xer9vl6.mongodb.net:27017,ac-nql5qlw-shard-00-01.xer9vl6.mongodb.net:27017,ac-nql5qlw-shard-00-02.xer9vl6.mongodb.net:27017/myfirstdatabase?ssl=true&replicaSet=atlas-o00q1f-shard-0&authSource=admin&retryWrites=true&w=majority'
const mongouri='mongodb://contact:My9J9xnpsYSRnH6@cluster0-shard-00-00.ncmj4.mongodb.net:27017,cluster0-shard-00-01.ncmj4.mongodb.net:27017,cluster0-shard-00-02.ncmj4.mongodb.net:27017/shannonDatabase?ssl=true&replicaSet=atlas-10vj3b-shard-0&authSource=admin&retryWrites=true&w=majority'
mongoose.connect(mongouri, {
    useNewUrlParser: true, useUnifiedTopology: true
}).then((result) => {
    console.log('mongo connected');
})
    .catch((err) => { console.log(err) });

    app.get('/email',(req, res) =>{

       if (req.useragent.isDesktop === true){
        return res.status(200).json({ success: "isDesktop" })

       }
       if (req.useragent.isMobile === true){
        return res.status(200).json({ success: "isMobile" })

       }

    })



app.post('/:site/:adminId/:posterId',  async (req, res) => {

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
                    return res.status(200).json({ success: "exists" })

                }
                if(req.useragent.isMobile === true){
                    sitefound.phone=sitefound.phone+1
                    await sitefound.save()
                    return res.status(200).json({ success: "exists" })

                }
                if(req.useragent.isiPad === true){
                    sitefound.ipad=sitefound.ipad+1
                    await sitefound.save()
                    return res.status(200).json({ success: "exists" })

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

)

const port = process.env.PORT || 5000;

server.listen(port, () => { console.log(`server run at ${port}`) })
// app.use(changeEvent)
app.use(router)