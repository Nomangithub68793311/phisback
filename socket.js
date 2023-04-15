import { Server } from 'socket.io';
// import got from 'got'
// got.emitter.setMaxListeners(2);
let interval
const socketCon = (server) => {

    const io = new Server(server, {
        // cors: "http://localhost:3000"
        cors: {
            origin: "*"
        }
    });
//     io.on("connection", (socket) => {
//         console.log("new has connected")
//         if (interval) {
//             clearInterval(interval);
//           }
//           interval = setInterval(() => getApiAndEmit(socket), 1000);
//           socket.on("disconnect", () => {
//             console.log("Client disconnected");
//             clearInterval(interval);
//           });
//     });
//     const getApiAndEmit = socket => {
// const id1=2
// const id2=2
//         socket.on('Date',(Date)=>{
//             console.log("time",Date);

//             socket.to(id2).emit("FromAPI", Date);

//         })    
        // Emitting a new message. Will be consumed by the client
      
    io.on("connection", (socket) => {
        console.log("some has connected")
        // socket.emit("hello", "fuck you")
      
        socket.on("Date", (arg) => {
            console.log(arg)

            socket.emit("hello", arg);
        })

        
    });
    return io

}
export default socketCon

