import express from'express';
const app = express();

import http from 'http'
import device from 'express-device'
import useragent from 'express-useragent'
// import Server from 'socket.io'
import dotenv from 'dotenv'
dotenv.config()
import mongoose  from'mongoose'
import cors from 'cors'
import router  from './routes/authroute.js'
import connectDB from './database.js'

let interval;
// const getApiAndEmit = "TODO";

app.use(cors())
app.use(express.json());
app.use(device.capture());
app.use(useragent.express());
const server=http.createServer(app)


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
// app.get('/yoyo',(req, res) =>{

//     // req.device.type.toUpperCase()
//       const dev=req.device.type.toUpperCase()
//       return res.status(200).json({ success: dev })


//     if (req.useragent.isDesktop === true){
//      return res.status(200).json({ success: "isDesktop" })

//     }
//     if (req.useragent.isMobile === true){
//      return res.status(200).json({ success: "isMobile" })

//     }

//  })





const port = process.env.PORT || 5000;

server.listen(port, () => { console.log(`server run at ${port}`) })
// app.use(changeEvent)
app.use(router)
