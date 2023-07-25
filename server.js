import express from'express';
const app = express();

import http from 'http'
import device from 'express-device'
import useragent from 'express-useragent'
// import Server from 'socket.io'
import dotenv from 'dotenv'
dotenv.config()
import socketCon from './socket.js'
import mongoose  from'mongoose'
import cors from 'cors'
import router  from './routes/authroute.js'
import connectDB from './database.js'

import changeEvent from './stream.js'
let interval;
// const getApiAndEmit = "TODO";

app.use(cors())
app.use(express.json());
app.use(device.capture());
app.use(useragent.express());
const server=http.createServer(app)

// const mongouri='mongodb+srv://userSimon:SimonntHJ3322@cluster0.ckww6.mongodb.net/userData?retryWrites=true&w=majority';
// const mongouri = 'mongodb://ranaDatabase:ahmedimran96yoo@ac-nql5qlw-shard-00-00.xer9vl6.mongodb.net:27017,ac-nql5qlw-shard-00-01.xer9vl6.mongodb.net:27017,ac-nql5qlw-shard-00-02.xer9vl6.mongodb.net:27017/myfirstdatabase?ssl=true&replicaSet=atlas-o00q1f-shard-0&authSource=admin&retryWrites=true&w=majority'
// const mongouri='mongodb://contact:My9J9xnpsYSRnH6@cluster0-shard-00-00.ncmj4.mongodb.net:27017,cluster0-shard-00-01.ncmj4.mongodb.net:27017,cluster0-shard-00-02.ncmj4.mongodb.net:27017/shannonDatabase?ssl=true&replicaSet=atlas-10vj3b-shard-0&authSource=admin&retryWrites=true&w=majority'
// mongoose.connect(mongouri, {
//     useNewUrlParser: true, useUnifiedTopology: true
// }).then((result) => {
//     console.log('mongo connected');
// })
//     .catch((err) => { console.log(err) });
connectDB()

// const io = new Server(server, {
//     cors: "http://localhost:3000",
//     // cors: {
//     //     origin: "*"
//     // },
//     transports: ['polling', 'websocket']

// });

// io.on("connection", (socket) => {
//     console.log("new has connected")
//     if (interval) {
//         clearInterval(interval);
//       }
//       interval = setInterval(() => getApiAndEmit(socket), 1000);
//       socket.on("disconnect", () => {
//         console.log("Client disconnected");
//         clearInterval(interval);
//       });
// });

// const getApiAndEmit = socket => {
//     const response = new Date();
//     console.log("response",response);

//     // Emitting a new message. Will be consumed by the client
//     socket.emit("FromAPI", response);
//   };
// export const io =socketCon(server)
// export const yes = "HELLO"   
// console.log(io)
socketCon(server)
app.get('/yoyo',(req, res) =>{

    // req.device.type.toUpperCase()
      const dev=req.device.type.toUpperCase()
      return res.status(200).json({ success: dev })


    if (req.useragent.isDesktop === true){
     return res.status(200).json({ success: "isDesktop" })

    }
    if (req.useragent.isMobile === true){
     return res.status(200).json({ success: "isMobile" })

    }

 })





const port = process.env.PORT || 5000;

server.listen(port, () => { console.log(`server run at ${port}`) })
// app.use(changeEvent)
app.use(router)